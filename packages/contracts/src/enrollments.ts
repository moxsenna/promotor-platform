import { z } from "zod";
import {
  ContactIdSchema,
  EnrollmentIdSchema,
  OrganizationIdSchema,
  ProgramIdSchema,
} from "./ids";

/**
 * PromotorClass-owned enrollment shapes.
 *
 * Mirrors docs/promotor-class/implementation-plan.md §7 (enrollments):
 * status enrolled/started/completed/cancelled, learning_status incl. at_risk,
 * progress_percent and intent_score 0-100, intent_label cold/warm/hot.
 * Unique per program_id + contact_id.
 */

export const EnrollmentStatusSchema = z.enum([
  "enrolled",
  "started",
  "completed",
  "cancelled",
]);
export type EnrollmentStatus = z.infer<typeof EnrollmentStatusSchema>;

export const LearningStatusSchema = z.enum([
  "active",
  "completed",
  "inactive",
  "at_risk",
]);
export type LearningStatus = z.infer<typeof LearningStatusSchema>;

export const IntentLabelSchema = z.enum(["cold", "warm", "hot"]);
export type IntentLabel = z.infer<typeof IntentLabelSchema>;

const percent = z.number().int().min(0).max(100);

export const EnrollmentSchema = z.object({
  id: EnrollmentIdSchema,
  organizationId: OrganizationIdSchema,
  programId: ProgramIdSchema,
  contactId: ContactIdSchema,
  status: EnrollmentStatusSchema,
  progressPercent: percent,
  intentScore: percent,
  intentLabel: IntentLabelSchema,
  learningStatus: LearningStatusSchema,
  /** UTC ISO 8601 timestamps. */
  enrolledAt: z.string(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  lastActivityAt: z.string().nullable().optional(),
});
export type Enrollment = z.infer<typeof EnrollmentSchema>;

/** Flow → Class enrollment request (INTEGRATION_CONTRACT §45). */
export const EnrollContactInputSchema = z.object({
  organizationId: OrganizationIdSchema,
  contactId: ContactIdSchema,
  programId: ProgramIdSchema,
  source: z.enum(["PROMOTORFLOW_AFTERSALES", "PROMOTORFLOW_MANUAL"]),
  idempotencyKey: z.string().min(1),
});
export type EnrollContactInput = z.infer<typeof EnrollContactInputSchema>;

/** Response ref for a created/reused enrollment. */
export const EnrollmentRefSchema = z.object({
  enrollmentId: EnrollmentIdSchema,
});
export type EnrollmentRef = z.infer<typeof EnrollmentRefSchema>;

/** Learning view Flow reads for one contact (INTEGRATION_CONTRACT §17). */
export const LearningContextSchema = z.object({
  contactId: ContactIdSchema,
  activeEnrollments: z.array(
    z.object({
      enrollmentId: EnrollmentIdSchema,
      programId: ProgramIdSchema,
      programTitle: z.string().min(1),
      progressPercent: percent,
      learningStatus: LearningStatusSchema,
      intentLabel: IntentLabelSchema,
      lastActivityAt: z.string().nullable(),
    })
  ),
  recentSignals: z.array(
    z.object({
      type: z.string().min(1),
      reason: z.string().min(1),
      priority: z.number().int().min(0),
      createdAt: z.string(),
    })
  ),
});
export type LearningContext = z.infer<typeof LearningContextSchema>;