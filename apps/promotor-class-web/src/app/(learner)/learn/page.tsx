import { EmptyState, PageHeader, SectionHeader, Stack } from "@/components/foundation";

/** Learner home (design.md §29) — editorial placeholder. Real program rows
    land with the mock state layer (M0.6). No fake learner data. */
export default function LearnerHomePage() {
  return (
    <Stack gap="8">
      <PageHeader title="Belajar" description="Kelas yang dibagikan promotor Anda." />
      <SectionHeader title="Lanjutkan belajar" />
      <EmptyState
        title="Belum ada kelas"
        description="Kelas yang dibagikan promotor akan muncul di sini."
      />
    </Stack>
  );
}
