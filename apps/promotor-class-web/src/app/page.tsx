import type { Metadata } from "next";

import { Container, PageHeader, Stack, TextLink } from "@/components/foundation";

export const metadata: Metadata = {
  title: "PromotorClass",
};

export default function HomePage() {
  return (
    <div className="pc-page-frame">
      <Container size="narrow">
        <Stack gap="8">
          <PageHeader title="PromotorClass" description="Kelas yang dikelola promotor untuk peserta belajar." />
          <Stack gap="4">
            <TextLink href="/app" standalone>
              Promotor workspace
            </TextLink>
            <TextLink href="/learn" standalone>
              Learner experience
            </TextLink>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
