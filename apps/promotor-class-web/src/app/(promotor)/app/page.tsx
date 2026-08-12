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
        {/* Header with date and progress indicator (Turn 4a mockup) */}
        <div className="pc-app-header">
          <div>
            <h1 className="pc-page-title">Beranda</h1>
            <p className="pc-meta pc-meta--muted">Selasa, 11 Agu</p>
          </div>
          <div className="pc-progress-indicator">
            <span className="pc-progress-value">67%</span>
            <span className="pc-progress-label">rata-rata selesai</span>
          </div>
        </div>
        
        <Divider />
        <Stack gap="2">
          <SectionHeader
            title="Perlu perhatian"
            action={<span className="pc-section-count">{queue.length}</span>}
          />
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
            </>
          )}
        </Stack>
        <Divider />
        <Stack gap="6">
          <SectionHeader title="Aktivitas terbaru" />
          <EmptyState
            title="Belum ada aktivitas"
            description="Aktivitas peserta akan tampil di sini."
          />
        </Stack>
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
