import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ContactId } from "@promotor/contracts";
import { getContact } from "@/modules/contacts/queries";
import { getDemoScenario, isFlowUsable } from "@/modules/demo/queries";
import { getLesson, listLearningTimelineByContact, listReflectionsByContact } from "@/modules/learning/queries";
import { listEnrollmentsByContact } from "@/modules/enrollments/queries";
import { getSignalsByContact } from "@/modules/signals/queries";
import { getFlowContactContext } from "@/modules/promotorflow/queries";
import { LearnerDetailClient } from "./learner-detail-client";

export const metadata: Metadata = {
  title: "Peserta",
};

type LearnerDetailPageProps = {
  params: Promise<{ contactId: string }>;
};

export default async function LearnerDetailPage({ params }: LearnerDetailPageProps) {
  const { contactId } = await params;
  const contactIdBranded = contactId as ContactId;

  const contact = getContact(contactIdBranded);
  if (!contact) notFound();

  const enrollments = listEnrollmentsByContact(contactId);
  const timeline = listLearningTimelineByContact(contactId);
  const reflections = listReflectionsByContact(contactId);
  const signals = getSignalsByContact(contactId);
  const primarySignal = signals.find((s) => s.signal.status === "ACTIVE") ?? signals[0] ?? null;
  const scenario = getDemoScenario();
  const flowUsable = isFlowUsable();
  const flowContext = flowUsable ? await getFlowContactContext(contactIdBranded) : null;

  const formattedReflections = reflections.map((r) => ({
    id: r.id,
    submittedAt: r.submittedAt,
    text: r.text,
    lessonTitle: getLesson(r.enrollmentId, r.lessonId)?.lesson.title,
  }));

  return (
    <LearnerDetailClient
      contact={contact}
      enrollments={enrollments}
      timeline={timeline}
      reflections={formattedReflections}
      primarySignal={primarySignal}
      flowContext={flowContext}
      scenario={scenario}
    />
  );
}
