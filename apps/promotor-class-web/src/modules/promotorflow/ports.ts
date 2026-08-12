/**
 * PromotorFlow integration domain ports (M0.6).
 *
 * Mirrors INTEGRATION_CONTRACT §12/§13 exactly: Class → Flow via
 * PromotorFlowAdapter, Flow → Class via PromotorClassAdapter. M0 lifecycle is
 * create/request only — completeNextAction/rescheduleNextAction never exist
 * here. The mock integration queue (plan §9.13, "Sync queued") parks work
 * requested during an outage; queued items are NOT canonical Flow refs.
 */
import type { PromotorClassAdapter, PromotorFlowAdapter } from "@promotor/contracts";
import type { IntegrationQueueItem } from "@/adapters/mock/seed-state";

export interface IntegrationQueuePort {
  enqueue(item: Omit<IntegrationQueueItem, "id" | "createdAt">): string;
}

export interface PromotorFlowPorts {
  flow: PromotorFlowAdapter;
  classAdapter: PromotorClassAdapter;
  queue: IntegrationQueuePort;
}
