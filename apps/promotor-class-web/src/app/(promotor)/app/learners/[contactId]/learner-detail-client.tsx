"use client";

import { useState } from "react";
import type { Enrollment, FlowContactContext } from "@promotor/contracts";
import type { ContactWithSource } from "@promotor/promotor-class-fixtures";
import { Container, Divider, EmptyState, PageHeader, ProgressBar, SectionHeader, Stack, StatusText, TextLink } from "@/components/foundation";
import { formatDateTime, formatPhoneDisplay } from "@/lib/format";
import { enrollmentStatusLabel, eventLabel, flowClassificationLabel, flowStageLabel, intentLabel, learningStatusLabel, signalNextStep, signalTypeLabel, sourceLabel } from "@/lib/labels";
import type { LearningTimelineItem } from "@/modules/learning/queries";

type LearnerDetailClientProps = {
  contact: ContactWithSource;
  enrollments: Enrollment[];
  timeline: LearningTimelineItem[];
  reflections: Array<{ id: string; submittedAt: string; text: string; lessonTitle?: string }>;
  primarySignal: { signal: { reason: string; signalType: any } } | null;
  flowContext: FlowContactContext | null;
  scenario: string;
};

export function LearnerDetailClient({
  contact,
  enrollments,
  timeline,
  reflections,
  primarySignal,
  flowContext,
  scenario,
}: LearnerDetailClientProps) {
  const [followupOpen, setFollowupOpen] = useState(false);

  const identity = [
    sourceLabel(contact.source),
    contact.email,
    formatPhoneDisplay(contact.phoneE164),
  ]
    .filter(Boolean)
    .join(" · ");

  const firstEnrollment = enrollments[0];
  const firstReflection = reflections[0];

  return (
    <>
      {/* DESKTOP VIEW */}
      <section className="pc-desktop-only">
        <Container>
          <Stack gap="8">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <TextLink href="/app/learners" standalone>
                  ← Peserta
                </TextLink>
                <PageHeader title={contact.name} description={identity} />
              </div>
              <button
                onClick={() => setFollowupOpen(true)}
                style={{
                  minHeight: "44px",
                  padding: "0 18px",
                  background: "#167A68",
                  color: "#fff",
                  fontWeight: "500",
                  fontSize: "14px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Tindak lanjuti
              </button>
            </div>
            <Divider />
            <Stack gap="2">
              <SectionHeader title="Program" />
              {enrollments.length === 0 ? (
                <EmptyState title="Belum ada program" description="Peserta ini belum terdaftar di program mana pun." />
              ) : (
                enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="pc-list-row">
                    <p style={{ fontWeight: "500" }}>{enrollment.programId}</p>
                    <Stack gap="2">
                      <ProgressBar value={enrollment.progressPercent} label="Progress program" size="md" />
                      <p className="pc-meta">
                        {enrollment.progressPercent}% · {enrollmentStatusLabel(enrollment.status)} · minat{" "}
                        {intentLabel(enrollment.intentLabel)} · {learningStatusLabel(enrollment.learningStatus)}
                        {enrollment.lastActivityAt ? ` · terakhir aktif ${formatDateTime(enrollment.lastActivityAt)}` : ""}
                      </p>
                    </Stack>
                  </div>
                ))
              )}
            </Stack>
            <Divider />
            <Stack gap="2">
              <SectionHeader title="Langkah berikutnya" />
              {!primarySignal ? (
                <EmptyState title="Tidak ada langkah berikutnya" description="Belum ada sinyal belajar untuk peserta ini." />
              ) : (
                <Stack gap="2">
                  <p>{primarySignal.signal.reason}</p>
                  <p className="pc-meta">Langkah berikutnya</p>
                  <p>{signalNextStep(primarySignal.signal.signalType)}</p>
                  <p className="pc-meta">Berdasarkan: {signalTypeLabel(primarySignal.signal.signalType)}</p>
                  {flowContext ? <FlowContextBlock context={flowContext} /> : null}
                  {scenario === "BUNDLE_FLOW_UNAVAILABLE" ? (
                    <Stack gap="1">
                      <StatusText>Sinkronisasi ke PromotorFlow sedang antre.</StatusText>
                      <p className="pc-meta">
                        Pembelajaran peserta tetap berjalan normal; hanya sinkronisasi PromotorFlow yang tertunda.
                      </p>
                    </Stack>
                  ) : null}
                </Stack>
              )}
            </Stack>
            <Divider />
            <Stack gap="2">
              <SectionHeader title="Refleksi" />
              {reflections.length === 0 ? (
                <EmptyState title="Belum ada refleksi" description="Refleksi peserta akan tampil di sini setelah peserta mengirim jawaban." />
              ) : (
                reflections.map((reflection) => (
                  <div className="pc-list-row" key={reflection.id}>
                    <p className="pc-meta">
                      {formatDateTime(reflection.submittedAt)} · {reflection.lessonTitle ?? "Pelajaran"}
                    </p>
                    <p className="pc-reflection">{reflection.text}</p>
                  </div>
                ))
              )}
            </Stack>
            <Divider />
            <Stack gap="2">
              <SectionHeader title="Timeline belajar" />
              {timeline.length === 0 ? (
                <EmptyState title="Belum ada aktivitas belajar" description="Peristiwa belajar peserta akan tampil di sini." />
              ) : (
                <div className="pc-timeline">
                  {[...timeline].reverse().map((item) => (
                    <TimelineItem key={item.event.eventId} item={item} />
                  ))}
                </div>
              )}
            </Stack>
          </Stack>
        </Container>
      </section>

      {/* MOBILE VIEW (Mockup 4f) */}
      <section className="pc-mobile-only" style={{ paddingBottom: "80px" }}>
        <div style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--color-border)" }}>
          <TextLink href="/app/learners" standalone>
            ← Peserta
          </TextLink>
          <span style={{ fontSize: "13px", color: "#73756F" }}>⋯</span>
        </div>

        <div style={{ padding: "20px" }}>
          <h1 style={{ font: "600 22px/1.2 inherit", margin: 0 }}>{contact.name}</h1>
          <div style={{ fontSize: "13px", color: "#73756F", marginTop: "4px" }}>{identity}</div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--color-border)" }}>
            <span style={{ fontSize: "15px", fontWeight: "600", color: "#167A68" }}>
              {primarySignal ? signalTypeLabel(primarySignal.signal.signalType) : "Minat sedang"}
            </span>
          </div>
          <div style={{ fontSize: "13.5px", color: "#73756F", lineHeight: "1.7", marginTop: "4px" }}>
            {primarySignal?.signal.reason ?? "Terdaftar di program."}
          </div>

          <div style={{ fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#9A9C97", margin: "16px 0 0" }}>
            Perjalanan belajar
          </div>
          <div style={{ fontSize: "13px", color: "#73756F", marginTop: "4px" }}>
            {firstEnrollment ? `${firstEnrollment.progressPercent}% selesai` : "Belum mulai"}
          </div>

          <div style={{ marginTop: "8px" }}>
            {[...timeline].reverse().slice(0, 4).map((item) => (
              <div key={item.event.eventId} style={{ display: "grid", gridTemplateColumns: "52px 14px 1fr", alignItems: "baseline", gap: "8px", padding: "5px 0" }}>
                <div style={{ fontSize: "13px", color: "#9A9C97" }}>{formatDateTime(item.event.occurredAt).slice(0, 5)}</div>
                <div style={{ fontSize: "11px", color: "#167A68" }}>●</div>
                <div style={{ fontSize: "14px", lineHeight: "1.5" }}>{eventLabel(item.event.eventType)}</div>
              </div>
            ))}
          </div>

          {firstReflection && (
            <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#9A9C97" }}>Refleksi</div>
              <div style={{ fontSize: "15px", lineHeight: "1.6", marginTop: "6px" }}>{firstReflection.text}</div>
              <div style={{ fontSize: "13px", color: "#9A9C97", marginTop: "4px" }}>{formatDateTime(firstReflection.submittedAt)}</div>
            </div>
          )}

          {primarySignal && (
            <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#9A9C97" }}>Langkah berikutnya</div>
              <div style={{ fontSize: "15px", lineHeight: "1.6", marginTop: "6px" }}>{signalNextStep(primarySignal.signal.signalType)}</div>
            </div>
          )}
        </div>

        {/* Sticky Mobile Actions (Mockup 4f bottom bar) */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, padding: "12px 20px 20px", borderTop: "1px solid var(--color-border)", background: "#F7F7F5", display: "flex", gap: "10px" }}>
          <button
            onClick={() => setFollowupOpen(true)}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "48px", background: "#167A68", color: "#fff", fontSize: "15px", fontWeight: "500", borderRadius: "6px", border: "none", cursor: "pointer" }}
          >
            Tindak lanjuti
          </button>
          <button
            style={{ flex: "none", minHeight: "48px", padding: "0 16px", border: "1px solid var(--color-border)", background: "#fff", color: "#20211F", font: "500 15px inherit", borderRadius: "6px", cursor: "pointer" }}
          >
            Catat
          </button>
        </div>
      </section>

      {/* FOLLOW-UP SHEET / MODAL (Mockup 2f / 3e) */}
      {followupOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
          {/* Backdrop */}
          <div onClick={() => setFollowupOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(32, 33, 31, 0.32)" }} />

          {/* Bottom sheet */}
          <div style={{ position: "relative", width: "100%", maxWidth: "500px", background: "#fff", borderRadius: "10px 10px 0 0", boxShadow: "0 -8px 24px rgba(32, 33, 31, 0.18)", padding: "20px 20px 24px", zIndex: 101 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: "16px", fontWeight: "600" }}>Tindak lanjuti — {contact.name}</div>
              <button onClick={() => setFollowupOpen(false)} style={{ background: "none", border: "none", fontSize: "14px", color: "#73756F", cursor: "pointer", padding: 0 }}>
                Tutup
              </button>
            </div>
            <div style={{ fontSize: "13px", color: "#73756F", marginTop: "4px" }}>
              {formatPhoneDisplay(contact.phoneE164) || "+62 812-2140-8871"} · WhatsApp
            </div>
            <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "12px", color: "#9A9C97", marginBottom: "4px" }}>Pesan yang disiapkan</div>
              <textarea
                defaultValue={`Halo ${contact.name}, saya lihat Kakak sudah menyelesaikan 100% program belajar anak! Apakah ada pertanyaan atau ingin diskusi lebih lanjut?`}
                style={{ width: "100%", height: "100px", font: "inherit", fontSize: "14px", padding: "10px", border: "1px solid var(--color-border)", borderRadius: "6px", resize: "none" }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <a
                href={`https://wa.me/${contact.phoneE164.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "44px", background: "#167A68", color: "#fff", fontSize: "14px", fontWeight: "500", borderRadius: "6px", textDecoration: "none" }}
              >
                Kirim via WhatsApp
              </a>
              <button
                onClick={() => setFollowupOpen(false)}
                style={{ flex: "none", minHeight: "44px", padding: "0 16px", border: "1px solid var(--color-border)", background: "#fff", color: "#20211F", fontSize: "14px", fontWeight: "500", borderRadius: "6px", cursor: "pointer" }}
              >
                Salin teks
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FlowContextBlock({ context }: { context: FlowContactContext }) {
  return (
    <Stack gap="1">
      <p className="pc-meta">PromotorFlow</p>
      <p>
        Tahap: {flowStageLabel(context.stage)} · {flowClassificationLabel(context.classification)}
      </p>
      {context.primaryNextAction ? (
        <p className="pc-meta">
          Aksi berikutnya: {context.primaryNextAction.type}
          {context.primaryNextAction.dueAt ? ` · jatuh tempo ${formatDateTime(context.primaryNextAction.dueAt)}` : ""}
        </p>
      ) : null}
    </Stack>
  );
}

function TimelineItem({ item }: { item: LearningTimelineItem }) {
  const { event } = item;
  return (
    <div className="pc-timeline-item">
      <span className="pc-timeline-dot" aria-hidden="true" />
      <div className="pc-timeline-body">
        <p className="pc-meta">{formatDateTime(event.occurredAt)}</p>
        <p>{timelineLabel(item)}</p>
      </div>
    </div>
  );
}

function timelineLabel(item: LearningTimelineItem): string {
  const { event, lessonTitle, programTitle } = item;
  let label = eventLabel(event.eventType);
  if (
    (event.eventType === "lesson.started" || event.eventType === "lesson.completed" || event.eventType === "reflection.submitted") &&
    lessonTitle
  ) {
    label += ` — ${lessonTitle}`;
  }
  if (event.eventType === "learner.enrolled" && programTitle) {
    label += ` — ${programTitle}`;
  }
  return label;
}
