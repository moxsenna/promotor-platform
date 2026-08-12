import { Container, Divider, EmptyState, PageHeader, SectionHeader, Stack } from "@/components/foundation";

/**
 * Promotor Home (design.md §16) — attention queue placeholder.
 * Real signal rows land with the mock state layer (M0.6). No KPI card grid.
 */
export default function PromotorHomePage() {
  return (
    <Container>
      <Stack gap="8">
        <PageHeader title="Beranda" description="Peserta dan aktivitas yang membutuhkan perhatian." />
        <Divider />
        <Stack gap="6">
          <SectionHeader title="Perlu perhatian" />
          <EmptyState
            title="Belum ada sinyal"
            description="Sinyal belajar peserta akan muncul di sini ketika peserta mulai mengerjakan program."
          />
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
