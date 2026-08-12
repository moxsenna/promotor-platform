import { z } from "zod";
import {
  ContactIdSchema,
  EnrollmentIdSchema,
  LearningEventIdSchema,
  LessonIdSchema,
  OrganizationIdSchema,
  ProgramIdSchema,
} from "./ids";

/**
 * PromotorClass-owned append-only learning events.
 *
 * Event names are contracts (INTEGRATION_CONTRACT §18). Envelope shape follows
 * §19 IntegrationEventEnvelope: schemaVersion 1, UTC ISO timestamp, runtime
 * validation, consumers ignore unknown optional fields, breaking semantics
 * require a version bump.
 */

export const LEARNING_EVENT_TYPES = [
  "program.created",
  "program.published",
  "learner.registered",
  "learner.enrolled",
  "lesson.started",
  "lesson.completed",
  "reflection.submitted",
  "program.progress_50",
  "program.progress_80",
  "program.completed",
  "cta.viewed",
  "cta.clicked",
  "learner.inactive",
] as const;

export const LearningEventTypeSchema = z.enum(LEARNING_EVENT_TYPES);
export type LearningEventType = z.infer<typeof LearningEventTypeSchema>;

export const SourceAppSchema = z.enum(["PROMOTORCLASS", "PROMOTORFLOW"]);
export type SourceApp = z.infer<typeof SourceAppSchema>;

export const EventSubjectSchema = z
  .object({
    programId: ProgramIdSchema.optional(),
    enrollmentId: EnrollmentIdSchema.optional(),
    lessonId: LessonIdSchema.optional(),
    bookingId: z.string().min(1).optional(),
    serviceId: z.string().min(1).optional(),
  })
  .optional();
export type EventSubject = z.infer<typeof EventSubjectSchema>;

/** Generic cross-app envelope (INTEGRATION_CONTRACT §19). eventType is free-form here. */
export const IntegrationEventEnvelopeSchema = z.object({
  schemaVersion: z.literal(1),
  eventId: z.string().min(1),
  eventType: z.string().min(1),
  sourceApp: SourceAppSchema,
  organizationId: OrganizationIdSchema,
  contactId: ContactIdSchema,
  occurredAt: z.string(),
  subject: EventSubjectSchema,
  payload: z.unknown(),
});
export type IntegrationEventEnvelope<TPayload = unknown> = Omit<
  z.infer<typeof IntegrationEventEnvelopeSchema>,
  "payload"
> & { payload: TPayload };

/** Class learning-event envelope: eventType restricted to the canonical event names. */
export const LearningEventEnvelopeSchema = IntegrationEventEnvelopeSchema.extend(
  { eventType: LearningEventTypeSchema }
);
export type LearningEventEnvelope<TPayload = unknown> = Omit<
  z.infer<typeof LearningEventEnvelopeSchema>,
  "payload"
> & { payload: TPayload };

/** Event payloads for the canonical Class event types. */
export const LessonCompletedPayloadSchema = z.object({
  lessonId: LessonIdSchema,
  programId: ProgramIdSchema,
});
export type LessonCompletedPayload = z.infer<
  typeof LessonCompletedPayloadSchema
>;

export const CtaClickedPayloadSchema = z.object({
  ctaId: z.string().min(1),
  programId: ProgramIdSchema.optional(),
  lessonId: LessonIdSchema.optional(),
});
export type CtaClickedPayload = z.infer<typeof CtaClickedPayloadSchema>;

export const LearnerInactivePayloadSchema = z.object({
  programId: ProgramIdSchema.optional(),
  enrollmentId: EnrollmentIdSchema.optional(),
  progressPercent: z.number().int().min(0).max(100),
});
export type LearnerInactivePayload = z.infer<
  typeof LearnerInactivePayloadSchema
>;