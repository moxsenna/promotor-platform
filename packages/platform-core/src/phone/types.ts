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

export interface PhoneNormalizationError {
  code: PhoneNormalizationErrorCode;
  message: string;
}

/**
 * Discriminated union result. normalizePhone never throws for expected
 * invalid user input; consumers narrow on `ok` (form/registration use).
 */
export type NormalizePhoneResult =
  | { ok: true; value: PhoneE164 }
  | { ok: false; error: PhoneNormalizationError };