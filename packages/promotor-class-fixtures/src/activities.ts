import { LearningActivityProjectionSchema } from "@promotor/contracts";

/**
 * Class → Flow activity projections (INTEGRATION_CONTRACT §30). These are the
 * fixture-side record of what the adapter reported to Flow; idempotencyKey
 * follows INTEGRATION_CONTRACT §26 (promotorclass:{source_event_id}:{rule_id}).
 */

export const learningActivities = [
  {
    organizationId: "org_001",
    contactId: "contact_001",
    source: "PROMOTORCLASS",
    sourceEventId: "evt_020", // Ayu — program.completed
    eventType: "PROGRAM_COMPLETED",
    summary: "Program 7 Hari Mengenal Cara Belajar Anak selesai.",
    context: {
      programId: "prog_01",
      programTitle: "7 Hari Mengenal Cara Belajar Anak",
      enrollmentId: "enr_01",
      intentLabel: "hot",
    },
    idempotencyKey: "promotorclass:evt_020:program_completed",
  },
  {
    organizationId: "org_001",
    contactId: "contact_003",
    source: "PROMOTORCLASS",
    sourceEventId: "evt_048", // Dimas — cta.clicked
    eventType: "CTA_CLICKED",
    summary: "Dimas mengklik CTA Private Session di program 30 Hari Setelah Tes.",
    context: {
      programId: "prog_02",
      programTitle: "30 Hari Setelah Tes",
      enrollmentId: "enr_03",
      ctaId: "cta_private_session",
    },
    idempotencyKey: "promotorclass:evt_048:cta_clicked",
  },
  {
    organizationId: "org_001",
    contactId: "contact_004",
    source: "PROMOTORCLASS",
    sourceEventId: "evt_035", // Nadia — learner.inactive
    eventType: "LEARNER_INACTIVE",
    summary: "Nadia tidak aktif 7 hari (progress 14%) — perlu pengingat ramah.",
    context: {
      programId: "prog_01",
      programTitle: "7 Hari Mengenal Cara Belajar Anak",
      enrollmentId: "enr_04",
      progressPercent: 14,
    },
    idempotencyKey: "promotorclass:evt_035:learner_inactive",
  },
];

// Static assertion so a drift against contracts is caught at typecheck time.
for (const activity of learningActivities) {
  void LearningActivityProjectionSchema.parse(activity);
}
