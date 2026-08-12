import type {
  ActivityRef,
  AssessmentStatus,
  ContactId,
  EligibleProgramsInput,
  EnrollContactInput,
  EnrollmentRef,
  EnrollmentStatus,
  FlowContactContext,
  LearningActivityProjection,
  LearningContext,
  LearningNextActionRequest,
  NextActionRef,
  ProgramId,
  ProgramSummary,
  PromotorClassAdapter,
  PromotorFlowAdapter,
} from "@promotor/contracts";
import { LearnerRepository } from "./learner-repository";
import type { MockStateStore } from "./mock-state-store";
import { nextSequentialId } from "./next-id";
import type { IntegrationQueueItem } from "./seed-state";

/**
 * Mock PromotorFlow integration adapters (INTEGRATION_CONTRACT §12/§13,
 * plan §9.12/§9.13).
 *
 * - MockPromotorFlowAdapter: what Class calls when talking to Flow
 *   (getContactContext, getAssessmentStatus, createNextAction,
 *   appendLearningActivity). M0 is create/request only — NO
 *   completeNextAction/rescheduleNextAction anywhere.
 * - MockPromotorClassAdapter: the reverse surface Flow uses against Class
 *   (getLearningContext, listEligiblePrograms, enrollContact,
 *   getEnrollmentStatus).
 *
 * Scenario behavior:
 * - CLASS_ONLY (no Flow entitlement) and BUNDLE_FLOW_UNAVAILABLE both make
 *   Flow calls fail with FlowIntegrationUnavailableError. The module
 *   command layer catches that and parks the work in the mock integration
 *   queue ("Sync queued", plan §9.13) — learning itself never breaks.
 */

export type FlowUnavailableReason = "NOT_ENTITLED" | "HEALTH_UNAVAILABLE";

export class FlowIntegrationUnavailableError extends Error {
  constructor(
    readonly reason: FlowUnavailableReason,
    message: string
  ) {
    super(message);
    this.name = "FlowIntegrationUnavailableError";
  }
}

/** Mock sync queue for Flow work requested during an outage (plan §9.13). */
export class MockIntegrationQueue {
  constructor(private readonly store: MockStateStore) {}

  enqueue(item: Omit<IntegrationQueueItem, "id" | "createdAt">): string {
    const data = this.store.getData();
    const id = nextSequentialId(data.integrationQueue.map((q) => q.id), "q_");
    this.store.update((draft) => {
      draft.integrationQueue.push({
        ...item,
        id,
        createdAt: new Date().toISOString(),
      } as IntegrationQueueItem);
    });
    return id;
  }
}

export class MockPromotorFlowAdapter implements PromotorFlowAdapter {
  constructor(private readonly store: MockStateStore) {}

  async getContactContext(contactId: ContactId): Promise<FlowContactContext> {
    const known = this.store.getData().flowContext[contactId];
    if (known) return Promise.resolve(known);
    // No Flow history for this contact in M0: deterministic default (NEW prospect).
    return Promise.resolve({ contactId, stage: "NEW", classification: "PROSPECT" });
  }

  async getAssessmentStatus(_contactId: ContactId): Promise<AssessmentStatus> {
    // Flow is the source of truth (§15); M0 mock has no assessment/booking data.
    return Promise.resolve("NOT_STARTED");
  }

  async createNextAction(input: LearningNextActionRequest): Promise<NextActionRef> {
    this.requireFlowAvailable();
    const nextActionId = nextSequentialId(
      this.store.getData().flowNextActions.map((a) => a.nextActionId),
      "na_"
    );
    this.store.update((draft) => {
      draft.flowNextActions.push({
        nextActionId,
        title: input.title,
        dueAt: input.dueAt ?? null,
      });
      const current = draft.flowContext[input.contactId];
      draft.flowContext[input.contactId] = {
        contactId: input.contactId,
        stage: current?.stage ?? "NEW",
        classification: current?.classification ?? "PROSPECT",
        primaryNextAction: {
          id: nextActionId,
          type: input.actionType,
          dueAt: input.dueAt ?? null,
        },
      };
    });
    return Promise.resolve({ nextActionId });
  }

  async appendLearningActivity(input: LearningActivityProjection): Promise<ActivityRef | void> {
    this.requireFlowAvailable();
    const before = this.store.getData().flowActivities.length;
    this.store.update((draft) => {
      draft.flowActivities.push(input);
    });
    return Promise.resolve({ activityId: `act_${before + 1}` });
  }

  private requireFlowAvailable(): void {
    const capabilities = this.store.getCapabilities();
    if (!capabilities.entitlements.promotorFlow) {
      throw new FlowIntegrationUnavailableError(
        "NOT_ENTITLED",
        "Organization is not entitled to PromotorFlow (CLASS_ONLY scenario)."
      );
    }
    if (capabilities.integrationHealth?.promotorFlow !== "AVAILABLE") {
      throw new FlowIntegrationUnavailableError(
        "HEALTH_UNAVAILABLE",
        "PromotorFlow integration is currently unavailable (BUNDLE_FLOW_UNAVAILABLE scenario)."
      );
    }
  }
}

export class MockPromotorClassAdapter implements PromotorClassAdapter {
  constructor(
    private readonly store: MockStateStore,
    options: { now?: () => string } = {}
  ) {
    this.learnerRepository = new LearnerRepository(store, options);
  }

  private readonly learnerRepository: LearnerRepository;

  /** INTEGRATION_CONTRACT §17 — minimum learning view Flow reads per contact. */
  async getLearningContext(contactId: ContactId): Promise<LearningContext> {
    const data = this.store.getData();
    const activeEnrollments = data.enrollments
      .filter(
        (e) => e.contactId === contactId && (e.status === "enrolled" || e.status === "started")
      )
      .map((e) => {
        const program = data.programs.find((p) => p.id === e.programId);
        return {
          enrollmentId: e.id,
          programId: e.programId,
          programTitle: program?.title ?? e.programId,
          progressPercent: e.progressPercent,
          learningStatus: e.learningStatus,
          intentLabel: e.intentLabel,
          lastActivityAt: e.lastActivityAt ?? null,
        };
      });
    const recentSignals = data.learningSignals
      .filter((s) => s.contactId === contactId)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3)
      .map((s) => ({
        type: s.signalType,
        reason: s.reason,
        priority: s.priority,
        createdAt: s.createdAt,
      }));
    return Promise.resolve({ contactId, activeEnrollments, recentSignals });
  }

  /** INTEGRATION_CONTRACT §13/§28 — eligible aftersales programs not yet enrolled. */
  async listEligiblePrograms(input: EligibleProgramsInput): Promise<ProgramSummary[]> {
    const data = this.store.getData();
    const eligible = data.programs
      .filter(
        (p) =>
          p.type === "aftersales" &&
          p.status === "published" &&
          !data.enrollments.some(
            (e) => e.contactId === input.contactId && e.programId === p.id
          )
      )
      .map((p) => ({ id: p.id, title: p.title, slug: p.slug }));
    return Promise.resolve(eligible);
  }

  /** INTEGRATION_CONTRACT §45 — same canonical contact_id, idempotent. */
  async enrollContact(input: EnrollContactInput): Promise<EnrollmentRef> {
    return this.learnerRepository.createEnrollment(input);
  }

  async getEnrollmentStatus(
    contactId: ContactId,
    programId: ProgramId
  ): Promise<EnrollmentStatus | null> {
    const found = this.store
      .getData()
      .enrollments.find((e) => e.contactId === contactId && e.programId === programId);
    return Promise.resolve(found?.status ?? null);
  }
}
