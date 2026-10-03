"use client";

/**
 * Feed "Balasan masuk" di halaman WhatsApp — Fase 3.
 * Menampilkan pesan yang diterima gateway (webhook message.received),
 * dipadankan ke kontak mock store via nomor E.164.
 * Selama halaman ini terbuka & terlihat, pesan dianggap sudah dibaca.
 */

import { useEffect, useState } from "react";
import { mockStore } from "@/adapters/mock/mock-state-store";
import { useWaInbox } from "@/lib/use-wa-inbox";

function contactNameForPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  const contact = mockStore
    .getContacts()
    .find((c) => c.phoneE164.replace(/\D/g, "") === digits);
  return contact?.name ?? null;
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} mnt lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function WaInbox() {
  const { messages, markSeen } = useWaInbox(15_000);
  const [, forceTick] = useState(0);

  // Selama feed terlihat, semua pesan dianggap sudah dibaca.
  useEffect(() => {
    if (typeof document === "undefined" || document.visibilityState === "visible") {
      markSeen();
    }
    const onVisible = () => {
      if (document.visibilityState === "visible") markSeen();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [markSeen]);

  // Re-render tiap menit supaya label waktu relatif segar.
  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  const list = messages ?? [];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "4px 2px 10px" }}>
        <span style={{ font: "600 15px/20px Inter, system-ui, sans-serif", color: "#191918" }}>
          Balasan masuk
        </span>
        <span style={{ font: "400 12px/16px Inter, system-ui, sans-serif", color: "#9C9A94" }}>
          {list.length > 0 ? `${list.length} pesan` : null}
        </span>
      </div>

      {list.length === 0 ? (
        <div
          style={{
            background: "#fff",
            border: "1px dashed #D5D3CE",
            borderRadius: 12,
            padding: "20px 16px",
            textAlign: "center",
            font: "400 13px/19px Inter, system-ui, sans-serif",
            color: "#71706B",
          }}
        >
          Belum ada balasan masuk. Saat klien membalas WhatsApp Anda, pesannya muncul di sini.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {list.map((m) => {
            const name = m.isGroup ? null : contactNameForPhone(m.phone);
            return (
              <div
                key={m.id}
                style={{
                  background: "#fff",
                  border: "1px solid #E8E7E3",
                  borderRadius: 12,
                  padding: "12px 14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ font: "600 13.5px/18px Inter, system-ui, sans-serif", color: "#191918" }}>
                    {name ?? (m.isGroup ? "Grup WhatsApp" : `+${m.phone}`)}
                  </span>
                  <span style={{ font: "400 11.5px/16px Inter, system-ui, sans-serif", color: "#9C9A94", flex: "none" }}>
                    {relativeTime(m.receivedAt)}
                  </span>
                </div>
                <div style={{
                  font: "400 13.5px/20px Inter, system-ui, sans-serif",
                  color: "#3B3A37",
                  paddingTop: 4,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  wordBreak: "break-word",
                }}>
                  {m.text || (m.type !== "text" ? `[${m.type}]` : "")}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
