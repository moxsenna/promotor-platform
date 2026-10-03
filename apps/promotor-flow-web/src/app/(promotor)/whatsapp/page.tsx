/**
 * Halaman "Hubungkan WhatsApp" — Fase 1 integrasi Wakonek.
 * Pola flat mengikuti /add dan /new-booking.
 */

import { BottomNav } from "@/components/BottomNav";
import { WaInbox } from "@/components/WaInbox";
import { WhatsAppConnect } from "@/components/WhatsAppConnect";

export default function WhatsAppPage() {
  return (
    <>
      <div style={{ flex: 1, overflow: "auto", paddingTop: 54, background: "#F7F7F5" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px" }}>
          <span style={{ height: 44, padding: "0 8px", display: "inline-flex", alignItems: "center", font: "500 15px Inter, system-ui, sans-serif", color: "#71706B" }}>
            Pengaturan
          </span>
        </div>

        <div style={{ padding: "4px 16px 0", font: "700 22px/28px Inter, system-ui, sans-serif", color: "#191918" }}>
          WhatsApp
        </div>
        <div style={{ padding: "2px 16px 0", font: "400 13px/19px Inter, system-ui, sans-serif", color: "#71706B" }}>
          Hubungkan nomor WhatsApp pribadi Anda untuk mengirim pesan langsung dari Ralivo Flow.
        </div>

        <div style={{ padding: "20px 16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <WhatsAppConnect />
          <WaInbox />
        </div>
      </div>
      <BottomNav />
    </>
  );
}
