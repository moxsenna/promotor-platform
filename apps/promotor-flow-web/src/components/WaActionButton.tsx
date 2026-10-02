"use client";

/**
 * Tombol pemicu dialog "Kirim via WhatsApp".
 * variant "pill" = pil WA baris halaman Hari ini (mockup-identik);
 * variant "full" = tombol utama lebar (halaman kontak).
 */

import { useState } from "react";
import { WaSendDialog } from "@/components/WaSendDialog";

interface WaActionButtonProps {
  variant: "pill" | "full";
  label?: string;
  contactName: string;
  phoneE164: string;
  message: string;
}

export function WaActionButton({
  variant,
  label,
  contactName,
  phoneE164,
  message,
}: WaActionButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {variant === "pill" ? (
        <button
          aria-label="Kirim WhatsApp"
          onClick={() => setOpen(true)}
          style={{
            width: 56,
            height: 44,
            margin: "-7px -6px -7px 0",
            padding: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <span
            style={{
              minWidth: 44,
              height: 30,
              padding: "0 10px",
              border: "1px solid #D5D3CE",
              borderRadius: 6,
              background: "#fff",
              fontWeight: 600,
              fontSize: 12.5,
              lineHeight: "28px",
              fontFamily: "Inter, system-ui, sans-serif",
              color: "#167A68",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {label ?? "WA"}
          </span>
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: "100%",
            height: 46,
            marginTop: 14,
            border: "none",
            borderRadius: 8,
            background: "#167A68",
            color: "#fff",
            font: "600 15px Inter, system-ui, sans-serif",
            cursor: "pointer",
          }}
        >
          {label ?? "Kirim via WhatsApp"}
        </button>
      )}

      <WaSendDialog
        open={open}
        contactName={contactName}
        phoneE164={phoneE164}
        initialMessage={message}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
