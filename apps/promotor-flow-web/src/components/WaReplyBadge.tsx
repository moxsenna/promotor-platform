"use client";

/**
 * Badge jumlah balasan belum dibaca untuk header halaman Hari ini.
 * Sembunyi (render null) saat tidak ada yang belum dibaca.
 */

import Link from "next/link";
import { useWaInbox } from "@/lib/use-wa-inbox";

export function WaReplyBadge() {
  const { unreadCount } = useWaInbox(20_000);

  if (unreadCount <= 0) return null;

  return (
    <Link
      href="/whatsapp"
      aria-label={`${unreadCount} balasan WhatsApp belum dibaca`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 30,
        padding: "0 10px",
        borderRadius: 15,
        background: "rgba(22,122,104,.1)",
        textDecoration: "none",
        font: "600 12px/16px Inter, system-ui, sans-serif",
        color: "#167A68",
        whiteSpace: "nowrap",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12.5 7A5.5 5.5 0 1 1 7 1.5c2.6 0 4.8 1.7 5.4 4" />
        <path d="M12.6 1.5v3h-3" />
      </svg>
      {unreadCount} balasan
    </Link>
  );
}
