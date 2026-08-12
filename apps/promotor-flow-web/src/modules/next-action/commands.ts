/**
 * NextAction Commands - Write Operations (Module Pattern)
 * 
 * Commands are write operations that cause side effects.
 * Following implementation-plan-v1.md §2.3: commands should validate input,
 * depend on port abstractions, and return results or throw errors.
 */

import type { NextActionPort, ContactLookupPort, ActivityLogPort } from "./ports";

/**
 * Command: createNextAction
 * Creates a new next action for a contact
 */
export async function createNextAction(
  input: any, // CreateNextActionInput will be typed when contract available
  actionPort: NextActionPort,
  logPort?: ActivityLogPort
): Promise<string> {
  // Validation (stubbed until full contract)
  if (!input.contactId || !input.type || !input.title) {
    throw new Error("Missing required fields: contactId, type, title");
  }

  const actionId = await actionPort.createNextAction(input);

  // Log activity if port is available
  if (logPort && input.contactId) {
    logPort.logCreateNextAction(input.contactId, actionId);
  }

  return actionId;
}

/**
 * Command: completeNextAction
 * Marks a next action as completed
 */
export async function completeNextAction(
  actionId: string,
  contactId: string,
  actionPort: NextActionPort,
  logPort?: ActivityLogPort
): Promise<void> {
  if (!actionId) {
    throw new Error("Action ID required");
  }

  await actionPort.completeNextAction(actionId);

  if (logPort && contactId) {
    logPort.logCompleteNextAction(contactId, actionId);
  }
}

/**
 * Command: updateNextAction
 * Updates an existing next action (M0 stub)
 */
export async function updateNextAction(
  actionId: string,
  updates: Partial<any>,
  actionPort: NextActionPort
): Promise<void> {
  // Stubbed - M0 doesn't have update method yet per contracts
  console.log("Command: updateNextAction", { actionId, updates });
}

/**
 * Command: deleteNextAction
 * Deletes a next action (M0 stub)
 */
export async function deleteNextAction(
  actionId: string,
  contactId: string,
  actionPort: NextActionPort,
  logPort?: ActivityLogPort
): Promise<void> {
  // Stubbed - M0 deliberately has no delete methods per integration-contract
  console.log("Command: deleteNextAction", { actionId, contactId });
}
