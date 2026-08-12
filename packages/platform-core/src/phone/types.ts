/**
 * Canonical E.164 phone number, e.g. "+6281234567890".
 * Branded string: only produced by normalizePhone.
 */
export type PhoneE164 = string & { readonly __brand: "PhoneE164" };

export type PhoneNormalizationErrorCode =
  | "EMPTY"
  | "INVALID_CHARACTERS"
  | "UNSUPPORTED_COUNTRY_CODE"
  | "TOO_SHORT"
  | "TOO_LONG";

/**
 * Thrown by normalizePhone for expected invalid input (never silently
 * sanitized). Consumers (registration form, matchOrCreateContact) catch
 * and branch on `code`.
 */
export class PhoneNormalizationError extends Error {
  /** @internal */
  readonly code: PhoneNormalizationErrorCode;

  constructor(code: PhoneNormalizationErrorCode, message: string) {
    super(message);
    this.name = "PhoneNormalizationError";
    this.code = code;
  }
}
