import { LearningEventEnvelopeSchema } from "@promotor/contracts";

/**
 * Append-only learning events (INTEGRATION_CONTRACT §18/§19; event names are
 * contracts). Static seeds for the demo timeline. One sequence per learner,
 * chronological within learner. Event ids evt_001..evt_054.
 *
 * Demo-path relevance:
 * - Ayu: ... → program.completed (evt_020) → PROGRAM_COMPLETED signal.
 * - Dimas: cta.clicked (evt_048) → HIGH_INTENT_CTA signal.
 * - Nadia: learner.inactive (evt_035) → AT_RISK signal.
 */

const ORG = "org_001";

/** [startEventId, completeEventId, lessonId, date] per completed lesson. */
const ayuLessonPairs: [string, string, string, string][] = [
  ["evt_003", "evt_004", "les_001", "2026-08-02"],
  ["evt_005", "evt_006", "les_002", "2026-08-03"],
  ["evt_007", "evt_008", "les_003", "2026-08-04"],
  ["evt_009", "evt_010", "les_004", "2026-08-05"],
  ["evt_011", "evt_012", "les_005", "2026-08-06"],
  ["evt_013", "evt_014", "les_006", "2026-08-07"],
];

/** [eventId, lessonId, date] per completed lesson. */
const ninaLessonPairs: [string, string, string][] = [
  ["evt_023", "les_001", "2026-08-02"],
  ["evt_024", "les_002", "2026-08-03"],
  ["evt_025", "les_003", "2026-08-04"],
  ["evt_026", "les_004", "2026-08-05"],
  ["evt_027", "les_005", "2026-08-06"],
  ["evt_028", "les_006", "2026-08-07"],
];

const dimasLessonPairs: [string, string, string][] = [
  ["evt_038", "les_008", "2026-05-11"],
  ["evt_039", "les_009", "2026-05-12"],
  ["evt_040", "les_010", "2026-05-13"],
  ["evt_041", "les_011", "2026-05-14"],
  ["evt_042", "les_012", "2026-05-15"],
  ["evt_043", "les_013", "2026-05-16"],
];

const hendraLessonPairs: [string, string, string][] = [
  ["evt_051", "les_020", "2026-07-21"],
  ["evt_052", "les_021", "2026-07-22"],
  ["evt_053", "les_022", "2026-07-23"],
];

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
  ...ayuLessonPairs.flatMap(([startId, completeId, lessonId, date]) => [
    startedLesson(startId, "contact_001", "enr_01", "prog_01", lessonId, `${date}T07:00:00.000Z`),
    completedLesson(completeId, "contact_001", "enr_01", "prog_01", lessonId, date),
  ]),
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
  progressEvent("evt_018", "contact_001", "enr_01", "prog_01", "program.progress_50", "2026-08-05T08:10:00.000Z"),
  progressEvent("evt_019", "contact_001", "enr_01", "prog_01", "program.progress_80", "2026-08-07T08:10:00.000Z"),
  programCompleted("evt_020", "contact_001", "enr_01", "prog_01", "2026-08-08T08:20:00.000Z"),

  // ── Nina Wulandari (contact_002, enr_02, prog_01) — 6/7 days, day 7 in progress
  registered("evt_021", "contact_002", "2026-08-01T07:45:00.000Z"),
  enrolled("evt_022", "contact_002", "prog_01", "enr_02", "2026-08-01T08:00:00.000Z"),
  ...ninaLessonPairs.map(([eventId, lessonId, date]) =>
    completedLesson(eventId, "contact_002", "enr_02", "prog_01", lessonId, date)
  ),
  progressEvent("evt_029", "contact_002", "enr_02", "prog_01", "program.progress_50", "2026-08-05T08:10:00.000Z"),
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
  ...dimasLessonPairs.map(([eventId, lessonId, date]) =>
    completedLesson(eventId, "contact_003", "enr_03", "prog_02", lessonId, date)
  ),
  progressEvent("evt_044", "contact_003", "enr_03", "prog_02", "program.progress_50", "2026-05-13T08:15:00.000Z"),
  progressEvent("evt_045", "contact_003", "enr_03", "prog_02", "program.progress_80", "2026-05-15T08:15:00.000Z"),
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
  ...hendraLessonPairs.map(([eventId, lessonId, date]) =>
    completedLesson(eventId, "contact_005", "enr_05", "prog_04", lessonId, date)
  ),
  startedLesson("evt_054", "contact_005", "enr_05", "prog_04", "les_023", "2026-08-10T06:45:00.000Z"),
];

// Static assertion so a drift against contracts is caught at typecheck time.
for (const event of learningEvents) void LearningEventEnvelopeSchema.parse(event);
