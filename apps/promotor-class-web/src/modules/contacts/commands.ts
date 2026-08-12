/**
 * Contacts commands (M0.6). matchOrCreateContact normalizes the phone via
 * @promotor/platform-core and reuses the canonical contact_id when the
 * normalized E.164 matches (plan §9.9, §11.5; INTEGRATION_CONTRACT §7).
 */
import { getDefaultStore } from "@/adapters/mock/mock-state-store";
import { LearnerRepository } from "@/adapters/mock/learner-repository";
import type {
  MatchOrCreateContactInput,
  MatchOrCreateContactResult,
} from "@/adapters/mock/learner-repository";
import type { ContactCommandPort } from "./ports";

export interface ContactCommandDeps {
  contacts: ContactCommandPort;
}

export function matchOrCreateContact(
  input: MatchOrCreateContactInput,
  deps?: Partial<ContactCommandDeps>
): MatchOrCreateContactResult {
  const contacts = deps?.contacts ?? new LearnerRepository(getDefaultStore());
  return contacts.matchOrCreateContact(input);
}
