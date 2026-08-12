import {
  learningActivities,
  contacts,
  enrollments,
  learningEvents,
  learningSignals,
  lessonProgress,
  lessons,
  modules,
  organization,
  programs,
  promotorPublicProfile,
  promotorUser,
  reflections,
} from "@promotor/promotor-class-fixtures";
import type {
  ContactWithSource,
  LessonProgress,
  PromotorPublicProfile,
  ReflectionResponse,
} from "@promotor/promotor-class-fixtures";
import type {
  Enrollment,
  FlowContactContext,
  FlowNextActionRef,
  LearningActivityProjection,
  LearningEventEnvelope,
  LearningNextActionRequest,
  LearningSignal,
  Lesson,
  Module,
  Organization,
  Program,
  User,
} from "@promotor/contracts";
import { capabilitiesForScenario, DEFAULT_SCENARIO } from "./scenario";
import type { ScenarioCapabilities } from "./scenario";

/**
 * Full mock state contents (plan §9.2) — the only place the store's data
 * shape is defined. Everything is a deep clone of the deterministic fixture
 * seeds (fixtures are static consts by design; the store must OWN mutable
 * copies so demo mutations never touch the fixture module itself).
 *
 * "Do not model the future database exactly" — this is simulator state.
 */

/** M0 mock integration queue (plan §9.13 "Sync queued"). Not a canonical Flow NextAction. */
export type IntegrationQueueItem =
  | {
      id: string;
      kind: "NEXT_ACTION";
      input: LearningNextActionRequest;
      reason: "NOT_ENTITLED" | "HEALTH_UNAVAILABLE";
      createdAt: string;
    }
  | {
      id: string;
      kind: "ACTIVITY";
      input: LearningActivityProjection;
      reason: "NOT_ENTITLED" | "HEALTH_UNAVAILABLE";
      createdAt: string;
    };

/** Static workspace identity (org, promotor user, public landing copy). */
export interface WorkspaceState {
  organization: Organization;
  promotorUser: User;
  promotorPublicProfile: PromotorPublicProfile;
}

export interface MockStateData {
  /** Derived from the active demo scenario (CLASS_ONLY / BUNDLE_*). */
  capabilities: ScenarioCapabilities;
  workspace: WorkspaceState;
  contacts: ContactWithSource[];
  programs: Program[];
  modules: Module[];
  lessons: Lesson[];
  enrollments: Enrollment[];
  lessonProgress: LessonProgress[];
  reflections: ReflectionResponse[];
  learningEvents: LearningEventEnvelope[];
  learningSignals: LearningSignal[];
  /** Activity projections already reported to Flow (INTEGRATION_CONTRACT §30). */
  flowActivities: LearningActivityProjection[];
  /** NextAction refs created via PromotorFlowAdapter.createNextAction (§12). */
  flowNextActions: FlowNextActionRef[];
  /** Flow contact context by contact id (INTEGRATION_CONTRACT §14). */
  flowContext: Record<string, FlowContactContext>;
  /** Work queued while the Flow integration was unavailable (§9.13). */
  integrationQueue: IntegrationQueueItem[];
}

export function seedMockState(): MockStateData {
  return {
    capabilities: capabilitiesForScenario(DEFAULT_SCENARIO),
    workspace: {
      organization: structuredClone(organization) as Organization,
      promotorUser: structuredClone(promotorUser) as User,
      promotorPublicProfile: structuredClone(promotorPublicProfile),
    },
    contacts: structuredClone(contacts),
    programs: structuredClone(programs) as Program[],
    modules: structuredClone(modules) as Module[],
    lessons: structuredClone(lessons) as Lesson[],
    enrollments: structuredClone(enrollments) as Enrollment[],
    lessonProgress: structuredClone(lessonProgress),
    reflections: structuredClone(reflections),
    learningEvents: structuredClone(learningEvents) as LearningEventEnvelope[],
    learningSignals: structuredClone(learningSignals) as LearningSignal[],
    flowActivities: structuredClone(learningActivities) as unknown as LearningActivityProjection[],
    flowNextActions: [],
    flowContext: {},
    integrationQueue: [],
  };
}
