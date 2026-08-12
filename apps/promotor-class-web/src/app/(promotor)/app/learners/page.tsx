import type { Metadata } from "next";

import { Container, Divider, StatusText, TextLink } from "@/components/foundation";

export const metadata: Metadata = {
  title: "Peserta",
};

/**
 * Mock data per canonical cast in PROMOTOR_MOCKUP_GAP_REPORT.md
 * Ayu Rahma, Nina Wulandari, Dimas Pratama, Nadia Putri, Hendra Saputra
 */
const DEMO_CONTACTS = [
  {
    id: "contact_ayu",
    name: "Ayu Rahma",
    progress: "100%",
    interest: "Minat tinggi",
    interestScore: "92",
    status: "Selesai",
    lastActive: "2 jam lalu",
    meta: "Instagram · parenting · anak 13 tahun",
    reasons: "Program selesai · refleksi menyebut konflik soal HP · belum assessment",
    program: "7 Hari Mengenal Cara Belajar Anak",
    progressNote: "Mengisi refleksi · klik konsultasi",
    reflection: "Saya merasa lebih memahami cara anak belajar sekarang.",
    reflectionMeta: "11 Agu 2025 · 23 kata",
    timeline: [
      { date: "11 Agu", dot: "#167A68", text: "Menyelesaikan Rencana Tindakan — program selesai" },
      { date: "10 Agu", dot: "#94662F", text: "Mengisi refleksi Hari 6" },
      { date: "09 Agu", dot: "#E4EFEB", text: "Klik konsultasi Privat" },
    ],
    stage: "Klien baru",
    assessment: "Belum",
    nextStep: "Jelaskan singkat tes cara belajar — jadwalkan 15 menit minggu ini",
  },
  {
    id: "contact_nina",
    name: "Nina Wulandari",
    progress: "71%",
    interest: "Minat sedang",
    interestScore: "76",
    status: "Sedang berjalan",
    lastActive: "3 hari lalu",
    meta: "Guru SD · kelas 4-6",
    reasons: "Belum mengisi assessment lanjutan setelah refleksi",
    program: "30 Hari Setelah Tes",
    progressNote: "Mulai Hari 5 dari 8",
    reflection: "Tantangan terbesar adalah konsisten mencatat perkembangan harian.",
    reflectionMeta: "08 Agu 2025 · 47 kata",
    timeline: [
      { date: "09 Agu", dot: "#94662F", text: "Mengisi refleksi Hari 6" },
      { date: "08 Agu", dot: "#94662F", text: "Menyelesaikan Hari 5" },
    ],
    stage: "Dalam bimbingan",
    assessment: "Dalam proses",
    nextStep: "Ajak refleksi mendalam tentang kendala harian",
  },
  {
    id: "contact_dimas",
    name: "Dimas Pratama",
    progress: "86%",
    interest: "Minat tinggi",
    interestScore: "88",
    status: "Sedang berjalan",
    lastActive: "5 jam lalu",
    meta: "Parenting coach · online course",
    reasons: "Penting untuk follow-up sesi privat berikutnya",
    program: "Parenting Growth Program",
    progressNote: "Hampir selesai",
    reflection: "Metode yang diajarkan sangat praktis dan langsung bisa diterapkan.",
    reflectionMeta: "10 Agu 2025 · 63 kata",
    timeline: [
      { date: "11 Agu", dot: "#167A68", text: "Klik konsultasi Privat" },
      { date: "10 Agu", dot: "#167A68", text: "Menyelesaikan Hari 7" },
    ],
    stage: "Prioritas tinggi",
    assessment: "Tervalidasi",
    nextStep: "Koordinasi jadwal konsultasi privat minggu depan",
  },
  {
    id: "contact_nadia",
    name: "Nadia Putri",
    progress: "43%",
    interest: "Minat rendah",
    interestScore: "45",
    status: "Belum mulai",
    lastActive: "1 minggu lalu",
    meta: "Ibu muda · anak 2 tahun",
    reasons: "Aktivitas belum konsisten dalam seminggu terakhir",
    program: "7 Hari Memahami Potensi Remaja",
    progressNote: "Berhenti di Hari 3",
    reflection: null,
    timeline: [
      { date: "04 Agu", dot: "#94662F", text: "Mengisi refleksi Hari 3" },
    ],
    stage: "Needs attention",
    assessment: "Belum",
    nextStep: "Pertanyakan hambatan teknis atau non-teknis",
  },
];

