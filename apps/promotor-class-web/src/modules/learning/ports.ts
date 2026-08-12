/**
 * Learning domain ports (M0.6 boundary).
 *
 * The learning module composes three adapter surfaces: curriculum reads
 * (programs), learner data reads (contacts/enrollments/progress/reflections)
 * and the learning service (completion + reflection mutations). Screens only
 * ever import this module's queries/commands.
 */
import type { Enrollment, Lesson, Module, Program } from "@promotor/contracts";
import type { ContactWithSource, LessonProgress, ReflectionResponse } from "@promotor/promotor-class-fixtures";
import type {
  CompleteLessonInput,
  CompleteLessonResult,
  SubmitReflectionInput,
  SubmitReflectionResult,
} from "@/adapters/mock/learning-service";

export interface LearningCurriculumPort {
  getProgramById(programId: string): Program | null;
  listModules(programId: string): Module[];
  listLessons(programId: string): Lesson[];
  getLessonById(lessonId: string): Lesson | null;
}

export interface LearningLearnerPort {
  getContactById(contactId: string): ContactWithSource | null;
  getEnrollmentById(enrollmentId: string): Enrollment | null;
  listEnrollmentsByContact(contactId: string): Enrollment[];
  listLessonProgressByEnrollment(enrollmentId: string): LessonProgress[];
  getLessonProgress(enrollmentId: string, lessonId: string): LessonProgress | null;
  getReflection(enrollmentId: string, lessonId: string): ReflectionResponse | null;
}

export interface LearningServicePort {
  completeLesson(input: CompleteLessonInput): CompleteLessonResult;
  submitReflection(input: SubmitReflectionInput): SubmitReflectionResult;
}

export interface LearningDeps {
  curriculum: LearningCurriculumPort;
  learners: LearningLearnerPort;
  service: LearningServicePort;
}
