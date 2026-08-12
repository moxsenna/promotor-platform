import { describe, expect, it } from "vitest";
import { formatPhone, normalizePhone } from "../index";
import type { PhoneE164 } from "../index";

describe("normalizePhone", () => {
  it("normalizes 08-prefixed numbers to E.164", () => {
    expect(normalizePhone("081234567890")).toEqual({
      ok: true,
      value: "+6281234567890",
    });
  });

  it("normalizes 62-prefixed numbers (no plus) to E.164", () => {
    expect(normalizePhone("6281234567890")).toEqual({
      ok: true,
      value: "+6281234567890",
    });
  });

  it("keeps +62-prefixed numbers unchanged", () => {
    expect(normalizePhone("+6281234567890")).toEqual({
      ok: true,
      value: "+6281234567890",
    });
  });

  it("strips spaces, dashes, dots and parentheses", () => {
    expect(normalizePhone("+62 812-3456-7890")).toEqual({
      ok: true,
      value: "+6281234567890",
    });
    expect(normalizePhone("0812-3456-7890")).toEqual({
      ok: true,
      value: "+6281234567890",
    });
    expect(normalizePhone("+62 (812) 3456.7890")).toEqual({
      ok: true,
      value: "+6281234567890",
    });
  });

  it("truncates a leading 0 after country code 62", () => {
    expect(normalizePhone("+62081234567890")).toEqual({
      ok: true,
      value: "+6281234567890",
    });
  });

  it("fails explicitly on empty input", () => {
    const result = normalizePhone("");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("EMPTY");
    }
  });

  it("fails on whitespace-only input", () => {
    const result = normalizePhone("   ");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("EMPTY");
    }
  });

  it("fails on letters and garbage characters", () => {
    for (const bad of ["abc", "0812abcdef", "+62 812-abc", "0812!2345"]) {
      const result = normalizePhone(bad);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("INVALID_CHARACTERS");
      }
    }
  });

  it("fails on a plus sign that is not the leading prefix", () => {
    const result = normalizePhone("0812+34567890");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_CHARACTERS");
    }
  });

  it("fails on too-short numbers", () => {
    for (const bad of ["0812", "+628123456", "628"]) {
      const result = normalizePhone(bad);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("TOO_SHORT");
      }
    }
  });

  it("fails on too-long numbers", () => {
    const result = normalizePhone("081234567890123");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TOO_LONG");
    }
  });

  it("fails on unsupported country codes", () => {
    for (const bad of ["81234567890", "+61 8123456789", "+918123456789"]) {
      const result = normalizePhone(bad);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("UNSUPPORTED_COUNTRY_CODE");
      }
    }
  });
});

describe("formatPhone", () => {
  it("formats 11-digit national numbers as +62 xxx-xxxx-xxxx", () => {
    expect(formatPhone("+6281234567890" as PhoneE164)).toBe("+62 812-3456-7890");
  });

  it("round-trips with normalizePhone", () => {
    for (const input of [
      "081234567890",
      "6281234567890",
      "+62 812-3456-7890",
      "0812-3456-7890",
    ]) {
      const normalized = normalizePhone(input);
      expect(normalized.ok).toBe(true);
      if (normalized.ok) {
        expect(normalizePhone(formatPhone(normalized.value))).toEqual({
          ok: true,
          value: normalized.value,
        });
      }
    }
  });
});
