/**
 * Add Prospect Page
 * Per mockup lines 208-220
 */

import { BottomNav } from "@/components/BottomNav";

export default async function AddPage() {
  return (
    <>
      <div style={{ flex: 1, overflow: "auto", paddingTop: 54, background: "#fff" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px" }}>
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
          Prospek baru
        </div>

        {/* Form Fields */}
        <div style={{ padding: "24px 16px 0", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Name Field */}
          <div>
            <div style={{ font: "500 13px/18px Inter, system-ui, sans-serif", color: "#71706B", paddingBottom: 6 }}>
              Nama
            </div>
            <div
              style={{
                height: 46,
                border: "1px solid #D5D3CE",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                font: "400 15px Inter, system-ui, sans-serif",
                color: "#191918",
              }}
            >
              Ayu Rahma
            </div>
          </div>

          {/* WhatsApp Field */}
          <div>
            <div style={{ font: "500 13px/18px Inter, system-ui, sans-serif", color: "#71706B", paddingBottom: 6 }}>
              WhatsApp
            </div>
            <div
              style={{
                height: 46,
                border: "1px solid #167A68",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                font: "400 15px Inter, system-ui, sans-serif",
                color: "#191918",
              }}
            >
              0812 1110 001
              <span style={{ width: 1.5, height: 20, background: "#167A68", marginLeft: 2 }} />
            </div>
          </div>

          {/* Needs/Kebutuhan Field */}
          <div>
            <div style={{ font: "500 13px/18px Inter, system-ui, sans-serif", color: "#71706B", paddingBottom: 6 }}>
              Kebutuhan
            </div>
            <div
              style={{
                height: 46,
                border: "1px solid #D5D3CE",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 12px",
                font: "400 15px Inter, system-ui, sans-serif",
                color: "#191918",
              }}
            >
              Parenting
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#9C9A94" strokeWidth={1.6} strokeLinecap="round">
                <path d="M3.5 5.5L7 9l3.5-3.5" />
              </svg>
            </div>
          </div>

          {/* Add more info button */}
          <button
            style={{
              background: "none",
              border: "none",
              padding: 0,
              textAlign: "left",
              font: "500 14px Inter, system-ui, sans-serif",
              color: "#167A68",
              cursor: "pointer",
            }}
          >
            + Tambahkan sumber & catatan
          </button>

          {/* Save button */}
          <button
            style={{
              width: "100%",
              height: 46,
              marginTop: 6,
              border: "none",
              borderRadius: 8,
              background: "#167A68",
              color: "#fff",
              font: "600 15px Inter, system-ui, sans-serif",
              cursor: "pointer",
            }}
          >
            Simpan prospek
          </button>
        </div>
      </div>

      <BottomNav navToday="#9C9A94" navContacts="#9C9A94" navCalendar="#9C9A94" />
    </>
  );
}
