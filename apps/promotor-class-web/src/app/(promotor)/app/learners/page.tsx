import type { Metadata } from "next";

import { Container, Divider, StatusText, TextLink } from "@/components/foundation";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Peserta",
};

/**
 * Learners list page (Turn 3e).
 * Shows filtered participant list with progress and interest signals.
 * Uses hardcoded mock data for M0 demo.
 */
const DEMO_CONTACTS = [
  {
    id: "contact_001",
    name: "Rina Wulandari",
    progress: "100%",
    status: "Selesai",
    lastActive: "2 jam lalu",
    interest: "Minat tinggi",
    interestScore: "85",
    tags: ["parenting"],
  },
  {
    id: "contact_002",
    name: "Budi Santoso",
    progress: "71%",
    status: "Sedang berjalan",
    lastActive: "3 hari lalu",
    interest: "Aktif",
    interestScore: "62",
    tags: ["bisnis"],
  },
  {
    id: "contact_003",
    name: "Siti Nurhaliza",
    progress: "43%",
    status: "Belum mulai",
    lastActive: "1 minggu lalu",
    interest: "Tidak aktif",
    interestScore: "23",
    tags: ["ibu muda"],
  },
  {
    id: "contact_004",
    name: "Ahmad Fauzi",
    progress: "86%",
    status: "Sedang berjalan",
    lastActive: "5 jam lalu",
    interest: "Minat tinggi",
    interestScore: "78",
    tags: ["guru"],
  },
  {
    id: "contact_005",
    name: "Dewi Lestari",
    progress: "100%",
    status: "Selesai",
    lastActive: "4 hari lalu",
    interest: "Refleksi",
    interestScore: "71",
    tags: ["entrepreneur"],
  },
];

export default function LearnersPage() {
  const filteredContacts = DEMO_CONTACTS; // No actual filtering in M0

  return (
    <Container size="wide">
      {/* Header */}
      <div style={{ padding: "var(--space-5) var(--space-4) 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h1 className="pc-page-title">Peserta</h1>
          <span className="pc-link--muted">Saring</span>
        </div>
        
        {/* Stats line */}
        <p className="pc-meta pc-meta--muted" style={{ marginTop: "var(--space-2)" }}>
          174 peserta · 12 tidak aktif &gt;7 hari
        </p>
        
        {/* Filter chips */}
        <div style={{ 
          display: "flex", 
          gap: "var(--space-2)", 
          marginTop: "var(--space-3)", 
          paddingBottom: "var(--space-3)",
          borderBottom: "1px solid var(--color-border)"
        }}>
          <FilterChip active label="Minat tinggi" />
          <FilterChip label="Tidak aktif" />
          <FilterChip label="Selesai" />
        </div>
      </div>
      
      {/* Scrollable content area */}
      <div className="pc-content-scroll">
        {filteredContacts.map((contact) => (
          <LearnerRow key={contact.id} contact={contact} />
        ))}
        
        {filteredContacts.length === 0 && (
          <div style={{ padding: "var(--space-6) 0", textAlign: "center" }}>
            <StatusText>Tidak ada peserta sesuai filter</StatusText>
          </div>
        )}
        
        {/* Load more indicator */}
        <div className="pc-list-more-link">
          <span>Lihat semua 174 peserta</span>
        </div>
      </div>
    </Container>
  );
}

function FilterChip({ active, label }: { active?: boolean; label: string }) {
  return (
    <span
      style={{
        fontSize: "var(--font-size-13)",
        padding: "var(--space-1) var(--space-3)",
        borderRadius: "var(--radius-md)",
        backgroundColor: active ? "var(--color-surface-success)" : "var(--color-surface-soft)",
        color: active ? "var(--color-accent)" : "var(--color-text-muted)",
        fontWeight: active ? "var(--weight-medium)" : "var(--weight-normal)",
      }}
    >
      {label}
    </span>
  );
}

function LearnerRow({ contact }: { contact: typeof DEMO_CONTACTS[0] }) {
  return (
    <TextLink href={`/app/learners/${contact.id}`} standalone>
      <div className="pc-learner-row">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pc-learner-name">{contact.name}</div>
          <div className="pc-learner-meta">
            {contact.status} · {contact.lastActive} · minat {contact.interest} {contact.interestScore}
          </div>
        </div>
        <div className="pc-learner-progress">{contact.progress}</div>
      </div>
    </TextLink>
  );
}
