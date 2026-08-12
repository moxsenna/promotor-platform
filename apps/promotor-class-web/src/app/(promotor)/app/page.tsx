import type { Metadata } from "next";

import { Container, Divider, EmptyState, PageHeader, SectionHeader, Stack, StatusText, TextLink } from "@/components/foundation";
import { formatDateTime } from "@/lib/format";
import { signalNextStep, signalTypeLabel } from "@/lib/labels";
import { getDemoScenario } from "@/modules/demo/queries";
import { getPromotorHomeSignals } from "@/modules/signals/queries";
import type { PromotorHomeSignalView } from "@/modules/signals/queries";

export const metadata: Metadata = {
  title: "Beranda",
};

/**
 * Mock data per canonical cast in PROMOTOR_MOCKUP_GAP_REPORT.md
 * Ayu Rahma, Nina Wulandari, Dimas Pratama, Nadia Putri, Hendra Saputra
 */
const DEMO_QUEUE_ITEMS = [
  {
    contactId: "contact_ayu",
    name: "Ayu Rahma",
    event: "Menyelesaikan Rencana Tindakan — program selesai",
    interest: "Minat tinggi" as const,
    interestScore: "92",
    reasons: "Refleksi menyebut konflik soal HP saat diingatkan peserta",
    next: "Jelaskan singkat tes cara belajar — jadwalkan 15 menit minggu ini",
    action: "Buka WhatsApp →",
  },
  {
    contactId: "contact_nina",
    name: "Nina Wulandari",
    event: "Mengisi refleksi Hari 6",
    interest: "Minat sedang" as const,
    interestScore: "76",
    reasons: "Belum mengisi assessment lanjutan setelah refleksi",
    next: "Ajak refleksi mendalam tentang kendala harian",
    action: "Tindak lanjuti →",
  },
  {
    contactId: "contact_dimas",
    name: "Dimas Pratama",
    event: "Klik konsultasi Privat",
    interest: "Minat tinggi" as const,
    interestScore: "88",
    reasons: "Penting untuk follow-up sesi privat berikutnya",
    next: "Koordinasi jadwal konsultasi privat minggu depan",
    action: "Koordinasi →",
  },
  {
    contactId: "contact_nadia",
    name: "Nadia Putri",
    event: "Unggah lembar kerja PDF hari ini",
    interest: "Minat rendah" as const,
    interestScore: "45",
    reasons: "Aktivitas belum konsisten dalam seminggu terakhir",
    next: "Pertanyakan hambatan teknis atau non-teknis",
    action: "Tanya kendala →",
  },
];

export default function PromotorHomePage() {
  const signals = getPromotorHomeSignals();
  const scenario = getDemoScenario();

  // Desktop shows table; mobile shows rows
  return (
    <>
      <DesktopPromotorHome signals={signals} scenario={scenario} />
      <MobilePromotorHome signals={signals} scenario={scenario} />
    </>
  );
}

// ============================================================
// DESKTOP VERSION — Mockup 2a
// ============================================================

function DesktopPromotorHome({
  signals,
  scenario,
}: {
  signals: PromotorHomeSignalView[];
  scenario: ReturnType<typeof getDemoScenario>;
}) {
  // Only show on desktop
  return (
    <section className="pc-desktop-only">
      <Container size="wide">
        <Stack gap="8">
          {/* Header: title left, date right (Turn 2a exact) */}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingBottom: "var(--space-2)" }}>
            <h1 style={{ fontSize: "var(--font-size-28)", fontWeight: "var(--weight-semibold)", margin: 0 }}>Beranda</h1>
            <span style={{ fontSize: "var(--font-size-12)", color: "var(--color-text-faint)" }}>Selasa, 11 Agustus</span>
          </div>
          
          {/* Stats line */}
          <p style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
            174 peserta aktif · 32 baru bulan ini · rata-rata 67% selesai
          </p>

          {/* Attention queue heading */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)", margin: "var(--space-10) 0 0", paddingBottom: "var(--space-3)", borderBottom: `1px solid var(--color-border-dark)` }}>
            <h2 style={{ fontSize: "var(--font-size-20)", fontWeight: "var(--weight-semibold)", margin: 0 }}>Perlu perhatian</h2>
            <span style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-faint)" }}>{DEMO_QUEUE_ITEMS.length}</span>
          </div>

          {/* Queue items */}
          <div style={{ paddingTop: "var(--space-5)" }}>
            {scenario === "BUNDLE_FLOW_UNAVAILABLE" ? (
              <StatusText>Sinkronisasi ke PromotorFlow sedang antre.</StatusText>
            ) : null}
            
            {DEMO_QUEUE_ITEMS.map((item) => (
              <div key={item.contactId} style={{ padding: "var(--space-5) 0", borderBottom: `1px solid var(--color-border)`, transition: "background 0.2s ease" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-hover)")}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-8)" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "var(--font-size-16)", fontWeight: "var(--weight-semibold)" }}>{item.name}</div>
                    <div style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>{item.event}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
                      <span style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--weight-medium)", color: "#167A68" }}>{item.interest}</span>
                      <span style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-faint)" }}>{item.interestScore}</span>
                    </div>
                    <div style={{ fontSize: "var(--font-size-13.5)", color: "var(--color-text-muted)", lineHeight: "1.7", marginTop: "var(--space-1)" }}>{item.reasons}</div>
                    <div style={{ marginTop: "var(--space-3)" }}>
                      <div style={{ fontSize: "var(--font-size-12)", color: "var(--color-text-faint)", marginBottom: "var(--space-1)" }}>Langkah berikutnya</div>
                      <div style={{ fontSize: "var(--font-size-14)" }}>{item.next}</div>
                    </div>
                  </div>
                  <div style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "var(--space-2)" }}>
                    <TextLink href={`/app/learners/${item.contactId}`} standalone>{item.action}</TextLink>
                    <TextLink href="/app/learners" standalone>Lihat peserta</TextLink>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Aktivitas terbaru */}
          <h2 style={{ fontSize: "var(--font-size-20)", fontWeight: "var(--weight-semibold)", margin: "var(--space-10) 0 0", paddingBottom: "var(--space-3)", borderBottom: `1px solid var(--color-border-dark)` }}>Aktivitas terbaru</h2>
          <div style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: "var(--space-2) var(--space-4)", fontSize: "var(--font-size-13)", paddingTop: "var(--space-3)" }}>
            <div style={{ color: "var(--color-text-faint)", fontVariantNumeric: "tabular-nums" }}>03:01</div>
            <div>Ayu menyelesaikan Rencana Tindakan</div>
            <div style={{ color: "var(--color-text-faint)", fontVariantNumeric: "tabular-nums" }}>02:57</div>
            <div>Ayu menyelesaikan Hari 6</div>
            <div style={{ color: "var(--color-text-faint)", fontVariantNumeric: "tabular-nums" }}>02:44</div>
            <div>Ayu mengisi refleksi</div>
            <div style={{ color: "var(--color-text-faint)", fontVariantNumeric: "tabular-nums" }}>00:23</div>
            <div>Nina menyelesaikan Hari 5</div>
          </div>
          <a href="/app/activity" style={{ display: "inline-block", marginTop: "var(--space-4)", fontSize: "var(--font-size-13)", textDecoration: "none", color: "var(--color-text-muted)" }}>Semua aktivitas →</a>
        </Stack>
      </Container>
    </section>
  );
}

