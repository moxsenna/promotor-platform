import { describe, expect, it } from "vitest";
import {
  formatPhone,
  PhoneNormalizationError,
  normalizePhone,
} from "../index";
import type { PhoneE164, PhoneNormalizationErrorCode } from "../index";

/**
 * Asserts that normalizePhone throws PhoneNormalizationError with the
 * expected code for invalid input (the failure contract).
 */
function expectErrorCode(
  input: string,
  code: PhoneNormalizationErrorCode
): void {
  try {
    normalizePhone(input);
  } catch (error) {
    expect(error).toBeInstanceOf(PhoneNormalizationError);
    expect((error as PhoneNormalizationError).code).toBe(code);
    return;
  }
  throw new Error(`normalizePhone should have thrown for input: "${input}"`);
}

describe("normalizePhone", () => {
  it("normalizes 08-prefixed numbers to E.164", () => {
    expect(normalizePhone("081234567890")).toBe("+6281234567890");
  });

  it("normalizes 62-prefixed numbers (no plus) to E.164", () => {
    expect(normalizePhone("6281234567890")).toBe("+6281234567890");
  });

  it("keeps +62-prefixed numbers unchanged", () => {
    expect(normalizePhone("+6281234567890")).toBe("+6281234567890");
  });

  it("strips spaces, dashes, dots and parentheses", () => {
    expect(normalizePhone("+62 812-3456-7890")).toBe("+6281234567890");
    expect(normalizePhone("0812-3456-7890")).toBe("+6281234567890");
    expect(normalizePhone("+62 (812) 3456.7890")).toBe("+6281234567890");
  });

  it("truncates a leading 0 after country code 62", () => {
    expect(normalizePhone("+62081234567890")).toBe("+6281234567890");
  });

  it("fails explicitly on empty input", () => {
    expect(() => normalizePhone("")).toThrow(PhoneNormalizationError);
    expectErrorCode("", "EMPTY");
  });

  it("fails on whitespace-only input", () => {
    expect(() => normalizePhone("   ")).toThrow(PhoneNormalizationError);
    expectErrorCode("   ", "EMPTY");
  });

  it("fails on letters and garbage characters", () => {
    for (const bad of ["abc", "0812abcdef", "+62 812-abc", "0812!2345"]) {
      expect(() => normalizePhone(bad)).toThrow(PhoneNormalizationError);
      expectErrorCode(bad, "INVALID_CHARACTERS");
    }
  });

  it("fails on a plus sign that is not the leading prefix", () => {
    expect(() => normalizePhone("0812+34567890")).toThrow(
      PhoneNormalizationError
    );
    expectErrorCode("0812+34567890", "INVALID_CHARACTERS");
  });

  it("fails on too-short numbers", () => {
    for (const bad of ["0812", "+628123456", "628"]) {
      expect(() => normalizePhone(bad)).toThrow(PhoneNormalizationError);
      expectErrorCode(bad, "TOO_SHORT");
    }
  });

  it("fails on too-long numbers", () => {
    expect(() => normalizePhone("081234567890123")).toThrow(
      PhoneNormalizationError
    );
    expectErrorCode("081234567890123", "TOO_LONG");
  });

  it("fails on unsupported country codes", () => {
    for (const bad of ["81234567890", "+61 8123456789", "+918123456789"]) {
      expect(() => normalizePhone(bad)).toThrow(PhoneNormalizationError);
      expectErrorCode(bad, "UNSUPPORTED_COUNTRY_CODE");
    }
  });
});

describe("formatPhone", () => {
  it("formats 11-digit national numbers as +62 xxx-xxxx-xxxx", () => {
    expect(formatPhone("+6281234567890" as PhoneE164)).toBe(
      "+62 812-3456-7890"
    );
  });

  it("chunks non-11-digit national numbers into 3-digit groups", () => {
    // 7 digits after +62: "812" + "3456"
    expect(formatPhone("+628123456" as PhoneE164)).toBe("+62 812-3456");
    // 8 digits after +62: "812" + "345" + "67"
    expect(formatPhone("+6281234567" as PhoneE164)).toBe("+62 812-345-67");
    // 9 digits after +62: "812" + "345" + "678"
    expect(formatPhone("+62812345678" as PhoneE164)).toBe("+62 812-345-678");
  });

  it("round-trips with normalizePhone", () => {
    for (const input of [
      "081234567890",
      "6281234567890",
      "+62 812-3456-7890",
      "0812-3456-7890",
    ]) {
      const normalized = normalizePhone(input);
      expect(normalizePhone(formatPhone(normalized))).toBe(normalized);
    }
  });
});
