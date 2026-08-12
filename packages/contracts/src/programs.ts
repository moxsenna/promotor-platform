import { z } from "zod";
import {
  ContactIdSchema,
  LessonIdSchema,
  OrganizationIdSchema,
  ProgramIdSchema,
  UserIdSchema,
} from "./ids";

/**
 * PromotorClass-owned curriculum shapes.
 *
 * Mirrors docs/promotor-class/implementation-plan.md §7 (programs, modules,
 * lessons) and the M0 video decision: YouTube only (provider "youtube",
 * official embed), manual lesson completion — no upload/recording/transcoding.
 */

/** Module rows are PromotorClass-owned; not part of the canonical shared ID set, so plain string. */
export type ModuleId = string;

export const ProgramTypeSchema = z.enum([
  "lead_magnet",
  "aftersales",
  "paid",
  "private",
]);
export type ProgramType = z.infer<typeof ProgramTypeSchema>;

export const ProgramStatusSchema = z.enum([
  "draft",
  "published",
  "archived",
]);
export type ProgramStatus = z.infer<typeof ProgramStatusSchema>;

export const ProgramAccessTypeSchema = z.enum(["public", "private", "manual"]);
export type ProgramAccessType = z.infer<typeof ProgramAccessTypeSchema>;

export const ProgramSchema = z.object({
  id: ProgramIdSchema,
  organizationId: OrganizationIdSchema,
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  type: ProgramTypeSchema,
  status: ProgramStatusSchema,
  accessType: ProgramAccessTypeSchema,
  instructorUserId: UserIdSchema.optional(),
  publishedAt: z.string().optional(),
});
export type Program = z.infer<typeof ProgramSchema>;

export const ModuleSchema = z.object({
  id: z.string().min(1),
  programId: ProgramIdSchema,
  title: z.string().min(1),
  position: z.number().int().min(0),
});
export type Module = z.infer<typeof ModuleSchema>;

export const LessonTypeSchema = z.enum(["video", "text", "reflection", "cta"]);
export type LessonType = z.infer<typeof LessonTypeSchema>;

/** V0.1 runtime support: manual completion only (see M0.1.9 video decision). */
export const LessonCompletionRuleSchema = z.literal("manual");
export type LessonCompletionRule = z.infer<typeof LessonCompletionRuleSchema>;

export const LessonStatusSchema = z.enum(["draft", "published"]);
export type LessonStatus = z.infer<typeof LessonStatusSchema>;

export const LessonSchema = z.object({
  id: LessonIdSchema,
  programId: ProgramIdSchema,
  /** Module rows are PromotorClass-owned; not part of the canonical shared ID set, so plain string. */
  moduleId: z.string().min(1),
  title: z.string().min(1),
  type: LessonTypeSchema,
  videoProvider: z.literal("youtube").optional(),
  videoUrl: z.string().url().optional(),
  videoExternalId: z.string().min(1).optional(),
  completionRule: LessonCompletionRuleSchema,
  isRequired: z.boolean(),
  position: z.number().int().min(0),
  status: LessonStatusSchema,
});
export type Lesson = z.infer<typeof LessonSchema>;

/** Flow-facing summary used by PromotorClassAdapter.listEligiblePrograms (INTEGRATION_CONTRACT §13). */
export const ProgramSummarySchema = z.object({
  id: ProgramIdSchema,
  title: z.string().min(1),
  slug: z.string().min(1),
});
export type ProgramSummary = z.infer<typeof ProgramSummarySchema>;

/** Input for "service completed → eligible aftersales program" (INTEGRATION_CONTRACT §28). */
export const EligibleProgramsInputSchema = z.object({
  organizationId: OrganizationIdSchema,
  contactId: ContactIdSchema,
});
export type EligibleProgramsInput = z.infer<typeof EligibleProgramsInputSchema>;