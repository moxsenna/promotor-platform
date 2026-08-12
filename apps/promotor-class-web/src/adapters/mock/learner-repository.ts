import type {
  ContactId,
  Enrollment,
  EnrollmentId,
  EnrollmentRef,
  EnrollContactInput,
  LearningEventEnvelope,
  LearningSignal,
  OrganizationId,
} from "@promotor/contracts";
import { normalizePhone } from "@promotor/platform-core";
import type { ContactWithSource, LessonProgress, ReflectionResponse } from "@promotor/promotor-class-fixtures";
import type { MockStateStore } from "./mock-state-store";
import { brandId, nextSequentialId } from "./next-id";

/**
 * Learner data + identity matching over mock state (plan §9.6 boundary).
 *
 * Contact identity follows INTEGRATION_CONTRACT §7/§9: organization_id +
 * phone_e164, phones stored as canonical E.164; matching normalizes input
 * through @promotor/platform-core normalizePhone() (plan §9.9). A matching
 * phone reuses the canonical contact_id — one person, one contact.
 */

/**
 * Contact registration sources (INTEGRATION_CONTRACT §7).
 * M0: these are string literals used in demo state — no contracts schema exists yet.
 */
type ContactSourceLabel =
  | "instagram"
  | "google_maps"
  | "referral"
  | "parenting_seminar"
  | "PUBLIC_LANDING"; // T11 FIX: new source for public program landing pages

export interface MatchOrCreateContactInput {
  organizationId: string;
  name: string;
  /** Any Indonesian variant ("0812...", "62812...", "+62 812-..."). */
  phone: string;
  email?: string;
  source: ContactSourceLabel;
}

export interface MatchOrCreateContactResult {
  contact: ContactWithSource;
  /** true when an existing canonical contact was reused. */
  matched: boolean;
}

export class LearnerRepository {
  private readonly now: () => string;

  constructor(
    private readonly store: MockStateStore,
    options: { now?: () => string } = {}
  ) {
    this.now = options.now ?? (() => new Date().toISOString());
  }

  // ── Contacts ────────────────────────────────────────────────────────────

  listContacts(): ContactWithSource[] {
    return this.store.getData().contacts;
  }

  getContactById(contactId: string): ContactWithSource | null {
    return this.store.getData().contacts.find((c) => c.id === contactId) ?? null;
  }

  /** Canonical E.164 lookup — normalize input first (normalizePhone owns format validation). */
  findContactByPhone(phoneE164: string): ContactWithSource | null {
    return this.store.getData().contacts.find((c) => c.phoneE164 === phoneE164) ?? null;
  }

  /**
   * Normalize phone → reuse canonical contact when it matches, otherwise
   * create (INTEGRATION_CONTRACT §7 §9 §10, plan §9.9). Invalid phone input
   * throws PhoneNormalizationError from platform-core — never silently sanitized.
   */
  matchOrCreateContact(input: MatchOrCreateContactInput): MatchOrCreateContactResult {
    const phoneE164 = normalizePhone(input.phone);
    const existing = this.findContactByPhone(phoneE164);
    if (existing) return { contact: existing, matched: true };

    const data = this.store.getData();
    const id = nextSequentialId(data.contacts.map((c) => c.id), "contact_");
    const occurredAt = this.now();
    const eventId = nextSequentialId(data.learningEvents.map((e) => e.eventId), "evt_");
    const contact: ContactWithSource = {
      id,
      organizationId: input.organizationId,
      name: input.name,
      phoneE164,
      email: input.email,
      source: input.source,
    };
    this.store.update((draft) => {
      draft.contacts.push(contact);
      draft.learningEvents.push({
        schemaVersion: 1,
        eventId,
        eventType: "learner.registered",
        sourceApp: "PROMOTORCLASS",
        organizationId: brandId<OrganizationId>(input.organizationId),
        contactId: brandId<ContactId>(id),
        occurredAt,
        payload: {},
      });
    });
    return { contact, matched: false };
  }

  // ── Enrollments ─────────────────────────────────────────────────────────

  listEnrollments(): Enrollment[] {
    return this.store.getData().enrollments;
  }

  getEnrollmentById(enrollmentId: string): Enrollment | null {
    return this.store.getData().enrollments.find((e) => e.id === enrollmentId) ?? null;
  }

