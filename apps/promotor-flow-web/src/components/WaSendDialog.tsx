"use client";

/**
 * Bottom-sheet "Kirim via WhatsApp" — Fase 2 integrasi Wakonek.
 * Human-in-the-loop sesuai PRD §4.2: pesan ditampilkan dulu, bisa diedit,
 * lalu dikirim eksplisit lewat BFF (/api/wa/send) dari nomor yang terhubung.
 * Status pengiriman diperbarui via polling ringan /api/wa/messages/:id.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface WaSendDialogProps {
  open: boolean;
  contactName: string;
  phoneE164: string;
  initialMessage: string;
  onClose: () => void;
  onSent?: (messageId: string) => void;
}

type SendState =
  | { phase: "editing" }
  | { phase: "sending" }
  | { phase: "sent"; messageId: string; delivery: string | null }
  | { phase: "error"; message: string; code?: string };

const DELIVERY_LABEL: Record<string, string> = {
  queued: "Mengantre kirim",
  sent: "Terkirim",
  delivered: "Terkirim ke perangkat",
  read: "Dibaca",
  failed: "Gagal terkirim",
};

function formatPhoneDisplay(phoneE164: string): string {
  const digits = phoneE164.replace(/\D/g, "");
  if (digits.startsWith("62") && digits.length >= 10 && digits.length <= 15) {
    const national = digits.slice(2);
    const chunks: string[] = [];
    let rest = national;
    while (rest.length > 7) {
      chunks.push(rest.slice(0, 3));
      rest = rest.slice(3);
    }
    if (rest.length > 4) {
      chunks.push(rest.slice(0, 4));
      rest = rest.slice(4);
    }
    chunks.push(rest);
    return `+62 ${chunks.join("-")}`;
  }
  return phoneE164.startsWith("+") ? phoneE164 : `+${digits}`;
}

export function WaSendDialog({
  open,
  contactName,
  phoneE164,
  initialMessage,
  onClose,
  onSent,
}: WaSendDialogProps) {
  const [text, setText] = useState(initialMessage);
  const [state, setState] = useState<SendState>({ phase: "editing" });
  const pollTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Reset saat dibuka untuk kontak/pesan berbeda.
  useEffect(() => {
    if (open) {
      setText(initialMessage);
      setState({ phase: "editing" });
      pollTimers.current.forEach(clearTimeout);
      pollTimers.current = [];
    }
  }, [open, initialMessage]);

  useEffect(() => {
    return () => pollTimers.current.forEach(clearTimeout);
  }, []);

  if (!open) return null;

  const busy = state.phase === "sending";
  const locked = busy || state.phase === "sent";

  const closeIfAllowed = () => {
    if (!locked) onClose();
  };

  async function pollDelivery(messageId: string, delaysMs: number[]) {
    for (const delay of delaysMs) {
      pollTimers.current.push(
        setTimeout(async () => {
          try {
            const res = await fetch(`/api/wa/messages/${encodeURIComponent(messageId)}`, {
              cache: "no-store",
            });
            if (res.ok) {
              const data = (await res.json()) as { status?: string };
              const label = data.status ? DELIVERY_LABEL[data.status] : undefined;
              setState((prev) =>
                prev.phase === "sent" && label ? { ...prev, delivery: label } : prev
              );
            }
          } catch {
            // polling best-effort saja
          }
        }, delay)
      );
    }
  }

  async function send() {
    setState({ phase: "sending" });
    try {
      const res = await fetch("/api/wa/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: phoneE164, text }),
      });
      const data = (await res.json().catch(() => null)) as
        | { messageId?: string; status?: string; code?: string; error?: string }
        | null;

      if (res.ok && data?.messageId) {
        if (data.status === "failed") {
          setState({
            phase: "error",
            message:
              "Pesan gagal terkirim — perangkat WhatsApp Anda sedang tidak terhubung ke server. Coba lagi setelah koneksi pulih.",
          });
          return;
        }
        setState({
          phase: "sent",
          messageId: data.messageId,
          delivery: DELIVERY_LABEL[data.status ?? ""] ?? "Terkirim",
        });
        onSent?.(data.messageId);
        void pollDelivery(data.messageId, [3000, 8000]);
        return;
      }

      if (data?.code === "not_connected" || data?.code === "unconfigured") {
        setState({ phase: "error", message: data.error ?? "WhatsApp belum terhubung", code: data.code });
      } else {
        setState({ phase: "error", message: data?.error ?? "Gagal mengirim pesan" });
      }
    } catch {
      setState({ phase: "error", message: "Tidak bisa menghubungi server aplikasi" });
    }
  }

  const initials = contactName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      onClick={closeIfAllowed}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(25,25,24,.45)",
        zIndex: 60,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Kirim pesan WhatsApp ke ${contactName}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          borderRadius: "16px 16px 0 0",
          padding: "10px 16px calc(20px + env(safe-area-inset-bottom))",
          boxShadow: "0 -8px 32px rgba(25,25,24,.18)",
        }}
      >
        <div aria-hidden style={{ width: 36, height: 4, borderRadius: 2, background: "#D5D3CE", margin: "0 auto 12px" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ font: "600 16px/22px Inter, system-ui, sans-serif", color: "#191918" }}>
            Kirim via WhatsApp
          </span>
          {!locked ? (
            <button
              aria-label="Tutup"
              onClick={onClose}
              style={{ width: 32, height: 32, border: "none", background: "none", cursor: "pointer", color: "#9C9A94", font: "400 18px Inter, system-ui, sans-serif" }}
            >
              ✕
            </button>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#F7F7F5", borderRadius: 10, marginBottom: 12 }}>
          <span aria-hidden style={{ width: 36, height: 36, borderRadius: "50%", background: "#E6F2EF", color: "#167A68", font: "600 13px Inter, system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            {initials}
          </span>
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ font: "600 14px/18px Inter, system-ui, sans-serif", color: "#191918" }}>{contactName}</span>
            <span style={{ font: "400 12.5px/16px Inter, system-ui, sans-serif", color: "#71706B" }}>
              {formatPhoneDisplay(phoneE164)}
            </span>
          </span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          maxLength={4096}
          disabled={locked}
          style={{
            width: "100%",
            boxSizing: "border-box",
            resize: "vertical",
            border: "1px solid #D5D3CE",
            borderRadius: 10,
            padding: 12,
            font: "400 14px/21px Inter, system-ui, sans-serif",
            color: "#191918",
            background: locked ? "#F7F7F5" : "#fff",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 2px 0", font: "400 11.5px/16px Inter, system-ui, sans-serif", color: "#9C9A94" }}>
          <span>Pesan dikirim dari nomor WhatsApp Anda yang terhubung.</span>
          <span>{text.length}/4096</span>
        </div>

        {state.phase === "sent" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, padding: "10px 12px", background: "rgba(6,118,71,.08)", borderRadius: 10 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#067647" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 8.5l3.5 3.5L13 4.5" />
            </svg>
            <span style={{ font: "500 13.5px/18px Inter, system-ui, sans-serif", color: "#067647" }}>
              {state.delivery ?? "Terkirim"} · tercatat di aktivitas kontak
            </span>
          </div>
        ) : null}

        {state.phase === "error" ? (
          <div style={{ marginTop: 14, padding: "10px 12px", background: "rgba(180,35,24,.07)", borderRadius: 10 }}>
            <span style={{ font: "400 13px/18px Inter, system-ui, sans-serif", color: "#B42318" }}>
              {state.message}
            </span>
            {state.code === "not_connected" || state.code === "unconfigured" ? (
              <div style={{ paddingTop: 6 }}>
                <Link href="/whatsapp" style={{ font: "500 13px/18px Inter, system-ui, sans-serif", color: "#167A68" }}>
                  Buka halaman koneksi WhatsApp →
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {state.phase === "sent" ? (
            <button onClick={onClose} className="pf-btn pf-btn--primary pf-btn--full">
              Selesai
            </button>
          ) : (
            <>
              <button onClick={onClose} disabled={busy} className="pf-btn pf-btn--secondary" style={{ flex: 1 }}>
                Batal
              </button>
              <button
                onClick={send}
                disabled={busy || text.trim().length === 0}
                className="pf-btn pf-btn--primary"
                style={{ flex: 1.4 }}
              >
                {busy ? "Mengirim…" : "Kirim"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
