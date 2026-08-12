import type { Metadata } from "next";

import {
  Container,
  Divider,
  EmptyState,
  PageHeader,
  Stack,
} from "@/components/foundation";

export const metadata: Metadata = {
  title: "Template",
};

/**
 * Follow-up templates (design.md §27). The module layer has no template
 * query in M0, so this page renders the honest empty state instead of
 * fabricating rows (no-fake-functionality rule).
 */
export default function TemplatesPage() {
  return (
    <Container>
      <Stack gap="8">
        <PageHeader
          title="Template"
          description="Template pesan follow-up untuk peserta."
        />
        <Divider />
        <EmptyState
          title="Belum ada template"
          description="Template pesan follow-up akan tampil di sini."
        />
      </Stack>
    </Container>
  );
}
