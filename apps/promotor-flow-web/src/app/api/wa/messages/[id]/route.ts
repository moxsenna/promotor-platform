import { NextResponse } from "next/server";
import { gatewayFetch, isWakonekConfigured } from "@/lib/wakonek";

export const dynamic = "force-dynamic";

/**
 * Cek status pesan terkirim (queued/sent/delivered/read/failed) — dipakai
 * dialog kirim untuk memperbarui label status tanpa menunggu webhook.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isWakonekConfigured()) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  try {
    const res = await gatewayFetch(`/v1/messages/${encodeURIComponent(id)}`);
    if (res.status === 403 || res.status === 404) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    if (!res.ok) {
      return NextResponse.json({ error: "gateway_error" }, { status: 502 });
    }
    const message = (await res.json()) as { status?: string; error?: string | null };
    return NextResponse.json({ status: message.status ?? "unknown", error: message.error ?? null });
  } catch {
    return NextResponse.json({ error: "unreachable" }, { status: 502 });
  }
}
