import { describe, expect, it } from "vitest";
import {
  ContactSchema,
  EnrollmentSchema,
  LearningActivityProjectionSchema,
  LearningEventEnvelopeSchema,
  LearningSignalSchema,
  LessonSchema,
  ModuleSchema,
  OrganizationSchema,
  ProgramSchema,
  UserSchema,
} from "@promotor/contracts";
import { learningActivities } from "./activities";
import { contacts } from "./contacts";
import { enrollments, lessonProgress, reflections } from "./enrollments";
import { learningEvents } from "./learning-events";
import { learningSignals } from "./learning-signals";
import { followUpTemplates } from "./templates";
import { organization, promotorPublicProfile, promotorUser } from "./promotor";
import { lessons, modules, programs } from "./programs";

/** E.164: + followed by 1-15 digits (ITU-T E.164). */
const E164 = /^\+[1-9]\d{1,14}$/;

describe("identity fixtures parse against contracts", () => {
  it("organization", () => {
    expect(OrganizationSchema.safeParse(organization).success).toBe(true);
  });

  it("promotor user", () => {
    expect(UserSchema.safeParse(promotorUser).success).toBe(true);
  });

  it("every contact resolves to one canonical identity", () => {
    for (const contact of contacts) {
      expect(ContactSchema.safeParse(contact).success).toBe(true);
      expect(contact.phoneE164).toMatch(E164);
    }
    expect(new Set(contacts.map((c) => c.phoneE164)).size).toBe(contacts.length);
    expect(new Set(contacts.map((c) => c.id)).size).toBe(contacts.length);
  });
});

describe("program fixtures parse against contracts", () => {
  it("programs", () => {
    for (const program of programs) expect(ProgramSchema.safeParse(program).success).toBe(true);
  });

  it("modules", () => {
    for (const moduleRow of modules) expect(ModuleSchema.safeParse(moduleRow).success).toBe(true);
  });

  it("lessons", () => {
    for (const lessonRow of lessons) expect(LessonSchema.safeParse(lessonRow).success).toBe(true);
  });

  it("public demo program exists for /p/rina/7-hari-mengenal-cara-belajar-anak", () => {
    const demo = programs.find((p) => p.slug === "7-hari-mengenal-cara-belajar-anak");
    expect(demo).toBeDefined();
    expect(demo?.accessType).toBe("public");
    expect(demo?.status).toBe("published");
  });

  it("has a youtube video lesson and a required reflection lesson", () => {
    const video = lessons.find(
      (l) => l.videoProvider === "youtube" && l.videoUrl && l.videoExternalId
    );
    expect(video).toBeDefined();
    expect(video?.videoProvider).toBe("youtube");
    expect(video?.videoUrl).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=/);
    expect(video?.videoExternalId).toHaveLength(11);

    const reflection = lessons.find((l) => l.type === "reflection" && l.isRequired);
    expect(reflection).toBeDefined();
  });
});

describe("enrollment fixtures parse against contracts", () => {
  it("enrollments", () => {
    for (const enrollment of enrollments) {
      expect(EnrollmentSchema.safeParse(enrollment).success).toBe(true);
    }
  });

  it("lesson progress matches stored progressPercent", () => {
    for (const enrollment of enrollments) {
      const total = lessons.filter((l) => l.programId === enrollment.programId).length;
      const done = lessonProgress.filter(
        (p) => p.enrollmentId === enrollment.id && p.completedAt !== null
      ).length;
      expect(done).toBeLessThanOrEqual(total);
      expect(enrollment.progressPercent).toBe(Math.round((done / total) * 100));
    }
  });

  it("lesson names validate against actual lessons", () => {
    const lessonIds = new Set(lessons.map((l) => l.id));
    for (const progress of lessonProgress) {
      expect(lessonIds.has(progress.lessonId)).toBe(true);
    }
  });
});

describe("learning event fixtures parse against contracts", () => {
  it("every event parses", () => {
    for (const event of learningEvents) {
      expect(LearningEventEnvelopeSchema.safeParse(event).success).toBe(true);
    }
  });

  it("event ids are unique", () => {
    expect(new Set(learningEvents.map((e) => e.eventId)).size).toBe(learningEvents.length);
  });

  it("timestamps are valid UTC ISO 8601", () => {
    for (const event of learningEvents) {
      expect(Number.isNaN(Date.parse(event.occurredAt))).toBe(false);
      expect(event.occurredAt.endsWith("Z")).toBe(true);
    }
  });
});