  getEnrollmentByContactAndProgram(contactId: string, programId: string): Enrollment | null {
    return (
      this.store
        .getData()
        .enrollments.find((e) => e.contactId === contactId && e.programId === programId) ?? null
    );
  }

  listEnrollmentsByContact(contactId: string): Enrollment[] {
    return this.store.getData().enrollments.filter((e) => e.contactId === contactId);
  }

  /**
   * Idempotent enrollment creation (INTEGRATION_CONTRACT §45, plan §9.9):
   * re-enrolling the same contact+program returns the existing ref and
   * emits no duplicate learner.enrolled event.
   */
  createEnrollment(input: EnrollContactInput): EnrollmentRef {
    const data = this.store.getData();
    const existing = this.getEnrollmentByContactAndProgram(input.contactId, input.programId);
    if (existing) return { enrollmentId: existing.id };

    const program = data.programs.find((p) => p.id === input.programId);
    const contact = data.contacts.find((c) => c.id === input.contactId);
    if (!program || !contact) {
      throw new Error(
        `Cannot enroll: unknown program "${input.programId}" or contact "${input.contactId}".`
      );
    }

    // Seed enrollment ids use 2-digit suffixes (enr_01..enr_05).
    const id = nextSequentialId(data.enrollments.map((e) => e.id), "enr_", 2);
    const eventId = nextSequentialId(data.learningEvents.map((e) => e.eventId), "evt_");
    const occurredAt = this.now();
    const enrollment: Enrollment = {
      id: id as EnrollmentId,
      organizationId: input.organizationId,
      programId: input.programId,
      contactId: input.contactId,
      status: "enrolled",
      progressPercent: 0,
      intentScore: 50,
      intentLabel: "warm",
      learningStatus: "inactive",
      enrolledAt: occurredAt,
      lastActivityAt: null,
    };
    this.store.update((draft) => {
      draft.enrollments.push(enrollment);
      draft.learningEvents.push({
        schemaVersion: 1,
        eventId,
        eventType: "learner.enrolled",
        sourceApp: "PROMOTORCLASS",
        organizationId: input.organizationId,
        contactId: input.contactId,
        occurredAt,
        subject: { programId: input.programId, enrollmentId: id as EnrollmentId },
        payload: {},
      });
    });
    return { enrollmentId: id as EnrollmentId };
  }

  // ── Lesson progress ─────────────────────────────────────────────────────

  listLessonProgress(): LessonProgress[] {
    return this.store.getData().lessonProgress;
  }

  listLessonProgressByEnrollment(enrollmentId: string): LessonProgress[] {
    return this.store.getData().lessonProgress.filter((p) => p.enrollmentId === enrollmentId);
  }

  getLessonProgress(enrollmentId: string, lessonId: string): LessonProgress | null {
    return (
      this.store
        .getData()
        .lessonProgress.find(
          (p) => p.enrollmentId === enrollmentId && p.lessonId === lessonId
        ) ?? null
    );
  }

  // ── Reflections ─────────────────────────────────────────────────────────

  listReflectionsByContact(contactId: string): ReflectionResponse[] {
    return this.store.getData().reflections.filter((r) => r.contactId === contactId);
  }

  getReflection(enrollmentId: string, lessonId: string): ReflectionResponse | null {
    return (
      this.store
        .getData()
        .reflections.find((r) => r.enrollmentId === enrollmentId && r.lessonId === lessonId) ??
      null
    );
  }

  // ── Learning events ─────────────────────────────────────────────────────

  /** Chronological (occurredAt asc, stable within timestamp). */
  listLearningEventsByContact(contactId: string): LearningEventEnvelope[] {
    return this.store
      .getData()
      .learningEvents.filter((e) => e.contactId === contactId)
      .sort(
        (a, b) =>
          a.occurredAt.localeCompare(b.occurredAt) || a.eventId.localeCompare(b.eventId)
      );
  }

  // ── Signals ─────────────────────────────────────────────────────────────

  listLearningSignals(): LearningSignal[] {
    return this.store.getData().learningSignals;
  }

  listLearningSignalsByContact(contactId: string): LearningSignal[] {
    return this.store.getData().learningSignals.filter((s) => s.contactId === contactId);
  }
}
