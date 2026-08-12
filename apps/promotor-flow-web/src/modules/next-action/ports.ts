/**
 * NextAction Ports - Dependency Injection Interfaces (Module Pattern)
 * 
 * Defines contracts for external services that NextAction depends on.
 * Following implementation-plan-v1.md §2.2: modules should depend on abstractions,
 * not concretions. These ports will be implemented by adapters later.
 */

import type { Contact } from "@promotor/contracts";

/**
 * Port: NextActionStore
 * Contract for persistent storage of next actions
 * M0 stubbed with mock store until NextAction contract available
 */
export interface NextActionPort {
  getPendingActionsForContact(contactId: string): Promise<NextActionItem[]>;
  createNextAction(input: CreateNextActionInput): Promise<string>; // returns action ID
  completeNextAction(actionId: string): Promise<void>;
}

/**
 * Port: ContactLookup
 * Contract for retrieving contact context
 */
export interface ContactLookupPort {
  getContactById(contactId: string): Contact | undefined;
}

/**
 * Port: ActivityLogger
 * Contract for logging user activities
 */
export interface ActivityLogPort {
  logCreateNextAction(contactId: string, actionId: string): void;
  logCompleteNextAction(contactId: string, actionId: string): void;
}

// Type definitions (will move to contracts when available)
export interface NextActionItem {
  id: string;
  contactId: string;
  type: "FOLLOW_UP" | "MANUAL" | "ASSESSMENT";
  title: string;
  description?: string;
  dueAt: string | null;
  status: "PENDING" | "COMPLETED" | "OVERDUE";
  createdAt: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
}

export interface CreateNextActionInput {
  contactId: string;
  type: "FOLLOW_UP" | "MANUAL" | "ASSESSMENT";
  title: string;
  description?: string;
  dueAt: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
}
