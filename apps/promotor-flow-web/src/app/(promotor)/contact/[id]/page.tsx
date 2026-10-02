/**
 * Contact Detail Page
 * Per mockup lines 115-148
 */

import { mockStore } from "@/adapters/mock/mock-state-store";

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const contact = mockStore.getContactById(params.id);

  if (!contact) {
    return <div style={{ padding: 20 }}>Kontak tidak ditemukan</div>;
  }

  return (
    <>
      <div style={{ flex: 1, overflow: "auto", paddingTop: 54, background: "#fff" }}>
        {/* Header with back and menu buttons */}
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
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="#71706B">
              <circle cx="4" cy="9" r="1.5" />
              <circle cx="9" cy="9" r="1.5" />
              <circle cx="14" cy="9" r="1.5" />
            </svg>
          </button>
        </div>

        {/* Contact Info */}
        <div style={{ padding: "4px 16px 0" }}>
          <div
            style={{
              font: "700 22px/28px Inter, system-ui, sans-serif",
              color: "#191918",
            }}
          >
            {contact.name}
          </div>
          <div
            style={{
              font: "400 14px/20px Inter, system-ui, sans-serif",
              color: "#71706B",
              paddingTop: 2,
            }}
          >
            {contact.phoneE164}
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              height: 44,
              margin: "0 -6px",
              padding: "0 6px",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#167A68",
              }}
            />
            <span style={{ font: "600 13.5px Inter, system-ui, sans-serif", color: "#191918" }}>
              Prospek
            </span>
            <span style={{ font: "400 13.5px Inter, system-ui, sans-serif", color: "#71706B" }}>
              · Parenting · Instagram
            </span>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#9C9A94" strokeWidth={1.6} strokeLinecap="round">
              <path d="M3.5 5.5L7 9l3.5-3.5" />
            </svg>
          </button>
        </div>

        {/* Next Actions Section */}
        <div
          style={{
            font: "600 11px/16px Inter, system-ui, sans-serif",
            letterSpacing: 0.07,
            color: "#9C9A94",
            textTransform: "uppercase",
            padding: "28px 16px 8px",
          }}
        >
          Tindakan berikutnya
        </div>
        <div style={{ padding: "0 16px" }}>
          <div
            style={{
              font: "600 15.5px/21px Inter, system-ui, sans-serif",
              color: "#191918",
            }}
          >
            Follow-up jadwal weekend
          </div>
          <div
            style={{
              font: "400 13.5px/19px Inter, system-ui, sans-serif",
              color: "#B42318",
              paddingTop: 2,
            }}
          >
            Terlambat 1 hari · kemarin 10:00
          </div>
          <button
            style={{
              width: "100%",
              height: 46,
              marginTop: 14,
              border: "none",
              borderRadius: 8,
              background: "#167A68",
              color: "#fff",
              font: "600 15px Inter, system-ui, sans-serif",
              cursor: "pointer",
            }}
          >
            Buka WhatsApp
          </button>
          <div style={{ display: "flex", gap: 20, paddingTop: 12 }}>
            <button
              style={{
                background: "none",
                border: "none",
                padding: "4px 0",
                font: "500 14px Inter, system-ui, sans-serif",
                color: "#167A68",
                cursor: "pointer",
              }}
            >
              Atur ulang
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                padding: "4px 0",
                font: "500 14px Inter, system-ui, sans-serif",
                color: "#167A68",
                cursor: "pointer",
              }}
            >
              Selesai tanpa pesan
            </button>
          </div>
        </div>

        {/* Notes Section */}
        <div
          style={{
            font: "600 11px/16px Inter, system-ui, sans-serif",
            letterSpacing: 0.07,
            color: "#9C9A94",
            textTransform: "uppercase",
            padding: "28px 16px 8px",
          }}
        >
          Catatan
        </div>
        <div style={{ padding: "0 16px" }}>
          <div
            style={{
              font: "400 14px/21px Inter, system-ui, sans-serif",
              color: "#191918",
              wordWrap: "break-word",
            }}
          >
            Anak kelas 9. Sedang bingung memilih SMA. Tanya jadwal weekend karena kerja Senin–Jumat.
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              padding: "8px 0 0",
              font: "500 14px Inter, system-ui, sans-serif",
              color: "#167A68",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        </div>

        {/* Booking Section */}
        <div
          style={{
            font: "600 11px/16px Inter, system-ui, sans-serif",
            letterSpacing: 0.07,
            color: "#9C9A94",
            textTransform: "uppercase",
            padding: "28px 16px 8px",
          }}
        >
          Booking
        </div>
        <div style={{ padding: "0 16px" }}>
          <div
            style={{
              font: "400 14px/20px Inter, system-ui, sans-serif",
              color: "#71706B",
            }}
          >
            Belum ada
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              padding: "8px 0 0",
              font: "500 14px Inter, system-ui, sans-serif",
              color: "#167A68",
              cursor: "pointer",
            }}
          >
            + Buat booking
          </button>
        </div>

        {/* Activity Section */}
        <div
          style={{
            font: "600 11px/16px Inter, system-ui, sans-serif",
            letterSpacing: 0.07,
            color: "#9C9A94",
            textTransform: "uppercase",
            padding: "28px 16px 8px",
          }}
        >
          Aktivitas
        </div>
        <div style={{ padding: "0 16px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <span
              style={{
                font: "450 12.5px/18px Inter, system-ui, sans-serif",
                color: "#9C9A94",
                width: 52,
                flex: "none",
              }}
            >
              12 Agu
            </span>
            <span style={{ font: "400 13.5px/18px Inter, system-ui, sans-serif", color: "#191918" }}>
              Follow-up jatuh tempo
            </span>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <span
              style={{
                font: "450 12.5px/18px Inter, system-ui, sans-serif",
                color: "#9C9A94",
                width: 52,
                flex: "none",
              }}
            >
              10 Agu
            </span>
            <span style={{ font: "400 13.5px/18px Inter, system-ui, sans-serif", color: "#191918" }}>
              WhatsApp dikirim
            </span>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <span
              style={{
                font: "450 12.5px/18px Inter, system-ui, sans-serif",
                color: "#9C9A94",
                width: 52,
                flex: "none",
              }}
            >
              8 Agu
            </span>
            <span style={{ font: "400 13.5px/18px Inter, system-ui, sans-serif", color: "#191918" }}>
              Menanyakan harga
            </span>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <span
              style={{
                font: "450 12.5px/18px Inter, system-ui, sans-serif",
                color: "#9C9A94",
                width: 52,
                flex: "none",
              }}
            >
              8 Agu
            </span>
            <span style={{ font: "400 13.5px/18px Inter, system-ui, sans-serif", color: "#191918" }}>
              Prospek ditambahkan
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
