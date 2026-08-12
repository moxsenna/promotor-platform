import type {
  ContactStage,
  ContactClassification,
  EnrollmentStatus,
  IntentLabel,
  LearningEventType,
  LearningStatus,
  LearningSignalType,
  LessonType,
  ProgramStatus,
  ProgramType,
} from "@promotor/contracts";

/**
 * Indonesian display labels for contracts enums (design.md §54 — full
 * Indonesian, never mixed). UI copy only: labels derive from canonical types,
 * never from fixtures.
 */

const INTENT_LABELS: Record<IntentLabel, string> = {
  cold: "Dingin",
  warm: "Hangat",
  hot: "Panas",
};

const SIGNAL_TYPE_LABELS: Record<LearningSignalType, string> = {
  PROGRAM_COMPLETED: "Program selesai",
  HIGH_LEARNING_INTENT: "Minat belajar tinggi",
  HIGH_INTENT_CTA: "CTA diklik",
  AT_RISK: "Tidak aktif",
};

/** Recommended next step per signal type (plan §9.11 — signal + next step). */
const SIGNAL_NEXT_STEPS: Record<LearningSignalType, string> = {
  PROGRAM_COMPLETED: "Follow up tawaran lanjutan: asesmen gaya belajar anak.",
  HIGH_LEARNING_INTENT: "Ajak personal check-in.",
  HIGH_INTENT_CTA: "Tawarkan jadwal konsultasi.",
  AT_RISK: "Kirim pengingat yang ramah.",
};

const EVENT_LABELS: Record<LearningEventType, string> = {
  "program.created": "Program dibuat",
  "program.published": "Program diterbitkan",
  "learner.registered": "Mendaftar",
  "learner.enrolled": "Terdaftar di program",
  "lesson.started": "Mulai pelajaran",
  "lesson.completed": "Menyelesaikan pelajaran",
  "reflection.submitted": "Mengirim refleksi",
  "program.progress_50": "Mencapai 50% program",
  "program.progress_80": "Mencapai 80% program",
  "program.completed": "Menyelesaikan program",
  "cta.viewed": "Melihat tawaran Private Session",
  "cta.clicked": "Mengklik CTA Private Session",
  "learner.inactive": "Menjadi tidak aktif",
};

const PROGRAM_TYPE_LABELS: Record<ProgramType, string> = {
  lead_magnet: "Lead magnet",
  aftersales: "Aftersales",
  paid: "Berbayar",
  private: "Privat",
};

const PROGRAM_STATUS_LABELS: Record<ProgramStatus, string> = {
  draft: "Draf",
  published: "Diterbitkan",
  archived: "Diarsipkan",
};

const LESSON_TYPE_LABELS: Record<LessonType, string> = {
  video: "Video",
  text: "Artikel",
  reflection: "Refleksi",
  cta: "CTA",
};

const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  enrolled: "Terdaftar",
  started: "Dimulai",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const LEARNING_STATUS_LABELS: Record<LearningStatus, string> = {
  active: "Aktif",
  completed: "Selesai",
  inactive: "Tidak aktif",
  at_risk: "Berisiko",
};

/** Acquisition channel labels (fixture-local source field, PRD §48). */
const SOURCE_LABELS: Record<string, string> = {
  instagram: "Instagram",
  google_maps: "Google Maps",
  referral: "Rujukan",
  parenting_seminar: "Seminar parenting",
};

const STAGE_LABELS: Record<ContactStage, string> = {
  NEW: "Baru",
  CONTACTED: "Sudah dihubungi",
  INTERESTED: "Tertarik",
  FOLLOW_UP: "Tindak lanjut",
  BOOKED: "Terjadwal",
  COMPLETED: "Selesai",
  LOST: "Tidak lanjut",
};

const CLASSIFICATION_LABELS: Record<ContactClassification, string> = {
  PROSPECT: "Prospek",
  CLIENT: "Klien",
};

export function intentLabel(label: IntentLabel): string {
  return INTENT_LABELS[label];
}

export function signalTypeLabel(type: LearningSignalType): string {
  return SIGNAL_TYPE_LABELS[type];
}

export function signalNextStep(type: LearningSignalType): string {
  return SIGNAL_NEXT_STEPS[type];
}

export function eventLabel(type: LearningEventType): string {
  return EVENT_LABELS[type];
}

export function programTypeLabel(type: ProgramType): string {
  return PROGRAM_TYPE_LABELS[type];
}

export function programStatusLabel(status: ProgramStatus): string {
  return PROGRAM_STATUS_LABELS[status];
}

export function lessonTypeLabel(type: LessonType): string {
  return LESSON_TYPE_LABELS[type];
}

export function flowStageLabel(stage: ContactStage): string {
  return STAGE_LABELS[stage];
}

export function flowClassificationLabel(
  classification: ContactClassification
): string {
  return CLASSIFICATION_LABELS[classification];
}

export function enrollmentStatusLabel(status: EnrollmentStatus): string {
  return ENROLLMENT_STATUS_LABELS[status];
}

export function learningStatusLabel(status: LearningStatus): string {
  return LEARNING_STATUS_LABELS[status];
}

export function sourceLabel(source: string): string {
  return SOURCE_LABELS[source] ?? source;
}
