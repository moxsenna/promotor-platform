import { describe, expect, it } from "vitest";
import {
  AssessmentStatusSchema,
  ContactIdSchema,
  IntegrationHealthSchema,
  LearningEventEnvelopeSchema,
  LearningNextActionRequestSchema,
  OrganizationIdSchema,
  ProductEntitlementsSchema,
} from "./index";

describe("ProductEntitlementsSchema", () => {
  it("accepts valid entitlements", () => {
    const result = ProductEntitlementsSchema.safeParse({
      promotorClass: true,
      promotorFlow: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects when promotorFlow is missing", () => {
    const result = ProductEntitlementsSchema.safeParse({
      promotorClass: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-boolean values", () => {
    const result = ProductEntitlementsSchema.safeParse({
      promotorClass: true,
      promotorFlow: "yes",
    });
    expect(result.success).toBe(false);
  });
});

describe("IntegrationHealthSchema", () => {
  it("accepts AVAILABLE and UNAVAILABLE", () => {
    expect(
      IntegrationHealthSchema.safeParse({ promotorFlow: "AVAILABLE" }).success
    ).toBe(true);
    expect(
      IntegrationHealthSchema.safeParse({ promotorFlow: "UNAVAILABLE" }).success
    ).toBe(true);
  });

  it("rejects unknown health values", () => {
    const result = IntegrationHealthSchema.safeParse({
      promotorFlow: "DEGRADED",
    });
    expect(result.success).toBe(false);
  });
});

describe("AssessmentStatusSchema", () => {
  it("accepts every canonical status", () => {
    for (const status of [
      "NOT_STARTED",
      "SCHEDULED",
      "COMPLETED",
      "CANCELLED",
      "UNKNOWN",
    ]) {
      expect(AssessmentStatusSchema.safeParse(status).success).toBe(true);
    }
  });

  it("rejects non-contract status", () => {
    expect(AssessmentStatusSchema.safeParse("IN_PROGRESS").success).toBe(false);
  });
});

describe("LearningNextActionRequestSchema", () => {
  const validRequest = {
    organizationId: "org_001",
    contactId: "contact_001",
    source: "PROMOTORCLASS",
    sourceEventId: "evt_123",
    sourceSignalId: "sig_456",
    actionType: "FOLLOW_UP",
    title: "Follow up tentang assessment.",
    reason: "Progress 80%, belum pernah assessment.",
    dueAt: "2026-08-14T09:00:00.000Z",
    context: {
      programId: "prog_01",
      programTitle: "Parenting Mini Class",
      enrollmentId: "enr_01",
      signalType: "HIGH_LEARNING_INTENT",
      intentLabel: "hot",
    },
    idempotencyKey: "promotorclass:evt_123:lead_magnet_progress_80",
  };

  it("accepts a valid request", () => {
    const result = LearningNextActionRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it("rejects a wrong actionType", () => {
    const result = LearningNextActionRequestSchema.safeParse({
      ...validRequest,
      actionType: "FOLLOW_UP_NOW",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing idempotencyKey", () => {
    const { idempotencyKey, ...withoutKey } = validRequest;
    const result = LearningNextActionRequestSchema.safeParse(withoutKey);
    expect(result.success).toBe(false);
  });

  it("rejects a missing contactId", () => {
    const { contactId, ...withoutContact } = validRequest;
    const result = LearningNextActionRequestSchema.safeParse(withoutContact);
    expect(result.success).toBe(false);
  });

  it("accepts a request without optional fields", () => {
    const minimal = {
      organizationId: "org_001",
      contactId: "contact_001",
      source: "PROMOTORCLASS",
      sourceEventId: "evt_123",
      actionType: "MANUAL",
      title: "Manual follow up.",
      reason: "Promotor decided.",
      context: {},
      idempotencyKey: "promotorclass:evt_123:manual_01",
    };
    const result = LearningNextActionRequestSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });
});

describe("branded ID schemas", () => {
  it("accepts proper id strings", () => {
    expect(OrganizationIdSchema.safeParse("org_001").success).toBe(true);
    expect(ContactIdSchema.safeParse("contact_001").success).toBe(true);
  });

  it("rejects empty strings", () => {
    expect(OrganizationIdSchema.safeParse("").success).toBe(false);
  });

  it("rejects non-string values", () => {
    expect(ContactIdSchema.safeParse(123).success).toBe(false);
  });
});

describe("LearningEventEnvelopeSchema", () => {
  const envelope = {
    schemaVersion: 1,
    eventId: "evt_001",
    eventType: "lesson.completed",
    sourceApp: "PROMOTORCLASS",
    organizationId: "org_001",
    contactId: "contact_001",
    occurredAt: "2026-08-12T10:00:00.000Z",
    subject: {
      programId: "prog_01",
      enrollmentId: "enr_01",
      lessonId: "les_01",
    },
    payload: {
      lessonId: "les_01",
      programId: "prog_01",
    },
  };

  it("accepts a valid envelope", () => {
    const result = LearningEventEnvelopeSchema.safeParse(envelope);
    expect(result.success).toBe(true);
  });

  it("rejects unknown eventType", () => {
    const result = LearningEventEnvelopeSchema.safeParse({
      ...envelope,
      eventType: "booking.created",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing contactId", () => {
    const { contactId, ...withoutContact } = envelope;
    const result = LearningEventEnvelopeSchema.safeParse(withoutContact);
    expect(result.success).toBe(false);
  });
});
