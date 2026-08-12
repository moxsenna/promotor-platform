/**
 * NextAction Queries - Read Operations (Module Pattern)
 * 
 * Queries are read-only operations that return data without side effects.
 * Following implementation-plan-v1.md §2.3: queries should be pure functions
 * that depend on port abstractions.
 */

import type { NextActionPort, ContactLookupPort } from "./ports";

/**
 * Query: getPendingActionsForContact
 * Returns all pending next actions for a specific contact
 */
export async function getPendingActionsForContact(
  contactId: string,
  actionPort: NextActionPort
): Promise<any[]> {
  // Stubbed until NextAction contract available and adapter implemented
  // In production this would call: return await actionPort.getPendingActionsForContact(contactId);
  console.log("Query: getPendingActionsForContact", { contactId });
  return [];
}

/**
 * Query: listAllNextActions
 * Returns paginated list of all next actions with filters
 */
export async function listAllNextActions({
  status,
  priority,
  limit = 50,
  offset = 0,
}: {
  status?: "PENDING" | "COMPLETED" | "OVERDUE";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  limit?: number;
  offset?: number;
}, actionPort: NextActionPort): Promise<{
  items: any[];
  total: number;
}> {
  // Stubbed
  console.log("Query: listAllNextActions", { status, priority, limit, offset });
  return { items: [], total: 0 };
}

/**
 * Query: getNextActionById
 * Fetches single next action by ID
 */
export async function getNextActionById(
  actionId: string,
  actionPort: NextActionPort
): Promise<any | null> {
  // Stubbed
  console.log("Query: getNextActionById", { actionId });
  return null;
}

/**
 * Query: getContactContextWithActions
 * Joins contact data with their next actions (requires both ports)
 */
export async function getContactContextWithActions(
  contactId: string,
  contactPort: ContactLookupPort,
  actionPort: NextActionPort
): Promise<{
  contact: any;
  actions: any[];
  upcomingDueDate: string | null;
} | null> {
  const contact = contactPort.getContactById(contactId);
  if (!contact) return null;

  const actions = await actionPort.getPendingActionsForContact(contactId);

  return {
    contact,
    actions,
    upcomingDueDate: actions.length > 0 ? actions[0].dueAt || null : null,
  };
}
