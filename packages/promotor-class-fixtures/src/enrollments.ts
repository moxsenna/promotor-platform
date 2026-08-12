import { EnrollmentSchema } from "@promotor/contracts";

/**
 * Enrollment seeds (spec §6.4 narrative; PRD §48 dummy data: Ayu 100% hot,
 * Nina 86% hot, Dimas 100% warm + private-session CTA, Nadia 14% cold at
 * risk, Hendra in progress on prog_04).
 *
 * progressPercent is derived from lesson progress (completed / total lessons
 * of the program, rounded) so T9's learning-service recalculation stays
 * consistent with these static seeds.
 *
 * `lessonProgress` and `reflections` have no contracts schemas yet — they are
 * fixture-local shapes (T9 seeds MockStateStore from them; controller may
 * later promote them into contracts).
 */

export const enrollments = [
  {
    id: "enr_01",
    organizationId: "org_001",
    programId: "prog_01",
    contactId: "contact_001", // Ayu Rahma — completed, follow-up demo path A
    status: "completed",
    progressPercent: 100,
    intentScore: 92,
    intentLabel: "hot",
    learningStatus: "completed",
    enrolledAt: "2026-08-01T08:00:00.000Z",
    startedAt: "2026-08-02T07:00:00.000Z",
    completedAt: "2026-08-08T08:20:00.000Z",
    lastActivityAt: "2026-08-08T08:20:00.000Z",
  },
  {
    id: "enr_02",
    organizationId: "org_001",
    programId: "prog_01",
    contactId: "contact_002", // Nina Wulandari — 6 of 7 days done
    status: "started",
    progressPercent: 86,
    intentScore: 87,
    intentLabel: "hot",
    learningStatus: "active",
    enrolledAt: "2026-08-01T08:00:00.000Z",
    startedAt: "2026-08-02T07:00:00.000Z",
    lastActivityAt: "2026-08-11T06:45:00.000Z",
  },
  {
    id: "enr_03",
    organizationId: "org_001",
    programId: "prog_02",
    contactId: "contact_003", // Dimas Pratama — aftersales completed + CTA clicked
    status: "completed",
    progressPercent: 100,
    intentScore: 78,
    intentLabel: "warm",
    learningStatus: "completed",
    enrolledAt: "2026-05-10T08:00:00.000Z",
    startedAt: "2026-05-11T07:00:00.000Z",
    completedAt: "2026-05-16T08:15:00.000Z",
    lastActivityAt: "2026-05-17T10:05:00.000Z",
  },
  {
    id: "enr_04",
    organizationId: "org_001",
    programId: "prog_01",
    contactId: "contact_004", // Nadia Putri — at risk, last activity 7 days ago
    status: "started",
    progressPercent: 14,
    intentScore: 34,
    intentLabel: "cold",
    learningStatus: "at_risk",
    enrolledAt: "2026-08-01T08:00:00.000Z",
    startedAt: "2026-08-04T09:00:00.000Z",
    lastActivityAt: "2026-08-05T09:20:00.000Z",
  },
  {
    id: "enr_05",
    organizationId: "org_001",
    programId: "prog_04",
    contactId: "contact_005", // Hendra Saputra — active on 7 Hari Memahami Potensi Remaja
    status: "started",
    progressPercent: 43,
    intentScore: 55,
    intentLabel: "warm",
    learningStatus: "active",
    enrolledAt: "2026-07-20T08:00:00.000Z",
    startedAt: "2026-07-21T07:30:00.000Z",
    lastActivityAt: "2026-08-10T06:50:00.000Z",
  },
];

/**
 * Per-lesson progress. status is derived (completed when completedAt set,
 * in_progress when only startedAt set) — no contracts schema yet.
 */
export interface LessonProgress {
  enrollmentId: string;
  contactId: string;
  lessonId: string;
  startedAt: string | null;
  completedAt: string | null;
}

