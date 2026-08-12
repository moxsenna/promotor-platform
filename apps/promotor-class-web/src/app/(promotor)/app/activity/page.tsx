import type { Metadata } from "next";

import { Container, Divider } from "@/components/foundation";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Aktivitas",
};

/**
 * Activity feed (design.md §25). Shows timestamped activity rows with action + target + optional reason.
 * M0 has no activity query exposed through module boundaries, so renders honest empty state.
 */
export default function ActivityPage() {
  return (
    <Container size="wide">
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h1 className="pc-page-title">Aktivitas</h1>
        <p className="pc-meta pc-meta--muted">Riwayat aktivitas belajar peserta.</p>
        
        <Divider />
        
        {/* Timeline container for consistent spacing */}
        <div className="pc-timeline-container">
          {/* Empty state — styled as minimal card */}
          <div className="pc-empty-state pc-learn-hero-card" style={{ padding: "var(--space-8) 0" }}>
            <div className="pc-learn-hero-content">
              <h3 className="pc-learn-hero-title">Belum ada aktivitas</h3>
              <p className="pc-learn-hero-desc">
                Aktivitas peserta akan tampil di sini setiap mereka mengerjakan program.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
