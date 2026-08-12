// Mock NextAction structure for seeding
// Actual NextAction type will be in @promotor/contracts when available

export interface NextActionFixture {
  id: string;
  organization_id: string;
  contact_id: string;
  title: string;
  description: string;
  due_at: string | null;
  source?: "PROMOTORFLOW" | "PROMOTORCLASS";
}

/**
 * Seed next actions for PromotorFlow
 */
export const seedNextActions: NextActionFixture[] = [
  {
    id: "action_followup_ayu",
    organization_id: "org_promotor",
    contact_id: "contact_ayu",
    title: "Follow-up tentang assessment",
    description: "Tanya jadwal weekend untuk konsultasi Parenting",
    due_at: new Date(Date.now() - 86400000).toISOString(), // 1 day overdue
    source: "PROMOTORCLASS",
  },
];
