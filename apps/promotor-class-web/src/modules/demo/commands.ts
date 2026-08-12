/**
 * Demo commands (M0.6 minimum set: resetDemo, setDemoScenario).
 *
 * resetDemo restores the pristine deterministic seed with the default
 * scenario (BUNDLE_AVAILABLE) and notifies subscribers (plan §9.4).
 */
import type { DemoScenario } from "@/adapters/mock/scenario";
import { getDefaultStore } from "@/adapters/mock/mock-state-store";
import type { DemoDeps } from "./ports";

export function resetDemo(deps?: Partial<DemoDeps>): void {
  (deps?.state ?? getDefaultStore()).resetDemo();
}

export function setDemoScenario(
  scenario: DemoScenario,
  deps?: Partial<DemoDeps>
): void {
  (deps?.state ?? getDefaultStore()).setScenario(scenario);
}
