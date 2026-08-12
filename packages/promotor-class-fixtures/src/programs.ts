import { LessonSchema, ModuleSchema, ProgramSchema } from "@promotor/contracts";

/**
 * PromotorClass-owned curriculum seeds (spec §6.4 locked programs;
 * implementation-plan §7 programs/modules/lessons; M0 video decision:
 * YouTube only, provider "youtube", manual completion).
 *
 * Demo-path requirements this file satisfies:
 * - prog_01 is public + published so /p/rina/7-hari-mengenal-cara-belajar-anak
 *   renders (task 9.9 Demo path B).
 * - prog_01 has one video lesson per day plus a required reflection on
 *   "Hari 7" (task 9.8 Demo path A2: completion blocked by reflection).
 * - videoUrl/videoExternalId use a stable public YouTube ID placeholder
 *   (jNQXAC9IVRw); embed rendering is T9's job.
 */

export const programs = [
  {
    id: "prog_01",
    organizationId: "org_001",
    title: "7 Hari Mengenal Cara Belajar Anak",
    slug: "7-hari-mengenal-cara-belajar-anak",
    description:
      "Kelas singkat 7 hari untuk orang tua mengenali cara anak belajar: dari gaya belajar, durasi fokus sesuai usia, sampai membangun rutinitas belajar yang ringan di rumah. Gratis dan langsung bisa diikuti.",
    type: "lead_magnet",
    status: "published",
    accessType: "public",
    instructorUserId: "user_001",
    publishedAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "prog_02",
    organizationId: "org_001",
    title: "30 Hari Setelah Tes",
    slug: "30-hari-setelah-tes",
    description:
      "Pendampingan 30 hari setelah anak menyelesaikan asesmen minat dan bakat. Bantu anak mengenali diri lebih dalam dan menyusun langkah belajar berikutnya.",
    type: "aftersales",
    status: "published",
    accessType: "manual",
    instructorUserId: "user_001",
    publishedAt: "2026-05-01T09:00:00.000Z",
  },
  {
    id: "prog_03",
    organizationId: "org_001",
    title: "Parenting Growth Program",
    slug: "parenting-growth-program",
    description:
      "Program pertumbuhan pola asuh untuk orang tua yang ingin berkembang bersama anak: manajemen emosi, disiplin positif, dan kebiasaan keluarga yang sehat. Termasuk konsultasi dan dukungan berkala.",
    type: "paid",
    status: "draft",
    accessType: "private",
    instructorUserId: "user_001",
  },
  {
    id: "prog_04",
    organizationId: "org_001",
    title: "7 Hari Memahami Potensi Remaja",
    slug: "7-hari-memahami-potensi-remaja",
    description:
      "Kelas 7 hari untuk memahami potensi remaja: minat, bakat, dan cara orang tua mendampingi masa remaja tanpa memaksakan kehendak.",
    type: "lead_magnet",
    status: "published",
    accessType: "private",
    instructorUserId: "user_001",
    publishedAt: "2026-07-15T09:00:00.000Z",
  },
];

export const modules = [
  { id: "mod_01", programId: "prog_01", title: "7 Hari Mengenal Cara Belajar Anak", position: 0 },
  { id: "mod_02", programId: "prog_02", title: "Minggu 1-2: Mulai dari Hasil Tes", position: 0 },
  { id: "mod_03", programId: "prog_02", title: "Minggu 3-4: Kebiasaan dan Langkah Berikutnya", position: 1 },
  { id: "mod_04", programId: "prog_03", title: "Modul 1: Fondasi Pola Asuh", position: 0 },
  { id: "mod_05", programId: "prog_03", title: "Modul 2: Praktik di Rumah", position: 1 },
  { id: "mod_06", programId: "prog_04", title: "7 Hari Memahami Potensi Remaja", position: 0 },
];

const VIDEO_URL = "https://www.youtube.com/watch?v=jNQXAC9IVRw";
const VIDEO_EXTERNAL_ID = "jNQXAC9IVRw";

const lesson = (
  id: string,
  programId: string,
  moduleId: string,
  title: string,
  type: "video" | "text" | "reflection" | "cta",
  position: number,
  isRequired: boolean,
  video?: boolean
) => ({
  id,
  programId,
  moduleId,
  title,
  type,
  ...(video ? { videoProvider: "youtube" as const, videoUrl: VIDEO_URL, videoExternalId: VIDEO_EXTERNAL_ID } : {}),
  completionRule: "manual",
  isRequired,
  position,
  status: "published",
});

