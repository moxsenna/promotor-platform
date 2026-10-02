/**
 * Reschedule Page
 * Per mockup lines 239-254
 */

import { BottomNav } from "@/components/BottomNav";

export default async function ReschedulePage() {
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
              height: 44,
              padding: "0 8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              font: "500 15px Inter, system-ui, sans-serif",
              color: "#71706B",
            }}
          >
            Batal
          </button>
        </div>

        {/* Title */}
        <div style={{ padding: "4px 16px 0", font: "700 22px/28px Inter, system-ui, sans-serif", color: "#191918" }}>
          Ubah jadwal
        </div>

        {/* Current Schedule Display */}
        <div style={{ padding: "22px 16px 10px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ font: "400 13px/19px Inter, system-ui, sans-serif", color: "#71706B", paddingBottom: 6 }}>
            Jadwal saat ini
          </div>
          <div
            style={{
              minHeight: 64,
              border: "1px solid #D5D3CE",
              borderRadius: 8,
              padding: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#71706B" strokeWidth={1.5}>
                <rect x="3.5" y="5" width="13" height="10" rx="1.5" />
                <path d="M3.5 8h13M6.5 4.5v3M13.5 4.5v3" />
              </svg>
              <div style={{ font: "600 15px/21px Inter, system-ui, sans-serif", color: "#191918" }}>
                Tes Personal
              </div>
            </div>
            <div style={{ font: "500 14px Inter, system-ui, sans-serif", color: "#191918" }}>
              Minggu depan
            </div>
          </div>
        </div>

        {/* New Date Selection */}
        <div style={{ font: "600 11px/16px Inter, system-ui, sans-serif", letterSpacing: ".07em", color: "#9C9A94", textTransform: "uppercase", padding: "0 16px 10px" }}>
          Tanggal baru
        </div>
        <div style={{ padding: "0 16px", display: "flex", gap: 8 }}>
          <div
            style={{
              flex: 1,
              height: 44,
              border: "1px solid #167A68",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              font: "600 14px Inter, system-ui, sans-serif",
              color: "#167A68",
            }}
          >
            Senin 17 Agu
          </div>
          <div
            style={{
              flex: 1,
              height: 44,
              border: "1px solid #D5D3CE",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              font: "500 14px Inter, system-ui, sans-serif",
              color: "#191918",
            }}
          >
            Selasa 18 Agu
          </div>
          <div
            style={{
              flex: 1,
              border: "1px solid #D5D3CE",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              font: "500 14px Inter, system-ui, sans-serif",
              color: "#71706B",
            }}
          >
            Pilih tanggal lain
          </div>
        </div>

        {/* Time Selection */}
        <div style={{ font: "600 11px/16px Inter, system-ui, sans-serif", letterSpacing: ".07em", color: "#9C9A94", textTransform: "uppercase", padding: "16px 16px 8px" }}>
          Jam
        </div>
        <div style={{ padding: "0 16px 8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div
            style={{
              width: 58,
              height: 42,
              border: "1px solid #167A68",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              font: "500 13px Inter, system-ui, sans-serif",
              color: "#167A68",
            }}
          >
            09:00
          </div>
          <div
            style={{
              width: 58,
              height: 42,
              border: "1px solid #D5D3CE",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              font: "500 13px Inter, system-ui, sans-serif",
              color: "#191918",
            }}
          >
            10:00
          </div>
          <div
            style={{
              width: 58,
              height: 42,
              border: "1px solid #D5D3CE",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              font: "500 13px Inter, system-ui, sans-serif",
              color: "#191918",
            }}
          >
            11:00
          </div>
          <div
            style={{
              width: 58,
              height: 42,
              border: "1px solid #D5D3CE",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              font: "500 13px Inter, system-ui, sans-serif",
              color: "#191918",
            }}
          >
            14:00
          </div>
          <div
            style={{
              width: 58,
              height: 42,
              border: "1px solid #D5D3CE",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              font: "500 13px Inter, system-ui, sans-serif",
              color: "#191918",
            }}
          >
            15:00
          </div>
          <div
            style={{
              width: 58,
              height: 42,
              border: "1px solid #D5D3CE",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              font: "500 13px Inter, system-ui, sans-serif",
              color: "#191918",
            }}
          >
            16:00
          </div>
        </div>

        {/* Reason Section */}
        <div style={{ font: "600 11px/16px Inter, system-ui, sans-serif", letterSpacing: ".07em", color: "#9C9A94", textTransform: "uppercase", padding: "26px 16px 10px" }}>
          Alasan · opsional
        </div>
        <div style={{ padding: "0 16px" }}>
          <div
            style={{
              minHeight: 64,
              border: "1px solid #D5D3CE",
              borderRadius: 8,
              padding: 12,
              font: "400 14px/20px Inter, system-ui, sans-serif",
              color: "#191918",
            }}
          >
            Klien minta pindah ke sore.
          </div>
        </div>

        {/* Save Buttons */}
        <div style={{ padding: "22px 16px 28px", display: "flex", flexDirection: "column", gap: 6 }}>
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
            Simpan & kabari via WhatsApp
          </button>
          <button
            style={{
              width: "100%",
              height: 44,
              background: "none",
              border: "none",
              font: "500 14.5px Inter, system-ui, sans-serif",
              color: "#167A68",
              cursor: "pointer",
            }}
          >
            Simpan tanpa mengabari
          </button>
        </div>
      </div>

      <BottomNav navToday="#9C9A94" navContacts="#9C9A94" navCalendar="#9C9A94" />
    </>
  );
}
