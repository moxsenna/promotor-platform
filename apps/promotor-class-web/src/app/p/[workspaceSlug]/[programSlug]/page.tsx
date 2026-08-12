import { Container, PageHeader, Stack, TextLink } from "@/components/foundation";

type PublicProgramPageProps = {
  params: Promise<{ workspaceSlug: string; programSlug: string }>;
};

/** Public program landing (design.md §51 screen 15) — acquisition page.
    Program content and registration land with the mock state layer. */
export default async function PublicProgramPage({ params }: PublicProgramPageProps) {
  const { programSlug } = await params;
  return (
    <div className="pc-page-frame">
      <Container size="narrow">
        <Stack gap="8">
          <TextLink href="/" standalone>
            ← Beranda
          </TextLink>
          <PageHeader
            title={programSlug}
            description="Halaman publik program. Materi dan pendaftaran akan ditampilkan di sini."
          />
        </Stack>
      </Container>
    </div>
  );
}
