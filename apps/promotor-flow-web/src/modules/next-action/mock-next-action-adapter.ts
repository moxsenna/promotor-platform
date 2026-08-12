/**
 * NextAction In-Memory Adapter (M0)
 * Temporary in-memory storage for development/testing
 * Will be replaced with real DB integration later
 */

import type { NextActionPort, CreateNextActionInput } from "./ports";

class MockNextActionAdapter implements NextActionPort {
  private actions: any[] = [];

  async getPendingActionsForContact(contactId: string): Promise<any[]> {
    return this.actions.filter(
      (a) => a.contactId === contactId && a.status === "PENDING"
    );
  }

  async createNextAction(input: CreateNextActionInput): Promise<string> {
    const actionId = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const action: any = {
      id: actionId,
      ...input,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    this.actions.push(action);
    console.log("MockNextActionAdapter: created action", action);
    
    return actionId;
  }

  async completeNextAction(actionId: string): Promise<void> {
    const index = this.actions.findIndex((a) => a.id === actionId);
    if (index === -1) {
      throw new Error(`Action ${actionId} not found`);
    }

    this.actions[index].status = "COMPLETED";
    console.log("MockNextActionAdapter: completed action", actionId);
  }
}

// Export singleton instance
export const mockNextActionAdapter = new MockNextActionAdapter();