describe("learning signal fixtures parse against contracts", () => {
  it("every signal parses", () => {
    for (const signal of learningSignals) {
      expect(LearningSignalSchema.safeParse(signal).success).toBe(true);
    }
  });

  it("signal sourceEventId exists and matches contact", () => {
    const eventById = new Map(learningEvents.map((e) => [e.eventId, e]));
    for (const signal of learningSignals) {
      const source = eventById.get(signal.sourceEventId);
      expect(source, `source event ${signal.sourceEventId}`).toBeDefined();
      expect(source?.contactId).toBe(signal.contactId);
    }
  });

  it("signal intentLabel matches its enrollment", () => {
    const enrollmentById = new Map(enrollments.map((e) => [e.id, e]));
    for (const signal of learningSignals) {
      const enrollment = signal.enrollmentId
        ? enrollmentById.get(signal.enrollmentId)
        : undefined;
      if (enrollment) expect(signal.intentLabel).toBe(enrollment.intentLabel);
    }
  });

  it("demo path A: Ayu has an ACTIVE PROGRAM_COMPLETED signal with follow-up reason", () => {
    const ayuSignal = learningSignals.find(
      (s) => s.contactId === "contact_001" && s.signalType === "PROGRAM_COMPLETED"
    );
    expect(ayuSignal).toBeDefined();
    expect(ayuSignal?.status).toBe("ACTIVE");
    expect(ayuSignal?.reason.length).toBeGreaterThan(0);
  });
});

describe("activity projections parse against contracts", () => {
  it("every activity parses", () => {
    for (const activity of learningActivities) {
      expect(LearningActivityProjectionSchema.safeParse(activity).success).toBe(true);
    }
  });

  it("activity sourceEventId exists and matches contact", () => {
    const eventById = new Map(learningEvents.map((e) => [e.eventId, e]));
    for (const activity of learningActivities) {
      const source = eventById.get(activity.sourceEventId);
      expect(source, `source event ${activity.sourceEventId}`).toBeDefined();
      expect(source?.contactId).toBe(activity.contactId);
    }
  });
});

describe("cross-reference integrity", () => {
  const programIds = new Set(programs.map((p) => p.id));
  const moduleIds = new Set(modules.map((m) => m.id));
  const lessonIds = new Set(lessons.map((l) => l.id));
  const contactIds = new Set(contacts.map((c) => c.id));
  const enrollmentIds = new Set(enrollments.map((e) => e.id));

  it("lessons point at existing programs/modules", () => {
    for (const lessonRow of lessons) {
      expect(programIds.has(lessonRow.programId)).toBe(true);
      expect(moduleIds.has(lessonRow.moduleId)).toBe(true);
      expect(modules.find((m) => m.id === lessonRow.moduleId)?.programId).toBe(
        lessonRow.programId
      );
    }
  });

  it("enrollments point at existing programs/contacts", () => {
    for (const enrollment of enrollments) {
      expect(programIds.has(enrollment.programId)).toBe(true);
      expect(contactIds.has(enrollment.contactId)).toBe(true);
    }
  });

  it("lesson progress and reflections point at existing enrollments/lessons", () => {
    for (const progress of lessonProgress) {
      expect(enrollmentIds.has(progress.enrollmentId)).toBe(true);
      expect(lessonIds.has(progress.lessonId)).toBe(true);
      expect(contactIds.has(progress.contactId)).toBe(true);
    }
    for (const reflection of reflections) {
      expect(enrollmentIds.has(reflection.enrollmentId)).toBe(true);
      expect(lessonIds.has(reflection.lessonId)).toBe(true);
      expect(contactIds.has(reflection.contactId)).toBe(true);
      expect(reflection.text.length).toBeGreaterThan(0);
    }
  });

  it("every enrollment has a lesson in progress or completed (no dead enrollment)", () => {
    for (const enrollment of enrollments) {
      const hasProgress = lessonProgress.some((p) => p.enrollmentId === enrollment.id);
      expect(hasProgress, `enrollment ${enrollment.id}`).toBe(true);
    }
  });
});

describe("template fixtures", () => {
  it("are present, unique, and carry natural-language body copy", () => {
    expect(followUpTemplates.length).toBeGreaterThan(0);
    expect(new Set(followUpTemplates.map((t) => t.id)).size).toBe(followUpTemplates.length);
    for (const template of followUpTemplates) {
      expect(template.body.length).toBeGreaterThan(10);
    }
  });
});

describe("public profile fixture", () => {
  it("is complete for the public landing route", () => {
    expect(promotorPublicProfile.name).toBe(promotorUser.name);
    expect(promotorPublicProfile.headline.length).toBeGreaterThan(0);
    expect(promotorPublicProfile.city.length).toBeGreaterThan(0);
  });
});
