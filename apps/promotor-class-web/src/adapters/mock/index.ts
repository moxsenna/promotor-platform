/**
 * Mock adapters — M0.6 scope.
 *
 * mock-state-store.ts (localStorage key promotorclass:m0:state:v1, seed if absent,
 * persist, resetDemo(), recover corrupt state), seed-state.ts, scenario.ts,
 * program/learner repositories, learning service, promotorflow adapter.
 *
 * Mock adapters consume @promotor/promotor-class-fixtures as seed source.
 * Screens must NEVER import fixtures directly — all fixture access goes
 * through these adapters.
 */
export * from "./mock-state-store";
export * from "./seed-state";
export * from "./scenario";
export * from "./next-id";
export * from "./program-repository";
export * from "./learner-repository";
export * from "./learning-service";
export * from "./promotorflow-adapter";
