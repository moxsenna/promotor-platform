import type { PhoneE164 } from "./types";

/**
 * Formats canonical E.164 input as display text, e.g. "+6281234567890" ->
 * "+62 812-3456-7890" (Indonesian mobile grouping for the common 11-digit
 * national length). Other valid lengths are chunked into 3-digit groups
 * ("+6281234567" -> "+62 812-3456").
 *
 * Round-trips through normalizePhone: output uses only digits, spaces and
 * dashes, all of which normalizePhone strips.
 *
 * Input is a branded PhoneE164 (produced by normalizePhone); no validation
 * is performed here.
 */
export function formatPhone(phone: PhoneE164): string {
  const national = phone.slice(3); // after "+62"

  let formatted: string;
  if (national.length === 11) {
    formatted = `${national.slice(0, 3)}-${national.slice(3, 7)}-${national.slice(7)}`;
  } else {
    const chunks: string[] = [];
    let rest = national;
    while (rest.length > 4) {
      chunks.push(rest.slice(0, 3));
      rest = rest.slice(3);
    }
    chunks.push(rest);
    formatted = chunks.join("-");
  }

  return `+62 ${formatted}`;
}
