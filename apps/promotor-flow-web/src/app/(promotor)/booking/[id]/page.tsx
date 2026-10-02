/**
 * Booking Detail Page
 * Per mockup lines 182-206
 */

import { BottomNav } from "@/components/BottomNav";

export default async function BookingDetailPage() {
  return (
    <>
      <div style={{ flex: 1, overflow: "auto", paddingTop: 54, background: "#fff" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
          }}
        >
          <button
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#191918",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
              <path d="M11.5 5L6 10l5.5 5" />
            </svg>
          </button>
          <button style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="#71706B">
              <circle cx="4" cy="9" r="1.5" />
              <circle cx="9" cy="9" r="1.5" />
              <circle cx="14" cy="9" r="1.5" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <div style={{ padding: "4px 16px 0", font: "700 22px/28px Inter, system-ui, sans-serif", color: "#191918" }}>
          Dimas Prakoso
        </div>
        <div style={{ padding: "0 16px 2px", font: "400 14px/20px Inter, system-ui, sans-serif", color: "#71706B" }}>
          Senin, 12 Agustus 2026 · 10:00
        </div>

        {/* Status Cards */}
        <div style={{ padding: "16px 0 0", display: "flex", gap: 12 }}>
          <div
            style={{
              flex: 1,
              minHeight: 60,
              border: "1px solid #D5D3CE",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              padding: "10px 12px",
              gap: 4,
            }}
          >
            <div style={{ font: "400 11.5px/17px Inter, system-ui, sans-serif", color: "#71706B" }}>
              Total tagihan
            </div>
            <div style={{ font: "700 16px/22px Inter, system-ui, sans-serif", color: "#191918" }}>
              Rp500.000
            </div>
            <div
              style={{
                alignSelf: "flex-start",
                height: 20,
                padding: "0 8px",
                borderRadius: 100,
                background: "#F2F2F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                font: "500 10px/16px Inter, system-ui, sans-serif",
                color: "#71706B",
              }}
            >
              Belum dibayar
            </div>
          </div>

          <div
            style={{
              flex: 1,
              minHeight: 60,
              border: "1px solid #D5D3CE",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              padding: "10px 12px",
              gap: 4,
            }}
          >
            <div style={{ font: "400 11.5px/17px Inter, system-ui, sans-serif", color: "#71706B" }}>
              Pembayaran
            </div>
            <div style={{ font: "700 16px/22px Inter, system-ui, sans-serif", color: "#191918" }}>
              Rp0
            </div>
            <div
              style={{
                alignSelf: "flex-start",
                height: 20,
                padding: "0 8px",
                borderRadius: 100,
                background: "#EAF5F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                font: "500 10px/16px Inter, system-ui, sans-serif",
                color: "#167A68",
              }}
            >
              Belum ada
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div style={{ padding: "14px 0 0", display: "flex", gap: 12 }}>
          <div
            style={{
              flex: 1,
              border: "1px solid #D5D3CE",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              padding: "10px 12px",
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#71706B" strokeWidth={1.5}>
                <rect x="3.5" y="5" width="9" height="6" rx="1" />
                <path d="M4 11h8M5 3h6a2 2 0 0 1 2 2v1H3V5a2 2 0 0 1 2-2Z" />
              </svg>
              <div style={{ font: "500 14px/20px Inter, system-ui, sans-serif", color: "#191918" }}>
                Home visit
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              border: "1px solid #D5D3CE",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              padding: "10px 12px",
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#71706B" strokeWidth={1.5}>
                <circle cx="8" cy="8" r="5" />
                <path d="M8 5v3l2 1" />
              </svg>
              <div style={{ font: "500 14px/20px Inter, system-ui, sans-serif", color: "#191918" }}>
                10:00 - 11:00
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div style={{ font: "600 11px/16px Inter, system-ui, sans-serif", letterSpacing: ".07em", color: "#9C9A94", textTransform: "uppercase", padding: "26px 16px 8px" }}>
          Tindakan
        </div>
        <div style={{ padding: "0 16px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            style={{
              width: "100%",
              height: 46,
              border: "none",
              borderRadius: 8,
              background: "#167A68",
              color: "#fff",
              font: "600 15px Inter, system-ui, sans-serif",
              cursor: "pointer",
            }}
          >
            Kirim WA pengingat
          </button>
          <button
            style={{
              width: "100%",
              height: 46,
              border: "1px solid #D5D3CE",
              borderRadius: 8,
              background: "#fff",
              color: "#191918",
              font: "600 15px Inter, system-ui, sans-serif",
              cursor: "pointer",
            }}
          >
            Bayar di lokasi
          </button>
          <button
            style={{
              width: "100%",
              height: 46,
              border: "1px solid #D5D3CE",
              borderRadius: 8,
              background: "#fff",
              color: "#191918",
              font: "500 15px Inter, system-ui, sans-serif",
              cursor: "pointer",
            }}
          >
            Pindahkan jadwal
          </button>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              style={{
                flex: 1,
                height: 46,
                border: "1px solid #D5D3CE",
                borderRadius: 8,
                background: "#fff",
                color: "#B42318",
                font: "500 15px Inter, system-ui, sans-serif",
                cursor: "pointer",
              }}
            >
              Batalkan
            </button>
            <button
              style={{
                flex: 1,
                height: 46,
                border: "1px solid #D5D3CE",
                borderRadius: 8,
                background: "#fff",
                color: "#191918",
                font: "500 15px Inter, system-ui, sans-serif",
                cursor: "pointer",
              }}
            >
              Selesaikan
            </button>
          </div>
        </div>
      </div>

      <BottomNav navToday="#9C9A94" navContacts="#9C9A94" navCalendar="#9C9A94" />
    </>
  );
}
