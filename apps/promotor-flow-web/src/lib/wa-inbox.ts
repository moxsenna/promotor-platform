/**
 * Penyimpanan inbox balasan masuk (server-side, M0 tanpa DB).
 * File .wa-inbox.json gitignored — di M1 migrasi ke tabel Neon.
 */

import fs from "node:fs";
import path from "node:path";

const INBOX_FILE = path.join(process.cwd(), ".wa-inbox.json");
const MAX_ENTRIES = 200;

export interface WaInboxEntry {
  /** id baris messages di wakonek — kunci dedupe (webhook ada retry). */
  id: string;
  chatJid: string;
  /** nomor pengirim (digit) untuk chat personal; jid grup utk @g.us. */
  phone: string;
  isGroup: boolean;
  type: string;
  text: string;
  /** waktu pesan dibuat di gateway. */
  createdAt: string;
  /** waktu event diterima BFF. */
  receivedAt: string;
}

export function readInbox(): WaInboxEntry[] {
  try {
    const list = JSON.parse(fs.readFileSync(INBOX_FILE, "utf8")) as WaInboxEntry[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function addInboxEntry(entry: WaInboxEntry): boolean {
  const list = readInbox();
  if (list.some((e) => e.id === entry.id)) return false;
  list.unshift(entry);
  fs.writeFileSync(INBOX_FILE, JSON.stringify(list.slice(0, MAX_ENTRIES), null, 2), {
    mode: 0o600,
  });
  return true;
}

/**
 * Ekstrak teks dari payload mentah Baileys (meniru unwrap
 * detectInboundMessageType di wakonek: ephemeral/viewOnce dibuka dulu).
 */
export function extractInboundText(
  payload: unknown
): { text: string; type: string } {
  let inner = payload as Record<string, any> | null | undefined;

  while (inner) {
    if (inner.ephemeralMessage?.message) {
      inner = inner.ephemeralMessage.message;
      continue;
    }
    if (inner.viewOnceMessage?.message) {
      inner = inner.viewOnceMessage.message;
      continue;
    }
    if (inner.viewOnceMessageV2?.message) {
      inner = inner.viewOnceMessageV2.message;
      continue;
    }
    break;
  }

  if (!inner) return { text: "", type: "unknown" };
  if (typeof inner.conversation === "string" && inner.conversation) {
    return { text: inner.conversation, type: "text" };
  }
  if (typeof inner.extendedTextMessage?.text === "string" && inner.extendedTextMessage.text) {
    return { text: inner.extendedTextMessage.text, type: "text" };
  }
  if (inner.imageMessage) return { text: inner.imageMessage.caption ?? "", type: "image" };
  if (inner.documentMessage) return { text: inner.documentMessage.caption ?? "", type: "document" };
  if (inner.locationMessage) return { text: "[Lokasi]", type: "location" };
  if (inner.audioMessage) return { text: "[Pesan suara]", type: "audio" };
  if (inner.videoMessage) return { text: inner.videoMessage.caption ?? "[Video]", type: "video" };
  if (inner.stickerMessage) return { text: "[Stiker]", type: "sticker" };
  return { text: "", type: "unknown" };
}
