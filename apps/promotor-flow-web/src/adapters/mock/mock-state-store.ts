/**
 * MockStateStore - Centralized mock state management (F0 milestone)
 * Persists to localStorage for demo persistence across refreshes.
 * Includes resetDemo() function for deterministic seeding.
 */

import type { Contact } from "@promotor/contracts";

// Rich TodayView item structure matching mockup requirements
export interface TodayViewItem {
  contact: Contact;
  section: "terlambat" | "hari_inis" | "berikutnya";
  statusType: "overdue" | "paid" | "pending_payment" | "aftercare" | "regular";
  timeIndicator: string; // "1 hari", "14:00", "Jumat 10:00", "Aftercare"
  serviceInfo: string; // "Parenting · Instagram", "Tes Family · Home visit"
  actionText: string; // "Tanya jadwal weekend", "DP sudah dibayar"
  hasWaButton: boolean;
  isCompleted: boolean; // Shows checkmark vs WA button
}

interface MockState {
  contacts: Contact[];
  nextActions: any[];
  bookings: any[];
  todayViewItems: TodayViewItem[];
}

const STORAGE_KEY = "promotor_flow_demo_state";

class MockStateStore {
  private state: MockState;
  private loadedFromStorage: boolean;

  constructor(initialState?: MockState) {
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

    this.state = initialState || this.getSeedData();
    this.loadedFromStorage = false;
  }

  private getSeedData(): MockState {
    return {
      contacts: this.seedContacts(),
      nextActions: [],
      bookings: [],
      todayViewItems: this.seedTodayViewItems(),
    };
  }

  private seedContacts(): Contact[] {
    return [
      {
        id: "contact_ayu" as any,
        organizationId: "org_promotor" as any,
        phoneE164: "+628121110001",
        name: "Ayu Rahma",
      },
      {
        id: "contact_arief" as any,
        organizationId: "org_promotor" as any,
        phoneE164: "+628121110004",
        name: "Arief Santoso",
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

  private seedTodayViewItems(): TodayViewItem[] {
    const contactMap = new Map<string, Contact>();
    this.seedContacts().forEach((c) => contactMap.set(c.id as string, c));

    return [
      // Terlambat section
      {
        contact: contactMap.get("contact_ayu")!,
        section: "terlambat",
        statusType: "overdue",
        timeIndicator: "1 hari",
        serviceInfo: "Parenting · Instagram",
        actionText: "Tanya jadwal weekend",
        hasWaButton: true,
        isCompleted: false,
      },
      // Hari ini section
      {
        contact: contactMap.get("contact_arief")!,
        section: "hari_inis",
        statusType: "paid",
        timeIndicator: "14:00",
        serviceInfo: "Tes Family · Home visit",
        actionText: "DP sudah dibayar",
        hasWaButton: false,
        isCompleted: true,
      },
      {
        contact: contactMap.get("contact_dimas")!,
        section: "hari_inis",
        statusType: "pending_payment",
        timeIndicator: "Jumat 10:00",
        serviceInfo: "Tes Personal · Datang ke lokasi",
        actionText: "DP belum dibayar",
        hasWaButton: true,
        isCompleted: false,
      },
      {
        contact: contactMap.get("contact_reni")!,
        section: "hari_inis",
        statusType: "aftercare",
        timeIndicator: "Aftercare",
        serviceInfo: "Klien · Tes Personal, 5 Agu",
        actionText: "Tanya pemahaman hasil",
        hasWaButton: true,
        isCompleted: false,
      },
      // Berikutnya section
      {
        contact: contactMap.get("contact_ayu")!,
        section: "berikutnya",
        statusType: "regular",
        timeIndicator: "Besok 09:00",
        serviceInfo: "Consultasi · Zoom call",
        actionText: "Konfirmasi waktu",
        hasWaButton: true,
        isCompleted: false,
      },
    ];
  }

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

  // ========== Today View Data ==========

  getTodayViewItems(): TodayViewItem[] {
    return [...this.state.todayViewItems];
  }

  getTodayViewItemsBySection(section: "terlambat" | "hari_inis" | "berikutnya"): TodayViewItem[] {
    return this.state.todayViewItems.filter((item) => item.section === section);
  }

  getOverdueCount(): number {
    return this.state.todayViewItems.filter(
      (item) => item.section === "terlambat"
    ).length;
  }

  getTotalActionCount(): number {
    return this.state.todayViewItems.length;
  }

  // ========== Utility Methods ==========

  resetDemo(): void {
    this.state = this.getSeedData();
    this.persist();
  }

  wasLoadedFromStorage(): boolean {
    return this.loadedFromStorage;
  }
}

// Export singleton instance for app-wide access
export const mockStore = new MockStateStore();

// Export class for direct instantiation if needed in tests
export { MockStateStore };
