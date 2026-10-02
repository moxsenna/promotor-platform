import { NextResponse } from "next/server";
import {
  gatewayFetch,
  isWakonekConfigured,
  writeSession,
  WAKONEK_EXTERNAL_USER_ID,
} from "@/lib/wakonek";

export const dynamic = "force-dynamic";

/**
 * Provision device WhatsApp baru di wakonek atas nama user lokal, simpan
 * deviceToken di server (file sesi), dan teruskan pairingToken ke browser
 * (token ini memang dirancang browser-safe, expiry 10 menit).
 */
export async function POST() {
  if (!isWakonekConfigured()) {
    return NextResponse.json(
      { error: "Wakonek belum dikonfigurasi (isi .env.local)" },
      { status: 503 }
    );
  }

  try {
    const res = await gatewayFetch("/v1/devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        externalUserId: WAKONEK_EXTERNAL_USER_ID,
        label: "Ralivo Flow (dev lokal)",
      }),
    });

    if (!res.ok) {
      console.error("[wa/pairing/start] gateway error", res.status);
      return NextResponse.json({ error: "Gateway WhatsApp gagal merespons" }, { status: 502 });
    }

    const data = (await res.json()) as {
      deviceId: string;
      deviceToken: string;
      pairingToken: string;
    };

    writeSession({
      deviceId: data.deviceId,
      deviceToken: data.deviceToken,
      createdAt: new Date().toISOString(),
      phone: null,
    });

    return NextResponse.json({ deviceId: data.deviceId, pairingToken: data.pairingToken });
  } catch (err) {
    console.error("[wa/pairing/start] unreachable gateway", err);
    return NextResponse.json({ error: "Gateway WhatsApp tidak terjangkau" }, { status: 502 });
  }
}
