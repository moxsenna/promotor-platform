import { describe, expect, it } from "vitest";
import type {
  ContactId,
  EnrollmentId,
  LearningEventEnvelope,
  LessonId,
  OrganizationId,
  ProgramId,
} from "@promotor/contracts";
import {
  MOCK_STATE_STORAGE_KEY,
  MOCK_STATE_VERSION,
  MockStateStore,
} from "./mock-state-store";
import type { MockStorage } from "./mock-state-store";
import { DEFAULT_SCENARIO, DEMO_SCENARIOS } from "./scenario";
import type { DemoScenario } from "./scenario";
import { brandId } from "./next-id";

/** In-memory Storage-like fake — tests never touch real localStorage. */
class MemoryStorage implements MockStorage {
  private readonly map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
  dump(key: string): string | undefined {
    return this.map.get(key);
  }
}

const SEED_CONTACTS = 5;
const SEED_PROGRAMS = 4;
const SEED_MODULES = 6;
const SEED_LESSONS = 26;
const SEED_ENROLLMENTS = 5;
const SEED_EVENTS = 54;
const SEED_SIGNALS = 5;

describe("MockStateStore", () => {
  it("seeds deterministic state when storage is empty", () => {
    const store = new MockStateStore({ storage: new MemoryStorage() });
    const data = store.getData();
    expect(data.contacts).toHaveLength(SEED_CONTACTS);
    expect(data.programs).toHaveLength(SEED_PROGRAMS);
    expect(data.modules).toHaveLength(SEED_MODULES);
    expect(data.lessons).toHaveLength(SEED_LESSONS);
    expect(data.enrollments).toHaveLength(SEED_ENROLLMENTS);
    expect(data.learningEvents).toHaveLength(SEED_EVENTS);
    expect(data.learningSignals).toHaveLength(SEED_SIGNALS);
    expect(data.flowActivities).toHaveLength(3);
    expect(data.flowNextActions).toHaveLength(0);
    expect(data.integrationQueue).toHaveLength(0);
    expect(data.reflections).toHaveLength(2);
    expect(store.getScenario()).toBe(DEFAULT_SCENARIO);
    expect(store.getCapabilities()).toEqual({
      entitlements: { promotorClass: true, promotorFlow: true },
      integrationHealth: { promotorFlow: "AVAILABLE" },
    });
    expect(store.getData().workspace.organization.slug).toBe("rina");
  });

  it("seeds and persists on first use", () => {
    const storage = new MemoryStorage();
    const store = new MockStateStore({ storage });
    const persisted = JSON.parse(storage.dump(MOCK_STATE_STORAGE_KEY) ?? "null");
    expect(persisted.version).toBe(MOCK_STATE_VERSION);
    expect(persisted.scenario).toBe(DEFAULT_SCENARIO);
    expect(persisted.data.learningEvents).toHaveLength(SEED_EVENTS);
  });

  it("persists mutations and reloads them on a fresh store (survive refresh)", () => {
    const storage = new MemoryStorage();
    const first = new MockStateStore({ storage });
    let newEventId = "";
    first.update((data) => {
      data.contacts.push({
        id: "contact_006",
        organizationId: "org_001",
        name: "Test User",
        phoneE164: "+6281700000000",
        source: "test",
      });
      const evt: LearningEventEnvelope = {
        schemaVersion: 1,
        eventId: "evt_t1",
        eventType: "lesson.completed",
        sourceApp: "PROMOTORCLASS",
        organizationId: brandId<OrganizationId>("org_001"),
        contactId: brandId<ContactId>("contact_001"),
        occurredAt: "2026-08-12T00:00:00.000Z",
        subject: {
          programId: brandId<ProgramId>("prog_01"),
          enrollmentId: brandId<EnrollmentId>("enr_01"),
          lessonId: brandId<LessonId>("les_002"),
        },
        payload: { lessonId: "les_002", programId: "prog_01" },
      };
      newEventId = evt.eventId;
      data.learningEvents.push(evt);
    });

    const second = new MockStateStore({ storage });
    expect(second.getData().contacts).toHaveLength(SEED_CONTACTS + 1);
    expect(second.getData().learningEvents.some((e) => e.eventId === newEventId)).toBe(true);
    // Scenario persists too.
    second.setScenario("CLASS_ONLY");
    const third = new MockStateStore({ storage });
    expect(third.getScenario()).toBe("CLASS_ONLY");
  });

  it("recovers from corrupt JSON payload (no crash)", () => {
    const storage = new MemoryStorage();
    storage.setItem(MOCK_STATE_STORAGE_KEY, "{not valid json");
    const store = new MockStateStore({ storage });
    expect(store.getData().learningEvents).toHaveLength(SEED_EVENTS);
    expect(store.getScenario()).toBe(DEFAULT_SCENARIO);
  });

  it("recovers from invalid shape (missing arrays) by restoring the seed", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      MOCK_STATE_STORAGE_KEY,
      JSON.stringify({ version: MOCK_STATE_VERSION, scenario: "BUNDLE_AVAILABLE", data: { garbage: true } })
    );
    const store = new MockStateStore({ storage });
    expect(store.getData().enrollments).toHaveLength(SEED_ENROLLMENTS);
    expect(store.getData().contacts).toHaveLength(SEED_CONTACTS);
  });

  it("recovers from wrong version (discard + reseed)", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      MOCK_STATE_STORAGE_KEY,
      JSON.stringify({ version: 99, scenario: "BUNDLE_AVAILABLE", data: {} })
    );
    const store = new MockStateStore({ storage });
    expect(store.getData().learningEvents).toHaveLength(SEED_EVENTS);
  });

  it("recovers from invalid scenario name", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      MOCK_STATE_STORAGE_KEY,
      JSON.stringify({ version: MOCK_STATE_VERSION, scenario: "NOT_A_SCENARIO", data: {} })
    );
    const store = new MockStateStore({ storage });
    expect(store.getScenario()).toBe(DEFAULT_SCENARIO);
  });

  it("resetDemo clears persisted state, restores seed + default scenario, notifies", () => {
    const storage = new MemoryStorage();
    const store = new MockStateStore({ storage });
    const events: string[] = [];
    const unsubscribe = store.subscribe(() => events.push("notified"));

    store.setScenario("BUNDLE_FLOW_UNAVAILABLE");
    store.update((data) => {
      data.contacts.push({
        id: "contact_099",
        organizationId: "org_001",
        name: "Ghost",
        phoneE164: "+6281999999999",
        source: "test",
      });
    });

    store.resetDemo();

    expect(store.getScenario()).toBe(DEFAULT_SCENARIO);
    expect(store.getData().contacts).toHaveLength(SEED_CONTACTS);
    expect(store.getData().learningEvents).toHaveLength(SEED_EVENTS);
    expect(store.getData().learningSignals).toHaveLength(SEED_SIGNALS);
    expect(store.getCapabilities()).toEqual({
      entitlements: { promotorClass: true, promotorFlow: true },
      integrationHealth: { promotorFlow: "AVAILABLE" },
    });
    expect(events).toContain("notified");
    unsubscribe();

    // Persisted state was reset: a fresh store sees the pristine seed.
    const fresh = new MockStateStore({ storage });
    expect(fresh.getData().contacts).toHaveLength(SEED_CONTACTS);
    expect(fresh.getScenario()).toBe(DEFAULT_SCENARIO);
  });

  it("subscribe/emit: notified on update, setScenario and resetDemo; unsubscribe stops", () => {
    const store = new MockStateStore({ storage: new MemoryStorage() });
    let count = 0;
    const unsubscribe = store.subscribe(() => {
      count += 1;
    });
    store.update(() => {});
    store.setScenario("CLASS_ONLY");
    expect(count).toBe(2);
    unsubscribe();
    store.update(() => {});
    expect(count).toBe(2);
  });

  it("rejects unknown scenarios", () => {
    const store = new MockStateStore({ storage: new MemoryStorage() });
    expect(() => store.setScenario("NOPE" as DemoScenario)).toThrow(/Unknown demo scenario/);
  });

  it("scenario mapping matches plan §9.5; class-only is not an outage", () => {
    const store = new MockStateStore({ storage: new MemoryStorage() });

    store.setScenario("CLASS_ONLY");
    expect(store.getCapabilities()).toEqual({
      entitlements: { promotorClass: true, promotorFlow: false },
      integrationHealth: null, // Flow health NOT queried — not "UNAVAILABLE".
    });

    store.setScenario("BUNDLE_AVAILABLE");
    expect(store.getCapabilities()).toEqual({
      entitlements: { promotorClass: true, promotorFlow: true },
      integrationHealth: { promotorFlow: "AVAILABLE" },
    });

    store.setScenario("BUNDLE_FLOW_UNAVAILABLE");
    expect(store.getCapabilities()).toEqual({
      entitlements: { promotorClass: true, promotorFlow: true },
      integrationHealth: { promotorFlow: "UNAVAILABLE" },
    });
  });

  it("every listed scenario is derivable", () => {
    for (const scenario of DEMO_SCENARIOS) {
      expect(storeFor(scenario).getCapabilities().entitlements.promotorClass).toBe(true);
    }
  });

  it("works without storage (node/SSR): in-memory seed, mutations never throw", () => {
    const store = new MockStateStore(); // no storage injected, no window
    expect(store.getData().contacts).toHaveLength(SEED_CONTACTS);
    expect(() => store.update((data) => data.contacts.push({
      id: "contact_006",
      organizationId: "org_001",
      name: "No Persistence",
      phoneE164: "+6281700000000",
      source: "test",
    }))).not.toThrow();
    expect(() => store.resetDemo()).not.toThrow();
  });
});

function storeFor(scenario: DemoScenario): MockStateStore {
  const store = new MockStateStore({ storage: new MemoryStorage() });
  store.setScenario(scenario);
  return store;
}
