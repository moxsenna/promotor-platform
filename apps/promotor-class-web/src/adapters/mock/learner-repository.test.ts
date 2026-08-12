import { describe, expect, it } from "vitest";
import { PhoneNormalizationError } from "@promotor/platform-core";
import type { ContactId, OrganizationId, ProgramId } from "@promotor/contracts";
import { MockStateStore } from "./mock-state-store";
import type { MockStorage } from "./mock-state-store";
import { LearnerRepository } from "./learner-repository";
import { brandId } from "./next-id";

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
}

function createHarness() {
  const store = new MockStateStore({ storage: new MemoryStorage() });
  const repo = new LearnerRepository(store, { now: () => "2026-08-12T08:00:00.000Z" });
  return { store, repo };
}

describe("LearnerRepository identity (plan §11.5)", () => {
  it("phone variants resolve to one canonical demo Contact", () => {
    const { repo } = createHarness();
    const variants = [
      "081222333444",
      "6281222333444",
      "+6281222333444",
      "+62 812-2233-3444",
      "(+62) 812 2233 3444",
    ];
    for (const variant of variants) {
      const result = repo.matchOrCreateContact({
        organizationId: "org_001",
        name: "Ayu Rahma",
        phone: variant,
        source: "instagram",
      });
      expect(result.matched).toBe(true);
      expect(result.contact.id).toBe("contact_001"); // canonical contact_id reused
    }
  });

  it("unknown phone creates a contact with canonical E.164 and the next id", () => {
    const { store, repo } = createHarness();
    const result = repo.matchOrCreateContact({
      organizationId: "org_001",
      name: "Budi Santoso",
      phone: "0817-0000-0000",
      source: "instagram",
    });
    expect(result.matched).toBe(false);
    expect(result.contact.id).toBe("contact_006");
    expect(result.contact.phoneE164).toBe("+6281700000000");
    // learner.registered event recorded for the new person.
    expect(
      store.getData().learningEvents.some(
        (e) => e.eventType === "learner.registered" && e.contactId === "contact_006"
      )
    ).toBe(true);
  });

  it("cannot match on a name when the phone differs (creates separate contact)", () => {
    const { repo } = createHarness();
    const result = repo.matchOrCreateContact({
      organizationId: "org_001",
      name: "Ayu Rahma",
      phone: "081700000000",
      source: "instagram",
    });
    expect(result.matched).toBe(false);
    expect(result.contact.id).toBe("contact_006");
  });

  it("rejects invalid phone input with PhoneNormalizationError (never silently sanitizes)", () => {
    const { repo } = createHarness();
    expect(() =>
      repo.matchOrCreateContact({
        organizationId: "org_001",
        name: "X",
        phone: "not-a-phone",
        source: "instagram",
      })
    ).toThrowError(PhoneNormalizationError);
  });
});

describe("LearnerRepository enrollments", () => {
  it("creates an enrollment idempotently (no duplicate learner.enrolled event)", () => {
    const { store, repo } = createHarness();
    const input = {
      organizationId: brandId<OrganizationId>("org_001"),
      contactId: brandId<ContactId>("contact_001"),
      programId: brandId<ProgramId>("prog_02"),
      source: "PROMOTORFLOW_AFTERSALES" as const,
      idempotencyKey: "x",
    };
    const eventsBefore = store.getData().learningEvents.length;
    const first = repo.createEnrollment(input);
    expect(first.enrollmentId).toBe("enr_06");
    const eventsAfterFirst = store.getData().learningEvents.length;
    expect(eventsAfterFirst).toBe(eventsBefore + 1);

    const second = repo.createEnrollment(input);
    expect(second.enrollmentId).toBe("enr_06");
    expect(store.getData().learningEvents.length).toBe(eventsAfterFirst);
  });

  it("rejects enrollment for unknown program or contact", () => {
    const { repo } = createHarness();
    expect(() =>
      repo.createEnrollment({
        organizationId: brandId<OrganizationId>("org_001"),
        contactId: brandId<ContactId>("contact_001"),
        programId: brandId<ProgramId>("prog_999"),
        source: "PROMOTORFLOW_MANUAL",
        idempotencyKey: "x",
      })
    ).toThrowError(/unknown program "prog_999"/);
  });
});
