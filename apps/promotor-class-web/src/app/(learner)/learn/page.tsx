import { getLearnerHome } from "@/modules/learning/queries";
import { Stack, SectionHeader, ProgressBar, TextLink, EmptyState } from "@/components/foundation";
import { LearnerContent } from "@/components/learner-shell/learner-content";

/**
 * Learner home (design.md §29) — resume learning surface.
 *
 * Shows active program(s) with progress bars and Continue buttons.
 * Imports ONLY module queries (never fixtures directly).
 * Hardcoded to contact_001 (Ayu Rahma) for M0 demo – in production this
 * comes from auth/session.
 */
const DEMO_CONTACT_ID = "contact_001";

export default async function LearnerHomePage() {
  const view = getLearnerHome(DEMO_CONTACT_ID);

  if (!view) {
    return (
      <LearnerContent>
        <Stack gap="8">
          <SectionHeader title="Belajar" />
          <EmptyState
            title="Tidak ada peserta"
            description="Data peserta belum tersedia."
          />
        </Stack>
      </LearnerContent>
    );
  }

  const { contact, enrollments } = view;

  return (
    <LearnerContent>
      <Stack gap="8">
        {/* Greeting - editorial tone per design.md §28 */}
        <p className="pc-learn-greeting">
          Halo, {contact.name.split(" ")[0]}
        </p>

        {/* Continue learning section */}
        <SectionHeader title="Lanjutkan belajar" />

        {enrollments.length === 0 ? (
          <div className="pc-learn-hero-card">
            <div className="pc-learn-hero-content">
              <h3 className="pc-learn-hero-title">Belum ada kelas</h3>
              <p className="pc-learn-hero-desc">
                Kelas yang dibagikan promotor akan muncul di sini. Mulai belajar dari program pertama Anda!
              </p>
              <div className="pc-learn-hero-icon">📚</div>
            </div>
            <button className="pc-learn-hero-cta">
              Eksplorasi program →
            </button>
          </div>
        ) : (
          <Stack gap="6">
            {enrollments.map((item) => {
              const { enrollment, program, nextLesson } = item;
              const totalLessons = 7; // prog_01 has 7 lessons
              const completedCount = Math.round(
                (enrollment.progressPercent / 100) * totalLessons
              );

              return (
                <article key={enrollment.id} className="pc-learn-enrollment-row">
                  <header className="pc-learn-enrollment-header">
                    <h3 className="pc-learn-enrollment-title">{program.title}</h3>
                    <p className="pc-learn-enrollment-meta">
                      {completedCount} dari {totalLessons} hari selesai
                    </p>
                  </header>

                  <div className="pc-learn-progress-container">
                    <ProgressBar value={enrollment.progressPercent} />
                    <p className="pc-learn-progress-text">
                      {enrollment.progressPercent}% selesai
                    </p>
                  </div>

                  {nextLesson ? (
                    <footer className="pc-learn-enrollment-footer">
                      <TextLink href={`/learn/programs/${enrollment.id}`}>
                        Lanjutkan →
                      </TextLink>
                    </footer>
                  ) : (
                    <footer className="pc-learn-enrollment-footer pc-learn-enrollment-footer--complete">
                      Kelas selesai
                    </footer>
                  )}
                </article>
              );
            })}
          </Stack>
        )}

        {/* Your programs list (all enrollments, not just active) */}
        <SectionHeader title="Program Anda" />
        {enrollments.length > 0 ? (
          <Stack gap="3">
            {enrollments.map((item) => (
              <article
                key={item.enrollment.id}
                className="pc-learn-all-program-row"
              >
                <div className="pc-learn-all-program-info">
                  <span className="pc-learn-all-program-title">
                    {item.program.title}
                  </span>
                  <span className="pc-learn-all-program-status">
                    {item.enrollment.status === "completed"
                      ? "Selesai"
                      : item.enrollment.status === "started"
                      ? "Sedang berjalan"
                      : "Terdaftar"}
                  </span>
                </div>
                <TextLink href={`/learn/programs/${item.enrollment.id}`}>
                  Lihat →
                </TextLink>
              </article>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </LearnerContent>
  );
}
