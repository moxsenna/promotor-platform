"use client";

/**
 * Badge status koneksi WhatsApp untuk header halaman.
 * Kompak: titik berwarna + label pendek, klik → halaman /whatsapp.
 */

import Link from "next/link";
import { WaStatusPill } from "@/components/WaStatusPill";
import { useWaStatus } from "@/lib/use-wa-status";

export function WaStatusBadge() {
  // Poll di sini supaya label badge selalu segar; pil hanya presentasi.
  useWaStatus(30_000);

  return (
    <Link
      href="/whatsapp"
      aria-label="Buka halaman koneksi WhatsApp"
      style={{ textDecoration: "none", display: "inline-flex" }}
    >
      <WaStatusPill />
    </Link>
  );
}
