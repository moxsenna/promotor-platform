import type { Metadata } from "next";

import {
  Container,
  Divider,
  EmptyState,
  PageHeader,
  Stack,
  StatusText,
  TextLink,
} from "@/components/foundation";
import { programStatusLabel, programTypeLabel } from "@/lib/labels";
import { listEnrollments } from "@/modules/enrollments/queries";
import { listPrograms } from "@/modules/programs/queries";

export const metadata: Metadata = {
  title: "Program",
};

/**
 * Program list (design.md §17, plan §9.10). Stacked rows — no KPI cards.
 * Each program links to its detail page. Status + learner count as plain
 * metadata; status text always carries meaning (never color alone).
 */
export default function ProgramsPage() {
  const programs = listPrograms();
  const enrollments = listEnrollments();

  return (
    <Container>
      <Stack gap="8">
        <PageHeader
          title="Program"
          description="Semua program yang dikelola promotor."
        />
        <Divider />
        {programs.length === 0 ? (
          <EmptyState
            title="Belum ada program"
            description="Buat program untuk mulai mendaftarkan peserta."
          />
        ) : (
          <Stack gap="1">
            {programs.map((program) => {
              const learnerCount = enrollments.filter(
                (e) => e.programId === program.id
              ).length;
              const tone =
                program.status === "published" ? "success" : "neutral";
              return (
                <div className="pc-list-row" key={program.id}>
                  <Stack gap="2">
                    <TextLink href={`/app/programs/${program.id}`} standalone>
                      {program.title}
                    </TextLink>
                    <p className="pc-meta">
                      {programTypeLabel(program.type)} · {learnerCount} peserta
                    </p>
                    <StatusText tone={tone}>
                      {programStatusLabel(program.status)}
                    </StatusText>
                  </Stack>
                </div>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
