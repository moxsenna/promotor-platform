import { mockStore } from "@/adapters/mock/mock-state-store";
import { AddButton } from "@/components/AddButton";
import { BottomNav } from "@/components/BottomNav";
import { WaReplyBadge } from "@/components/WaReplyBadge";
import { WaStatusBadge } from "@/components/WaStatusBadge";
import { WaActionButton } from "@/components/WaActionButton";
import { buildWaMessage, templateForTodayStatus } from "@/lib/wa-templates";
import type { TodayViewItem } from "@/adapters/mock/mock-state-store";

function todayWaMessage(item: TodayViewItem): string {
  return buildWaMessage(templateForTodayStatus(item.statusType), {
    firstName: item.contact.name.split(/\s+/)[0],
    serviceName: item.serviceInfo.split("·")[0].trim(),
    bookingDate: item.timeIndicator || undefined,
  });
}

interface SectionProps {
  title: string;
  textColor: string;
  items: TodayViewItem[];
}

function ContactRowSection({ title, textColor, items }: SectionProps) {
  if (items.length === 0) return null;

  return (
    <>
      <div
        style={{
          fontWeight: 600,
          fontSize: 11,
          lineHeight: "16px",
          letterSpacing: 0.07,
          color: textColor,
          textTransform: "uppercase",
          padding: "24px 16px 8px",
        }}
      >
        {title}
      </div>
      <div style={{ background: "#fff", borderTop: "1px solid #E8E7E3" }}>
        {items.map((item) => (
          <ContactRow key={(item.contact.id as any) + item.statusType} item={item} />
        ))}
      </div>
    </>
  );
}

function ContactRow({ item }: { item: TodayViewItem }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "13px 16px", borderBottom: "1px solid #E8E7E3" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name + Time/Status side by side */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: 15.5,
              lineHeight: "21px",
              fontFamily: "Inter, system-ui, sans-serif",
              color: "#191918",
            }}
          >
            {item.contact.name}
          </span>
          <span
            style={{
              fontWeight: 500,
              fontSize: 12.5,
              lineHeight: "21px",
              fontFamily: "Inter, system-ui, sans-serif",
              color: getTimeColor(item),
              whiteSpace: "nowrap",
            }}
          >
            {item.timeIndicator}
          </span>
        </div>

        {/* Service/Context info */}
        <div
          style={{
            fontSize: 13,
            lineHeight: "18px",
            fontFamily: "Inter, system-ui, sans-serif",
            color: "#71706B",
          }}
        >
          {item.serviceInfo}
        </div>

        {/* Action text + CTA button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            paddingTop: 3,
          }}
        >
          <span
            style={{
              fontSize: 13.5,
              lineHeight: "19px",
              fontFamily: "Inter, system-ui, sans-serif",
              color: getActionTextColor(item),
            }}
          >
            {item.actionText}
          </span>

          {item.isCompleted ? (
            <svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              fill="none"
              stroke="#9C9A94"
              strokeWidth={1.6}
              strokeLinecap="round"
            >
              <path d="M6 3.5L10.5 8L6 12.5" />
            </svg>
          ) : (
            <WaActionButton
              variant="pill"
              contactName={item.contact.name}
              phoneE164={item.contact.phoneE164}
              message={todayWaMessage(item)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function getTimeColor(item: TodayViewItem): string {
  switch (item.statusType) {
    case "overdue":
      return "#B42318";
    case "regular":
      return "#71706B";
    case "aftercare":
      return "#9C9A94";
    default:
      return "#191918";
  }
}

function getActionTextColor(item: TodayViewItem): string {
  switch (item.statusType) {
    case "paid":
      return "#067647"; // green for completed
    case "pending_payment":
      return "#B54708"; // orange for attention needed
    default:
      return "#191918";
  }
}

/**
 * TodayPage - Main container for /app route (Today view)
 * 
 * Per PromotorFlow Mockups dc.html:
 * - Header with date subtitle and add button
 * - Summary: "N tindakan · X terlambat"
 * - Grouped sections by urgency (Terlambat, Hari ini, Berikutnya)
 * - Rows with exact structure: name+time | service/context | action+CTA
 */
export async function TodayPage() {
  const todayItems = mockStore.getTodayViewItems();
  const overdueCount = mockStore.getOverdueCount();

  const itemsBySection = {
    terlambat: todayItems.filter((i) => i.section === "terlambat"),
    hari_inis: todayItems.filter((i) => i.section === "hari_inis"),
    berikutnya: todayItems.filter((i) => i.section === "berikutnya"),
  };

  return (
    <div className="page-container">
      <header className="page-header" style={{ paddingBottom: 0, borderBottom: "none" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "12px 16px 0",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 24,
                lineHeight: "29px",
                fontFamily: "Inter, system-ui, sans-serif",
                color: "#191918",
              }}
            >
              Hari ini
            </div>
            <div
              style={{
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "20px",
                fontFamily: "Inter, system-ui, sans-serif",
                color: "#71706B",
                paddingTop: 2,
              }}
            >
              Selasa, 12 Agustus
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <WaReplyBadge />
            <WaStatusBadge />
            <AddButton size={44} iconSize={20} />
          </div>
        </div>
        
        <div
          style={{
            fontSize: 13,
            fontWeight: 450,
            lineHeight: "18px",
            fontFamily: "Inter, system-ui, sans-serif",
            color: "#71706B",
            padding: "10px 16px 0",
          }}
        >
          {todayItems.length} tindakan ·{" "}
          <span style={{ color: "#B42318" }}>{overdueCount} terlambat</span>
        </div>
      </header>

      <ContactRowSection
        title="Terlambat"
        textColor="#B42318"
        items={itemsBySection.terlambat}
      />
      <ContactRowSection
        title="Hari ini"
        textColor="#9C9A94"
        items={itemsBySection.hari_inis}
      />
      <ContactRowSection
        title="Berikutnya"
        textColor="#9C9A94"
        items={itemsBySection.berikutnya}
      />

      <BottomNav navToday="#191918" navContacts="#9C9A94" navCalendar="#9C9A94" />
    </div>
  );
}
