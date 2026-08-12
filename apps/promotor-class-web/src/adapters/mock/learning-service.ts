import type {
  ContactId,
  Enrollment,
  EnrollmentId,
  EnrollmentStatus,
  IntentLabel,
  LearningEventEnvelope,
  LearningEventId,
  LearningSignal,
  LearningSignalId,
  LearningSignalSeverity,
  LearningSignalType,
  LessonId,
  OrganizationId,
  ProgramId,
} from "@promotor/contracts";
import type { LessonProgress, ReflectionResponse } from "@promotor/promotor-class-fixtures";
import type { MockStateStore } from "./mock-state-store";
import type { MockStateData } from "./seed-state";
import { nextSequentialId } from "./next-id";

/**
 * Learning behavior service (plan §9.8, §11.4).
 *
 * completeLesson() drives the M0 demo path A2 end-to-end in one transaction:
 * lesson progress updates → program progress recalculates → learning events
 * are appended → signals are created/updated.
 *
 * Rules:
 * - completing a lesson once changes progress once and appends ONE
 *   lesson.completed event; completing again is idempotent (no duplicate event),
 * - a required reflection lesson (isRequired + type "reflection") cannot be
 *   completed before its reflection is submitted — completion is rejected,
 * - progress = round(completed lessons / total lessons of program) * 100,
 * - milestone events (program.progress_50 / progress_80 / program.completed)
 *   are emitted once per enrollment when the threshold is first reached,
 * - signals are upserted per (enrollment, signalType) when their rule fires.
 */

export type CompletionRejectionReason =
  | "ENROLLMENT_NOT_FOUND"
  | "LESSON_NOT_FOUND"
  | "REQUIRED_REFLECTION_MISSING";

export class CompletionRejectedError extends Error {
  constructor(
    readonly reason: CompletionRejectionReason,
    message: string
  ) {
    super(message);
    this.name = "CompletionRejectedError";
  }
}

export type ReflectionRejectionReason =
  | "ENROLLMENT_NOT_FOUND"
  | "LESSON_NOT_FOUND"
  | "NOT_REFLECTION_LESSON";

export class ReflectionRejectedError extends Error {
  constructor(
    readonly reason: ReflectionRejectionReason,
    message: string
  ) {
    super(message);
    this.name = "ReflectionRejectedError";
  }
}

export interface CompleteLessonInput {
  contactId: string;
  enrollmentId: string;
  lessonId: string;
  /** UTC ISO timestamp; defaults to now. Injectable for deterministic tests. */
  at?: string;
}

export interface CompleteLessonResult {
  /** false when the lesson was already completed (idempotent no-op). */
  changed: boolean;
  completed: boolean;
  progressPercent: number;
  enrollmentStatus: EnrollmentStatus;
  /** Learning event ids appended by this call (empty for idempotent no-op). */
  eventIds: string[];
}

export interface SubmitReflectionInput {
  contactId: string;
  enrollmentId: string;
  programId: string;
  lessonId: string;
  text: string;
  at?: string;
}

export interface SubmitReflectionResult {
  changed: boolean;
  reflection: ReflectionResponse;
}

export class LearningService {
  private readonly now: () => string;

  constructor(
    private readonly store: MockStateStore,
    options: { now?: () => string } = {}
  ) {
    this.now = options.now ?? (() => new Date().toISOString());
  }

