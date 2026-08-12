import { z } from "zod";
import {
  ContactIdSchema,
  OrganizationIdSchema,
  UserIdSchema,
} from "./ids";

/**
 * Canonical shared-platform identity shapes (organizations, users, contacts).
 *
 * INTEGRATION_CONTRACT §7/§9: Contact identity is organization_id + phone_e164;
 * phones are stored/matched as E.164. Field names mirror the canonical table
 * semantics in docs/INTEGRATION_CONTRACT.md and docs/promotor-class/implementation-plan.md
 * (§7: organizations, users, Shared Core Contacts). No extra canonical fields beyond
 * what the contract implies were invented here.
 */

export const OrganizationSchema = z.object({
  id: OrganizationIdSchema,
  name: z.string().min(1),
  slug: z.string().min(1),
});
export type Organization = z.infer<typeof OrganizationSchema>;

export const UserRoleSchema = z.enum(["owner", "admin", "editor"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: UserIdSchema,
  organizationId: OrganizationIdSchema,
  name: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().optional(),
  role: UserRoleSchema,
});
export type User = z.infer<typeof UserSchema>;

export const ContactSchema = z.object({
  id: ContactIdSchema,
  organizationId: OrganizationIdSchema,
  name: z.string().min(1),
  /** Canonical E.164 (e.g. "+6281212345678"). Validation of format belongs to platform-core normalizePhone, not here. */
  phoneE164: z.string().min(1),
  email: z.string().min(1).optional(),
});
export type Contact = z.infer<typeof ContactSchema>;