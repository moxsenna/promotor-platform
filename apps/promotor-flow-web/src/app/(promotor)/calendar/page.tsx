/**
 * Calendar/Agenda Page
 * Per mockup lines 150-179
 */

import { AddButton } from "@/components/AddButton";
import { BottomNav } from "@/components/BottomNav";

export default async function CalendarPage() {
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
          <div>
            <div
              style={{
                font: "700 24px/29px Inter, system-ui, sans-serif",
                color: "#191918",
              }}
            >
              Agenda
            </div>
            <div
              style={{
                font: "400 14px/20px Inter, system-ui, sans-serif",
                color: "#71706B",
                paddingTop: 2,
              }}
            >
              Agustus 2026
            </div>
          </div>
          <AddButton size={44} iconSize={20} />
        </div>

        {/* Today Section */}
        <div
          style={{
            font: "600 11px/16px Inter, system-ui, sans-serif",
            letterSpacing: 0.07,
            color: "#9C9A94",
            textTransform: "uppercase",
            padding: "24px 16px 8px",
          }}
        >
          Hari ini · Selasa 12
        </div>
        <div style={{ background: "#fff", borderTop: "1px solid #E8E7E3" }}>
          {/* Booking 1 */}
          <div
            style={{
              display: "flex",
              gap: 14,
              padding: "13px 16px",
              borderBottom: "1px solid #E8E7E3",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                font: "600 13.5px/19px Inter, system-ui, sans-serif",
                color: "#191918",
                width: 44,
                flex: "none",
              }}
            >
              10:00
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  font: "600 15.5px/21px Inter, system-ui, sans-serif",
                  color: "#191918",
                }}
              >
                Dimas Prakoso
              </div>
              <div
                style={{
                  font: "400 13px/18px Inter, system-ui, sans-serif",
                  color: "#71706B",
                }}
              >
                Tes Personal · Datang ke lokasi
              </div>
              <div
                style={{
                  font: "400 13px/18px Inter, system-ui, sans-serif",
                  color: "#B54708",
                }}
              >
                DP belum dibayar
              </div>
            </div>
          </div>

          {/* Booking 2 */}
          <div
            style={{
              display: "flex",
              gap: 14,
              padding: "13px 16px",
              borderBottom: "1px solid #E8E7E3",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                font: "600 13.5px/19px Inter, system-ui, sans-serif",
                color: "#191918",
                width: 44,
                flex: "none",
              }}
            >
              14:00
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  font: "600 15.5px/21px Inter, system-ui, sans-serif",
                  color: "#191918",
                }}
              >
                Arief Santoso
              </div>
              <div
                style={{
                  font: "400 13px/18px Inter, system-ui, sans-serif",
                  color: "#71706B",
                }}
              >
                Tes Family · Home visit
              </div>
            </div>
          </div>
        </div>

        {/* Next Day Section */}
        <div
          style={{
            font: "600 11px/16px Inter, system-ui, sans-serif",
            letterSpacing: 0.07,
            color: "#9C9A94",
            textTransform: "uppercase",
            padding: "24px 16px 8px",
          }}
        >
          Kamis 14
        </div>
        <div style={{ background: "#fff", borderTop: "1px solid #E8E7E3" }}>
          {/* Booking 3 */}
          <div
            style={{
              display: "flex",
              gap: 14,
              padding: "13px 16px",
              borderBottom: "1px solid #E8E7E3",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                font: "600 13.5px/19px Inter, system-ui, sans-serif",
                color: "#191918",
                width: 44,
                flex: "none",
              }}
            >
              10:00
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  font: "600 15.5px/21px Inter, system-ui, sans-serif",
                  color: "#191918",
                }}
              >
                Ayu Rahma
              </div>
              <div
                style={{
                  font: "400 13px/18px Inter, system-ui, sans-serif",
                  color: "#71706B",
                }}
              >
                Tes Personal · Datang ke lokasi
              </div>
            </div>
          </div>

          {/* Booking 4 */}
          <div
            style={{
              display: "flex",
              gap: 14,
              padding: "13px 16px",
              borderBottom: "1px solid #E8E7E3",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                font: "600 13.5px/19px Inter, system-ui, sans-serif",
                color: "#191918",
                width: 44,
                flex: "none",
              }}
            >
              16:00
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  font: "600 15.5px/21px Inter, system-ui, sans-serif",
                  color: "#191918",
                }}
              >
                Sari Melati
              </div>
              <div
                style={{
                  font: "400 13px/18px Inter, system-ui, sans-serif",
                  color: "#71706B",
                }}
              >
                Tes Couple · Home visit
              </div>
              <div
                style={{
                  font: "400 13px/18px Inter, system-ui, sans-serif",
                  color: "#9C9A94",
                }}
              >
                Belum dikonfirmasi
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: 24 }} />
      </div>

      <BottomNav navToday="#9C9A94" navContacts="#9C9A94" navCalendar="#191918" />
    </>
  );
}
