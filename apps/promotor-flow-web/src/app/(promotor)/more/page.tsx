/**
 * Halaman "Lainnya" — entri menu sesuai PRD §10.4 / mockup.
 * Baris non-fungsional untuk saat ini (placeholder mockup); baris
 * "Koneksi WhatsApp" fungsional → /whatsapp.
 */

import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { WaStatusPill } from "@/components/WaStatusPill";

const ROW_FONT = "400 15px/20px Inter, system-ui, sans-serif";

function Row({ label, trailing }: { label: string; trailing?: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 52,
        padding: "0 16px",
        background: "#fff",
        borderTop: "1px solid #E8E7E3",
      }}
    >
      <span style={{ font: ROW_FONT, color: "#191918" }}>{label}</span>
      {trailing ?? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#9C9A94" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
          <path d="M6 3.5L10.5 8L6 12.5" />
        </svg>
      )}
    </div>
  );
}

export default function MorePage() {
  return (
    <>
      <div style={{ flex: 1, overflow: "auto", paddingTop: 54, background: "#F7F7F5" }}>
        <div style={{ padding: "8px 16px 0", font: "700 24px/29px Inter, system-ui, sans-serif", color: "#191918" }}>
          Lainnya
        </div>

        <div style={{ padding: "16px 0 0" }}>
          <Link href="/whatsapp" style={{ textDecoration: "none", display: "block" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: 52,
                padding: "0 16px",
                background: "#fff",
                borderTop: "1px solid #E8E7E3",
                cursor: "pointer",
              }}
            >
              <span style={{ font: ROW_FONT, color: "#191918" }}>Koneksi WhatsApp</span>
              <WaStatusPill />
            </div>
          </Link>
          <Row label="Layanan" trailing={<span style={{ font: "400 13px Inter, system-ui, sans-serif", color: "#71706B" }}>3 aktif</span>} />
          <Row label="Halaman booking" />
          <Row label="Template pesan" />
          <Row label="Tag" />
          <Row label="Profil" />
          <Row label="Notifikasi" trailing={<span style={{ font: "400 13px Inter, system-ui, sans-serif", color: "#71706B" }}>Ringkasan harian 09:00</span>} />
          <Row label="Pengaturan" />
          <Row label="Bantuan" />
          <div style={{ borderTop: "1px solid #E8E7E3" }} />
        </div>

        <div style={{ padding: "24px 16px 32px", textAlign: "center", font: "400 12px/16px Inter, system-ui, sans-serif", color: "#9C9A94" }}>
          PromotorFlow V0.1 · Rina Pratiwi
        </div>
      </div>
      <BottomNav />
    </>
  );
}
