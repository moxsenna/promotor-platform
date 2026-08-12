import { seedMockState } from "./seed-state";
import type { MockStateData } from "./seed-state";
import { capabilitiesForScenario, DEFAULT_SCENARIO, DEMO_SCENARIOS } from "./scenario";
import type { DemoScenario, ScenarioCapabilities } from "./scenario";

/**
 * Persistent mock state store (plan §9.3/§9.4).
 *
 * localStorage key `promotorclass:m0:state:v1` (namespaced + versioned):
 * - seeds deterministic state when absent,
 * - persists every mutation,
 * - survives refresh (reload from storage),
 * - resetDemo(): clear persisted state → clone seed → persist → notify → default scenario,
 * - recovers from corrupt/invalid persisted state by discarding it and
 *   restoring the deterministic seed — never crashes,
 * - subscribe()/update() emit notifications for the React hook in T10/T11
 *   (the store itself stays framework-free).
 *
 * Storage is injected (Storage-like interface) so tests run in plain node
 * without a DOM; the default is window.localStorage on the client and null
 * (fresh in-memory seed) on the server.
 */

export interface MockStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const MOCK_STATE_STORAGE_KEY = "promotorclass:m0:state:v1";
export const MOCK_STATE_VERSION = 1;

export class MockStateStore {
  static readonly STORAGE_KEY = MOCK_STATE_STORAGE_KEY;
  static readonly VERSION = MOCK_STATE_VERSION;

  readonly storageKey = MOCK_STATE_STORAGE_KEY;

  private readonly storage: MockStorage | null;
  private readonly listeners = new Set<() => void>();
  private state: MockStateData;
  private scenario: DemoScenario;

  constructor(options: { storage?: MockStorage | null } = {}) {
    this.storage =
      options.storage === undefined ? createDefaultStorage() : options.storage;
    const persisted = this.readPersisted();
    if (persisted) {
      this.state = persisted.data;
      this.scenario = persisted.scenario;
    } else {
      this.state = seedMockState();
      this.scenario = DEFAULT_SCENARIO;
      this.persist();
    }
  }

  /** Current mock state. Read-only by convention — mutate ONLY via update(). */
  getData(): MockStateData {
    return this.state;
  }

  getScenario(): DemoScenario {
    return this.scenario;
  }

  getCapabilities(): ScenarioCapabilities {
    return this.state.capabilities;
  }

  /**
   * The single mutation path: applies the mutator, persists, notifies.
   * All repositories/services mutate through here.
   */
  update(mutator: (data: MockStateData) => void): void {
    mutator(this.state);
    this.persist();
    this.emit();
  }

  setScenario(scenario: DemoScenario): void {
    if (!DEMO_SCENARIOS.includes(scenario)) {
      throw new Error(`Unknown demo scenario: "${scenario}".`);
    }
    this.scenario = scenario;
    this.state.capabilities = capabilitiesForScenario(scenario);
    this.persist();
    this.emit();
  }

  /** Restore the pristine deterministic demo (plan §9.4). */
  resetDemo(): void {
    this.state = seedMockState();
    this.scenario = DEFAULT_SCENARIO;
    if (this.storage) {
      try {
        this.storage.removeItem(this.storageKey);
      } catch {
        // Storage unavailable — in-memory reset still effective.
      }
    }
    this.persist();
    this.emit();
  }

  /** Returns an unsubscribe function. Listener receives no payload; re-read state. */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private readPersisted(): PersistedMockState | null {
    if (!this.storage) return null;
    let raw: string | null = null;
    try {
      raw = this.storage.getItem(this.storageKey);
    } catch {
      return null;
    }
    if (raw === null) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!isValidPersistedState(parsed)) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  private persist(): void {
    if (!this.storage) return;
    const payload: PersistedMockState = {
      version: MOCK_STATE_VERSION,
      scenario: this.scenario,
      data: this.state,
    };
    try {
      this.storage.setItem(this.storageKey, JSON.stringify(payload));
    } catch {
      // Quota/security errors: keep working in-memory, never crash.
    }
  }

  private emit(): void {
    for (const listener of [...this.listeners]) listener();
  }
}

interface PersistedMockState {
  version: typeof MOCK_STATE_VERSION;
  scenario: DemoScenario;
  data: MockStateData;
}

/**
 * Structural validation of persisted state. Corrupt/mismatched payloads are
 * discarded and replaced by the deterministic seed (plan §9.3 "recover from
 * corrupt/invalid state ... do not crash").
 */
function isValidPersistedState(value: unknown): value is PersistedMockState {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  if (record.version !== MOCK_STATE_VERSION) return false;
  if (
    typeof record.scenario !== "string" ||
    !(DEMO_SCENARIOS as readonly string[]).includes(record.scenario)
  ) {
    return false;
  }
  return isValidMockStateData(record.data);
}

function isValidMockStateData(value: unknown): value is MockStateData {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  if (!isValidCapabilities(record.capabilities)) return false;
  const workspace = record.workspace;
  if (typeof workspace !== "object" || workspace === null) return false;
  const arrayKeys = [
    "contacts",
    "programs",
    "modules",
    "lessons",
    "enrollments",
    "lessonProgress",
    "reflections",
    "learningEvents",
    "learningSignals",
    "flowActivities",
    "flowNextActions",
    "integrationQueue",
  ] as const;
  for (const key of arrayKeys) {
    const items = record[key];
    if (!Array.isArray(items)) return false;
    for (const item of items) {
      if (typeof item !== "object" || item === null) return false;
    }
  }
  const flowContext = record.flowContext;
  if (typeof flowContext !== "object" || flowContext === null || Array.isArray(flowContext)) {
    return false;
  }
  return true;
}

function isValidCapabilities(value: unknown): value is ScenarioCapabilities {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  const entitlements = record.entitlements;
  if (typeof entitlements !== "object" || entitlements === null) return false;
  const ent = entitlements as Record<string, unknown>;
  if (typeof ent.promotorClass !== "boolean" || typeof ent.promotorFlow !== "boolean") {
    return false;
  }
  const health = record.integrationHealth;
  if (health === null) return true; // CLASS_ONLY: Flow health not queried.
  if (typeof health !== "object" || health === null) return false;
  const flowHealth = (health as Record<string, unknown>).promotorFlow;
  return flowHealth === "AVAILABLE" || flowHealth === "UNAVAILABLE";
}

function createDefaultStorage(): MockStorage | null {
  if (typeof window === "undefined") return null;
  try {
    const storage = window.localStorage;
    if (!storage) return null;
    // Probe: access can throw in restricted/private contexts.
    storage.getItem(MOCK_STATE_STORAGE_KEY);
    return storage;
  } catch {
    return null;
  }
}

let defaultStore: MockStateStore | null = null;

/**
 * Lazy process-wide store.
 *
 * Client: one store backed by window.localStorage for the whole session.
 * Server (SSR): no persistent storage → in-memory deterministic seed. Server
 * components only read; demo mutations are client-side ("use client" per
 * global constraints), so the server singleton stays pristine.
 */
export function getDefaultStore(): MockStateStore {
  defaultStore ??= new MockStateStore();
  return defaultStore;
}
