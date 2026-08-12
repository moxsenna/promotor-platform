/**
 * Signals domain — M0 boundary file.
 *
 * Canonical types live in @promotor/contracts (LearningSignal, LearningSignalType,
 * LearningSignalStatus from learning-signals.ts; LearningSignalId from ids.ts).
 *
 * M0.6 mock adapter adds signal queries (inbox/feed for Promotor Home) here.
 */
export * from "./ports";
export * from "./queries";
