/**
 * Programs domain ports (M0.6).
 */
import type { Lesson, Program } from "@promotor/contracts";
import type { CurriculumView } from "@/adapters/mock/program-repository";

export interface ProgramCatalogPort {
  listPrograms(): Program[];
  listPublishedPrograms(): Program[];
  listPublicPublishedPrograms(): Program[];
  getProgramById(programId: string): Program | null;
  getProgramBySlug(slug: string): Program | null;
  getLessonById(lessonId: string): Lesson | null;
  getCurriculum(programId: string): CurriculumView | null;
}

export type { CurriculumView } from "@/adapters/mock/program-repository";