type Contact = typeof DEMO_CONTACTS[0];

export default function LearnersPage() {
  return (
    <>
      <DesktopLearnersTable contacts={DEMO_CONTACTS} />
      <MobileLearnerList contacts={DEMO_CONTACTS} />
    </>
  );
}

// ============================================================
// DESKTOP VERSION — Mockup 2e
// ============================================================

function DesktopLearnersTable({
  contacts,
}: {
  contacts: typeof DEMO_CONTACTS;
}) {
  // Only show on desktop
  return (
    <section className="pc-desktop-only">
      <div style={{ display: "flex", flex: 1, background: "#FFFFFF", minWidth: 0 }}>
        {/* Table container - takes remaining space */}
        <div style={{ flex: 1, padding: "32px 32px 40px", minWidth: 0 }}>
          <h1 style={{ fontSize: "var(--font-size-28)", fontWeight: "var(--weight-semibold)", margin: 0 }}>Peserta</h1>
          <p style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
            174 peserta · 12 tidak aktif lebih dari 7 hari
          </p>

          {/* Table headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 62px 96px 82px 44px",
            gap: "0 12px",
            fontSize: "var(--font-size-12)",
            color: "var(--color-text-faint)",
            paddingBottom: "var(--space-2)",
            borderBottom: `1px solid var(--color-border-dark)`,
            paddingTop: "var(--space-6)",
          }}>
            <div>Nama</div>
            <div style={{ textAlign: "right" }}>Progres</div>
            <div>Minat</div>
            <div>Status</div>
            <div>Terakhir</div>
          </div>

          {/* Table rows */}
          {contacts.map((contact) => (
            <div key={contact.id} style={{
              display: "grid",
              gridTemplateColumns: "1fr 62px 96px 82px 44px",
              gap: "0 12px",
              alignItems: "center",
              fontSize: "var(--font-size-14)",
              padding: "var(--space-3) 0",
              borderBottom: `1px solid var(--color-border)`,
              cursor: "pointer",
            }}>
              <div style={{ 
                fontWeight: "var(--weight-medium)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {contact.name}
              </div>
              <div style={{ 
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}>
                {contact.progress}
              </div>
              <div style={{
                fontSize: "var(--font-size-13)",
                whiteSpace: "nowrap",
                color: contact.interest === "Minat tinggi" ? "var(--color-accent)" : 
                      contact.interest === "Minat sedang" ? "#94662F" : 
                      "#A33A32",
              }}>
                {contact.interest} {contact.interestScore}
              </div>
              <div style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)" }}>
                {contact.status}
              </div>
              <div style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-faint)" }}>
                {contact.lastActive}
              </div>
            </div>
          ))}
        </div>

        {/* Side panel - 400px fixed width */}
        <div style={{
          width: "400px",
          flex: "none",
          background: "#fff",
          borderLeft: `1px solid var(--color-border-dark)`,
          boxShadow: "-8px 0 24px rgba(32,33,31,.06)",
          padding: "var(--space-6) 24px 40px",
          overflow: "hidden",
        }}>
          {(() => {
            const contact = contacts[0]!;
            return (
              <>
                {/* Identity */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <div style={{ fontSize: "var(--font-size-20)", fontWeight: "var(--weight-semibold)" }}>{contact.name}</div>
                    <div style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>{contact.meta}</div>
                  </div>
                  <span style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-faint)" }}>Tutup</span>
                </div>

                {/* Interest section */}
                <div style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-3)", borderTop: `1px solid var(--color-border)` }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)" }}>
                    <span style={{ fontSize: "var(--font-size-15)", fontWeight: "var(--weight-semibold)", color: contact.interest === "Minat tinggi" ? "var(--color-accent)" : 
                          contact.interest === "Minat sedang" ? "#94662F" : 
                          "#A33A32" }}>{contact.interest}</span>
                    <span style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-faint)" }}>{contact.interestScore}</span>
                  </div>
                  <div style={{ fontSize: "var(--font-size-13_5)", color: "var(--color-text-muted)", lineHeight: 1.75, marginTop: "var(--space-1_5)" }}>
                    {contact.reasons}
                  </div>
                </div>

                {/* Learn section */}
                <div style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-3)", borderTop: `1px solid var(--color-border)` }}>
                  <div style={{ fontSize: "var(--font-size-12)", color: "var(--color-text-faint)", marginBottom: "var(--space-2)" }}>Belajar</div>
                  <div style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--weight-medium)" }}>{contact.program}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
                    <div style={{ flex: 1, height: "3px", background: "#E5E5E1" }}>
                      <div style={{ height: "3px", background: "var(--color-accent)", width: contact.progress }}></div>
                    </div>
                    <div style={{ fontSize: "var(--font-size-13)", fontVariantNumeric: "tabular-nums" }}>{contact.progress}</div>
                  </div>
                  <div style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>{contact.progressNote}</div>
                </div>

                {/* Reflection section */}
                <div style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-3)", borderTop: `1px solid var(--color-border)` }}>
                  <div style={{ fontSize: "var(--font-size-12)", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "var(--space-2_5)" }}>Refleksi</div>
                  {contact.reflection && (
                    <div style={{ fontSize: "var(--font-size-15)", lineHeight: 1.6, paddingLeft: "var(--space-3)", borderLeft: `2px solid var(--color-border-dark)`, textWrap: "pretty" }}>
                      {contact.reflection}
                    </div>
                  )}
                  <div style={{ fontSize: "var(--font-size-12)", color: "var(--color-text-faint)", marginTop: "var(--space-2)" }}>{contact.reflectionMeta}</div>
                </div>

                {/* Timeline section */}
                <div style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-3)", borderTop: `1px solid var(--color-border)` }}>
                  <div style={{ fontSize: "var(--font-size-12)", color: "var(--color-text-faint)", marginBottom: "var(--space-3)" }}>Riwayat belajar</div>
                  {contact.timeline.map((event, index) => (
                    <div key={index} style={{ display: "grid", gridTemplateColumns: "52px 12px 1fr", gap: "var(--space-2)", alignItems: "start" }}>
                      <div style={{ fontSize: "var(--font-size-12)", color: "var(--color-text-faint)", paddingTop: "1px" }}>{event.date}</div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: "5px", height: "5px", borderRadius: "3px", background: event.dot, marginTop: "var(--space-1_5)" }}></div>
                        {index !== contact.timeline.length - 1 && (
                          <div style={{ width: "1px", flex: 1, minHeight: "20px", background: "#E5E5E1" }}></div>
                        )}
                      </div>
                      <div style={{ fontSize: "var(--font-size-13_5)", paddingBottom: "var(--space-2_5)" }}>{event.text}</div>
                    </div>
                  ))}
                </div>

                {/* PromotorFlow section */}
                <div style={{ marginTop: "var(--space-3)", paddingTop: "var(--space-3)", borderTop: `1px solid var(--color-border)` }}>
                  <div style={{ fontSize: "var(--font-size-12)", color: "var(--color-text-faint)", marginBottom: "var(--space-1_5)" }}>PromotorFlow</div>
                  <div style={{ fontSize: "var(--font-size-14)" }}>Tahap · {contact.stage}</div>
                  <div style={{ fontSize: "var(--font-size-14)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>Assessment · {contact.assessment}</div>
                </div>

                {/* Next step action area */}
                <div style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-3)", borderTop: `1px solid var(--color-border-dark)` }}>
                  <div style={{ fontSize: "var(--font-size-12)", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "var(--space-1)" }}>Langkah berikutnya</div>
                  <div style={{ fontSize: "var(--font-size-15)", fontWeight: "var(--weight-medium)" }}>{contact.nextStep}</div>
                  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", marginTop: "var(--space-4)" }}>
                    <button style={{
                      border: `1px solid var(--color-accent)`,
                      background: "var(--color-accent)",
                      color: "#fff",
                      font: "500 var(--font-size-13) inherit",
                      padding: "var(--space-2_5) var(--space-3)",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                    }}>Tindak lanjuti →</button>
                    <span style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)" }}>Lihat di kalender</span>
                  </div>
                  <div style={{ fontSize: "var(--font-size-12)", color: "var(--color-text-faint)", marginTop: "var(--space-2_5)" }}>Tindak lanjut akan tersimpan di Aktivitas</div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// MOBILE VERSION — Mockup 3e
