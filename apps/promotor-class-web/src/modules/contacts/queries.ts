/**
 * Contacts queries (M0.6). Contact identity is canonical shared-platform
 * state (INTEGRATION_CONTRACT §7 §9) — Contact schema imported from
 * @promotor/contracts, never redefined. Fixture-local source field reaches
 * screens through these queries only.
 */
import type { ContactId } from "@promotor/contracts";
import type { ContactWithSource } from "@promotor/promotor-class-fixtures";
import { getDefaultStore } from "@/adapters/mock/mock-state-store";
import { LearnerRepository } from "@/adapters/mock/learner-repository";
import type { ContactQueryPort } from "./ports";

export interface ContactQueriesDeps {
  contacts: ContactQueryPort;
}

export function listContacts(deps?: Partial<ContactQueriesDeps>): ContactWithSource[] {
  const contacts = deps?.contacts ?? new LearnerRepository(getDefaultStore());
  return contacts.listContacts();
}

export function getContact(
  contactId: ContactId,
  deps?: Partial<ContactQueriesDeps>
): ContactWithSource | null {
  const contacts = deps?.contacts ?? new LearnerRepository(getDefaultStore());
  return contacts.getContactById(contactId);
}

/** Canonical E.164 lookup (normalize input first via platform-core normalizePhone). */
export function findContactByPhone(
  phoneE164: string,
  deps?: Partial<ContactQueriesDeps>
): ContactWithSource | null {
  const contacts = deps?.contacts ?? new LearnerRepository(getDefaultStore());
  return contacts.findContactByPhone(phoneE164);
}
