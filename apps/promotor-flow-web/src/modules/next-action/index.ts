/**
 * NextAction Module - Public API
 * 
 * Following implementation-plan-v1.md §2.4: each module exports a clean public API
 * that hides internal implementation details. Consumers import from here only.
 */

export type { NextActionItem, CreateNextActionInput } from "./ports";
export { getPendingActionsForContact, listAllNextActions, getNextActionById, getContactContextWithActions } from "./queries";
export { createNextAction, completeNextAction, updateNextAction, deleteNextAction } from "./commands";
export { mockNextActionAdapter } from "./mock-next-action-adapter";