  completeLesson(input: CompleteLessonInput): CompleteLessonResult {
    const data = this.store.getData();
    const enrollment = data.enrollments.find((e) => e.id === input.enrollmentId);
    if (!enrollment) {
      throw new CompletionRejectedError(
        "ENROLLMENT_NOT_FOUND",
        `Enrollment "${input.enrollmentId}" not found.`
      );
    }
    const lesson = data.lessons.find((l) => l.id === input.lessonId);
    if (!lesson) {
      throw new CompletionRejectedError(
        "LESSON_NOT_FOUND",
        `Lesson "${input.lessonId}" not found.`
      );
    }

    const existingProgress = data.lessonProgress.find(
      (p) => p.enrollmentId === input.enrollmentId && p.lessonId === input.lessonId
    );
    if (existingProgress?.completedAt) {
      // Idempotent: no progress change, no duplicate event.
      return {
        changed: false,
        completed: true,
        progressPercent: enrollment.progressPercent,
        enrollmentStatus: enrollment.status,
        eventIds: [],
      };
    }

    const reflectionSubmitted = data.reflections.some(
      (r) => r.enrollmentId === input.enrollmentId && r.lessonId === input.lessonId
    );
    if (lesson.isRequired && lesson.type === "reflection" && !reflectionSubmitted) {
      throw new CompletionRejectedError(
        "REQUIRED_REFLECTION_MISSING",
        `Lesson "${input.lessonId}" requires a reflection before it can be completed.`
      );
    }

    const occurredAt = input.at ?? this.now();
    const eventIds: string[] = [];
    let percent = 0;
    let enrollmentStatus: EnrollmentStatus = enrollment.status;

    this.store.update((draft) => {
      const progress = draft.lessonProgress.find(
        (p) => p.enrollmentId === input.enrollmentId && p.lessonId === input.lessonId
      );
      if (progress) {
        progress.completedAt = occurredAt;
      } else {
        const row: LessonProgress = {
          enrollmentId: input.enrollmentId,
          contactId: input.contactId,
          lessonId: input.lessonId,
          startedAt: occurredAt,
          completedAt: occurredAt,
        };
        draft.lessonProgress.push(row);
      }

      this.appendEvent(draft, eventIds, {
        eventType: "lesson.completed",
        organizationId: enrollment.organizationId,
        contactId: enrollment.contactId,
        programId: enrollment.programId,
        enrollmentId: enrollment.id,
        lessonId: lesson.id,
        occurredAt,
        payload: { lessonId: lesson.id, programId: enrollment.programId },
      });

      // Recalculate program progress.
      const totalLessons = draft.lessons.filter((l) => l.programId === enrollment.programId).length;
      const completedCount = draft.lessonProgress.filter(
        (p) => p.enrollmentId === enrollment.id && p.completedAt !== null
      ).length;
      percent = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

      const row = draft.enrollments.find((e) => e.id === enrollment.id);
      if (row) {
        row.progressPercent = percent;
        row.lastActivityAt = occurredAt;
        if (percent === 100) {
          row.status = "completed";
          row.learningStatus = "completed";
          row.completedAt ??= occurredAt;
        } else {
          if (row.status === "enrolled") row.status = "started";
          row.learningStatus = "active";
        }
        enrollmentStatus = row.status;
      }

      // Milestone events — emitted at most once per enrollment.
      if (percent >= 80 && !this.hasMilestone(draft, enrollment.id, "program.progress_80")) {
        this.appendEvent(draft, eventIds, {
          eventType: "program.progress_80",
          organizationId: enrollment.organizationId,
          contactId: enrollment.contactId,
          programId: enrollment.programId,
          enrollmentId: enrollment.id,
          occurredAt,
          payload: {},
        });
        this.upsertSignal(draft, {
          sourceEventId: this.lastEventId(draft),
          contactId: enrollment.contactId,
          programId: enrollment.programId,
          enrollmentId: enrollment.id,
          signalType: "HIGH_LEARNING_INTENT",
          intentLabel: enrollment.intentLabel,
          severity: "HIGH",
          priority: 80,
          reason: this.contactName(draft, enrollment.contactId) +
            " mencapai 80% materi " + this.programTitle(draft, enrollment.programId) +
            " — ajak lanjut ke asesmen gaya belajar.",
          createdAt: occurredAt,
        });
      } else if (percent >= 50 && !this.hasMilestone(draft, enrollment.id, "program.progress_50")) {
        this.appendEvent(draft, eventIds, {
          eventType: "program.progress_50",
          organizationId: enrollment.organizationId,
          contactId: enrollment.contactId,
          programId: enrollment.programId,
          enrollmentId: enrollment.id,
          occurredAt,
          payload: {},
        });
      }

      if (percent === 100 && !this.hasMilestone(draft, enrollment.id, "program.completed")) {
        this.appendEvent(draft, eventIds, {
          eventType: "program.completed",
          organizationId: enrollment.organizationId,
          contactId: enrollment.contactId,
          programId: enrollment.programId,
          enrollmentId: enrollment.id,
          occurredAt,
          payload: { progressPercent: 100 },
        });
        this.upsertSignal(draft, {
          sourceEventId: this.lastEventId(draft),
          contactId: enrollment.contactId,
          programId: enrollment.programId,
          enrollmentId: enrollment.id,
          signalType: "PROGRAM_COMPLETED",
          intentLabel: enrollment.intentLabel,
          severity: "HIGH",
          priority: 90,
          reason:
            "Program " + this.programTitle(draft, enrollment.programId) +
            " selesai. Follow up tawaran asesmen gaya belajar anak.",
          createdAt: occurredAt,
        });
      }
    });

    return {
      changed: true,
      completed: true,
      progressPercent: percent,
      enrollmentStatus,
      eventIds,
    };
  }

