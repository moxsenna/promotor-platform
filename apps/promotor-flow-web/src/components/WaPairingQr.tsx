"use client";

/**
 * QR pairing in-app untuk wakonek. Diadaptasi dari komponen
 * `<WakonekPairing />` (@wakonek/sdk, D:\Coding\wakonek\packages\sdk)
 * dan di-restyle mengikuti token desain PromotorFlow (tanpa Tailwind).
 * Alur: POST /v1/devices/:id/pairing (pairing token, browser-safe)
 * + SSE /v1/devices/:id/pairing/events?token= untuk QR & status.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export interface WaPairingQrProps {
  gatewayUrl: string;
  deviceId: string;
  pairingToken: string;
  onConnected: (phone: string) => void;
  onFailed?: (message: string) => void;
}

export function WaPairingQr({
  gatewayUrl,
  deviceId,
  pairingToken,
  onConnected,
  onFailed,
}: WaPairingQrProps) {
  const [qr, setQr] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [connected, setConnected] = useState(false);
  const [runId, setRunId] = useState(0);
  // Callback disimpan di ref supaya efek SSE tidak re-run saat parent
  // me-render ulang dengan fungsi baru.
  const onConnectedRef = useRef(onConnected);
  const onFailedRef = useRef(onFailed);
  onConnectedRef.current = onConnected;
  onFailedRef.current = onFailed;

  const regenerate = useCallback(() => {
    setQr(null);
    setExpired(false);
    setRunId((n) => n + 1);
  }, []);

  useEffect(() => {
    const base = gatewayUrl.replace(/\/+$/, "");
    let disposed = false;

    fetch(`${base}/v1/devices/${encodeURIComponent(deviceId)}/pairing`, {
      method: "POST",
      headers: { "x-pairing-token": pairingToken },
    }).then((res) => {
      if (!res.ok && !disposed) {
        onFailedRef.current?.(`Gagal memulai sesi pairing (${res.status})`);
      }
    }).catch((err) => {
      if (!disposed) onFailedRef.current?.(err instanceof Error ? err.message : String(err));
    });

    const sseUrl = `${base}/v1/devices/${encodeURIComponent(deviceId)}/pairing/events?token=${encodeURIComponent(pairingToken)}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.addEventListener("qr", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.qr) {
          setQr(data.qr);
          setExpired(false);
        }
      } catch {
        // abaikan chunk tidak valid
      }
    });

    eventSource.addEventListener("status", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.status === "disconnected" || data.status === "logged_out") {
          // Sesi QR berakhir; QR terakhir tidak valid untuk dipindai.
          setExpired(true);
        }
      } catch {
        // abaikan
      }
    });

    eventSource.addEventListener("connected", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        setConnected(true);
        onConnectedRef.current?.(data.phone ?? "");
      } catch {
        // abaikan
      }
    });

    eventSource.onerror = () => {
      // EventSource reconnect sendiri; biarkan sampai disposed/unmount.
    };

    return () => {
      disposed = true;
      eventSource.close();
    };
  }, [gatewayUrl, deviceId, pairingToken, runId]);

  if (connected) {
    return (
      <div style={{ padding: "28px 16px", textAlign: "center" }}>
        <div
          aria-hidden
          style={{
            width: 56,
            height: 56,
            margin: "0 auto 12px",
            borderRadius: "50%",
            background: "var(--color-accent-soft, #E6F2EF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#167A68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.5 13.5l5 5L20.5 8" />
          </svg>
        </div>
        <div style={{ font: "600 17px/24px Inter, system-ui, sans-serif", color: "#191918" }}>
          WhatsApp terhubung
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div style={{ padding: "28px 16px", textAlign: "center" }}>
        <div style={{ font: "600 15px/22px Inter, system-ui, sans-serif", color: "#B54708", marginBottom: 6 }}>
          Kode QR kedaluwarsa
        </div>
        <div style={{ font: "400 13px/19px Inter, system-ui, sans-serif", color: "#71706B", marginBottom: 16 }}>
          Sesi QR berakhir sebelum dipindai. Buat kode baru untuk melanjutkan.
        </div>
        <button type="button" onClick={regenerate} className="pf-btn pf-btn--secondary">
          Buat QR baru
        </button>
      </div>
    );
  }

  if (qr) {
    return (
      <div style={{ padding: "20px 16px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            padding: 12,
            background: "#fff",
            border: "1px solid #E8E7E3",
            borderRadius: 12,
          }}
        >
          <QRCodeSVG value={qr} size={200} />
        </div>
        <div style={{ font: "400 13px/19px Inter, system-ui, sans-serif", color: "#71706B", maxWidth: 280, margin: "12px auto 0" }}>
          Buka <strong>WhatsApp &gt; Perangkat Tertaut &gt; Tautkan Perangkat</strong>, lalu pindai kode di atas. Kode diperbarui otomatis tiap ±20–60 detik.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "28px 16px", textAlign: "center" }}>
      <div style={{ font: "400 14px/20px Inter, system-ui, sans-serif", color: "#71706B" }}>
        Menyiapkan kode QR…
      </div>
    </div>
  );
}
