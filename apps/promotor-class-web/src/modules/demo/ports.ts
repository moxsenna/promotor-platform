/**
 * Demo simulator control-plane ports (M0.6).
 *
 * resetDemo + scenario switching are demo-level commands; the MockStateStore
 * itself satisfies this port (it is the store's own surface).
 */
import type { DemoScenario, ScenarioCapabilities } from "@/adapters/mock/scenario";

export interface DemoStatePort {
  getScenario(): DemoScenario;
  getCapabilities(): ScenarioCapabilities;
  resetDemo(): void;
  setScenario(scenario: DemoScenario): void;
}

export interface DemoDeps {
  state: DemoStatePort;
}
