import type { Metadata } from "next";

import {
  Container,
  Divider,
  EmptyState,
  PageHeader,
  Stack,
} from "@/components/foundation";

export const metadata: Metadata = {
  title: "Aktivitas",
};

/**
 * Activity feed (design.md §25). The module layer has no activity query in
 * M0 (fixture projections exist but are not exposed through any module
 * boundary), so this page renders the honest empty state instead of
 * fabricating rows (no-fake-functionality rule).
 */
export default function ActivityPage() {
  return (
    <Container>
      <Stack gap="8">
        <PageHeader
          title="Aktivitas"
          description="Riwayat aktivitas belajar peserta."
        />
        <Divider />
        <EmptyState
          title="Belum ada aktivitas"
          description="Aktivitas peserta akan tampil di sini."
        />
      </Stack>
    </Container>
  );
}
