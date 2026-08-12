/**
 * Signals domain ports (M0.6). Promotor Home reads through these.
 */
import type { ContactWithSource } from "@promotor/promotor-class-fixtures";
import type { LearningSignal, Program } from "@promotor/contracts";

export interface SignalQueryPort {
  listLearningSignals(): LearningSignal[];
  listLearningSignalsByContact(contactId: string): LearningSignal[];
}

export interface SignalContextPort {
  getContactById(contactId: string): ContactWithSource | null;
  getProgramById(programId: string): Program | null;
}

export interface SignalsDeps {
  signals: SignalQueryPort;
  context: SignalContextPort;
}
