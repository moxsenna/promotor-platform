/**
 * Capability model re-exported from @promotor/contracts (single source of
 * truth, constraint: contracts <- platform-core). Two separate concepts:
 * ProductEntitlements (what the org is entitled to) and IntegrationHealth
 * (observed runtime availability of the Flow integration) — never one
 * overloaded enum. See docs/INTEGRATION_CONTRACT.md.
 */
export {
  ProductEntitlementsSchema,
  IntegrationHealthSchema,
  PromotorFlowHealthSchema,
} from "@promotor/contracts";
export type {
  ProductEntitlements,
  IntegrationHealth,
  PromotorFlowHealth,
} from "@promotor/contracts";