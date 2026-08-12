/**
 * Enrollments queries (M0.6).
 */
import type { Enrollment, EnrollmentId, EnrollmentStatus } from "@promotor/contracts";
import { getDefaultStore } from "@/adapters/mock/mock-state-store";
import { LearnerRepository } from "@/adapters/mock/learner-repository";
import type { EnrollmentQueryPort } from "./ports";

export interface EnrollmentQueriesDeps {
  enrollments: EnrollmentQueryPort;
}

export function getEnrollmentById(
  enrollmentId: EnrollmentId,
  deps?: Partial<EnrollmentQueriesDeps>
): Enrollment | null {
  const enrollments = deps?.enrollments ?? new LearnerRepository(getDefaultStore());
  return enrollments.getEnrollmentById(enrollmentId);
}

export function getEnrollmentStatus(
  contactId: string,
  programId: string,
  deps?: Partial<EnrollmentQueriesDeps>
): EnrollmentStatus | null {
  const enrollments = deps?.enrollments ?? new LearnerRepository(getDefaultStore());
  return (
    enrollments.getEnrollmentByContactAndProgram(contactId, programId)?.status ?? null
  );
}

export function listEnrollmentsByContact(
  contactId: string,
  deps?: Partial<EnrollmentQueriesDeps>
): Enrollment[] {
  const enrollments = deps?.enrollments ?? new LearnerRepository(getDefaultStore());
  return enrollments.listEnrollmentsByContact(contactId);
}
