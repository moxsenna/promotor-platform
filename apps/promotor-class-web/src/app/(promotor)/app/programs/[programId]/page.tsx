import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listEnrollments } from "@/modules/enrollments/queries";
import { getProgramDetail } from "@/modules/programs/queries";
import { ProgramWorkspaceClient } from "./program-workspace-client";

export const metadata: Metadata = {
  title: "Detail program",
};

type ProgramDetailPageProps = {
  params: Promise<{ programId: string }>;
};

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { programId } = await params;
  const view = getProgramDetail(programId);
  if (!view) notFound();

  const learnerCount = listEnrollments().filter((e) => e.programId === programId).length;
  const lessonCount = view.modules.reduce((sum, module) => sum + module.lessons.length, 0);

  return <ProgramWorkspaceClient view={view} learnerCount={learnerCount} lessonCount={lessonCount} />;
}
