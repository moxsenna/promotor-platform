"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WaInboxEntry } from "@/lib/wa-inbox";

const LAST_SEEN_KEY = "wa_inbox_last_seen";

/**
 * Polling inbox balasan masuk + pelacak "belum dibaca".
 * lastSeen disimpan di localStorage (client-only, M0).
 */
export function useWaInbox(intervalMs = 15_000) {
  const [messages, setMessages] = useState<WaInboxEntry[] | null>(null);
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const tickRef = useRef(0);

  const refresh = useCallback(async () => {
    const tick = ++tickRef.current;
    try {
      const res = await fetch("/api/wa/inbox", { cache: "no-store" });
      const data = (await res.json()) as { messages?: WaInboxEntry[] };
      if (tick === tickRef.current) setMessages(data.messages ?? []);
    } catch {
      // biarkan nilai lama; polling best-effort
    }
  }, []);

  useEffect(() => {
    setLastSeen(() => {
      if (typeof window === "undefined") return null;
      return window.localStorage.getItem(LAST_SEEN_KEY);
    });
    void refresh();

    const t = setInterval(() => {
      if (typeof document === "undefined" || document.visibilityState === "visible") {
        void refresh();
      }
    }, intervalMs);
    const onVisible = () => {
      if (typeof document === "undefined" || document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh, intervalMs]);

  const markSeen = useCallback(() => {
    const now = new Date().toISOString();
    try {
      window.localStorage.setItem(LAST_SEEN_KEY, now);
    } catch {
      // localStorage tidak tersedia — abaikan
    }
    setLastSeen(now);
  }, []);

  const unreadCount =
    messages?.filter((m) => !lastSeen || m.receivedAt > lastSeen).length ?? 0;

  return { messages, unreadCount, markSeen, refresh };
}
