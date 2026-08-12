import { z } from "zod";
import {
  ContactIdSchema,
  LearningEventIdSchema,
  LearningSignalIdSchema,
  OrganizationIdSchema,
  ProgramIdSchema,
} from "./ids";
import type { ContactId, ProgramId } from "./ids";
import type {
  EnrollContactInput,
  EnrollmentRef,
  EnrollmentStatus,
  LearningContext,
} from "./enrollments";
import type {
  EligibleProgramsInput,
  ProgramSummary,
} from "./programs";
import { IntentLabelSchema } from "./learning-signals";

/**
 * PromotorFlow integration contracts (INTEGRATION_CONTRACT §12-§17, §24, §30, §45).
 *
 * Class → Flow via PromotorFlowAdapter; Flow → Class via PromotorClassAdapter.
 * Canonical NextAction lives only in PromotorFlow; Class requests actions via
 * LearningNextActionRequest. M0 deliberately has NO complete/reschedule methods.
 */

export const AssessmentStatusSchema = z.enum([
  "NOT_STARTED",
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "UNKNOWN",
]);
export type AssessmentStatus = z.infer<typeof AssessmentStatusSchema>;

export const ContactStageSchema = z.enum([
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "FOLLOW_UP",
  "BOOKED",
  "COMPLETED",
  "LOST",
]);
export type ContactStage = z.infer<typeof ContactStageSchema>;

export const ContactClassificationSchema = z.enum(["PROSPECT", "CLIENT"]);
export type ContactClassification = z.infer<
  typeof ContactClassificationSchema
>;

/** INTEGRATION_CONTRACT §14 — minimum Flow contact context. */
export const FlowContactContextSchema = z.object({
  contactId: ContactIdSchema,
  stage: ContactStageSchema,
  classification: ContactClassificationSchema,
  primaryNextAction: z
    .object({
      id: z.string().min(1),
      type: z.string().min(1),
      dueAt: z.string().nullable(),
    })
    .optional(),
  activeBooking: z
    .object({
      id: z.string().min(1),
      serviceId: z.string().min(1),
      startAt: z.string(),
      status: z.string(),
    })
    .optional(),
});
export type FlowContactContext = z.infer<typeof FlowContactContextSchema>;

/** Minimal ref returned by PromotorFlowAdapter.createNextAction (INTEGRATION_CONTRACT §12, §41). */
export const NextActionRefSchema = z.object({
  nextActionId: z.string().min(1),
});
export type NextActionRef = z.infer<typeof NextActionRefSchema>;

/** Ref with optional display fields so Class can show "Open in PromotorFlow" without Flow internals. */
export const FlowNextActionRefSchema = NextActionRefSchema.extend({
  title: z.string().optional(),
  dueAt: z.string().nullable().optional(),
});
export type FlowNextActionRef = z.infer<typeof FlowNextActionRefSchema>;

/** INTEGRATION_CONTRACT §24 — Class → Flow next action request. */
export const LearningNextActionRequestSchema = z.object({
  organizationId: OrganizationIdSchema,
  contactId: ContactIdSchema,
  source: z.literal("PROMOTORCLASS"),
  sourceEventId: LearningEventIdSchema,
  sourceSignalId: LearningSignalIdSchema.optional(),
  actionType: z.enum(["FOLLOW_UP", "MANUAL"]),
  title: z.string().min(1),
  reason: z.string().min(1),
  dueAt: z.string().optional(),
  context: z.object({
    programId: z.string().min(1).optional(),
    programTitle: z.string().min(1).optional(),
    enrollmentId: z.string().min(1).optional(),
    signalType: z.string().min(1).optional(),
    intentLabel: IntentLabelSchema.optional(),
  }),
  idempotencyKey: z.string().min(1),
});
export type LearningNextActionRequest = z.infer<
  typeof LearningNextActionRequestSchema
>;

/** INTEGRATION_CONTRACT §30 — Class activity projection (not canonical learning history). */
export const LearningActivityProjectionSchema = z.object({
  organizationId: OrganizationIdSchema,
  contactId: ContactIdSchema,
  source: z.literal("PROMOTORCLASS"),
  sourceEventId: LearningEventIdSchema,
  eventType: z.enum([
    "PROGRAM_COMPLETED",
    "CTA_CLICKED",
    "LEARNER_INACTIVE",
    "LEARNING_SIGNAL",
  ]),
  summary: z.string().min(1),
  context: z.record(z.unknown()),
  idempotencyKey: z.string().min(1),
});
export type LearningActivityProjection = z.infer<
  typeof LearningActivityProjectionSchema
>;

/** Ref returned by PromotorFlowAdapter.appendLearningActivity. */
export const ActivityRefSchema = z.object({
  activityId: z.string().min(1),
});
export type ActivityRef = z.infer<typeof ActivityRefSchema>;

/**
 * Class → Flow adapter (INTEGRATION_CONTRACT §12).
 *
 * Class callers may not depend on Flow React components, route internals, or
 * private DB implementation. M0: create/request only — no complete/reschedule.
 */
export interface PromotorFlowAdapter {
  getContactContext(contactId: ContactId): Promise<FlowContactContext>;
  getAssessmentStatus(contactId: ContactId): Promise<AssessmentStatus>;
  createNextAction(input: LearningNextActionRequest): Promise<NextActionRef>;
  appendLearningActivity(
    input: LearningActivityProjection
  ): Promise<ActivityRef | void>;
}

/**
 * Flow → Class reverse adapter (INTEGRATION_CONTRACT §13).
 * Used for: service completed → eligible aftersales program → enroll canonical contact.
 */
export interface PromotorClassAdapter {
  getLearningContext(contactId: ContactId): Promise<LearningContext>;
  listEligiblePrograms(input: EligibleProgramsInput): Promise<ProgramSummary[]>;
  enrollContact(input: EnrollContactInput): Promise<EnrollmentRef>;
  getEnrollmentStatus(
    contactId: ContactId,
    programId: ProgramId
  ): Promise<EnrollmentStatus | null>;
}