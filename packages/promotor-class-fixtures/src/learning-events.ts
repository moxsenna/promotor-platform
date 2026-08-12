import { LearningEventEnvelopeSchema } from "@promotor/contracts";

/**
 * Append-only learning events (INTEGRATION_CONTRACT §18/§19; event names are
 * contracts). Static seeds for the demo timeline. One sequence per learner,
 * chronological within learner (timestamps non-decreasing — enforced by the
 * test suite). Event ids evt_001..evt_054.
 *
 * Demo-path relevance:
 * - Ayu: ... → program.completed (evt_020) → PROGRAM_COMPLETED signal.
 * - Dimas: cta.clicked (evt_048) → HIGH_INTENT_CTA signal.
 * - Nadia: learner.inactive (evt_035) → AT_RISK signal.
 *
 * lesson.started coverage convention: started/ completed pairs are emitted
 * for Ayu's full journey; other learners only get lesson.started for the
 * lesson currently in progress (Nina les_007, Hendra les_023). Timeline
 * renderers must NOT assume a started event precedes every completed event.
 */

const ORG = "org_001";

const registered = (
  eventId: string,
  contactId: string,
  occurredAt: string
) => ({
  schemaVersion: 1,
  eventId,
  eventType: "learner.registered",
  sourceApp: "PROMOTORCLASS",
  organizationId: ORG,
  contactId,
  occurredAt,
  payload: {},
});

const enrolled = (
  eventId: string,
  contactId: string,
  programId: string,
  enrollmentId: string,
  occurredAt: string
) => ({
  schemaVersion: 1,
  eventId,
  eventType: "learner.enrolled",
  sourceApp: "PROMOTORCLASS",
  organizationId: ORG,
  contactId,
  occurredAt,
  subject: { programId, enrollmentId },
  payload: {},
});

/** Lesson completions land at 07:40 UTC (matches lesson-progress rows). */
const completedLesson = (
  eventId: string,
  contactId: string,
  enrollmentId: string,
  programId: string,
  lessonId: string,
  date: string
) => ({
  schemaVersion: 1,
  eventId,
  eventType: "lesson.completed",
  sourceApp: "PROMOTORCLASS",
  organizationId: ORG,
  contactId,
  occurredAt: `${date}T07:40:00.000Z`,
  subject: { programId, enrollmentId, lessonId },
  payload: { lessonId, programId },
});

const startedLesson = (
  eventId: string,
  contactId: string,
  enrollmentId: string,
  programId: string,
  lessonId: string,
  occurredAt: string
) => ({
  schemaVersion: 1,
  eventId,
  eventType: "lesson.started",
  sourceApp: "PROMOTORCLASS",
  organizationId: ORG,
  contactId,
  occurredAt,
  subject: { programId, enrollmentId, lessonId },
  payload: {},
});

const progressEvent = (
  eventId: string,
  contactId: string,
  enrollmentId: string,
  programId: string,
  eventType: "program.progress_50" | "program.progress_80",
  occurredAt: string
) => ({
  schemaVersion: 1,
  eventId,
  eventType,
  sourceApp: "PROMOTORCLASS",
  organizationId: ORG,
  contactId,
  occurredAt,
  subject: { programId, enrollmentId },
  payload: {},
});

const programCompleted = (
  eventId: string,
  contactId: string,
  enrollmentId: string,
  programId: string,
  occurredAt: string
) => ({
  schemaVersion: 1,
  eventId,
  eventType: "program.completed",
  sourceApp: "PROMOTORCLASS",
  organizationId: ORG,
  contactId,
  occurredAt,
  subject: { programId, enrollmentId },
  payload: { progressPercent: 100 },
});

