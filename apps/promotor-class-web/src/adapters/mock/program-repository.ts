import type { Lesson, Module, Program } from "@promotor/contracts";
import type { MockStateStore } from "./mock-state-store";

/**
 * Read-only program catalog over mock state (plan §9.6 boundary).
 *
 * Returned objects are internal state references — treat as immutable.
 * Mutations happen only through learning-service / module commands.
 */

export interface ModuleWithLessons {
  module: Module;
  lessons: Lesson[];
}

export interface CurriculumView {
  program: Program;
  modules: ModuleWithLessons[];
}

export class ProgramRepository {
  constructor(private readonly store: MockStateStore) {}

  listPrograms(): Program[] {
    return this.store.getData().programs;
  }

  listPublishedPrograms(): Program[] {
    return this.store.getData().programs.filter((p) => p.status === "published");
  }

  listPublicPublishedPrograms(): Program[] {
    return this.store
      .getData()
      .programs.filter((p) => p.status === "published" && p.accessType === "public");
  }

  getProgramById(programId: string): Program | null {
    return this.store.getData().programs.find((p) => p.id === programId) ?? null;
  }

  getProgramBySlug(slug: string): Program | null {
    return this.store.getData().programs.find((p) => p.slug === slug) ?? null;
  }

  getModuleById(moduleId: string): Module | null {
    return this.store.getData().modules.find((m) => m.id === moduleId) ?? null;
  }

  listModules(programId: string): Module[] {
    return this.store
      .getData()
      .modules.filter((m) => m.programId === programId)
      .sort((a, b) => a.position - b.position);
  }

  listLessons(programId: string): Lesson[] {
    return this.store
      .getData()
      .lessons.filter((l) => l.programId === programId)
      .sort((a, b) => a.position - b.position);
  }

  getLessonById(lessonId: string): Lesson | null {
    return this.store.getData().lessons.find((l) => l.id === lessonId) ?? null;
  }

  getCurriculum(programId: string): CurriculumView | null {
    const program = this.getProgramById(programId);
    if (!program) return null;
    const modules = this.listModules(programId).map((module) => ({
      module,
      lessons: this.store
        .getData()
        .lessons.filter((l) => l.programId === programId && l.moduleId === module.id)
        .sort((a, b) => a.position - b.position),
    }));
    return { program, modules };
  }
}