  submitReflection(input: SubmitReflectionInput): SubmitReflectionResult {
    const data = this.store.getData();
    const enrollment = data.enrollments.find((e) => e.id === input.enrollmentId);
    if (!enrollment) {
      throw new ReflectionRejectedError(
        "ENROLLMENT_NOT_FOUND",
        `Enrollment "${input.enrollmentId}" not found.`
      );
    }
    const lesson = data.lessons.find((l) => l.id === input.lessonId);
    if (!lesson) {
      throw new ReflectionRejectedError("LESSON_NOT_FOUND", `Lesson "${input.lessonId}" not found.`);
    }
    if (lesson.type !== "reflection") {
      throw new ReflectionRejectedError(
        "NOT_REFLECTION_LESSON",
        `Lesson "${input.lessonId}" is not a reflection lesson.`
      );
    }

    const occurredAt = input.at ?? this.now();
    const existing = data.reflections.find(
      (r) => r.enrollmentId === input.enrollmentId && r.lessonId === input.lessonId
    );
    if (existing) {
      // Re-submission updates the response; append-only event stream stays clean.
      this.store.update((draft) => {
        const row = draft.reflections.find(
          (r) => r.enrollmentId === input.enrollmentId && r.lessonId === input.lessonId
        );
        if (row) {
          row.text = input.text;
          row.submittedAt = occurredAt;
        }
      });
      return { changed: true, reflection: existing };
    }

    const reflectionId = nextSequentialId(data.reflections.map((r) => r.id), "refl_");
    this.store.update((draft) => {
      const reflection: ReflectionResponse = {
        id: reflectionId,
        organizationId: enrollment.organizationId,
        enrollmentId: enrollment.id,
        contactId: enrollment.contactId,
        programId: enrollment.programId,
        lessonId: lesson.id,
        text: input.text,
        submittedAt: occurredAt,
      };
      draft.reflections.push(reflection);
      draft.learningEvents.push({
        schemaVersion: 1,
        eventId: nextSequentialId(draft.learningEvents.map((e) => e.eventId), "evt_"),
        eventType: "reflection.submitted",
        sourceApp: "PROMOTORCLASS",
        organizationId: enrollment.organizationId,
        contactId: enrollment.contactId,
        occurredAt,
        subject: {
          programId: enrollment.programId,
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
        },
        payload: { lessonId: lesson.id, programId: enrollment.programId },
      });
    });
    return {
      changed: true,
      reflection: {
        id: reflectionId,
        organizationId: enrollment.organizationId,
        enrollmentId: enrollment.id,
        contactId: enrollment.contactId,
        programId: enrollment.programId,
        lessonId: lesson.id,
        text: input.text,
        submittedAt: occurredAt,
      },
    };
  }

  // ── Internal helpers (operate on a draft inside store.update) ───────────

  private appendEvent(
    draft: MockStateData,
    eventIds: string[],
    fields: {
      eventType: LearningEventEnvelope["eventType"];
      organizationId: OrganizationId;
      contactId: ContactId;
      programId: ProgramId;
      enrollmentId: EnrollmentId;
      lessonId?: LessonId;
      occurredAt: string;
      payload: unknown;
    }
  ): void {
    const envelope: LearningEventEnvelope = {
      schemaVersion: 1,
      eventId: nextSequentialId(draft.learningEvents.map((e) => e.eventId), "evt_"),
      eventType: fields.eventType,
      sourceApp: "PROMOTORCLASS",
      organizationId: fields.organizationId,
      contactId: fields.contactId,
      occurredAt: fields.occurredAt,
      subject: {
        programId: fields.programId,
        enrollmentId: fields.enrollmentId,
        ...(fields.lessonId !== undefined ? { lessonId: fields.lessonId } : {}),
      },
      payload: fields.payload,
    };
    draft.learningEvents.push(envelope);
    eventIds.push(envelope.eventId);
  }

  private lastEventId(draft: MockStateData): string {
    const last = draft.learningEvents[draft.learningEvents.length - 1];
    return last?.eventId ?? "";
  }

  private hasMilestone(
    draft: MockStateData,
    enrollmentId: string,
    eventType: string
  ): boolean {
    return draft.learningEvents.some(
      (e) => e.eventType === eventType && e.subject?.enrollmentId === enrollmentId
    );
  }

  private upsertSignal(
    draft: MockStateData,
    fields: {
      sourceEventId: string;
      contactId: string;
      programId: string;
      enrollmentId: string;
      signalType: LearningSignalType;
      intentLabel: IntentLabel;
      severity: LearningSignalSeverity;
      priority: number;
      reason: string;
      createdAt: string;
    }
  ): void {
    const existing = draft.learningSignals.find(
      (s) =>
        s.enrollmentId === fields.enrollmentId &&
        s.signalType === fields.signalType &&
        s.status === "ACTIVE"
    );
    if (existing) {
      // Update the active signal instead of duplicating it.
      existing.reason = fields.reason;
      existing.createdAt = fields.createdAt;
      return;
    }
    const signal: LearningSignal = {
      id: nextSequentialId(draft.learningSignals.map((s) => s.id), "sig_") as LearningSignalId,
      organizationId: this.organizationId(draft, fields.enrollmentId) as OrganizationId,
      sourceEventId: fields.sourceEventId as LearningEventId,
      contactId: fields.contactId as ContactId,
      programId: fields.programId as ProgramId,
      enrollmentId: fields.enrollmentId as EnrollmentId,
      signalType: fields.signalType,
      intentLabel: fields.intentLabel,
      severity: fields.severity,
      priority: fields.priority,
      reason: fields.reason,
      status: "ACTIVE",
      createdAt: fields.createdAt,
    };
    draft.learningSignals.push(signal);
  }

  private organizationId(draft: MockStateData, enrollmentId: string): string {
    return draft.enrollments.find((e) => e.id === enrollmentId)?.organizationId ?? "";
  }

  private contactName(draft: MockStateData, contactId: string): string {
    return draft.contacts.find((c) => c.id === contactId)?.name ?? "";
  }

  private programTitle(draft: MockStateData, programId: string): string {
    return draft.programs.find((p) => p.id === programId)?.title ?? "";
  }
}
