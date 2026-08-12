/**
 * Enrollments commands (M0.6). Idempotent per (contactId, programId):
 * re-enrolling the same contact+program returns the existing ref without a
 * duplicate learner.enrolled event.
 */
import type { EnrollContactInput, EnrollmentRef } from "@promotor/contracts";
import { getDefaultStore } from "@/adapters/mock/mock-state-store";
import { LearnerRepository } from "@/adapters/mock/learner-repository";
import type { EnrollmentCommandPort } from "./ports";

export interface EnrollmentCommandDeps {
  enrollments: EnrollmentCommandPort;
}

export function enrollContact(
  input: EnrollContactInput,
  deps?: Partial<EnrollmentCommandDeps>
): EnrollmentRef {
  const enrollments = deps?.enrollments ?? new LearnerRepository(getDefaultStore());
  return enrollments.createEnrollment(input);
}
