import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { addInboxEntry, extractInboundText } from "@/lib/wa-inbox";

export const dynamic = "force-dynamic";

const SIGNATURE_TOLERANCE_MS = 300_000;

function verifySignature(rawBody: string, header: string, secret: string): boolean {
  if (!header || !secret) return false;

  let timestamp: number | null = null;
  let signature: string | null = null;
  for (const part of header.split(",")) {
    const trimmed = part.trim();
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim().toLowerCase();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (key === "t") {
      const parsed = Number.parseInt(value, 10);
      if (!Number.isNaN(parsed)) timestamp = parsed;
    } else if (key === "v1" && value.length > 0) {
      signature = value;
    }
  }
  if (timestamp === null || signature === null) return false;

  const ageMs = Math.abs(Date.now() - timestamp * 1000);
  if (ageMs > SIGNATURE_TOLERANCE_MS) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  const actualBuf = Buffer.from(signature, "utf8");
  if (expectedBuf.length !== actualBuf.length) return false;
  return timingSafeEqual(expectedBuf, actualBuf);
}

/**
 * Receiver webhook wakonek (message.received / message.status / device.status).
 * Autentikasi = HMAC X-Wakonek-Signature atas raw body dengan webhook secret
 * app "Ralivo Flow". Wajib cepat 200 — dispatcher wakonek me-retry bila gagal.
 */
export async function POST(request: Request) {
  const secret = process.env.WAKONEK_WEBHOOK_SECRET || "";
  const rawBody = await request.text();
  const header = request.headers.get("x-wakonek-signature") ?? "";

  if (!verifySignature(rawBody, header, secret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  if (payload?.event === "message.received" && payload.message?.id) {
    const msg = payload.message;
    const chatJid: string = typeof msg.chatJid === "string" ? msg.chatJid : "";
    const isGroup = chatJid.endsWith("@g.us");
    const phone = isGroup ? chatJid : chatJid.replace(/@s\.whatsapp\.net$/, "").replace(/\D/g, "");
    const { text, type } = extractInboundText(msg.payload);

    addInboxEntry({
      id: String(msg.id),
      chatJid,
      phone,
      isGroup,
      type,
      text,
      createdAt: typeof msg.createdAt === "string" ? msg.createdAt : new Date().toISOString(),
      receivedAt: new Date().toISOString(),
    });
  }

  // message.status & device.status: status outbound sudah dipoll terpisah,
  // status koneksi dipantau via /api/wa/status — keduanya diabaikan di sini.

  return NextResponse.json({ ok: true });
}
