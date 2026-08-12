/**
 * PromotorFlow commands (M0.6). The command layer wraps the adapter and
 * catches FlowIntegrationUnavailableError to park work in the mock sync queue
 * (plan §9.13): during an outage the caller gets an honest QUEUED result, and
 * learning itself never breaks.
 */
import type {
  ActivityRef,
  LearningActivityProjection,
  LearningNextActionRequest,
  NextActionRef,
} from "@promotor/contracts";
import { getDefaultStore } from "@/adapters/mock/mock-state-store";
import {
  FlowIntegrationUnavailableError,
  MockIntegrationQueue,
  MockPromotorFlowAdapter,
} from "@/adapters/mock/promotorflow-adapter";
import type { FlowUnavailableReason } from "@/adapters/mock/promotorflow-adapter";
import type { PromotorFlowPorts } from "./ports";

export type CreateNextActionResult =
  | { status: "CREATED"; ref: NextActionRef }
  | { status: "QUEUED"; queueItemId: string; reason: FlowUnavailableReason };

export type AppendLearningActivityResult =
  | { status: "CREATED"; ref: ActivityRef | null }
  | { status: "QUEUED"; queueItemId: string; reason: FlowUnavailableReason };

export async function createNextAction(
  input: LearningNextActionRequest,
  deps?: Partial<PromotorFlowPorts>
): Promise<CreateNextActionResult> {
  const flow = deps?.flow ?? new MockPromotorFlowAdapter(getDefaultStore());
  try {
    const ref = await flow.createNextAction(input);
    return { status: "CREATED", ref };
  } catch (error) {
    if (error instanceof FlowIntegrationUnavailableError) {
      const queue = deps?.queue ?? new MockIntegrationQueue(getDefaultStore());
      const queueItemId = queue.enqueue({
        kind: "NEXT_ACTION",
        input,
        reason: error.reason,
      });
      return { status: "QUEUED", queueItemId, reason: error.reason };
    }
    throw error;
  }
}

export async function appendLearningActivity(
  input: LearningActivityProjection,
  deps?: Partial<PromotorFlowPorts>
): Promise<AppendLearningActivityResult> {
  const flow = deps?.flow ?? new MockPromotorFlowAdapter(getDefaultStore());
  try {
    const ref = await flow.appendLearningActivity(input);
    // Contract allows void (no ref needed) — normalize to null, never fake an id.
    return { status: "CREATED", ref: ref === undefined ? null : ref };
  } catch (error) {
    if (error instanceof FlowIntegrationUnavailableError) {
      const queue = deps?.queue ?? new MockIntegrationQueue(getDefaultStore());
      const queueItemId = queue.enqueue({
        kind: "ACTIVITY",
        input,
        reason: error.reason,
      });
      return { status: "QUEUED", queueItemId, reason: error.reason };
    }
    throw error;
  }
}
