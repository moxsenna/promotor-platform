/**
 * Contacts domain ports (M0.6 boundary).
 *
 * Screens never import mock adapters or fixtures directly — they go through
 * these ports. The mock LearnerRepository satisfies them structurally; a real
 * HTTP implementation can later implement the same interfaces.
 */
import type { ContactId } from "@promotor/contracts";
import type { ContactWithSource } from "@promotor/promotor-class-fixtures";
import type {
  MatchOrCreateContactInput,
  MatchOrCreateContactResult,
} from "@/adapters/mock/learner-repository";

export interface ContactQueryPort {
  listContacts(): ContactWithSource[];
  getContactById(contactId: ContactId): ContactWithSource | null;
  findContactByPhone(phoneE164: string): ContactWithSource | null;
}

export interface ContactCommandPort {
  matchOrCreateContact(input: MatchOrCreateContactInput): MatchOrCreateContactResult;
}
