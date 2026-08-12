import { formatPhone } from "@promotor/platform-core";
import type { PhoneE164 } from "@promotor/platform-core";

/**
 * Display formatters for promotor screens. Times render in Asia/Jakarta (the
 * demo audience) so dates stay deterministic regardless of server timezone.
 */

const TIME_ZONE = "Asia/Jakarta";

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TIME_ZONE,
  });
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}

/** Canonical E.164 -> display grouping ("+62 812-2333-4444"). */
export function formatPhoneDisplay(phone: string): string {
  return formatPhone(phone as PhoneE164);
}
