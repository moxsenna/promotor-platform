import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
import { lessonTypeLabel, programStatusLabel, programTypeLabel } from "@/lib/labels";
import { listEnrollments } from "@/modules/enrollments/queries";
import { getProgramDetail } from "@/modules/programs/queries";

export const metadata: Metadata = {
  title: "Detail program",
};

type ProgramDetailPageProps = {
  params: Promise<{ programId: string }>;
};

/**
 * Program detail with curriculum (plan §9.10, design.md §18-§19).
 * Minimal but real: program metadata + module/lesson hierarchy. No KPI
 * cards, no analytic panels (non-goals in M0).
 */
export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { programId } = await params;
  const view = getProgramDetail(programId);
  if (!view) notFound();

  const learnerCount = listEnrollments().filter(
    (e) => e.programId === programId
  ).length;
  const lessonCount = view.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );
  const tone = view.program.status === "published" ? "success" : "neutral";

  return (
    <Container>
      <Stack gap="8">
        <div>
          <TextLink href="/app/programs" standalone>
            ← Program
          </TextLink>
          <PageHeader
            title={view.program.title}
            description={view.program.description}
          />
          <p className="pc-meta">
            {programTypeLabel(view.program.type)} · {lessonCount} pelajaran ·{" "}
            {learnerCount} peserta
          </p>
          <StatusText tone={tone}>{programStatusLabel(view.program.status)}</StatusText>
        </div>
        <Divider />
        <Stack gap="6">
          <SectionHeader title="Kurikulum" />
          {view.modules.length === 0 ? (
            <EmptyState
              title="Belum ada materi"
              description="Kurikulum program akan tampil di sini."
            />
          ) : (
            view.modules.map(({ module, lessons }) => (
              <Stack gap="2" key={module.id}>
                <h3 className="pc-module-title">{module.title}</h3>
                {lessons.map((lesson) => (
                  <div className="pc-list-row" key={lesson.id}>
                    <Stack gap="1">
                      <p>
                        {String(lesson.position + 1).padStart(2, "0")} · {lesson.title}
                      </p>
                      <p className="pc-meta">{lessonTypeLabel(lesson.type)}</p>
                    </Stack>
                  </div>
                ))}
              </Stack>
            ))
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
