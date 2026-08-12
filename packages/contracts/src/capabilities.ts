import { z } from "zod";

/**
 * Product capabilities are TWO separate concepts, never one overloaded enum:
 *
 * - ProductEntitlements: what the organization is entitled/billed to use.
 * - IntegrationHealth: observed runtime availability of the Flow integration.
 *
 * If a user is not entitled to Flow, consumers derive that from entitlements
 * rather than faking service health. See docs/INTEGRATION_CONTRACT.md and the
 * M0.1.7 mock scenarios (CLASS_ONLY / BUNDLE_AVAILABLE / BUNDLE_FLOW_UNAVAILABLE).
 */

export const ProductEntitlementsSchema = z.object({
  promotorClass: z.boolean(),
  promotorFlow: z.boolean(),
});
export type ProductEntitlements = z.infer<typeof ProductEntitlementsSchema>;

export const PromotorFlowHealthSchema = z.enum(["AVAILABLE", "UNAVAILABLE"]);
export type PromotorFlowHealth = z.infer<typeof PromotorFlowHealthSchema>;

export const IntegrationHealthSchema = z.object({
  promotorFlow: PromotorFlowHealthSchema,
});
export type IntegrationHealth = z.infer<typeof IntegrationHealthSchema>;