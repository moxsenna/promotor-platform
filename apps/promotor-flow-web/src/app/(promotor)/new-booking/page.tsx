/**
 * New Booking Page
 * Per mockup lines 222-237
 */

import { BottomNav } from "@/components/BottomNav";

export default async function NewBookingPage() {
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
          Booking baru
        </div>

        {/* Form Fields */}
        <div style={{ padding: "22px 16px 0", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Contact Field */}
          <div>
            <div style={{ font: "500 13px/18px Inter, system-ui, sans-serif", color: "#71706B", paddingBottom: 6 }}>
              Kontak
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
              Ayu Rahma
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#9C9A94" strokeWidth={1.6} strokeLinecap="round">
                <path d="M3.5 5.5L7 9l3.5-3.5" />
              </svg>
            </div>
          </div>

          {/* Service Field */}
          <div>
            <div style={{ font: "500 13px/18px Inter, system-ui, sans-serif", color: "#71706B", paddingBottom: 6 }}>
              Layanan
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
              Tes Personal · Rp500.000
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#9C9A94" strokeWidth={1.6} strokeLinecap="round">
                <path d="M3.5 5.5L7 9l3.5-3.5" />
              </svg>
            </div>
          </div>

          {/* Date and Time Fields */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ font: "500 13px/18px Inter, system-ui, sans-serif", color: "#71706B", paddingBottom: 6 }}>
                Tanggal
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
                14 Agu
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: "500 13px/18px Inter, system-ui, sans-serif", color: "#71706B", paddingBottom: 6 }}>
                Jam
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
                10:00
              </div>
            </div>
          </div>

          {/* Location Field */}
          <div>
            <div style={{ font: "500 13px/18px Inter, system-ui, sans-serif", color: "#71706B", paddingBottom: 6 }}>
              Lokasi
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div
                style={{
                  flex: 1,
                  height: 44,
                  border: "1px solid #167A68",
                  borderRadius: 8,
                  background: "#EAF5F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  font: "600 14px Inter, system-ui, sans-serif",
                  color: "#167A68",
                }}
              >
                Datang ke lokasi
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
                Home visit
              </div>
            </div>
          </div>

          {/* Schedule conflict notice */}
          <div style={{ font: "400 13px/19px Inter, system-ui, sans-serif", color: "#9C9A94", marginTop: -4 }}>
            Tidak ada bentrok dengan jadwal lain.
          </div>

          {/* DP Field */}
          <div>
            <div style={{ font: "500 13px/18px Inter, system-ui, sans-serif", color: "#71706B", paddingBottom: 6 }}>
              DP
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
              Rp150.000
            </div>
          </div>

          {/* Save button */}
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
            Simpan booking
          </button>

          {/* Info text */}
          <div
            style={{
              font: "400 12.5px/18px Inter, system-ui, sans-serif",
              color: "#9C9A94",
              paddingBottom: 24,
              textAlign: "center",
            }}
          >
            Setelah disimpan, konfirmasi bisa dikirim via WhatsApp.
          </div>
        </div>
      </div>

      <BottomNav navToday="#9C9A94" navContacts="#9C9A94" navCalendar="#9C9A94" />
    </>
  );
}
