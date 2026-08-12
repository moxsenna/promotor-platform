import { LearningSignalSchema } from "@promotor/contracts";

/**
 * Persistent learning signals (INTEGRATION_CONTRACT §22/§27; examples map
 * event → signal exactly as the mock rule engine will replay them).
 *
 * Each signal keeps its sourceEventId pointing at the learning event that
 * produced it, and intentLabel mirrors the enrollment's intent score band.
 */

export const learningSignals = [
  {
    id: "sig_001",
    organizationId: "org_001",
    sourceEventId: "evt_019", // program.progress_80 (Ayu)
    contactId: "contact_001",
    programId: "prog_01",
    enrollmentId: "enr_01",
    signalType: "HIGH_LEARNING_INTENT",
    intentLabel: "hot",
    severity: "HIGH",
    priority: 80,
    reason: "Ayu mencapai 80% materi tapi asesmen belum dikerjakan — ajak lanjut ke asesmen gaya belajar.",
    status: "ACTIVE",
    createdAt: "2026-08-07T08:15:00.000Z",
  },
  {
    id: "sig_002",
    organizationId: "org_001",
    sourceEventId: "evt_020", // program.completed (Ayu)
    contactId: "contact_001",
    programId: "prog_01",
    enrollmentId: "enr_01",
    signalType: "PROGRAM_COMPLETED",
    intentLabel: "hot",
    severity: "HIGH",
    priority: 90,
    reason: "Program 7 Hari Mengenal Cara Belajar Anak selesai. Follow up tawaran asesmen gaya belajar anak.",
    status: "ACTIVE",
    createdAt: "2026-08-08T08:25:00.000Z",
  },
  {
    id: "sig_003",
    organizationId: "org_001",
    sourceEventId: "evt_030", // program.progress_80 (Nina)
    contactId: "contact_002",
    programId: "prog_01",
    enrollmentId: "enr_02",
    signalType: "HIGH_LEARNING_INTENT",
    intentLabel: "hot",
    severity: "MEDIUM",
    priority: 70,
    reason: "Nina aktif menyelesaikan 6 dari 7 hari — ajak personal check-in sebelum kelas selesai.",
    status: "ACTIVE",
    createdAt: "2026-08-08T08:15:00.000Z",
  },
  {
    id: "sig_004",
    organizationId: "org_001",
    sourceEventId: "evt_048", // cta.clicked (Dimas)
    contactId: "contact_003",
    programId: "prog_02",
    enrollmentId: "enr_03",
    signalType: "HIGH_INTENT_CTA",
    intentLabel: "warm",
    severity: "MEDIUM",
    priority: 85,
    reason: "Dimas mengklik tombol Private Session — tawarkan jadwal konsultasi.",
    status: "ACTIVE",
    createdAt: "2026-05-17T10:10:00.000Z",
  },
  {
    id: "sig_005",
    organizationId: "org_001",
    sourceEventId: "evt_035", // learner.inactive (Nadia)
    contactId: "contact_004",
    programId: "prog_01",
    enrollmentId: "enr_04",
    signalType: "AT_RISK",
    intentLabel: "cold",
    severity: "HIGH",
    priority: 60,
    reason: "Nadia tidak ada aktivitas 5 hari, progress baru 14% — kirim pengingat yang ramah.",
    status: "ACTIVE",
    createdAt: "2026-08-10T09:05:00.000Z",
  },
];

// Static assertion so a drift against contracts is caught at typecheck time.
for (const signal of learningSignals) void LearningSignalSchema.parse(signal);