export const learningEvents = [
  // ── Ayu Rahma (contact_001, enr_01, prog_01) — full journey 08-01..08-08
  registered("evt_001", "contact_001", "2026-08-01T07:30:00.000Z"),
  enrolled("evt_002", "contact_001", "prog_01", "enr_01", "2026-08-01T08:00:00.000Z"),
  startedLesson("evt_003", "contact_001", "enr_01", "prog_01", "les_001", "2026-08-02T07:00:00.000Z"),
  completedLesson("evt_004", "contact_001", "enr_01", "prog_01", "les_001", "2026-08-02"),
  startedLesson("evt_005", "contact_001", "enr_01", "prog_01", "les_002", "2026-08-03T07:00:00.000Z"),
  completedLesson("evt_006", "contact_001", "enr_01", "prog_01", "les_002", "2026-08-03"),
  startedLesson("evt_007", "contact_001", "enr_01", "prog_01", "les_003", "2026-08-04T07:00:00.000Z"),
  completedLesson("evt_008", "contact_001", "enr_01", "prog_01", "les_003", "2026-08-04"),
  startedLesson("evt_009", "contact_001", "enr_01", "prog_01", "les_004", "2026-08-05T07:00:00.000Z"),
  completedLesson("evt_010", "contact_001", "enr_01", "prog_01", "les_004", "2026-08-05"),
  progressEvent("evt_018", "contact_001", "enr_01", "prog_01", "program.progress_50", "2026-08-05T08:10:00.000Z"),
  startedLesson("evt_011", "contact_001", "enr_01", "prog_01", "les_005", "2026-08-06T07:00:00.000Z"),
  completedLesson("evt_012", "contact_001", "enr_01", "prog_01", "les_005", "2026-08-06"),
  startedLesson("evt_013", "contact_001", "enr_01", "prog_01", "les_006", "2026-08-07T07:00:00.000Z"),
  completedLesson("evt_014", "contact_001", "enr_01", "prog_01", "les_006", "2026-08-07"),
  progressEvent("evt_019", "contact_001", "enr_01", "prog_01", "program.progress_80", "2026-08-07T08:10:00.000Z"),
  startedLesson("evt_015", "contact_001", "enr_01", "prog_01", "les_007", "2026-08-08T07:00:00.000Z"),
  completedLesson("evt_016", "contact_001", "enr_01", "prog_01", "les_007", "2026-08-08"),
  {
    schemaVersion: 1,
    eventId: "evt_017",
    eventType: "reflection.submitted",
    sourceApp: "PROMOTORCLASS",
    organizationId: ORG,
    contactId: "contact_001",
    occurredAt: "2026-08-08T08:10:00.000Z",
    subject: { programId: "prog_01", enrollmentId: "enr_01", lessonId: "les_007" },
    payload: { lessonId: "les_007", programId: "prog_01" },
  },
  programCompleted("evt_020", "contact_001", "enr_01", "prog_01", "2026-08-08T08:20:00.000Z"),

  // ── Nina Wulandari (contact_002, enr_02, prog_01) — 6/7 days, day 7 in progress
  registered("evt_021", "contact_002", "2026-08-01T07:45:00.000Z"),
  enrolled("evt_022", "contact_002", "prog_01", "enr_02", "2026-08-01T08:00:00.000Z"),
  completedLesson("evt_023", "contact_002", "enr_02", "prog_01", "les_001", "2026-08-02"),
  completedLesson("evt_024", "contact_002", "enr_02", "prog_01", "les_002", "2026-08-03"),
  completedLesson("evt_025", "contact_002", "enr_02", "prog_01", "les_003", "2026-08-04"),
  completedLesson("evt_026", "contact_002", "enr_02", "prog_01", "les_004", "2026-08-05"),
  progressEvent("evt_029", "contact_002", "enr_02", "prog_01", "program.progress_50", "2026-08-05T08:10:00.000Z"),
  completedLesson("evt_027", "contact_002", "enr_02", "prog_01", "les_005", "2026-08-06"),
  completedLesson("evt_028", "contact_002", "enr_02", "prog_01", "les_006", "2026-08-07"),
  progressEvent("evt_030", "contact_002", "enr_02", "prog_01", "program.progress_80", "2026-08-07T08:10:00.000Z"),
  startedLesson("evt_031", "contact_002", "enr_02", "prog_01", "les_007", "2026-08-11T06:30:00.000Z"),

  // ── Nadia Putri (contact_004, enr_04, prog_01) — inactive, at risk
  registered("evt_032", "contact_004", "2026-08-01T09:00:00.000Z"),
  enrolled("evt_033", "contact_004", "prog_01", "enr_04", "2026-08-01T09:05:00.000Z"),
  completedLesson("evt_034", "contact_004", "enr_04", "prog_01", "les_001", "2026-08-05"),
  {
    schemaVersion: 1,
    eventId: "evt_035",
    eventType: "learner.inactive",
    sourceApp: "PROMOTORCLASS",
    organizationId: ORG,
    contactId: "contact_004",
    occurredAt: "2026-08-10T09:00:00.000Z",
    subject: { programId: "prog_01", enrollmentId: "enr_04" },
    payload: { programId: "prog_01", enrollmentId: "enr_04", progressPercent: 14 },
  },

  // ── Dimas Pratama (contact_003, enr_03, prog_02) — completed + CTA clicked
  registered("evt_036", "contact_003", "2026-05-10T07:00:00.000Z"),
  enrolled("evt_037", "contact_003", "prog_02", "enr_03", "2026-05-10T08:00:00.000Z"),
  completedLesson("evt_038", "contact_003", "enr_03", "prog_02", "les_008", "2026-05-11"),
  completedLesson("evt_039", "contact_003", "enr_03", "prog_02", "les_009", "2026-05-12"),
  completedLesson("evt_040", "contact_003", "enr_03", "prog_02", "les_010", "2026-05-13"),
  progressEvent("evt_044", "contact_003", "enr_03", "prog_02", "program.progress_50", "2026-05-13T08:15:00.000Z"),
  completedLesson("evt_041", "contact_003", "enr_03", "prog_02", "les_011", "2026-05-14"),
  completedLesson("evt_042", "contact_003", "enr_03", "prog_02", "les_012", "2026-05-15"),
  progressEvent("evt_045", "contact_003", "enr_03", "prog_02", "program.progress_80", "2026-05-15T08:15:00.000Z"),
  completedLesson("evt_043", "contact_003", "enr_03", "prog_02", "les_013", "2026-05-16"),
  programCompleted("evt_046", "contact_003", "enr_03", "prog_02", "2026-05-16T08:15:00.000Z"),
  {
    schemaVersion: 1,
    eventId: "evt_047",
    eventType: "cta.viewed",
    sourceApp: "PROMOTORCLASS",
    organizationId: ORG,
    contactId: "contact_003",
    occurredAt: "2026-05-17T10:00:00.000Z",
    subject: { programId: "prog_02", enrollmentId: "enr_03", lessonId: "les_013" },
    payload: { ctaId: "cta_private_session", programId: "prog_02", lessonId: "les_013" },
  },
  {
    schemaVersion: 1,
    eventId: "evt_048",
    eventType: "cta.clicked",
    sourceApp: "PROMOTORCLASS",
    organizationId: ORG,
    contactId: "contact_003",
    occurredAt: "2026-05-17T10:05:00.000Z",
    subject: { programId: "prog_02", enrollmentId: "enr_03", lessonId: "les_013" },
    payload: { ctaId: "cta_private_session", programId: "prog_02", lessonId: "les_013" },
  },

  // ── Hendra Saputra (contact_005, enr_05, prog_04) — active, 3/7 lessons done
  registered("evt_049", "contact_005", "2026-07-20T07:00:00.000Z"),
  enrolled("evt_050", "contact_005", "prog_04", "enr_05", "2026-07-20T08:00:00.000Z"),
  completedLesson("evt_051", "contact_005", "enr_05", "prog_04", "les_020", "2026-07-21"),
  completedLesson("evt_052", "contact_005", "enr_05", "prog_04", "les_021", "2026-07-22"),
  completedLesson("evt_053", "contact_005", "enr_05", "prog_04", "les_022", "2026-07-23"),
  startedLesson("evt_054", "contact_005", "enr_05", "prog_04", "les_023", "2026-08-10T06:45:00.000Z"),
];

// Static assertion so a drift against contracts is caught at typecheck time.
for (const event of learningEvents) void LearningEventEnvelopeSchema.parse(event);
