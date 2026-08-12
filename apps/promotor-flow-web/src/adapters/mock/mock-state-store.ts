/**
 * MockStateStore - Centralized mock state management (F0 milestone)
 * Persists to localStorage for demo persistence across refreshes.
 * Includes resetDemo() function for deterministic seeding.
 */

import type { Contact } from "@promotor/contracts";

// Define our state interface matching Flow domain
interface MockState {
  contacts: Contact[];
  nextActions: any[]; // Will be properly typed when NextAction contract available
  bookings: any[];     // Will be properly typed when Booking contract available
}

const STORAGE_KEY = "promotor_flow_demo_state";

class MockStateStore {
  private state: MockState;
  private loadedFromStorage: boolean;

  constructor(initialState?: MockState) {
    // Try to load from localStorage first (only in browser)
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          this.state = JSON.parse(stored);
          this.loadedFromStorage = true;
          return;
        } catch (error) {
          console.warn("Failed to parse localStorage state, using seed", error);
        }
      }
    }

    // Load seed data if not loaded from storage
    this.state = initialState || this.getSeedData();
    this.loadedFromStorage = false;
  }

  /**
   * Get initial seed data for fresh demos
   */
  private getSeedData(): MockState {
    return {
      contacts: this.seedContacts(),
      nextActions: [],
      bookings: [],
    };
  }

  /**
   * Seed contacts with deterministic data
   * Uses same contact IDs as promotor-class fixtures for integration testing
   */
  private seedContacts(): Contact[] {
    return [
      {
        id: "contact_ayu" as any,
        organizationId: "org_promotor" as any,
        phoneE164: "+628121110001",
        name: "Ayu Rahma",
      },
      {
        id: "contact_dimas" as any,
        organizationId: "org_promotor" as any,
        phoneE164: "+628121110002",
        name: "Dimas Prakoso",
      },
      {
        id: "contact_reni" as any,
        organizationId: "org_promotor" as any,
        phoneE164: "+628121110003",
        name: "Reni Wulandari",
      },
    ];
  }

  /**
   * Persist current state to localStorage
   */
  persist(): void {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.error("Failed to persist state to localStorage", error);
    }
  }

  // ========== CRUD Operations ==========

  getContacts(): Contact[] {
    return [...this.state.contacts];
  }

  getContactById(id: string): Contact | undefined {
    return this.state.contacts.find((c) => c.id === id);
  }

  addContact(contact: Contact): Contact {
    this.state.contacts.push(contact);
    this.persist();
    return contact;
  }

  updateContact(
    id: string,
    updates: Partial<Omit<Contact, "id" | "organizationId">>
  ): Contact | undefined {
    const index = this.state.contacts.findIndex((c) => c.id === id);
    if (index === -1) return undefined;

    this.state.contacts[index] = {
      ...this.state.contacts[index],
      ...updates,
    };

    this.persist();
    return this.state.contacts[index];
  }

  deleteContact(id: string): boolean {
    const index = this.state.contacts.findIndex((c) => c.id === id);
    if (index === -1) return false;

    this.state.contacts.splice(index, 1);
    this.persist();
    return true;
  }

  // ========== Utility Methods ==========

  /**
   * Reset to deterministic seed data
   * Useful for demo mode restoration
   */
  resetDemo(): void {
    this.state = this.getSeedData();
    this.persist();
  }

  /**
   * Check if state was loaded from storage or seeded fresh
   */
  wasLoadedFromStorage(): boolean {
    return this.loadedFromStorage;
  }
}

// Export singleton instance for app-wide access
export const mockStore = new MockStateStore();

// Export class for direct instantiation if needed in tests
export { MockStateStore };
