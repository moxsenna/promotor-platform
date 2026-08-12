import type { Contact } from "@promotor/contracts";

/**
 * Seed contacts for PromotorFlow
 * Uses same contact_ids as promotor-class-fixtures to ensure ONE PERSON = ONE CONTACT identity
 */
export const seedContacts: Contact[] = [
  {
    contact_id: "contact_ayu",
    organization_id: "org_promotor",
    phone_e164: "+628121110001",
    name: "Ayu Rahma",
    stage: "CONTACT_LEAD",
    classification: "PROSPECT",
    created_at: new Date("2026-08-05T08:00:00Z").toISOString(),
    updated_at: new Date("2026-08-10T14:30:00Z").toISOString(),
  },
  {
    contact_id: "contact_dimas",
    organization_id: "org_promotor",
    phone_e164: "+628121110002",
    name: "Dimas Prakoso",
    stage: "BOOKED",
    classification: "PROSPECT",
    created_at: new Date("2026-08-07T10:00:00Z").toISOString(),
    updated_at: new Date("2026-08-12T09:00:00Z").toISOString(),
  },
  {
    contact_id: "contact_reni",
    organization_id: "org_promotor",
    phone_e164: "+628121110003",
    name: "Reni Wulandari",
    stage: "COMPLETED",
    classification: "CLIENT",
    created_at: new Date("2026-07-20T11:00:00Z").toISOString(),
    updated_at: new Date("2026-08-11T16:00:00Z").toISOString(),
  },
];
