/**
 * Demo queries (M0.6): which scenario is active and what it means for
 * capabilities (ProductEntitlements + IntegrationHealth — two separate
 * concepts, plan §9.5). CLASS_ONLY must never be rendered as an outage.
 */
import type { DemoScenario, ScenarioCapabilities } from "@/adapters/mock/scenario";
import { getDefaultStore } from "@/adapters/mock/mock-state-store";
import type { DemoDeps } from "./ports";

export function getDemoScenario(deps?: Partial<DemoDeps>): DemoScenario {
  return (deps?.state ?? getDefaultStore()).getScenario();
}

export function getCapabilities(deps?: Partial<DemoDeps>): ScenarioCapabilities {
  return (deps?.state ?? getDefaultStore()).getCapabilities();
}

/** Entitled AND healthy — only then is a Flow call attempted. */
export function isFlowUsable(deps?: Partial<DemoDeps>): boolean {
  const capabilities = getCapabilities(deps);
  return (
    capabilities.entitlements.promotorFlow &&
    capabilities.integrationHealth?.promotorFlow === "AVAILABLE"
  );
}
