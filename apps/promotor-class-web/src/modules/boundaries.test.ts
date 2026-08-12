import { describe, expect, it } from "vitest";
import { MockStateStore } from "../adapters/mock/mock-state-store";
import type { MockStorage } from "../adapters/mock/mock-state-store";
import { LearnerRepository } from "../adapters/mock/learner-repository";
import { ProgramRepository } from "../adapters/mock/program-repository";
import { LearningService } from "../adapters/mock/learning-service";
import { getLearnerHome, getLesson } from "./learning/queries";
import { completeLesson } from "./learning/commands";
import { getPromotorHomeSignals } from "./signals/queries";
import { getProgramBySlug, getProgramDetail } from "./programs/queries";
import { getCapabilities, getDemoScenario } from "./demo/queries";
import { resetDemo, setDemoScenario } from "./demo/commands";
import { getWorkspace } from "./organizations/queries";
import type { OrganizationQueryPort } from "./organizations/ports";
import { matchOrCreateContact } from "./contacts/commands";
import { getEnrollmentStatus } from "./enrollments/queries";
import type { LearningDeps } from "./learning/ports";

/**
 * Module boundary smoke tests: the module layer is the ONLY surface screens
 * import. Queries/commands must return plain data (never the store) and
 * mutate through injected adapters so tests stay isolated from the
 * process-wide default store.
 */

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

class WorkspacePort implements OrganizationQueryPort {
  constructor(private readonly store: MockStateStore) {}
  getWorkspace() {
    return this.store.getData().workspace;
  }
}

function signalDeps(store: MockStateStore) {
  const learners = new LearnerRepository(store);
  const programs = new ProgramRepository(store);
  return {
    signals: learners,
    context: {
      getContactById: (contactId: string) => learners.getContactById(contactId),
      getProgramById: (programId: string) => programs.getProgramById(programId),
    },
  };
}

function createDeps() {
  const store = new MockStateStore({ storage: new MemoryStorage() });
  const learners = new LearnerRepository(store, {
    now: () => "2026-08-12T08:00:00.000Z",
  });
  const curriculum = new ProgramRepository(store);
  const learningDeps: Partial<LearningDeps> = {
    curriculum,
    learners,
    service: new LearningService(store, { now: () => "2026-08-12T08:00:00.000Z" }),
  };
  return { store, learners, learningDeps };
}

describe("module boundaries (plan §9.6)", () => {
  it("demo module: scenario switch + resetDemo restore deterministic state", () => {
    const { store } = createDeps();
    const demoDeps = { state: store };

    expect(getDemoScenario(demoDeps)).toBe("BUNDLE_AVAILABLE");
    expect(getCapabilities(demoDeps).integrationHealth?.promotorFlow).toBe("AVAILABLE");

    setDemoScenario("CLASS_ONLY", demoDeps);
    expect(getDemoScenario(demoDeps)).toBe("CLASS_ONLY");
    expect(getCapabilities(demoDeps).integrationHealth).toBeNull();

    resetDemo(demoDeps);
    expect(getDemoScenario(demoDeps)).toBe("BUNDLE_AVAILABLE");
    expect(store.getData().learningEvents).toHaveLength(54);
  });

  it("learning query getLearnerHome returns plain data for a learner in progress", () => {
    const { learningDeps } = createDeps();
    const home = getLearnerHome("contact_005", learningDeps);
    expect(home).not.toBeNull();
    expect(home!.contact.name).toBe("Hendra Saputra");
    expect(home!.enrollments).toHaveLength(1);
    expect(home!.enrollments[0]!.program.title).toBe("7 Hari Memahami Potensi Remaja");
    expect(home!.enrollments[0]!.nextLesson!.lesson.id).toBe("les_023");
    expect(home!.enrollments[0]!.nextLesson!.completed).toBe(false);

    // Ayu finished everything → active enrollments empty, nextLesson null.
    const done = getLearnerHome("contact_001", learningDeps);
    expect(done!.enrollments).toHaveLength(0);
  });

  it("learning commands drive the demo path A2 and queries reflect it", () => {
    const { learningDeps } = createDeps();
    // Hendra completes his in-progress lesson → progress 43 → 57.
    const result = completeLesson(
      { contactId: "contact_005", enrollmentId: "enr_05", lessonId: "les_023" },
      learningDeps
    );
    expect(result.progressPercent).toBe(57);

    const lesson = getLesson("enr_05", "les_023", learningDeps);
    expect(lesson!.completed).toBe(true);
    expect(lesson!.progress!.completedAt).toBe("2026-08-12T08:00:00.000Z");
    const home = getLearnerHome("contact_005", learningDeps);
    expect(home!.enrollments[0]!.nextLesson!.lesson.id).toBe("les_024");
  });

  it("signals query returns enriched rows sorted by priority", () => {
    const { store } = createDeps();
    const rows = getPromotorHomeSignals(signalDeps(store));
    expect(rows).toHaveLength(5);
    expect(rows[0]!.contactName).toBe("Ayu Rahma");
    expect(rows[0]!.signal.signalType).toBe("PROGRAM_COMPLETED");
    expect(rows[0]!.programTitle).toBe("7 Hari Mengenal Cara Belajar Anak");
    expect(rows[0]!.signal.priority).toBe(90);
  });

  it("programs + organizations + contacts + enrollments queries", () => {
    const { store } = createDeps();
    const curriculum = new ProgramRepository(store);

    const publicProgram = getProgramBySlug("7-hari-mengenal-cara-belajar-anak", {
      catalog: curriculum,
    });
    expect(publicProgram!.status).toBe("published");
    const detail = getProgramDetail("prog_01", { catalog: curriculum });
    expect(detail!.modules).toHaveLength(1);
    expect(detail!.modules[0]!.lessons).toHaveLength(7);

    const workspace = getWorkspace({ workspace: new WorkspacePort(store) });
    expect(workspace.organization.slug).toBe("rina");
    expect(workspace.promotorPublicProfile.name).toBe("Rina Maharani");

    const matched = matchOrCreateContact(
      { organizationId: "org_001", name: "Ayu Rahma", phone: "081222333444", source: "instagram" },
      { contacts: new LearnerRepository(store) }
    );
    expect(matched.matched).toBe(true);
    expect(matched.contact.id).toBe("contact_001");

    expect(getEnrollmentStatus("contact_001", "prog_01", { enrollments: new LearnerRepository(store) })).toBe("completed");
  });

  it("queries never return the store itself (plain data only)", () => {
    const { learningDeps } = createDeps();
    const home = getLearnerHome("contact_001", learningDeps);
    expect(home).not.toHaveProperty("getData");
    expect(home).not.toHaveProperty("update");
    const signals = getPromotorHomeSignals(signalDeps(createDeps().store));
    expect(signals[0]).not.toHaveProperty("getData");
  });
});
