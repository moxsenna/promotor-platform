import { getProgramById } from "@/modules/programs/queries";
import { Container, SectionHeader, TextLink, Stack, Divider } from "@/components/foundation";
import RegistrationFormClient from "./page-client";
import { getWorkspace } from "@/modules/organizations/queries";

type PublicProgramPageProps = {
  params: Promise<{ workspaceSlug: string; programSlug: string }>;
};

/**
 * Public program landing + registration (design.md §51 screen 15).
 *
 * Mobile-first acquisition page showing:
 * - Program identity/value prop
 * - Curriculum preview
 * - Promotor identity ("Rina Maharani dari Rina Learning Studio")
 * - Registration form with E.164 phone normalization
 * - Privacy copy (no narrower promises than platform performs)
 *
 * On success → redirects to /learn/programs/[enrollmentId].
 */
export default async function PublicProgramPage({ params }: PublicProgramPageProps) {
  const { programSlug } = await params;

  // Get workspace identity (promotor name/headline/city/instagram) via module query layer
  const workspace = getWorkspace();
  
  // Find program by slug (fixtures use prog_01's slug for "7-hari-mengenal-cara-belajar-anak")
  const PROGRAM_SLUGS: Record<string, string> = {
    "7-hari-mengenal-cara-belajar-anak": "prog_01",
    "30-hari-setelah-tes": "prog_02",
    "parenting-growth-program": "prog_03",
    "7-hari-memahami-potensi-remaja": "prog_04",
  };

  const programId = PROGRAM_SLUGS[programSlug];
  if (!programId) {
    return (
      <div className="pc-page-frame">
        <Container size="narrow">
          <Stack gap="8">
            <TextLink href="/" standalone>← Beranda</TextLink>
            <SectionHeader title="Program tidak ditemukan" />
            <p>Program dengan slug tersebut tidak tersedia.</p>
            <TextLink href="/">Kembali ke beranda</TextLink>
          </Stack>
        </Container>
      </div>
    );
  }

  const program = getProgramById(programId);
  if (!program) {
    return (
      <div className="pc-page-frame">
        <Container size="narrow">
          <Stack gap="8">
            <TextLink href="/" standalone>← Beranda</TextLink>
            <SectionHeader title="Program tidak ditemukan" />
            <p>Program tidak dapat dimuat.</p>
          </Stack>
        </Container>
      </div>
    );
  }

  // Get curriculum preview (first module only, first 3 lessons)
  const modulesPreview = [];
  const lessonsPreview: { moduleId: string; lessonId: string; title: string; type: string }[] = [];

  // For demo path B, we only show prog_01's first module as curriculum preview
  try {
    const { getProgramDetail } = await import("@/modules/programs/queries");
    const detail = getProgramDetail(programId);
    if (detail?.modules && detail.modules.length > 0) {
      const firstModule = detail.modules[0];
      if (firstModule && firstModule.lessons && firstModule.lessons.length > 0) {
        lessonsPreview.push(
          ...firstModule.lessons.slice(0, 3).map((l, idx) => ({
            moduleId: firstModule.module.id,
            lessonId: l.id,
            title: l.title,
            type: l.type,
          }))
        );
      }
    }
  } catch {
    // Fallback: no curriculum preview if queries fail
  }

  return (
    <div className="pc-public-page-frame">
      {/* Top nav */}
      <header className="pc-public-header">
        <Container size="narrow">
          <TextLink href="/" standalone>← Beranda</TextLink>
        </Container>
      </header>

      <Container size="wide" className="pc-public-container">
        <Stack gap="8">
          {/* Hero section */}
          <section className="pc-public-hero">
            <h1 className="pc-public-title">{program.title}</h1>
            <p className="pc-public-desc">{program.description}</p>
          </section>

          {/* Promotor identity */}
          <section className="pc-public-promotor">
            <h2 className="pc-public-promotor-title">Dari</h2>
            <div className="pc-public-promotor-card">
              <div className="pc-public-promotor-name">{workspace.promotorPublicProfile.name}</div>
              <div className="pc-public-promotor-role">{workspace.promotorPublicProfile.headline}</div>
              <div className="pc-public-promotor-org">
                dari {workspace.organization.name}
              </div>
            </div>
          </section>

          {/* Curriculum preview */}
          <section className="pc-public-curriculum">
            <SectionHeader title="Ringkasan materi" />
            {lessonsPreview.length > 0 ? (
              <Stack gap="1" className="pc-public-curriculum-list">
                {lessonsPreview.map((lesson, idx) => (
                  <div key={idx} className="pc-public-curriculum-item">
                    <span className="pc-public-curriculum-number">Hari {idx + 1}</span>
                    <span className="pc-public-curriculum-title">{lesson.title}</span>
                    <span className={`pc-public-curriculum-type pc-public-curriculum-type--${lesson.type}`}>
                      {lesson.type === "video" ? "Video" : lesson.type === "reflection" ? "Refleksi" : "Artikel"}
                    </span>
                  </div>
                ))}
              </Stack>
            ) : (
              <p className="pc-public-curriculum-empty">Materi akan ditampilkan setelah mendaftar.</p>
            )}
          </section>

          {/* Registration form */}
          <Divider />
          <section className="pc-public-registration">
            <SectionHeader title="Daftar kelas ini" />
            <p className="pc-public-register-desc">
              Isi nama dan nomor telepon untuk memulai belajar. Kami akan menghubungi Anda melalui WhatsApp jika diperlukan.
            </p>
            <RegistrationFormClient
              organizationId={workspace.organization.id}
              programId={programId}
              programTitle={program.title}
            />
          </section>

          {/* Privacy copy - matches platform behavior, not narrower */}
          <footer className="pc-public-footer">
            <p className="pc-public-privacy">
              Data yang Anda berikan digunakan untuk enrollmen pembelajaran dan komunikasi terkait program.
              Nomor telepon akan disimpan sesuai standar E.164. Tidak ada janji penggunaan data yang lebih terbatas
              dari yang sudah ditetapkan dalam kebijakan privasi platform.
            </p>
          </footer>
        </Stack>
      </Container>
    </div>
  );
}
