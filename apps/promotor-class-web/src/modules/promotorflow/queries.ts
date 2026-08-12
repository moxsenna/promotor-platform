/**
 * PromotorFlow queries (M0.6). Async because they mirror the adapter contract
 * (§12/§13 return Promises — a real Flow boundary is remote).
 */
import type {
  AssessmentStatus,
  EligibleProgramsInput,
  EnrollmentStatus,
  FlowContactContext,
  LearningContext,
  ProgramId,
  ProgramSummary,
} from "@promotor/contracts";
import type { ContactId } from "@promotor/contracts";
import type { FlowNextActionRef } from "@promotor/contracts";
import { getDefaultStore } from "@/adapters/mock/mock-state-store";
import type { MockStateStore } from "@/adapters/mock/mock-state-store";
import {
  MockPromotorClassAdapter,
  MockPromotorFlowAdapter,
} from "@/adapters/mock/promotorflow-adapter";
import type { IntegrationQueueItem } from "@/adapters/mock/seed-state";
import type { PromotorFlowPorts } from "./ports";

export interface PromotorFlowStoreDeps {
  store: MockStateStore;
}

const toFlowAdapter = (deps?: Partial<PromotorFlowPorts>) =>
  deps?.flow ?? new MockPromotorFlowAdapter(getDefaultStore());

const toClassAdapter = (deps?: Partial<PromotorFlowPorts>) =>
  deps?.classAdapter ?? new MockPromotorClassAdapter(getDefaultStore());

/** Class → Flow: contact context (§14). */
export function getFlowContactContext(
  contactId: ContactId,
  deps?: Partial<PromotorFlowPorts>
): Promise<FlowContactContext> {
  return toFlowAdapter(deps).getContactContext(contactId);
}

/** Class → Flow: assessment status (§15). */
export function getAssessmentStatus(
  contactId: ContactId,
  deps?: Partial<PromotorFlowPorts>
): Promise<AssessmentStatus> {
  return toFlowAdapter(deps).getAssessmentStatus(contactId);
}

/** Local record of NextAction refs created this session (for "Open in PromotorFlow"). */
export function listFlowNextActions(deps?: Partial<PromotorFlowStoreDeps>): FlowNextActionRef[] {
  const store = deps?.store ?? getDefaultStore();
  return store.getData().flowNextActions;
}

/** "Sync queued" items parked during an outage (plan §9.13). */
export function listIntegrationQueue(
  deps?: Partial<PromotorFlowStoreDeps>
): IntegrationQueueItem[] {
  const store = deps?.store ?? getDefaultStore();
  return store.getData().integrationQueue;
}

/** Flow → Class: learning context (§17). */
export function getLearningContext(
  contactId: ContactId,
  deps?: Partial<PromotorFlowPorts>
): Promise<LearningContext> {
  return toClassAdapter(deps).getLearningContext(contactId);
}

/** Flow → Class: eligible aftersales programs (§28). */
export function listEligiblePrograms(
  input: EligibleProgramsInput,
  deps?: Partial<PromotorFlowPorts>
): Promise<ProgramSummary[]> {
  return toClassAdapter(deps).listEligiblePrograms(input);
}

/** Flow → Class: enrollment status for a contact+program pair. */
export function getEnrollmentStatus(
  contactId: ContactId,
  programId: ProgramId,
  deps?: Partial<PromotorFlowPorts>
): Promise<EnrollmentStatus | null> {
  return toClassAdapter(deps).getEnrollmentStatus(contactId, programId);
}
