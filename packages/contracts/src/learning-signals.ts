import { z } from "zod";
import {
  ContactIdSchema,
  EnrollmentIdSchema,
  LearningEventIdSchema,
  LearningSignalIdSchema,
  OrganizationIdSchema,
  ProgramIdSchema,
} from "./ids";
import { IntentLabelSchema } from "./enrollments";

export { IntentLabelSchema };
export type { IntentLabel } from "./enrollments";

/**
 * PromotorClass-owned persistent learning signals
 * (INTEGRATION_CONTRACT §22: learning_signals table; §27 signal examples).
 *
 * PromotorClass persists signals and requests Flow actions through the adapter;
 * it never owns a second canonical next_actions table (§23).
 */

export const LearningSignalTypeSchema = z.enum([
  "HIGH_LEARNING_INTENT",
  "PROGRAM_COMPLETED",
  "HIGH_INTENT_CTA",
  "AT_RISK",
]);
export type LearningSignalType = z.infer<typeof LearningSignalTypeSchema>;

export const LearningSignalSeveritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
export type LearningSignalSeverity = z.infer<
  typeof LearningSignalSeveritySchema
>;

export const LearningSignalStatusSchema = z.enum([
  "ACTIVE",
  "RESOLVED",
  "DISMISSED",
]);
export type LearningSignalStatus = z.infer<typeof LearningSignalStatusSchema>;

export const LearningSignalSchema = z.object({
  id: LearningSignalIdSchema,
  organizationId: OrganizationIdSchema,
  /** The learning event that produced this signal. */
  sourceEventId: LearningEventIdSchema,
  contactId: ContactIdSchema,
  programId: ProgramIdSchema.optional(),
  enrollmentId: EnrollmentIdSchema.optional(),
  signalType: LearningSignalTypeSchema,
  intentLabel: IntentLabelSchema,
  severity: LearningSignalSeveritySchema.optional(),
  priority: z.number().int().min(0),
  reason: z.string().min(1),
  status: LearningSignalStatusSchema,
  createdAt: z.string(),
  resolvedAt: z.string().optional(),
});
export type LearningSignal = z.infer<typeof LearningSignalSchema>;