// ============================================================

function MobileLearnerList({ contacts }: { contacts: typeof DEMO_CONTACTS }) {
  return (
    <section className="pc-mobile-only">
      <Container>
        <div style={{ padding: "var(--space-5) var(--space-5) 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h1 style={{ fontSize: "var(--font-size-24)", fontWeight: "var(--weight-semibold)", margin: 0 }}>Peserta</h1>
            <a href="/app/learners/filter" style={{ fontSize: "var(--font-size-13)", color: "var(--color-accent)", textDecoration: "none" }}>Saring</a>
          </div>
          <p style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginTop: "var(--space-1_5)" }}>
            174 peserta · 12 tidak aktif &gt;7 hari
          </p>
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3_5)", paddingBottom: "var(--space-3)", borderBottom: `1px solid var(--color-border-dark)` }}>
          <span style={{ 
            fontSize: "var(--font-size-13)", 
            padding: "var(--space-1_5) var(--space-2)", 
            borderRadius: "var(--radius-md)",
            background: "var(--color-accent-soft)", 
            color: "var(--color-accent)" 
          }}>
            Minat tinggi
          </span>
          <span style={{ 
            fontSize: "var(--font-size-13)", 
            padding: "var(--space-1_5) var(--space-2)", 
            borderRadius: "var(--radius-md)",
            background: "#F2F2EF", 
            color: "var(--color-text-muted)" 
          }}>
            Tidak aktif
          </span>
          <span style={{ 
            fontSize: "var(--font-size-13)", 
            padding: "var(--space-1_5) var(--space-2)", 
            borderRadius: "var(--radius-md)",
            background: "#F2F2EF", 
            color: "var(--color-text-muted)" 
          }}>
            Selesai
          </span>
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflow: "hidden", paddingBottom: "var(--space-5)" }}>
          {contacts.map((contact) => (
            <a key={contact.id} href={`/app/learners/${contact.id}`} style={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
              padding: "var(--space-3) 0",
              borderBottom: `1px solid var(--color-border)`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)", alignItems: "baseline" }}>
                <div style={{ fontSize: "var(--font-size-16)", fontWeight: "var(--weight-medium)" }}>{contact.name}</div>
                <div style={{ fontSize: "var(--font-size-14)", fontVariantNumeric: "tabular-nums", flex: "none" }}>{contact.progress}</div>
              </div>
              <div style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                {contact.status} · {contact.lastActive} · minat {contact.interest} {contact.interestScore}
              </div>
            </a>
          ))}
        </div>

        {/* Load more link */}
        <div style={{ padding: "var(--space-3) 0", textAlign: "center" }}>
          <TextLink href="/app/learners?offset=20">Muat lebih banyak</TextLink>
        </div>
      </Container>
    </section>
  );
}
