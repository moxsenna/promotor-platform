/**
 * Demo simulator control-plane — M0 boundary file.
 *
 * Scenario names (CLASS_ONLY / BUNDLE_AVAILABLE / BUNDLE_FLOW_UNAVAILABLE)
 * live in mock code, not contracts (plan §6.1). Capabilities derive from
 * ProductEntitlements + IntegrationHealth (contracts capabilities.ts).
 * resetDemo() restores the deterministic seed; setDemoScenario() switches
 * the entitlement/health combination. Class-only is never an outage.
 */
export * from "./ports";
export * from "./queries";
export * from "./commands";
