import { OrganizationSchema, UserSchema } from "@promotor/contracts";

/**
 * Promotor workspace identity for the demo (spec §6.4 locked narrative;
 * implementation-plan §9 seed data).
 *
 * Organization/User shapes come from @promotor/contracts; phone is stored as
 * canonical E.164 (+62812...). The public profile below is landing-page copy
 * only (PRD §48) — no contracts schema exists for it yet, so it stays a
 * fixture-local shape.
 */

export const organization = {
  id: "org_001",
  name: "Rina Learning Studio",
  slug: "rina",
};

export const promotorUser = {
  id: "user_001",
  organizationId: "org_001",
  name: "Rina Maharani",
  email: "rina.maharani@example.com",
  phone: "+6281222333444",
  role: "owner",
} as const;

/** Public landing copy for the /p/[workspaceSlug] routes (PRD §48). */
export interface PromotorPublicProfile {
  name: string;
  headline: string;
  city: string;
  instagramHandle: string;
}

export const promotorPublicProfile: PromotorPublicProfile = {
  name: "Rina Maharani",
  headline: "Bu Rina — Promotor & Parenting Educator",
  city: "Bandung",
  instagramHandle: "@rinasahabatkeluarga",
};

// Static assertions so a drift against contracts is caught at typecheck time.
void OrganizationSchema.parse(organization);
void UserSchema.parse(promotorUser);
