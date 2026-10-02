"use client";

/**
 * UI halaman "Hubungkan WhatsApp" (Fase 1 integrasi Wakonek).
 * Mesin status lokal: idle → pairing (QR) → connected; polling status
 * BFF sebagai sumber kebenaran saat halaman dibuka.
 */

import { useCallback, useState } from "react";
import { useWaStatus } from "@/lib/use-wa-status";
import { WaPairingQr } from "@/components/WaPairingQr";

type LocalStage = "idle" | "pairing" | "error";

export function WhatsAppConnect() {
  const { status, refresh } = useWaStatus(20_000);
  const [local, setLocal] = useState<LocalStage>("idle");
  const [pairing, setPairing] = useState<{ deviceId: string; pairingToken: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL ?? "";

  const startPairing = useCallback(async () => {
    setError(null);
    setLocal("pairing");
    try {
      const res = await fetch("/api/wa/pairing/start", { method: "POST" });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Gagal memulai pairing");
        setLocal("error");
        return;
      }
      const data = (await res.json()) as { deviceId: string; pairingToken: string };
      setPairing(data);
    } catch {
      setError("Tidak bisa menghubungi server aplikasi");
      setLocal("error");
    }
  }, []);

  const cancelPairing = useCallback(() => {
    setPairing(null);
    setLocal("idle");
    void refresh();
  }, [refresh]);

  const onConnected = useCallback(
    (_phone: string) => {
      setPairing(null);
      setLocal("idle");
      void refresh();
    },
    [refresh]
  );

  const stage = status?.stage ?? "connecting_ui";
  const phone = status?.phone ?? null;

  // Sedang menampilkan QR / baru saja selesai pair.
  if (local === "pairing") {
    if (pairing && gatewayUrl) {
      return (
        <PairingCard
          gatewayUrl={gatewayUrl}
          pairing={pairing}
          onConnected={onConnected}
          onFailed={(message) => {
            setError(message);
            setPairing(null);
            setLocal("error");
          }}
          onCancel={cancelPairing}
        />
      );
    }
    return <Card title="Memulai…" desc="Menyiapkan sesi WhatsApp." />;
  }

  if (stage === "unconfigured") {
    return (
      <Card
        title="Belum dikonfigurasi"
        desc="Kredensial Wakonek belum terisi di .env.local (WAKONEK_API_KEY, NEXT_PUBLIC_GATEWAY_URL)."
        tone="warning"
      />
    );
  }

  if (stage === "connected") {
    return (
      <Card
        title="WhatsApp terhubung"
        desc={phone ? `Pesan terkirim dari nomor ${phone}.` : "Pesan akan terkirim dari nomor WhatsApp Anda."}
        tone="success"
      />
    );
  }

  if (stage === "disconnected") {
    return (
      <>
        <Card
          title="WhatsApp terputus"
          desc="Koneksi ke WhatsApp terputus. Gateway sedang mencoba menyambung ulang otomatis — atau hubungkan ulang sekarang."
          tone="warning"
        />
        <button type="button" onClick={startPairing} className="pf-btn pf-btn--secondary pf-btn--full">
          Sambungkan ulang
        </button>
      </>
    );
  }

  if (stage === "error" || local === "error") {
    return (
      <>
        <Card title="Gagal memeriksa status" desc={error ?? "Gateway WhatsApp tidak terjangkau."} tone="warning" />
        <button type="button" onClick={() => { setLocal("idle"); setError(null); void refresh(); }} className="pf-btn pf-btn--secondary pf-btn--full">
          Coba lagi
        </button>
      </>
    );
  }

  // not_connected / needs_pairing / status belum termuat
  return (
    <>
      <EmptyConnect />
      <button type="button" onClick={startPairing} className="pf-btn pf-btn--primary pf-btn--full">
        Hubungkan WhatsApp
      </button>
      {error ? (
        <div style={{ font: "400 13px/19px Inter, system-ui, sans-serif", color: "#B42318", textAlign: "center" }}>
          {error}
        </div>
      ) : null}
    </>
  );
}

function EmptyConnect() {
  return (
    <div className="pf-empty-state">
      <div className="pf-empty-title">WhatsApp belum terhubung</div>
      <div className="pf-empty-desc">
        Hubungkan nomor WhatsApp Anda sekali saja. Setelah itu, pengingat booking, reminder
        pembayaran, dan follow-up aftercare bisa dikirim langsung dari Ralivo Flow — tanpa
        berpindah aplikasi — dan status terkirimnya tercatat otomatis.
      </div>
    </div>
  );
}

function PairingCard({
  gatewayUrl,
  pairing,
  onConnected,
  onFailed,
  onCancel,
}: {
  gatewayUrl: string;
  pairing: { deviceId: string; pairingToken: string };
  onConnected: (phone: string) => void;
  onFailed: (message: string) => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div
        style={{
          background: "#fff",
          border: "1px solid #E8E7E3",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <WaPairingQr
          gatewayUrl={gatewayUrl}
          deviceId={pairing.deviceId}
          pairingToken={pairing.pairingToken}
          onConnected={onConnected}
          onFailed={onFailed}
        />
      </div>
      <button type="button" onClick={onCancel} className="pf-btn pf-btn--ghost pf-btn--full">
        Batal
      </button>
    </>
  );
}

function Card({
  title,
  desc,
  tone,
}: {
  title: string;
  desc: string;
  tone?: "success" | "warning";
}) {
  const dotColor = tone === "success" ? "#067647" : tone === "warning" ? "#B54708" : "#9C9A94";
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8E7E3",
        borderRadius: 12,
        padding: "24px 16px",
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
        <span aria-hidden style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, flex: "none" }} />
        <span style={{ font: "600 16px/24px Inter, system-ui, sans-serif", color: "#191918" }}>{title}</span>
      </div>
      <div style={{ font: "400 13px/19px Inter, system-ui, sans-serif", color: "#71706B", maxWidth: 300, margin: "0 auto" }}>
        {desc}
      </div>
    </div>
  );
}
