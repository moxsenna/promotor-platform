import { PhoneNormalizationError } from "./types";
import type { PhoneE164 } from "./types";

/** Indonesian national numbers: 8 to 11 digits after country code 62. */
const MIN_NATIONAL_DIGITS = 8;
const MAX_NATIONAL_DIGITS = 11;

const SEPARATORS = /[\s\-().]/g;

/**
 * Normalizes Indonesian phone input variants ("0812...", "62812...",
 * "+62812...", "+62 812-...", "0812-3456-7890", ...) to canonical E.164
 * ("+6281234567890").
 *
 * Failure contract: throws PhoneNormalizationError on invalid input — never
 * silently sanitizes. Error codes: EMPTY, INVALID_CHARACTERS,
 * UNSUPPORTED_COUNTRY_CODE, TOO_SHORT, TOO_LONG.
 */
export function normalizePhone(input: string): PhoneE164 {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    throw new PhoneNormalizationError("EMPTY", "Phone number is empty.");
  }

  const stripped = trimmed.replace(SEPARATORS, "");
  if (!/^\+?\d+$/.test(stripped)) {
    throw new PhoneNormalizationError(
      "INVALID_CHARACTERS",
      `Phone number may only contain digits, one leading "+", and separators (space, dash, dot, parentheses); got "${trimmed}".`
    );
  }

  // One leading zero before the country code may occur with +62 ("+620812...").
  let national: string;
  if (stripped.startsWith("+62")) {
    national = stripped.slice(3);
  } else if (stripped.startsWith("62")) {
    national = stripped.slice(2);
  } else if (stripped.startsWith("0")) {
    national = stripped.slice(1);
  } else {
    throw new PhoneNormalizationError(
      "UNSUPPORTED_COUNTRY_CODE",
      `Only Indonesian numbers are supported (prefix 0, 62, or +62); got "${stripped}".`
    );
  }

  if (national.startsWith("0")) {
    national = national.slice(1);
  }

  if (national.length < MIN_NATIONAL_DIGITS) {
    throw new PhoneNormalizationError(
      "TOO_SHORT",
      `Phone number too short: ${national.length} digit(s) after country code 62 (minimum ${MIN_NATIONAL_DIGITS}).`
    );
  }
  if (national.length > MAX_NATIONAL_DIGITS) {
    throw new PhoneNormalizationError(
      "TOO_LONG",
      `Phone number too long: ${national.length} digit(s) after country code 62 (maximum ${MAX_NATIONAL_DIGITS}).`
    );
  }

  return `+62${national}` as PhoneE164;
}
