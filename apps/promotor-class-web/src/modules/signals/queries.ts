/**
 * Signals queries (M0.6 minimum: getPromotorHomeSignals).
 *
 * Promotor Home attention queue: ACTIVE signals first, then priority desc,
 * then createdAt desc — enriched with contact name + program title so the
 * screen never touches fixtures or raw state.
 */
import type { LearningSignal } from "@promotor/contracts";
import { getDefaultStore } from "@/adapters/mock/mock-state-store";
import type { MockStateStore } from "@/adapters/mock/mock-state-store";
import { LearnerRepository } from "@/adapters/mock/learner-repository";
import { ProgramRepository } from "@/adapters/mock/program-repository";
import type { SignalContextPort, SignalsDeps } from "./ports";

export interface PromotorHomeSignalView {
  signal: LearningSignal;
  contactName: string;
  programTitle: string | null;
}

/** Enrichment context: contact lookup + program lookup over the same store. */
function createSignalContext(store: MockStateStore): SignalContextPort {
  const learners = new LearnerRepository(store);
  const programs = new ProgramRepository(store);
  return {
    getContactById: (contactId) => learners.getContactById(contactId),
    getProgramById: (programId) => programs.getProgramById(programId),
  };
}

function resolveDeps(deps?: Partial<SignalsDeps>): SignalsDeps {
  const store = getDefaultStore();
  return {
    signals: deps?.signals ?? new LearnerRepository(store),
    context: deps?.context ?? createSignalContext(store),
  };
}

function enrich(
  signal: LearningSignal,
  deps: SignalsDeps
): PromotorHomeSignalView {
  const contact = deps.context.getContactById(signal.contactId);
  const program = signal.programId ? deps.context.getProgramById(signal.programId) : null;
  return {
    signal,
    contactName: contact?.name ?? signal.contactId,
    programTitle: program?.title ?? null,
  };
}

/** Promotor Home attention queue (sorted, enriched). */
export function getPromotorHomeSignals(
  deps?: Partial<SignalsDeps>
): PromotorHomeSignalView[] {
  const resolved = resolveDeps(deps);
  return [...resolved.signals.listLearningSignals()]
    .sort((a, b) => {
      const activeDiff = Number(b.status === "ACTIVE") - Number(a.status === "ACTIVE");
      if (activeDiff !== 0) return activeDiff;
      const priorityDiff = b.priority - a.priority;
      if (priorityDiff !== 0) return priorityDiff;
      return b.createdAt.localeCompare(a.createdAt);
    })
    .map((signal) => enrich(signal, resolved));
}

/** Learner-detail signal feed for one contact (timeline uses events; this is the signal list). */
export function getSignalsByContact(
  contactId: string,
  deps?: Partial<SignalsDeps>
): PromotorHomeSignalView[] {
  const resolved = resolveDeps(deps);
  return resolved.signals
    .listLearningSignalsByContact(contactId)
    .sort((a, b) => b.priority - a.priority || b.createdAt.localeCompare(a.createdAt))
    .map((signal) => enrich(signal, resolved));
}
