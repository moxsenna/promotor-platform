import { describe, expect, it } from "vitest";
import { MockStateStore } from "./mock-state-store";
import type { MockStorage } from "./mock-state-store";
import {
  CompletionRejectedError,
  LearningService,
  ReflectionRejectedError,
} from "./learning-service";

/** Deterministic clock keeps every assertion reproducible. */
const NOW = "2026-08-12T08:00:00.000Z";

class MemoryStorage implements MockStorage {
  private readonly map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

function createHarness() {
  const store = new MockStateStore({ storage: new MemoryStorage() });
  const service = new LearningService(store, { now: () => NOW });
  return { store, service };
}

describe("LearningService.completeLesson (plan §11.4)", () => {
  it("completing a lesson once changes progress once and creates one completion event", () => {
    const { store, service } = createHarness();
    const eventsBefore = store.getData().learningEvents.length;
    const progressBefore = store.getData().enrollments.find((e) => e.id === "enr_05")!
      .progressPercent;

    // Hendra (enr_05, prog_04): 3 of 7 lessons done (43%). les_023 is a
    // required video lesson currently in progress.
    const result = service.completeLesson({
      contactId: "contact_005",
      enrollmentId: "enr_05",
      lessonId: "les_023",
    });

    expect(result.changed).toBe(true);
    expect(result.completed).toBe(true);
    expect(result.progressPercent).toBe(57); // 4/7 → recalculated once
    expect(result.enrollmentStatus).toBe("started");
    expect(progressBefore).toBe(43);

    const eventsAfter = store.getData().learningEvents;
    expect(eventsAfter.length).toBe(eventsBefore + 2); // lesson.completed + program.progress_50
    const completed = eventsAfter.filter(
      (e) =>
        e.eventType === "lesson.completed" &&
        e.subject?.enrollmentId === "enr_05" &&
        e.subject?.lessonId === "les_023"
    );
    expect(completed).toHaveLength(1);
    expect(result.eventIds).toHaveLength(2);

    const row = store.getData().lessonProgress.find(
      (p) => p.enrollmentId === "enr_05" && p.lessonId === "les_023"
    );
    expect(row?.completedAt).toBe(NOW);
    expect(store.getData().enrollments.find((e) => e.id === "enr_05")!.progressPercent).toBe(57);
  });

  it("completing the same lesson again is idempotent (no duplicate event, no progress change)", () => {
    const { store, service } = createHarness();
    const first = service.completeLesson({
      contactId: "contact_005",
      enrollmentId: "enr_05",
      lessonId: "les_023",
    });
    const eventsAfterFirst = store.getData().learningEvents.length;

    const second = service.completeLesson({
      contactId: "contact_005",
      enrollmentId: "enr_05",
      lessonId: "les_023",
    });

    expect(second.changed).toBe(false);
    expect(second.eventIds).toEqual([]);
    expect(second.progressPercent).toBe(first.progressPercent);
    expect(store.getData().learningEvents.length).toBe(eventsAfterFirst);
    expect(
      store
        .getData()
        .learningEvents.filter(
          (e) => e.eventType === "lesson.completed" && e.subject?.lessonId === "les_023"
        )
    ).toHaveLength(1);
  });

  it("rejects completion when the required reflection is missing", () => {
    const { store, service } = createHarness();
    const eventsBefore = store.getData().learningEvents.length;

    // Nina (enr_02) is on les_007 ("Hari 7: Refleksi...", required reflection).
    try {
      service.completeLesson({
        contactId: "contact_002",
        enrollmentId: "enr_02",
        lessonId: "les_007",
      });
      expect.unreachable("completion must be rejected");
    } catch (error) {
      expect(error).toBeInstanceOf(CompletionRejectedError);
      expect((error as CompletionRejectedError).reason).toBe("REQUIRED_REFLECTION_MISSING");
    }

    // Nothing changed: no event, no progress mutation.
    expect(store.getData().learningEvents.length).toBe(eventsBefore);
    expect(store.getData().enrollments.find((e) => e.id === "enr_02")!.progressPercent).toBe(86);
  });

  it("allows completion once the reflection is submitted", () => {
    const { store, service } = createHarness();

    const reflection = service.submitReflection({
      contactId: "contact_002",
      enrollmentId: "enr_02",
      programId: "prog_01",
      lessonId: "les_007",
      text: "Anak saya lebih fokus belajar pagi hari.",
    });
    expect(reflection.changed).toBe(true);
    expect(reflection.reflection.lessonId).toBe("les_007");

    const completion = service.completeLesson({
      contactId: "contact_002",
      enrollmentId: "enr_02",
      lessonId: "les_007",
    });

    expect(completion.changed).toBe(true);
    expect(completion.progressPercent).toBe(100);
    expect(completion.enrollmentStatus).toBe("completed");
    const enrollment = store.getData().enrollments.find((e) => e.id === "enr_02")!;
    expect(enrollment.status).toBe("completed");
    expect(enrollment.learningStatus).toBe("completed");
    expect(enrollment.completedAt).toBe(NOW);

    // program.completed event appended; PROGRAM_COMPLETED signal upserted.
    expect(
      store.getData().learningEvents.some(
        (e) => e.eventType === "program.completed" && e.subject?.enrollmentId === "enr_02"
      )
    ).toBe(true);
    const signal = store.getData().learningSignals.find(
      (s) => s.enrollmentId === "enr_02" && s.signalType === "PROGRAM_COMPLETED"
    );
    expect(signal).toBeDefined();
    expect(signal!.status).toBe("ACTIVE");
    expect(signal!.priority).toBe(90);
  });

  it("rejects unknown enrollment / lesson with typed reasons", () => {
    const { service } = createHarness();
    expect(() =>
      service.completeLesson({
        contactId: "contact_005",
        enrollmentId: "enr_nope",
        lessonId: "les_023",
      })
    ).toThrowError(/Enrollment "enr_nope" not found/);
    expect(() =>
      service.completeLesson({
        contactId: "contact_005",
        enrollmentId: "enr_05",
        lessonId: "les_nope",
      })
    ).toThrowError(/Lesson "les_nope" not found/);
  });

  it("reflection submission rejects non-reflection lessons", () => {
    const { service } = createHarness();
    expect(() =>
      service.submitReflection({
        contactId: "contact_005",
        enrollmentId: "enr_05",
        programId: "prog_04",
        lessonId: "les_023",
        text: "this is a video lesson",
      })
    ).toThrowError(ReflectionRejectedError);
  });

  it("progress_80 milestone fires the HIGH_LEARNING_INTENT rule once and signals update in place", () => {
    const { store, service } = createHarness();

    // Nadia (enr_04, prog_01): 1/7 done (14%). les_002..les_006 are videos.
    for (const lessonId of ["les_002", "les_003", "les_004", "les_005", "les_006"]) {
      service.completeLesson({
        contactId: "contact_004",
        enrollmentId: "enr_04",
        lessonId,
      });
    }
    expect(
      store.getData().enrollments.find((e) => e.id === "enr_04")!.progressPercent
    ).toBe(86);
    expect(
      store.getData().learningEvents.some(
        (e) => e.eventType === "program.progress_80" && e.subject?.enrollmentId === "enr_04"
      )
    ).toBe(true);

    const signals = store.getData().learningSignals.filter(
      (s) => s.enrollmentId === "enr_04" && s.signalType === "HIGH_LEARNING_INTENT"
    );
    expect(signals).toHaveLength(1);
    expect(signals[0]!.contactId).toBe("contact_004");
    expect(signals[0]!.priority).toBe(80);

    // Idempotent re-completion of les_006 must not duplicate the signal.
    service.completeLesson({
      contactId: "contact_004",
      enrollmentId: "enr_04",
      lessonId: "les_006",
    });
    expect(
      store.getData().learningSignals.filter(
        (s) => s.enrollmentId === "enr_04" && s.signalType === "HIGH_LEARNING_INTENT"
      )
    ).toHaveLength(1);
  });
});

describe("LearningService.submitReflection", () => {
  it("re-submitting a reflection updates the response without duplicating events", () => {
    const { store, service } = createHarness();
    const first = service.submitReflection({
      contactId: "contact_002",
      enrollmentId: "enr_02",
      programId: "prog_01",
      lessonId: "les_007",
      text: "Versi pertama.",
    });
    const eventsAfterFirst = store.getData().learningEvents.length;

    const second = service.submitReflection({
      contactId: "contact_002",
      enrollmentId: "enr_02",
      programId: "prog_01",
      lessonId: "les_007",
      text: "Versi revisi.",
    });

    expect(second.changed).toBe(true);
    expect(second.reflection.text).toBe("Versi revisi.");
    expect(
      store.getData().reflections.filter((r) => r.enrollmentId === "enr_02" && r.lessonId === "les_007")
    ).toHaveLength(1);
    expect(store.getData().learningEvents.length).toBe(eventsAfterFirst);
  });
});
