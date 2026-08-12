import { ContactSchema } from "@promotor/contracts";

/**
 * Canonical shared contacts for the demo (spec §6.4 locked narrative).
 *
 * Shape follows @promotor/contracts ContactSchema; phoneE164 is the canonical
 * E.164 identity (implementation-plan §7: organization_id + phone_e164 unique).
 * `source` (where the learner first came from, PRD §48) has no contracts
 * schema yet — fixture-local extension field, stripped by zod on parse.
 */

export type ContactWithSource = {
  id: string;
  organizationId: string;
  name: string;
  phoneE164: string;
  email?: string;
  source: string;
};

export const contacts: ContactWithSource[] = [
  {
    id: "contact_001",
    organizationId: "org_001",
    name: "Ayu Rahma",
    phoneE164: "+6281222333444",
    email: "ayu.rahma@example.com",
    source: "instagram",
  },
  {
    id: "contact_002",
    organizationId: "org_001",
    name: "Nina Wulandari",
    phoneE164: "+6281333444555",
    email: "nina.wulandari@example.com",
    source: "google_maps",
  },
  {
    id: "contact_003",
    organizationId: "org_001",
    name: "Dimas Pratama",
    phoneE164: "+6281444555666",
    email: "dimas.pratama@example.com",
    source: "referral",
  },
  {
    id: "contact_004",
    organizationId: "org_001",
    name: "Nadia Putri",
    phoneE164: "+6281555666777",
    email: "nadia.putri@example.com",
    source: "parenting_seminar",
  },
  {
    id: "contact_005",
    organizationId: "org_001",
    name: "Hendra Saputra",
    phoneE164: "+6281666777888",
    email: "hendra.saputra@example.com",
    source: "referral",
  },
];

// Static assertion so a drift against contracts is caught at typecheck time.
for (const contact of contacts) {
  void ContactSchema.parse(contact);
}
