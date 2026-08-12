/**
 * Programs queries (M0.6): catalog, public landing, curriculum detail.
 */
import type { Lesson, Program } from "@promotor/contracts";
import { getDefaultStore } from "@/adapters/mock/mock-state-store";
import { ProgramRepository } from "@/adapters/mock/program-repository";
import type { CurriculumView } from "@/adapters/mock/program-repository";
import type { ProgramCatalogPort } from "./ports";

export interface ProgramQueriesDeps {
  catalog: ProgramCatalogPort;
}

export function getProgramBySlug(
  slug: string,
  deps?: Partial<ProgramQueriesDeps>
): Program | null {
  const catalog = deps?.catalog ?? new ProgramRepository(getDefaultStore());
  return catalog.getProgramBySlug(slug);
}

export function getProgramById(
  programId: string,
  deps?: Partial<ProgramQueriesDeps>
): Program | null {
  const catalog = deps?.catalog ?? new ProgramRepository(getDefaultStore());
  return catalog.getProgramById(programId);
}

/** Public landing catalog: published + accessType public only. */
export function listPublicPrograms(deps?: Partial<ProgramQueriesDeps>): Program[] {
  const catalog = deps?.catalog ?? new ProgramRepository(getDefaultStore());
  return catalog.listPublicPublishedPrograms();
}

/** Program + modules + lessons (curriculum preview for /p and /learn). */
export function getProgramDetail(
  programId: string,
  deps?: Partial<ProgramQueriesDeps>
): CurriculumView | null {
  const catalog = deps?.catalog ?? new ProgramRepository(getDefaultStore());
  return catalog.getCurriculum(programId);
}

export function getLessonById(
  lessonId: string,
  deps?: Partial<ProgramQueriesDeps>
): Lesson | null {
  const catalog = deps?.catalog ?? new ProgramRepository(getDefaultStore());
  return catalog.getLessonById(lessonId);
}