export const lessonProgress: LessonProgress[] = [
  // Ayu — prog_01, all 7 days completed
  ...["les_001", "les_002", "les_003", "les_004", "les_005", "les_006"].map((lessonId, i) => {
    const day = i + 2; // 08-02..08-07
    const date = `2026-08-0${day}`;
    return {
      enrollmentId: "enr_01",
      contactId: "contact_001",
      lessonId,
      startedAt: `${date}T07:00:00.000Z`,
      completedAt: `${date}T07:40:00.000Z`,
    };
  }),
  {
    enrollmentId: "enr_01",
    contactId: "contact_001",
    lessonId: "les_007",
    startedAt: "2026-08-08T07:00:00.000Z",
    completedAt: "2026-08-08T07:50:00.000Z",
  },
  // Nina — prog_01, 6 days completed, day 7 in progress
  ...["les_001", "les_002", "les_003", "les_004", "les_005", "les_006"].map((lessonId, i) => {
    const day = i + 2; // 08-02..08-07
    const date = `2026-08-0${day}`;
    return {
      enrollmentId: "enr_02",
      contactId: "contact_002",
      lessonId,
      startedAt: `${date}T07:00:00.000Z`,
      completedAt: `${date}T07:40:00.000Z`,
    };
  }),
  {
    enrollmentId: "enr_02",
    contactId: "contact_002",
    lessonId: "les_007",
    startedAt: "2026-08-11T06:30:00.000Z",
    completedAt: null,
  },
  // Nadia — prog_01, one lesson done, then inactive
  {
    enrollmentId: "enr_04",
    contactId: "contact_004",
    lessonId: "les_001",
    startedAt: "2026-08-04T09:00:00.000Z",
    completedAt: "2026-08-05T09:20:00.000Z",
  },
  // Dimas — prog_02, all 6 lessons completed
  ...["les_008", "les_009", "les_010", "les_011", "les_012", "les_013"].map((lessonId, i) => {
    const day = i + 11; // 05-11..05-16
    const date = `2026-05-${day}`;
    return {
      enrollmentId: "enr_03",
      contactId: "contact_003",
      lessonId,
      startedAt: `${date}T07:00:00.000Z`,
      completedAt: `${date}T07:45:00.000Z`,
    };
  }),
  // Hendra — prog_04, 3 lessons done, lesson 4 in progress
  ...["les_020", "les_021", "les_022"].map((lessonId, i) => {
    const day = i + 21; // 07-21..07-23
    const date = `2026-07-${day}`;
    return {
      enrollmentId: "enr_05",
      contactId: "contact_005",
      lessonId,
      startedAt: `${date}T07:30:00.000Z`,
      completedAt: `${date}T08:00:00.000Z`,
    };
  }),
  {
    enrollmentId: "enr_05",
    contactId: "contact_005",
    lessonId: "les_023",
    startedAt: "2026-08-10T06:45:00.000Z",
    completedAt: null,
  },
];

/** Learner reflection responses (PRD §48 reflection copy). No contracts schema yet. */
export interface ReflectionResponse {
  id: string;
  organizationId: string;
  enrollmentId: string;
  contactId: string;
  programId: string;
  lessonId: string;
  text: string;
  submittedAt: string;
}

export const reflections: ReflectionResponse[] = [
  {
    id: "refl_001",
    organizationId: "org_001",
    enrollmentId: "enr_01",
    contactId: "contact_001",
    programId: "prog_01",
    lessonId: "les_007",
    text: "Kalau sudah main HP, anak saya sulit berhenti dan kalau diingatkan sering jadi konflik.",
    submittedAt: "2026-08-08T08:10:00.000Z",
  },
  {
    id: "refl_002",
    organizationId: "org_001",
    enrollmentId: "enr_03",
    contactId: "contact_003",
    programId: "prog_02",
    lessonId: "les_012",
    text: "Dua minggu pertama saya melihat perubahan kecil: anak mulai mau menceritakan hasil belajarnya tanpa diminta. Saya belajar tidak perlu membandingkannya dengan teman sekelas.",
    submittedAt: "2026-05-14T08:00:00.000Z",
  },
];

// Static assertion so a drift against contracts is caught at typecheck time.
for (const enrollment of enrollments) void EnrollmentSchema.parse(enrollment);
