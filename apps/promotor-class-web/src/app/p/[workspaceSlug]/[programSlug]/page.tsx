import { ScaffoldNote } from "@/components/scaffold-note";

type PublicProgramPageProps = {
  params: Promise<{ workspaceSlug: string; programSlug: string }>;
};

export default async function PublicProgramPage({ params }: PublicProgramPageProps) {
  const { workspaceSlug, programSlug } = await params;
  return (
    <ScaffoldNote
      route={`/p/${workspaceSlug}/${programSlug}`}
      title="Public program landing"
      note={`Workspace "${workspaceSlug}", program "${programSlug}". Scaffold route — the acquisition landing page lands with the mock state layer.`}
    />
  );
}
