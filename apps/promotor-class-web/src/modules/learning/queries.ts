/**
 * Learning queries (M0.6 minimum set: getLearnerHome, getEnrollment, getLesson).
 *
 * These are the ONLY entry points screens import for the learner experience.
 * They return plain data (contracts + fixture-local shapes re-exported here) —
 * never the store.
 */
import type { Enrollment, Lesson, Module, Program, LearningEventEnvelope } from "@promotor/contracts";
import type { ContactWithSource, LessonProgress, ReflectionResponse } from "@promotor/promotor-class-fixtures";
import { getDefaultStore } from "@/adapters/mock/mock-state-store";
import { ProgramRepository } from "@/adapters/mock/program-repository";
import { LearnerRepository } from "@/adapters/mock/learner-repository";
import { LearningService } from "@/adapters/mock/learning-service";
import type { LearningCurriculumPort, LearningLearnerPort, LearningDeps } from "./ports";

export interface LearnerHomeEnrollment {
  enrollment: Enrollment;
  program: Program;
  /** First not-yet-completed lesson of the program (null when finished). */
  nextLesson: { lesson: Lesson; completed: boolean } | null;
}

export interface LearnerHomeView {
  contact: ContactWithSource;
  enrollments: LearnerHomeEnrollment[];
}

export interface LessonDetailItem {
  lesson: Lesson;
  progress: LessonProgress | null;
  completed: boolean;
  reflection: ReflectionResponse | null;
}

export interface EnrollmentDetailView {
  enrollment: Enrollment;
  contact: ContactWithSource;
  program: Program;
  modules: { module: Module; lessons: LessonDetailItem[] }[];
}

export interface LessonDetailView {
  lesson: Lesson;
  program: Program;
  enrollment: Enrollment;
  contact: ContactWithSource;
  progress: LessonProgress | null;
  completed: boolean;
  reflection: ReflectionResponse | null;
}

/** Timeline row for the learner detail screen: event + curriculum context. */
export interface LearningTimelineItem {
  event: LearningEventEnvelope;
  lessonTitle: string | null;
  programTitle: string | null;
}

function resolveDeps(deps?: Partial<LearningDeps>): LearningDeps {
  const store = getDefaultStore();
  return {
    curriculum: deps?.curriculum ?? new ProgramRepository(store),
    learners: deps?.learners ?? new LearnerRepository(store),
    service: deps?.service ?? new LearningService(store),
  };
}

/** Learner home for one contact: identity + active enrollments with next lesson. */
export function getLearnerHome(
  contactId: string,
  deps?: Partial<LearningDeps>
): LearnerHomeView | null {
  const { curriculum, learners } = resolveDeps(deps);
  const contact = learners.getContactById(contactId);
  if (!contact) return null;

  const enrollments = learners
    .listEnrollmentsByContact(contactId)
    .filter((e) => e.status === "enrolled" || e.status === "started");

  const rows: LearnerHomeEnrollment[] = [];
  for (const enrollment of enrollments) {
    const program = curriculum.getProgramById(enrollment.programId);
    if (!program) continue;
    const progressRows = learners.listLessonProgressByEnrollment(enrollment.id);
    const lessons = curriculum.listLessons(enrollment.programId);
    const next = lessons.find((l) => {
      const row = progressRows.find((p) => p.lessonId === l.id);
      return row?.completedAt === null || row === undefined;
    });
    rows.push({
      enrollment,
      program,
      nextLesson: next ? { lesson: next, completed: false } : null,
    });
  }
  return { contact, enrollments: rows };
}

/** Full enrollment detail: enrollment + contact + program + curriculum with per-lesson state. */
export function getEnrollment(
  enrollmentId: string,
  deps?: Partial<LearningDeps>
): EnrollmentDetailView | null {
  const { curriculum, learners } = resolveDeps(deps);
  const enrollment = learners.getEnrollmentById(enrollmentId);
  if (!enrollment) return null;
  const contact = learners.getContactById(enrollment.contactId);
  const program = curriculum.getProgramById(enrollment.programId);
  if (!contact || !program) return null;

  const progressRows = learners.listLessonProgressByEnrollment(enrollment.id);
  const modules = curriculum.listModules(enrollment.programId).map((module) => ({
    module,
    lessons: curriculum
      .listLessons(enrollment.programId)
      .filter((l) => l.moduleId === module.id)
      .map((lesson) => {
        const progress = progressRows.find((p) => p.lessonId === lesson.id) ?? null;
        return {
          lesson,
          progress,
          completed: progress?.completedAt !== null && progress !== null,
          reflection: learners.getReflection(enrollment.id, lesson.id),
        };
      }),
  }));
  return { enrollment, contact, program, modules };
}

/** Single lesson with completion state + submitted reflection. */
export function getLesson(
  enrollmentId: string,
  lessonId: string,
  deps?: Partial<LearningDeps>
): LessonDetailView | null {
  const { curriculum, learners } = resolveDeps(deps);
  const enrollment = learners.getEnrollmentById(enrollmentId);
  if (!enrollment) return null;
  const lesson = curriculum.getLessonById(lessonId);
  const program = curriculum.getProgramById(enrollment.programId);
  const contact = learners.getContactById(enrollment.contactId);
  if (!lesson || !program || !contact) return null;

  const progress = learners.getLessonProgress(enrollment.id, lessonId);
  return {
    lesson,
    program,
    enrollment,
    contact,
    progress,
    completed: progress?.completedAt !== null && progress !== null,
    reflection: learners.getReflection(enrollment.id, lessonId),
  };
}

/**
 * Per-contact learning timeline (chronological asc, T6 ordering) enriched
 * with lesson/program titles so the screen never touches fixtures or state.
 */
export function listLearningTimelineByContact(
  contactId: string,
  deps?: Partial<LearningDeps>
): LearningTimelineItem[] {
  const { curriculum, learners } = resolveDeps(deps);
  return learners.listLearningEventsByContact(contactId).map((event) => {
    const lessonId = event.subject?.lessonId;
    const programId = event.subject?.programId;
    const lesson = lessonId ? curriculum.getLessonById(lessonId) : null;
    const program = programId ? curriculum.getProgramById(programId) : null;
    return {
      event,
      lessonTitle: lesson?.title ?? null,
      programTitle: program?.title ?? null,
    };
  });
}

/** Raw reflection responses for one contact (learner detail owns reflection display). */
export function listReflectionsByContact(
  contactId: string,
  deps?: Partial<LearningDeps>
): ReflectionResponse[] {
  const { learners } = resolveDeps(deps);
  return learners.listReflectionsByContact(contactId);
}
