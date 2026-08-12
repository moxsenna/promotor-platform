import { describe, expect, it } from "vitest";
import type {
  ContactId,
  LearningEventId,
  LearningSignalId,
  OrganizationId,
  ProgramId,
} from "@promotor/contracts";
import { MockStateStore } from "./mock-state-store";
import type { MockStorage } from "./mock-state-store";
import {
  FlowIntegrationUnavailableError,
  MockIntegrationQueue,
  MockPromotorClassAdapter,
  MockPromotorFlowAdapter,
} from "./promotorflow-adapter";
import { brandId } from "./next-id";

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

function createHarness(scenario: "BUNDLE_AVAILABLE" | "CLASS_ONLY" | "BUNDLE_FLOW_UNAVAILABLE") {
  const store = new MockStateStore({ storage: new MemoryStorage() });
  store.setScenario(scenario);
  return {
    store,
    flow: new MockPromotorFlowAdapter(store),
    classAdapter: new MockPromotorClassAdapter(store, {
      now: () => "2026-08-12T08:00:00.000Z",
    }),
  };
}

const nextActionInput = {
  organizationId: brandId<OrganizationId>("org_001"),
  contactId: brandId<ContactId>("contact_001"),
  source: "PROMOTORCLASS" as const,
  sourceEventId: brandId<LearningEventId>("evt_020"),
  sourceSignalId: brandId<LearningSignalId>("sig_002"),
  actionType: "FOLLOW_UP" as const,
  title: "Tawarkan asesmen gaya belajar",
  reason: "Program selesai",
  dueAt: "2026-08-15T08:00:00.000Z",
  context: { programId: "prog_01", programTitle: "7 Hari Mengenal Cara Belajar Anak" },
  idempotencyKey: "promotorclass:evt_020:follow_up",
};

describe("MockPromotorFlowAdapter (§12)", () => {
  it("returns a default Flow contact context when Flow has no history", async () => {
    const { flow } = createHarness("BUNDLE_AVAILABLE");
    const context = await flow.getContactContext(brandId<ContactId>("contact_001"));
    expect(context).toEqual({
      contactId: "contact_001",
      stage: "NEW",
      classification: "PROSPECT",
    });
    expect(await flow.getAssessmentStatus(brandId<ContactId>("contact_001"))).toBe("NOT_STARTED");
  });

  it("createNextAction records the ref and updates the contact context", async () => {
    const { store, flow } = createHarness("BUNDLE_AVAILABLE");
    const ref = await flow.createNextAction(nextActionInput);
    expect(ref.nextActionId).toBe("na_001");
    expect(store.getData().flowNextActions).toHaveLength(1);
    const context = await flow.getContactContext(brandId<ContactId>("contact_001"));
    expect(context.primaryNextAction).toEqual({
      id: "na_001",
      type: "FOLLOW_UP",
      dueAt: "2026-08-15T08:00:00.000Z",
    });
    // No complete/reschedule surface exists on the adapter (M0 rule).
    expect(typeof (flow as unknown as { completeNextAction?: unknown }).completeNextAction).toBe(
      "undefined"
    );
  });

  it("appendLearningActivity reports an activity ref when available", async () => {
    const { store, flow } = createHarness("BUNDLE_AVAILABLE");
    const before = store.getData().flowActivities.length;
    const ref = await flow.appendLearningActivity({
      organizationId: brandId<OrganizationId>("org_001"),
      contactId: brandId<ContactId>("contact_001"),
      source: "PROMOTORCLASS",
      sourceEventId: brandId<LearningEventId>("evt_020"),
      eventType: "PROGRAM_COMPLETED",
      summary: "Program selesai.",
      context: { programId: "prog_01" },
      idempotencyKey: "promotorclass:evt_020:program_completed",
    });
    expect(ref).toEqual({ activityId: `act_${before + 1}` });
    expect(store.getData().flowActivities).toHaveLength(before + 1);
  });

  it("fails createNextAction during an outage (BUNDLE_FLOW_UNAVAILABLE) with a typed error", async () => {
    const { flow } = createHarness("BUNDLE_FLOW_UNAVAILABLE");
    await expect(flow.createNextAction(nextActionInput)).rejects.toBeInstanceOf(
      FlowIntegrationUnavailableError
    );
    try {
      await flow.createNextAction(nextActionInput);
      expect.unreachable("must throw");
    } catch (error) {
      expect((error as FlowIntegrationUnavailableError).reason).toBe("HEALTH_UNAVAILABLE");
    }
  });

  it("fails createNextAction in CLASS_ONLY as NOT_ENTITLED (class-only ≠ outage state)", async () => {
    const { flow } = createHarness("CLASS_ONLY");
    try {
      await flow.createNextAction(nextActionInput);
      expect.unreachable("must throw");
    } catch (error) {
      expect(error).toBeInstanceOf(FlowIntegrationUnavailableError);
      expect((error as FlowIntegrationUnavailableError).reason).toBe("NOT_ENTITLED");
    }
    // Health is never queried/faked in CLASS_ONLY.
    expect(createHarness("CLASS_ONLY").store.getCapabilities().integrationHealth).toBeNull();
  });

  it("MockIntegrationQueue parks outage work without touching canonical state", () => {
    const { store } = createHarness("BUNDLE_FLOW_UNAVAILABLE");
    const queue = new MockIntegrationQueue(store);
    const id = queue.enqueue({
      kind: "NEXT_ACTION",
      input: nextActionInput,
      reason: "HEALTH_UNAVAILABLE",
    });
    expect(id).toBe("q_001");
    const item = store.getData().integrationQueue[0];
    expect(item?.kind).toBe("NEXT_ACTION");
    expect(store.getData().flowNextActions).toHaveLength(0); // queued ≠ canonical ref
  });
});

