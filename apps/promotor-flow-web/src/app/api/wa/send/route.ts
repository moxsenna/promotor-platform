import { NextResponse } from "next/server";
import { gatewayFetch, isWakonekConfigured, readSession } from "@/lib/wakonek";

export const dynamic = "force-dynamic";

const MAX_TEXT = 4096;

/**
 * Kirim pesan WhatsApp text via wakonek atas device yang terhubung.
 * Body: { target: string (nomor tujuan, E.164 atau digit), text: string }.
 */
export async function POST(request: Request) {
  if (!isWakonekConfigured()) {
    return NextResponse.json({ code: "unconfigured", error: "Wakonek belum dikonfigurasi" }, { status: 503 });
  }

  const session = readSession();
  if (!session) {
    return NextResponse.json(
      { code: "not_connected", error: "WhatsApp belum terhubung" },
      { status: 409 }
    );
  }

  let body: { target?: unknown; text?: unknown };
  try {
    body = (await request.json()) as { target?: unknown; text?: unknown };
  } catch {
    return NextResponse.json({ error: "Body JSON tidak valid" }, { status: 400 });
  }

  const target = typeof body.target === "string" ? body.target.replace(/\D/g, "") : "";
  const text = typeof body.text === "string" ? body.text.trim() : "";

  if (!/^[1-9]\d{6,15}$/.test(target)) {
    return NextResponse.json({ error: "Nomor tujuan tidak valid" }, { status: 400 });
  }
  if (text.length === 0 || text.length > MAX_TEXT) {
    return NextResponse.json({ error: `Isi pesan wajib 1-${MAX_TEXT} karakter` }, { status: 400 });
  }

  try {
    const res = await gatewayFetch("/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Device-Token": session.deviceToken,
      },
      body: JSON.stringify({ deviceId: session.deviceId, target, type: "text", text }),
    });

    if (res.status === 403 || res.status === 404) {
      // Device token invalid / binding hilang → minta pairing ulang.
      return NextResponse.json(
        { code: "not_connected", error: "Sesi WhatsApp tidak berlaku, hubungkan ulang" },
        { status: 409 }
      );
    }
    if (!res.ok) {
      const detail = (await res.json().catch(() => null)) as
        | { messageId?: string; status?: string; error?: string }
        | null;

      // Gateway 400 "Device is not connected": device ada tapi socket mati.
      if (res.status === 400 && detail?.error?.toLowerCase().includes("not connected")) {
        return NextResponse.json(
          {
            code: "not_connected",
            error: "Perangkat WhatsApp sedang tidak terhubung. Hubungkan ulang dulu ya.",
          },
          { status: 409 }
        );
      }

      // Gateway 500 dengan status "failed" = percobaan kirim nyata gagal
      // (mis. perangkat putus di tengah kirim) — teruskan sebagai hasil.
      if (detail?.status === "failed" && detail.messageId) {
        return NextResponse.json({ messageId: detail.messageId, status: "failed" });
      }

      console.error("[wa/send] gateway error", res.status);
      return NextResponse.json({ error: "Gateway WhatsApp gagal mengirim" }, { status: 502 });
    }

    const data = (await res.json()) as { messageId?: string; status?: string };
    return NextResponse.json({
      messageId: data.messageId ?? null,
      status: data.status ?? "queued",
    });
  } catch (err) {
    console.error("[wa/send] unreachable gateway", err);
    return NextResponse.json({ error: "Gateway WhatsApp tidak terjangkau" }, { status: 502 });
  }
}
