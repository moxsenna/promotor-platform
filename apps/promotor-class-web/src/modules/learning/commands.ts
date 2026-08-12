/**
 * Learning commands (M0.6 minimum set: completeLesson, submitReflection).
 *
 * Demo path A2 lives here: lesson completion → progress recalc → learning
 * event → signal rule → Promotor Home changes.
 */
import { getDefaultStore } from "@/adapters/mock/mock-state-store";
import { LearningService } from "@/adapters/mock/learning-service";
import type {
  CompleteLessonInput,
  CompleteLessonResult,
  SubmitReflectionInput,
  SubmitReflectionResult,
} from "@/adapters/mock/learning-service";
import type { LearningServicePort } from "./ports";

export interface LearningCommandDeps {
  service: LearningServicePort;
}

export function completeLesson(
  input: CompleteLessonInput,
  deps?: Partial<LearningCommandDeps>
): CompleteLessonResult {
  const service = deps?.service ?? new LearningService(getDefaultStore());
  return service.completeLesson(input);
}

export function submitReflection(
  input: SubmitReflectionInput,
  deps?: Partial<LearningCommandDeps>
): SubmitReflectionResult {
  const service = deps?.service ?? new LearningService(getDefaultStore());
  return service.submitReflection(input);
}
