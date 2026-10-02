/**
 * BottomNav - Fixed bottom navigation bar
 * Per mockup lines 256-263:
 * - 4 items: Hari ini, Kontak, Kalender, Lainnya
 * - Icons: 22x22, stroke 1.7
 * - Label: 10.5px / 500 weight
 * - Button height 52px, gap 3px, color varies by active state
 */

import Link from "next/link";

export interface BottomNavProps {
  navToday?: string;
  navContacts?: string;
  navCalendar?: string;
}

export function BottomNav({
  navToday = "#191918",
  navContacts = "#9C9A94",
  navCalendar = "#9C9A94",
}: BottomNavProps) {
  const items = [
    {
      label: "Hari ini",
      href: "/app",
      color: navToday,
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <path d="M4 6h14M4 11h14M4 16h9" />
        </svg>
      ),
    },
    {
      label: "Kontak",
      href: "/contacts",
      color: navContacts,
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <circle cx="11" cy="8" r="3.2" />
          <path d="M4.5 18c0-3.3 2.9-5.2 6.5-5.2s6.5 1.9 6.5 5.2" />
        </svg>
      ),
    },
    {
      label: "Kalender",
      href: "/calendar",
      color: navCalendar,
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <rect x="3.5" y="5" width="15" height="13" rx="2" />
          <path d="M3.5 9h15M7.5 3.5v3M14.5 3.5v3" />
        </svg>
      ),
    },
    {
      label: "Lainnya",
      href: "/more",
      color: "#9C9A94",
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
          <circle cx="5" cy="11" r="1.7" />
          <circle cx="11" cy="11" r="1.7" />
          <circle cx="17" cy="11" r="1.7" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        borderTop: "1px solid #E8E7E3",
        background: "rgba(255,255,255,.94)",
        paddingBottom: 26,
        flex: "none",
      }}
    >
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          style={{
            flex: 1,
            height: 52,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: item.color,
            textDecoration: "none",
          }}
        >
          {item.icon}
          <span style={{ font: "500 10.5px Inter, system-ui, sans-serif" }}>
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}