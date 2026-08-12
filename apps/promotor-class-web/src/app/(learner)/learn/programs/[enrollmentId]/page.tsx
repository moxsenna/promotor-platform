import { getEnrollment } from "@/modules/learning/queries";
import { Stack, SectionHeader, ProgressBar, TextLink, Divider } from "@/components/foundation";
import { LearnerContent } from "@/components/learner-shell/learner-content";
import EnrollmentPageClient from "./page-client";

type EnrollmentPageRouteProps = {
  params: Promise<{ enrollmentId: string }>;
};

/**
 * Enrollment home — curriculum view for one program (design.md §30).
 *
 * Shows module hierarchy, lesson rows with completion status, and progress bar.
 * Uses client island for completion/reflection actions.
 * Hardcoded to contact_001 (Ayu Rahma) for M0 demo.
 */
const DEMO_CONTACT_ID = "contact_001";

export default async function EnrollmentPageRoute({ params }: EnrollmentPageRouteProps) {
  const { enrollmentId } = await params;
  const view = getEnrollment(enrollmentId);

  if (!view) {
    return (
      <LearnerContent>
        <Stack gap="8">
          <SectionHeader title="Belajar" />
          <p className="pc-learn-greeting">Program tidak ditemukan.</p>
        </Stack>
      </LearnerContent>
    );
  }

  const { enrollment, contact, program, modules } = view;

  const completedCount = modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.completed).length,
    0
  );
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  // Find next incomplete lesson for "Continue" button
  let nextLesson: { moduleId: string; lessonId: string; position: number } | null = null;
  outerLoop:
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (!lesson.completed) {
        nextLesson = {
          moduleId: mod.module.id,
          lessonId: lesson.lesson.id,
          position: lesson.lesson.position,
        };
        break outerLoop;
      }
    }
  }

  return (
    <LearnerContent>
      <Stack gap="8">
        {/* Program header */}
        <header className="pc-learn-program-header">
          <h1 className="pc-learn-program-title">{program.title}</h1>
          <p className="pc-learn-program-desc">{program.description}</p>
        </header>

        {/* Progress */}
        <div className="pc-learn-enrollment-progress">
          <div className="pc-inline pc-inline--align-baseline">
            <span className="pc-learn-progress-text">
              {completedCount} dari {totalLessons} hari selesai
            </span>
            <span className="pc-inline--4 pc-inline">
              • <span className="pc-learn-progress-text">{enrollment.progressPercent}%</span>
            </span>
          </div>
          <ProgressBar value={enrollment.progressPercent} />
        </div>

        {/* Curriculum sections */}
        <SectionHeader title="Materi pembelajaran" />

        <Stack gap="6">
          {modules.map((modGroup) => {
            const { module, lessons } = modGroup;

            // Skip empty modules (e.g., reflection-only)
            if (lessons.length === 0) return null;

            return (
              <section key={module.id} className="pc-lesson-section">
                <h2 className="pc-lesson-section-title">{module.title}</h2>
                <Stack gap="3" className="pc-lesson-list">
                  {lessons.map((lessonItem) => {
                    const { lesson, completed, reflection } = lessonItem;

                    // Determine status badge
                    let statusText = "Belum mulai";
                    let statusClass = "";
                    if (completed) {
                      statusText = "Selesai";
                      statusClass = "--completed";
                    } else if (lessonItem.progress?.startedAt) {
                      statusText = "Sedang berjalan";
                      statusClass = "--in-progress";
                    } else if (lesson.type === "reflection" && !reflection) {
                      statusText = "Perlu refleksi";
                      statusClass = "--blocked";
                    }

                    return (
                      <article key={lesson.id} className={`pc-lesson-row ${statusClass}`}>
                        <div className="pc-lesson-number">Hari {lesson.position + 1}</div>

                        <div className="pc-lesson-content">
                          <h3 className="pc-lesson-title">{lesson.title}</h3>
                          <div className="pc-lesson-meta">
                            <span>{lesson.type === "video" ? "Video" : lesson.type}</span>
                            {lesson.type === "video" && lesson.videoExternalId && (
                              <>
                                <span aria-hidden>•</span>
                                <span className="pc-meta">via YouTube</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="pc-lesson-actions">
                          {completed ? (
                            <span className="pc-status pc-status--success">
                              <span className="pc-status-dot"></span>
                              Selesai
                            </span>
                          ) : (
                            <TextLink href={`/learn/programs/${enrollmentId}/lesson/${lesson.id}`}>
                              Mulai →
                            </TextLink>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </Stack>
              </section>
            );
          })}
        </Stack>

        {/* Next step / continue CTA */}
        {nextLesson ? (
          <>
            <Divider />
            <footer className="pc-learn-next-step">
              <div className="pc-learn-next-label">Langkah berikutnya</div>
              <div className="pc-inline pc-inline--align-center pc-inline--4">
                <span>Hari {nextLesson.position + 1}: Belajar lebih lanjut</span>
                <TextLink
                  href={`/learn/programs/${enrollmentId}/lesson/${nextLesson.lessonId}`}
                >
                  Lanjutkan →
                </TextLink>
              </div>
            </footer>
          </>
        ) : (
          <footer className="pc-learn-complete-footer">
            <p className="pc-learn-complete-text">Selamat! Program selesai.</p>
            <TextLink href="/learn">Kembali ke Beranda Belajar</TextLink>
          </footer>
        )}
      </Stack>

      {/* Client island for completion actions */}
      <EnrollmentPageClient />
    </LearnerContent>
  );
}
