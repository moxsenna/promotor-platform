import { z } from "zod";

/**
 * Canonical platform ID brands + runtime Zod schemas.
 *
 * INTEGRATION_CONTRACT §8: one person = one canonical contact; canonical IDs are
 * organization_id, user_id, contact_id. UUID is the recommended representation,
 * but schemas stay permissive (non-empty, length-bounded strings) so M0 mock
 * data may use any stable string id.
 */

const idString = z.string().min(1).max(255);

export const OrganizationIdSchema = idString.brand("OrganizationId");
export type OrganizationId = z.infer<typeof OrganizationIdSchema>;

export const UserIdSchema = idString.brand("UserId");
export type UserId = z.infer<typeof UserIdSchema>;

export const ContactIdSchema = idString.brand("ContactId");
export type ContactId = z.infer<typeof ContactIdSchema>;

export const ProgramIdSchema = idString.brand("ProgramId");
export type ProgramId = z.infer<typeof ProgramIdSchema>;

export const EnrollmentIdSchema = idString.brand("EnrollmentId");
export type EnrollmentId = z.infer<typeof EnrollmentIdSchema>;

export const LessonIdSchema = idString.brand("LessonId");
export type LessonId = z.infer<typeof LessonIdSchema>;

export const LearningEventIdSchema = idString.brand("LearningEventId");
export type LearningEventId = z.infer<typeof LearningEventIdSchema>;

export const LearningSignalIdSchema = idString.brand("LearningSignalId");
export type LearningSignalId = z.infer<typeof LearningSignalIdSchema>;