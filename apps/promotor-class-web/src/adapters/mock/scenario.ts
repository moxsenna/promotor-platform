import type { IntegrationHealth, ProductEntitlements } from "@promotor/contracts";

/**
 * Demo scenarios (plan §9.5, global constraints).
 *
 * A scenario is ONE combination of ProductEntitlements + IntegrationHealth
 * (two separate concepts, never one overloaded enum — see contracts
 * capabilities.ts). Scenario names live in mock code, not in contracts
 * (plan §6.1).
 *
 *   CLASS_ONLY              → entitlements {promotorClass: true, promotorFlow: false}
 *                             Flow health NOT queried (null). Class-only is NOT
 *                             an outage — it is a different billing tier.
 *   BUNDLE_AVAILABLE        → {true, true} + promotorFlow AVAILABLE (default).
 *   BUNDLE_FLOW_UNAVAILABLE → {true, true} + promotorFlow UNAVAILABLE. Learning
 *                             stays fully usable; only Flow sync is deferred.
 */

export const DEMO_SCENARIOS = [
  "CLASS_ONLY",
  "BUNDLE_AVAILABLE",
  "BUNDLE_FLOW_UNAVAILABLE",
] as const;

export type DemoScenario = (typeof DEMO_SCENARIOS)[number];

export const DEFAULT_SCENARIO: DemoScenario = "BUNDLE_AVAILABLE";

export interface ScenarioCapabilities {
  entitlements: ProductEntitlements;
  /**
   * Observed runtime health of the Flow integration. null when Flow is not
   * queried at all (CLASS_ONLY — never fake health for a non-entitled user).
   */
  integrationHealth: IntegrationHealth | null;
}

export function capabilitiesForScenario(scenario: DemoScenario): ScenarioCapabilities {
  switch (scenario) {
    case "CLASS_ONLY":
      return {
        entitlements: { promotorClass: true, promotorFlow: false },
        integrationHealth: null,
      };
    case "BUNDLE_AVAILABLE":
      return {
        entitlements: { promotorClass: true, promotorFlow: true },
        integrationHealth: { promotorFlow: "AVAILABLE" },
      };
    case "BUNDLE_FLOW_UNAVAILABLE":
      return {
        entitlements: { promotorClass: true, promotorFlow: true },
        integrationHealth: { promotorFlow: "UNAVAILABLE" },
      };
  }
}
