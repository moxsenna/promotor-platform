/**
 * Enrollments domain ports (M0.6).
 */
import type { Enrollment, EnrollmentId, EnrollmentStatus } from "@promotor/contracts";
import type { EnrollContactInput, EnrollmentRef } from "@promotor/contracts";

export interface EnrollmentQueryPort {
  getEnrollmentById(enrollmentId: EnrollmentId): Enrollment | null;
  getEnrollmentByContactAndProgram(
    contactId: string,
    programId: string
  ): Enrollment | null;
  listEnrollmentsByContact(contactId: string): Enrollment[];
  listEnrollments(): Enrollment[];
}

export interface EnrollmentCommandPort {
  createEnrollment(input: EnrollContactInput): EnrollmentRef;
}

export type { EnrollmentStatus } from "@promotor/contracts";
