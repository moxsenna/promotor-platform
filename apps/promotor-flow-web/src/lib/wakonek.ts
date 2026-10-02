/**
 * Server-only helper untuk Wakonek gateway (WhatsApp).
 * Dipakai oleh route handler /api/wa/*. Kredensial API key tidak boleh
 * sampai ke browser — pairing token yang diteruskan ke browser memang
 * dirancang browser-safe oleh wakonek (expiry 10 menit).
 */

import fs from "node:fs";
import path from "node:path";

const GATEWAY_URL = (
  process.env.WAKONEK_GATEWAY_URL ||
  process.env.NEXT_PUBLIC_GATEWAY_URL ||
  ""
).replace(/\/+$/, "");

const API_KEY = process.env.WAKONEK_API_KEY || "";

/**
 * M0 belum punya auth/user — identitas eksternal mock ini nanti diganti
 * ID user Better Auth saat backend M1 masuk.
 */
export const WAKONEK_EXTERNAL_USER_ID = "local-promotor";

const SESSION_FILE = path.join(process.cwd(), ".wa-session.json");

export interface WaSession {
  deviceId: string;
  deviceToken: string;
  createdAt: string;
  phone: string | null;
}

export function isWakonekConfigured(): boolean {
  return Boolean(GATEWAY_URL && API_KEY);
}

export function readSession(): WaSession | null {
  try {
    const raw = JSON.parse(fs.readFileSync(SESSION_FILE, "utf8")) as WaSession;
    return raw.deviceId && raw.deviceToken ? raw : null;
  } catch {
    return null;
  }
}

export function writeSession(session: WaSession): void {
  fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2), { mode: 0o600 });
}

export async function gatewayFetch(pathname: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${GATEWAY_URL}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
}