export const lessons = [
  // prog_01 — 7 Hari Mengenal Cara Belajar Anak (one lesson per day, "Day X of 7")
  lesson("les_001", "prog_01", "mod_01", "Hari 1: Cara Kerja Otak Anak Saat Belajar", "video", 0, true, true),
  lesson("les_002", "prog_01", "mod_01", "Hari 2: Mengenali Gaya Belajar Anak", "video", 1, true, true),
  lesson("les_003", "prog_01", "mod_01", "Hari 3: Membuat Lingkungan Belajar yang Nyaman", "video", 2, true, true),
  lesson("les_004", "prog_01", "mod_01", "Hari 4: Durasi Fokus Anak Sesuai Usia", "video", 3, true, true),
  lesson("les_005", "prog_01", "mod_01", "Hari 5: Mengajak Anak Belajar Tanpa Paksaan", "video", 4, true, true),
  lesson("les_006", "prog_01", "mod_01", "Hari 6: Membuat Rutinitas Belajar yang Lebih Ringan", "video", 5, true, true),
  lesson("les_007", "prog_01", "mod_01", "Hari 7: Refleksi & Rencana Belajar ke Depan", "reflection", 6, true),

  // prog_02 — 30 Hari Setelah Tes
  lesson("les_008", "prog_02", "mod_02", "Membaca Hasil Tes Anak", "video", 0, true, true),
  lesson("les_009", "prog_02", "mod_02", "Gaya Belajar Anak: Visual, Auditori, Kinestetik", "video", 1, true, true),
  lesson("les_010", "prog_02", "mod_02", "Menyusun Langkah Setelah Tes", "text", 2, true),
  lesson("les_011", "prog_02", "mod_03", "Membangun Kebiasaan Baru Selama 30 Hari", "video", 3, true, true),
  lesson("les_012", "prog_02", "mod_03", "Refleksi: Kemajuan Dua Minggu Pertama", "reflection", 4, true),
  lesson("les_013", "prog_02", "mod_03", "Jadwalkan Private Session", "cta", 5, false),

  // prog_03 — Parenting Growth Program (draft)
  lesson("les_014", "prog_03", "mod_04", "Pola Asuh yang Tumbuh Bersama Anak", "video", 0, true, true),
  lesson("les_015", "prog_03", "mod_04", "Manajemen Emosi Orang Tua", "text", 1, true),
  lesson("les_016", "prog_03", "mod_05", "Disiplin Positif di Rumah", "video", 2, true, true),
  lesson("les_017", "prog_03", "mod_05", "Menyusun Aturan Keluarga", "text", 3, true),
  lesson("les_018", "prog_03", "mod_05", "Refleksi: Rutinitas Keluarga", "reflection", 4, true),
  lesson("les_019", "prog_03", "mod_05", "Konsultasi dan Dukungan", "cta", 5, false),

  // prog_04 — 7 Hari Memahami Potensi Remaja
  lesson("les_020", "prog_04", "mod_06", "Hari 1: Apa Itu Potensi Remaja?", "video", 0, true, true),
  lesson("les_021", "prog_04", "mod_06", "Hari 2: Mengenali Minat dan Bakat", "text", 1, true),
  lesson("les_022", "prog_04", "mod_06", "Hari 3: Peran Orang Tua di Masa Remaja", "video", 2, true, true),
  lesson("les_023", "prog_04", "mod_06", "Hari 4: Komunikasi dengan Remaja", "video", 3, true, true),
  lesson("les_024", "prog_04", "mod_06", "Hari 5: Mendukung Pilihan Anak", "text", 4, true),
  lesson("les_025", "prog_04", "mod_06", "Hari 6: Refleksi: Pola Asuh dan Remaja", "reflection", 5, true),
  lesson("les_026", "prog_04", "mod_06", "Hari 7: Rencana Pendampingan 30 Hari", "text", 6, true),
];

// Static assertions so a drift against contracts is caught at typecheck time.
for (const program of programs) void ProgramSchema.parse(program);
for (const module of modules) void ModuleSchema.parse(module);
for (const lessonRow of lessons) void LessonSchema.parse(lessonRow);
