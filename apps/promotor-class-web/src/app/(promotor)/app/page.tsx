import type { Metadata } from "next";

import {
  Container,
  Divider,
  EmptyState,
  PageHeader,
  SectionHeader,
  Stack,
  StatusText,
  TextLink,
} from "@/components/foundation";
import { formatDateTime } from "@/lib/format";
import { signalNextStep, signalTypeLabel } from "@/lib/labels";
import { getDemoScenario } from "@/modules/demo/queries";
import { getPromotorHomeSignals } from "@/modules/signals/queries";
import type { PromotorHomeSignalView } from "@/modules/signals/queries";

export const metadata: Metadata = {
  title: "Beranda",
};

/**
 * Promotor Home — attention queue (design.md §16, plan §10).
 *
 * Rows come from the signals module only; scenario capability comes from the
 * demo module. No KPI card grid (hard constraint). Queue shows one row per
 * contact (highest-priority ACTIVE signal wins) — the module query stays
 * signal-complete for tests, deduplication is a screen concern.
 *
 * Scenario behavior (plan §9.11-§9.13):
 * - CLASS_ONLY: signal + recommended next step. No outage language.
 * - BUNDLE_AVAILABLE: same; Flow context lives on the learner detail page.
 * - BUNDLE_FLOW_UNAVAILABLE: signal + next step + a single "sync queued"
 *   notice; learning remains fully usable.
 */
export default function PromotorHomePage() {
  const signals = getPromotorHomeSignals();
  const scenario = getDemoScenario();

  const byContact = new Map<string, PromotorHomeSignalView>();
  for (const row of signals) {
    const current = byContact.get(row.signal.contactId);
    if (!current || row.signal.priority > current.signal.priority) {
      byContact.set(row.signal.contactId, row);
    }
  }
  const queue = [...byContact.values()];

  return (
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
        
        {/* Section divider WITHIN header container */}
        <div className="pc-section-divider">
          <h2 className="pc-section-title">Perlu perhatian</h2>
          <span className="pc-section-count">{queue.length}</span>
        </div>
        
        {/* Scrollable content area */}
        <div className="pc-content-scroll">
          {scenario === "BUNDLE_FLOW_UNAVAILABLE" ? (
            <StatusText>Sinkronisasi ke PromotorFlow sedang antre.</StatusText>
          ) : null}
          {queue.length === 0 ? (
            <EmptyState
              title="Belum ada sinyal"
              description="Sinyal belajar peserta akan muncul di sini ketika peserta mulai mengerjakan program."
            />
          ) : (
            <>
              {queue.slice(0, 4).map((row) => (
                <SignalRow key={row.signal.contactId} row={row} />
              ))}
              {queue.length > 4 && (
                <div className="pc-list-more-link">
                  <span>Lihat {queue.length - 4} lainnya</span>
                </div>
              )}
              
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
  );
}

function SignalRow({ row }: { row: PromotorHomeSignalView }) {
  const { signal, contactName, programTitle } = row;
  const tone =
    signal.severity === "HIGH"
      ? "danger"
      : signal.severity === "MEDIUM"
        ? "warning"
        : "neutral";
  return (
    <div className="pc-list-row">
      <div className="pc-list-row-head">
        <TextLink href={`/app/learners/${signal.contactId}`} standalone>
          {contactName}
        </TextLink>
        <StatusText tone={tone}>{signalTypeLabel(signal.signalType)}</StatusText>
      </div>
      <Stack gap="2">
        <p className="pc-meta">
          {programTitle ?? "Tanpa program"} · {formatDateTime(signal.createdAt)}
        </p>
        <p>{signal.reason}</p>
        <p className="pc-meta">Langkah berikutnya</p>
        <p>{signalNextStep(signal.signalType)}</p>
        <div className="pc-list-actions">
          <TextLink href={`/app/learners/${signal.contactId}`}>
            Tindak lanjuti →
          </TextLink>
        </div>
      </Stack>
    </div>
  );
}
