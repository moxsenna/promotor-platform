import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { ContactId, Enrollment, FlowContactContext } from "@promotor/contracts";

import {
  Container,
  Divider,
  EmptyState,
  PageHeader,
  ProgressBar,
  SectionHeader,
  Stack,
  StatusText,
  TextLink,
} from "@/components/foundation";
import { formatDateTime, formatPhoneDisplay } from "@/lib/format";
import {
  enrollmentStatusLabel,
  eventLabel,
  flowClassificationLabel,
  flowStageLabel,
  intentLabel,
  learningStatusLabel,
  signalNextStep,
  signalTypeLabel,
  sourceLabel,
} from "@/lib/labels";
import { getContact } from "@/modules/contacts/queries";
import { getDemoScenario, isFlowUsable } from "@/modules/demo/queries";
import {
  getLesson,
  listLearningTimelineByContact,
  listReflectionsByContact,
} from "@/modules/learning/queries";
import type { LearningTimelineItem } from "@/modules/learning/queries";
import { listEnrollmentsByContact } from "@/modules/enrollments/queries";
import { getProgramById } from "@/modules/programs/queries";
import { getSignalsByContact } from "@/modules/signals/queries";
import { getFlowContactContext } from "@/modules/promotorflow/queries";

export const metadata: Metadata = {
  title: "Peserta",
};

type LearnerDetailPageProps = {
  params: Promise<{ contactId: string }>;
};

/**
 * Learner detail (design.md §23, plan §10). Identity, program + progress,
 * intent, next step, reflection (raw reflection lives HERE, not on Home),
 * learning timeline, and Flow context when the scenario allows.
 *
 * Scenario behavior (plan §9.11-§9.13): CLASS_ONLY shows signal + next step
 * only; BUNDLE_AVAILABLE additionally shows the Flow contact context
 * (read-only — no Flow web app exists in M0, so no fake "Open in
 * PromotorFlow" link); BUNDLE_FLOW_UNAVAILABLE adds the "sync queued" note.
 * Follow-up draft (plan §9.14) is owned by T11 — not duplicated here.
 */
export default async function LearnerDetailPage({ params }: LearnerDetailPageProps) {
  const { contactId } = await params;
  const contactIdBranded = contactId as ContactId;

  const contact = getContact(contactIdBranded);
  if (!contact) notFound();

  const enrollments = listEnrollmentsByContact(contactId);
  const timeline = listLearningTimelineByContact(contactId);
  const reflections = listReflectionsByContact(contactId);
  const signals = getSignalsByContact(contactId);
  const primarySignal = signals.find((s) => s.signal.status === "ACTIVE") ?? signals[0];
  const scenario = getDemoScenario();
  const flowUsable = isFlowUsable();
  const flowContext = flowUsable ? await getFlowContactContext(contactIdBranded) : null;

  const identity = [
    sourceLabel(contact.source),
    contact.email,
    formatPhoneDisplay(contact.phoneE164),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Container>
      <Stack gap="8">
        <div>
          <TextLink href="/app/learners" standalone>
            ← Peserta
          </TextLink>
          <PageHeader title={contact.name} description={identity} />
        </div>
        <Divider />
        <Stack gap="2">
          <SectionHeader title="Program" />
          {enrollments.length === 0 ? (
            <EmptyState
              title="Belum ada program"
              description="Peserta ini belum terdaftar di program mana pun."
            />
          ) : (
            enrollments.map((enrollment) => (
              <EnrollmentRow
                key={enrollment.id}
                enrollment={enrollment}
                programTitle={getProgramById(enrollment.programId)?.title ?? null}
                programId={enrollment.programId}
              />
            ))
          )}
        </Stack>
        <Divider />
        <Stack gap="2">
          <SectionHeader title="Langkah berikutnya" />
          {!primarySignal ? (
            <EmptyState
              title="Tidak ada langkah berikutnya"
              description="Belum ada sinyal belajar untuk peserta ini."
            />
          ) : (
            <Stack gap="2">
              <p>{primarySignal.signal.reason}</p>
              <p className="pc-meta">Langkah berikutnya</p>
              <p>{signalNextStep(primarySignal.signal.signalType)}</p>
              <p className="pc-meta">
                Berdasarkan: {signalTypeLabel(primarySignal.signal.signalType)}
              </p>
              {flowContext ? <FlowContextBlock context={flowContext} /> : null}
              {scenario === "BUNDLE_FLOW_UNAVAILABLE" ? (
                <Stack gap="1">
                  <StatusText>Sinkronisasi ke PromotorFlow sedang antre.</StatusText>
                  <p className="pc-meta">
                    Pembelajaran peserta tetap berjalan normal; hanya sinkronisasi
                    PromotorFlow yang tertunda.
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
            <EmptyState
              title="Belum ada refleksi"
              description="Refleksi peserta akan tampil di sini setelah peserta mengirim jawaban."
            />
          ) : (
            reflections.map((reflection) => {
              const lessonTitle = getLesson(reflection.enrollmentId, reflection.lessonId)?.lesson.title;
              return (
                <div className="pc-list-row" key={reflection.id}>
                  <p className="pc-meta">
                    {formatDateTime(reflection.submittedAt)} ·{" "}
                    {lessonTitle ?? "Pelajaran"}
                  </p>
                  <p className="pc-reflection">{reflection.text}</p>
                </div>
              );
            })
          )}
        </Stack>
        <Divider />
        <Stack gap="2">
          <SectionHeader title="Timeline belajar" />
          {timeline.length === 0 ? (
            <EmptyState
              title="Belum ada aktivitas belajar"
              description="Peristiwa belajar peserta akan tampil di sini."
            />
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
  );
}

function EnrollmentRow({
  enrollment,
  programTitle,
  programId,
}: {
  enrollment: Enrollment;
  programTitle: string | null;
  programId: string;
}) {
  return (
    <div className="pc-list-row">
      {programTitle ? (
        <TextLink href={`/app/programs/${programId}`} standalone>
          {programTitle}
        </TextLink>
      ) : (
        <p>{programId}</p>
      )}
      <Stack gap="2">
        <ProgressBar value={enrollment.progressPercent} label="Progress program" size="md" />
        <p className="pc-meta">
          {enrollment.progressPercent}% · {enrollmentStatusLabel(enrollment.status)} · minat{" "}
          {intentLabel(enrollment.intentLabel)} · {learningStatusLabel(enrollment.learningStatus)}
          {enrollment.lastActivityAt
            ? ` · terakhir aktif ${formatDateTime(enrollment.lastActivityAt)}`
            : ""}
        </p>
      </Stack>
    </div>
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
    (event.eventType === "lesson.started" ||
      event.eventType === "lesson.completed" ||
      event.eventType === "reflection.submitted") &&
    lessonTitle
  ) {
    label += ` — ${lessonTitle}`;
  }
  if (event.eventType === "learner.enrolled" && programTitle) {
    label += ` — ${programTitle}`;
  }
  return label;
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
          {context.primaryNextAction.dueAt
            ? ` · jatuh tempo ${formatDateTime(context.primaryNextAction.dueAt)}`
            : ""}
        </p>
      ) : null}
    </Stack>
  );
}
