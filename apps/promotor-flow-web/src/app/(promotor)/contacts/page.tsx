/**
 * Contacts List Page
 * Per mockup lines 87-113
 */

import { mockStore } from "@/adapters/mock/mock-state-store";
import { AddButton } from "@/components/AddButton";
import { BottomNav } from "@/components/BottomNav";

export default async function ContactsPage() {
  const contacts = mockStore.getContacts();

  return (
    <>
      <div style={{ flex: 1, overflow: "auto", paddingTop: 54, background: "#fff" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px 0",
          }}
        >
          <div
            style={{
              font: "700 24px/29px Inter, system-ui, sans-serif",
              color: "#191918",
            }}
          >
            Kontak
          </div>
          <AddButton size={44} iconSize={20} />
        </div>

        {/* Search Bar */}
        <div style={{ padding: "12px 16px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 40,
              padding: "0 12px",
              background: "#fff",
              border: "1px solid #E8E7E3",
              borderRadius: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#9C9A94" strokeWidth={1.6} strokeLinecap="round">
              <circle cx="7" cy="7" r="4.4" />
              <path d="M10.3 10.3L14 14" />
            </svg>
            <span style={{ font: "400 14px Inter, system-ui, sans-serif", color: "#9C9A94" }}>
              Cari nama atau nomor
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: 20,
            padding: "16px 16px 0",
            borderBottom: "1px solid #E8E7E3",
          }}
        >
          <button
            style={{
              background: "none",
              border: "none",
              padding: "0 0 10px",
              cursor: "pointer",
              font: "600 14px Inter, system-ui, sans-serif",
              color: "#191918",
              borderBottom: "2px solid #191918",
              marginBottom: -1,
            }}
          >
            Semua
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              padding: "0 0 10px",
              cursor: "pointer",
              font: "600 14px Inter, system-ui, sans-serif",
              color: "#9C9A94",
              borderBottom: "2px solid transparent",
              marginBottom: -1,
            }}
          >
            Prospek
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              padding: "0 0 10px",
              cursor: "pointer",
              font: "600 14px Inter, system-ui, sans-serif",
              color: "#9C9A94",
              borderBottom: "2px solid transparent",
              marginBottom: -1,
            }}
          >
            Klien
          </button>
        </div>

        {/* Contact List */}
        <div style={{ background: "#fff" }}>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "13px 16px",
                borderBottom: "1px solid #E8E7E3",
                cursor: "pointer",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    font: "600 15.5px/21px Inter, system-ui, sans-serif",
                    color: "#191918",
                  }}
                >
                  {contact.name}
                </div>
                <div
                  style={{
                    font: "400 13px/18px Inter, system-ui, sans-serif",
                    color: "#71706B",
                  }}
                >
                  {contact.phoneE164}
                </div>
              </div>
              <span
                style={{
                  font: "450 12.5px Inter, system-ui, sans-serif",
                  color: "#9C9A94",
                  whiteSpace: "nowrap",
                }}
              >
                {/* Placeholder for trail data */}
                +62
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="#C6C4BE"
                strokeWidth={1.6}
                strokeLinecap="round"
              >
                <path d="M6 3.5L10.5 8L6 12.5" />
              </svg>
            </div>
          ))}
        </div>

        <div style={{ height: 24 }} />
      </div>

      <BottomNav navToday="#9C9A94" navContacts="#191918" navCalendar="#9C9A94" />
    </>
  );
}
