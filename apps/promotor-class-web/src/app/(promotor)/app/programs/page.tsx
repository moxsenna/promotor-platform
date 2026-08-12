import type { Metadata } from "next";

import { Container, Divider, EmptyState, PageHeader, Stack, StatusText, TextLink } from "@/components/foundation";

export const metadata: Metadata = {
  title: "Program",
};

/**
 * Mock data per Turn 4a structure - canonical program names from mockups
 */
const DEMO_PROGRAMS = [
  {
    id: "prog_001",
    title: "7 Hari Mengenal Cara Belajar Anak",
    type: "lead-magnet" as const,
    learnerCount: 84,
    status: "published" as const,
    updatedAt: "2 jam lalu",
  },
  {
    id: "prog_002",
    title: "30 Hari Setelah Tes — Kenali Diri Lebih Dalam",
    type: "aftersales" as const,
    learnerCount: 31,
    status: "published" as const,
    updatedAt: "1 hari lalu",
  },
  {
    id: "prog_003",
    title: "Parenting Growth Program",
    type: "berbayar" as const,
    learnerCount: 0,
    status: "draft" as const,
    updatedAt: "4 hari lalu",
  },
  {
    id: "prog_004",
    title: "7 Hari Memahami Potensi Remaja",
    type: "privat" as const,
    learnerCount: 17,
    status: "published" as const,
    updatedAt: "2 minggu lalu",
  },
];

// Helper functions for type-safe labels
function getLabel(type: string) {
  const typeLabels: Record<string, string> = {
    "lead-magnet": "Lead magnet",
    "aftersales": "Aftersales",
    "berbayar": "Berbayar",
    "privat": "Privat",
  };
  return typeLabels[type] || type;
}

function getStatusLabel(status: string) {
  const statusLabels: Record<string, string> = {
    "published": "Dipublikasikan",
    "draft": "Draf",
  };
  return statusLabels[status] || status;
}

type Program = typeof DEMO_PROGRAMS[0];

export default function ProgramsPage() {
  return (
    <>
      <DesktopProgramsTable programs={DEMO_PROGRAMS} />
      <MobileProgramList programs={DEMO_PROGRAMS} />
    </>
  );
}

// ============================================================
// DESKTOP VERSION — Mockup 2b
// ============================================================

function DesktopProgramsTable({
  programs,
}: {
  programs: typeof DEMO_PROGRAMS;
}) {
  return (
    <section className="pc-desktop-only">
      <Container size="wide">
        <Stack gap="8">
          {/* Header with "Program baru" button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1 style={{ fontSize: "var(--font-size-28)", fontWeight: "var(--weight-semibold)", margin: 0 }}>Program</h1>
            <a href="/app/programs/new" style={{
              border: `1px solid var(--color-accent)`,
              background: "var(--color-accent)",
              color: "#fff",
              font: "var(--weight-medium) var(--font-size-13) inherit",
              padding: "var(--space-2) var(--space-3)",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
            }}>
              Program baru
            </a>
          </div>

          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px 80px 130px 100px",
            gap: "0 24px",
            fontSize: "var(--font-size-12)",
            color: "var(--color-text-faint)",
            paddingBottom: "var(--space-3)",
            borderBottom: `1px solid var(--color-border-dark)`,
          }}>
            <div>Nama</div>
            <div>Jenis</div>
            <div style={{ textAlign: "right" }}>Peserta</div>
            <div>Status</div>
            <div>Diperbarui</div>
          </div>

          {/* Table rows */}
          {programs.length === 0 ? (
            <EmptyState
              title="Belum ada program"
              description="Buat program untuk mulai mendaftarkan peserta."
            />
          ) : (
            programs.map((program) => (
              <div key={program.id} style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 80px 130px 100px",
                gap: "0 24px",
                fontSize: "var(--font-size-13)",
                padding: "var(--space-3) 0",
                borderBottom: `1px solid var(--color-border)`,
              }}>
                <div style={{ 
                  fontWeight: "var(--weight-medium)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {program.title}
                </div>
                <div>{getLabel(program.type)}</div>
                <div style={{ 
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                  color: program.learnerCount > 0 ? "var(--color-text)" : "var(--color-text-faint)",
                }}>
                  {program.learnerCount > 0 ? program.learnerCount : "—"}
                </div>
                <div>
                  <StatusText tone={program.status === "published" ? "success" : "neutral"}>
                    {getStatusLabel(program.status)}
                  </StatusText>
                </div>
                <div style={{ color: "var(--color-text-muted)" }}>{program.updatedAt}</div>
              </div>
            ))
          )}
        </Stack>
      </Container>
    </section>
  );
}

// ============================================================
// MOBILE VERSION — Mockup 3a
// ============================================================

function MobileProgramList({ programs }: { programs: typeof DEMO_PROGRAMS }) {
  return (
    <section className="pc-mobile-only">
      <Container>
        <PageHeader
          title="Program"
          actions={
            <a href="/app/programs/new" style={{
              minWidth: "160px",
              minHeight: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-accent)",
              color: "#fff",
              font: "500 var(--font-size-14) inherit",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
            }}>
              Program baru
            </a>
          }
        />

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: "var(--space-4)",
          marginBottom: "var(--space-4)",
          borderBottom: `1px solid var(--color-border-dark)`,
          paddingBottom: "var(--space-2)",
        }}>
          <span style={{ 
            fontSize: "var(--font-size-15)",
            fontWeight: "var(--weight-medium)",
            color: "var(--color-accent)",
            borderBottom: `2px solid var(--color-accent)`,
            paddingBottom: "var(--space-1)",
          }}>
            Semua 4
          </span>
          <span style={{ 
            fontSize: "var(--font-size-15)",
            fontWeight: "var(--weight-medium)",
            color: "var(--color-text-muted)",
          }}>
            Aktif 3
          </span>
          <span style={{ 
            fontSize: "var(--font-size-15)",
            fontWeight: "var(--weight-medium)",
            color: "var(--color-text-muted)",
          }}>
            Draf 1
          </span>
        </div>

        {/* List of rows */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {programs.map((program) => (
            <a key={program.id} href={`/app/programs/${program.id}`} style={{
              display: "flex",
              flexDirection: "column",
              padding: "var(--space-4) 0",
              borderBottom: `1px solid var(--color-border)`,
              textDecoration: "none",
              color: "inherit",
            }}>
              <div style={{ 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "var(--font-size-15)",
                fontWeight: "var(--weight-medium)",
              }}>
                {program.title}
                <span style={{ fontSize: "var(--font-size-15)" }}>→</span>
              </div>
              <p style={{ 
                fontSize: "var(--font-size-13)",
                color: "var(--color-text-muted)",
                marginTop: "var(--space-1)",
              }}>
                {getLabel(program.type)} · {program.learnerCount > 0 ? program.learnerCount : "—"} peserta · {program.updatedAt}
              </p>
            </a>
          ))}
        </div>

        {/* + Program button fixed at bottom-right */}
        <a href="/app/programs/new" style={{
          position: "absolute",
          right: "20px",
          bottom: "calc(74px + 20px)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          minHeight: "48px",
          padding: "0 var(--space-4)",
          background: "var(--color-accent)",
          color: "#fff",
          fontSize: "var(--font-size-15)",
          fontWeight: "var(--weight-medium)",
          textDecoration: "none",
          borderRadius: "var(--radius-md)",
          boxShadow: "0 6px 18px rgba(32,33,31,.18)",
        }}>
          + Program
        </a>
      </Container>
    </section>
  );
}
