"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type WaStage =
  | "unconfigured"
  | "not_connected"
  | "needs_pairing"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface WaStatus {
  stage: WaStage;
  phone: string | null;
}

const IDLE_STAGE: WaStage[] = ["not_connected", "needs_pairing", "error", "unconfigured"];

/**
 * Polling status koneksi WhatsApp dari BFF (/api/wa/status).
 * Poll hanya saat tab terlihat; interval bisa dilewati lewat resetKey
 * (mis. setelah pairing selesai) agar status segar segera.
 */
export function useWaStatus(intervalMs = 30_000, resetKey: unknown = null) {
  const [status, setStatus] = useState<WaStatus | null>(null);
  const tickRef = useRef(0);

  const refresh = useCallback(async () => {
    const tick = ++tickRef.current;
    try {
      const res = await fetch("/api/wa/status", { cache: "no-store" });
      const data = (await res.json()) as WaStatus;
      if (tick === tickRef.current) setStatus(data);
    } catch {
      if (tick === tickRef.current) setStatus({ stage: "error", phone: null });
    }
  }, []);

  useEffect(() => {
    void refresh();

    if (typeof document === "undefined" || typeof document.hasFocus !== "function") {
      const t = setInterval(() => void refresh(), intervalMs);
      return () => clearInterval(t);
    }

    const t = setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, intervalMs);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh, intervalMs, resetKey]);

  return { status, refresh, isIdle: (s: WaStatus | null) => !s || IDLE_STAGE.includes(s.stage) };
}
