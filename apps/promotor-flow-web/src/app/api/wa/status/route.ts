import { NextResponse } from "next/server";
import { gatewayFetch, isWakonekConfigured, readSession, writeSession } from "@/lib/wakonek";

export const dynamic = "force-dynamic";

/**
 * Status koneksi WhatsApp user lokal, dinormalisasi untuk frontend.
 * Dipanggil berkala (badge header, halaman /whatsapp, baris Lainnya).
 */
export async function GET() {
  if (!isWakonekConfigured()) {
    return NextResponse.json({ stage: "unconfigured" });
  }

  const session = readSession();
  if (!session) {
    return NextResponse.json({ stage: "not_connected" });
  }

  try {
    const res = await gatewayFetch("/v1/devices/me", {
      headers: { "X-Device-Token": session.deviceToken },
    });

    // Device token invalid / device hilang / binding dicabut → pairing ulang.
    if (res.status === 403 || res.status === 404) {
      return NextResponse.json({ stage: "needs_pairing" });
    }
    if (!res.ok) {
      console.error("[wa/status] gateway error", res.status);
      return NextResponse.json({ stage: "error" });
    }

    const device = (await res.json()) as {
      deviceId: string;
      phone: string | null;
      status: string;
    };

    if (device.status === "connected" && device.phone && device.phone !== session.phone) {
      writeSession({ ...session, phone: device.phone });
    }

    const stage =
      device.status === "connected"
        ? "connected"
        : device.status === "logged_out"
          ? "needs_pairing"
          : device.status === "qr" || device.status === "connecting"
            ? "connecting"
            : device.phone
              ? // Pernah terhubung — gateway auto-reconnect dengan backoff.
                "disconnected"
              : // Belum pernah pair (QR session berakhir tanpa discan).
                "needs_pairing";

    return NextResponse.json({ stage, phone: device.phone, deviceId: device.deviceId });
  } catch (err) {
    console.error("[wa/status] unreachable gateway", err);
    return NextResponse.json({ stage: "error" });
  }
}