describe("MockPromotorClassAdapter (§13)", () => {
  it("getLearningContext returns active enrollments + recent signals", async () => {
    const { classAdapter } = createHarness("BUNDLE_AVAILABLE");
    const context = await classAdapter.getLearningContext(brandId<ContactId>("contact_002")); // Nina
    expect(context.contactId).toBe("contact_002");
    expect(context.activeEnrollments).toHaveLength(1);
    expect(context.activeEnrollments[0]).toMatchObject({
      enrollmentId: "enr_02",
      programId: "prog_01",
      programTitle: "7 Hari Mengenal Cara Belajar Anak",
      progressPercent: 86,
      learningStatus: "active",
      intentLabel: "hot",
    });
    expect(context.recentSignals[0]?.type).toBe("HIGH_LEARNING_INTENT");
  });

  it("listEligiblePrograms returns published aftersales programs not yet enrolled", async () => {
    const { classAdapter } = createHarness("BUNDLE_AVAILABLE");
    const eligible = await classAdapter.listEligiblePrograms({
      organizationId: brandId<OrganizationId>("org_001"),
      contactId: brandId<ContactId>("contact_001"), // Ayu: only prog_01 enrolled
    });
    expect(eligible).toEqual([
      { id: "prog_02", title: "30 Hari Setelah Tes", slug: "30-hari-setelah-tes" },
    ]);

    const dimas = await classAdapter.listEligiblePrograms({
      organizationId: brandId<OrganizationId>("org_001"),
      contactId: brandId<ContactId>("contact_003"), // Dimas: already enrolled in prog_02
    });
    expect(dimas).toEqual([]);
  });

  it("enrollContact creates a canonical enrollment and getEnrollmentStatus reflects it", async () => {
    const { classAdapter } = createHarness("BUNDLE_AVAILABLE");
    expect(await classAdapter.getEnrollmentStatus(brandId<ContactId>("contact_001"), brandId<ProgramId>("prog_02"))).toBeNull();

    const ref = await classAdapter.enrollContact({
      organizationId: brandId<OrganizationId>("org_001"),
      contactId: brandId<ContactId>("contact_001"),
      programId: brandId<ProgramId>("prog_02"),
      source: "PROMOTORFLOW_AFTERSALES",
      idempotencyKey: "promotorclass:aftersales:prog_02",
    });
    expect(ref.enrollmentId).toBe("enr_06");
    expect(await classAdapter.getEnrollmentStatus(brandId<ContactId>("contact_001"), brandId<ProgramId>("prog_02"))).toBe("enrolled");
    // Existing enrollment untouched.
    expect(await classAdapter.getEnrollmentStatus(brandId<ContactId>("contact_001"), brandId<ProgramId>("prog_01"))).toBe("completed");
  });
});