// ============================================================
// MOBILE VERSION — Mockup 4a
// ============================================================

function MobilePromotorHome({
  signals,
  scenario,
}: {
  signals: PromotorHomeSignalView[];
  scenario: ReturnType<typeof getDemoScenario>;
}) {
  // Only show on mobile
  return (
    <section className="pc-mobile-only">
      <Container size="wide">
        <Stack gap="8">
          {/* Header: title left, date right (Turn 4a exact) */}
          <div className="pc-home-header">
            <h1 className="pc-page-title">Beranda</h1>
            <span className="pc-date">{formatDateTime("2025-08-12T00:00:00Z")}</span>
          </div>
          
          {/* Stats line below header */}
          <p className="pc-home-stats">
            174 peserta aktif · 32 baru bulan ini · rata-rata 67% selesai
          </p>
          
          {/* Section divider */}
          <div className="pc-section-divider">
            <h2 className="pc-section-title">Perlu perhatian</h2>
            <span className="pc-section-count">{DEMO_QUEUE_ITEMS.length}</span>
          </div>
          
          {/* Scrollable content area */}
          <div className="pc-content-scroll">
            {scenario === "BUNDLE_FLOW_UNAVAILABLE" ? (
              <StatusText>Sinkronisasi ke PromotorFlow sedang antre.</StatusText>
            ) : null}
            {DEMO_QUEUE_ITEMS.length === 0 ? (
              <EmptyState
                title="Belum ada sinyal"
                description="Sinyal belajar peserta akan muncul di sini ketika peserta mulai mengerjakan program."
              />
            ) : (
              <>
                {DEMO_QUEUE_ITEMS.map((item) => (
                  <div key={item.contactId} className="pc-list-row">
                    <div className="pc-list-row-head">
                      <TextLink href={`/app/learners/${item.contactId}`} standalone>
                        {item.name}
                      </TextLink>
                      <span style={{
                        fontSize: "var(--font-size-14)",
                        fontWeight: "var(--weight-medium)",
                        color: item.interest === "Minat tinggi" ? "#167A68" : 
                               item.interest === "Minat sedang" ? "#94662F" : 
                               "#A33A32",
                      }}>{item.interest}</span>
                    </div>
                    <Stack gap="2">
                      <p className="pc-meta">
                        {item.event} · 12 Agu 2025
                      </p>
                      <p>{item.reasons}</p>
                      <p className="pc-meta">Langkah berikutnya</p>
                      <p>{item.next}</p>
                      <div className="pc-list-actions">
                        <TextLink href={`/app/learners/${item.contactId}`}>
                          {item.action}
                        </TextLink>
                      </div>
                    </Stack>
                  </div>
                ))}
                
                {/* Aktivitas terbaru section */}
                <div className="pc-activity-header">Aktivitas terbaru</div>
                <div className="pc-timeline-simple">
                  <div className="pc-timeline-time">03:01</div>
                  <div className="pc-timeline-text">Ayu menyelesaikan Rencana Tindakan</div>
                  <div className="pc-timeline-time">02:44</div>
                  <div className="pc-timeline-text">Ayu mengisi refleksi</div>
                </div>
              </>
            )}
          </div>
        </Stack>
      </Container>
    </section>
  );
}
