"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isPromotorNavActive, PROMOTOR_PRIMARY_NAV, PROMOTOR_SECONDARY_NAV } from "./nav-items";

function SidebarNavRow({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={["pc-nav-row", active ? "pc-nav-row--active" : ""].filter(Boolean).join(" ")}
    >
      {label}
    </Link>
  );
}

/** Compact, utility-first desktop sidebar (design.md §15). Hidden below 1024px. */
/** REMEDIATION: 200px width per mockup v2 spec, desktop-only chrome. */
export function PromotorSidebar() {
  const pathname = usePathname();
  return (
    <aside className="pc-sidebar">
      <div className="pc-sidebar-brand">
        <span style={{ fontSize: "18px", fontWeight: "600" }}>PromotorClass</span>
      </div>
      <nav aria-label="Menu utama" className="pc-sidebar-nav">
        {PROMOTOR_PRIMARY_NAV.map((item) => (
          <SidebarNavRow key={item.href} href={item.href} label={item.label} active={isPromotorNavActive(item.href, pathname)} />
        ))}
        <hr className="pc-sidebar-divider" />
        {PROMOTOR_SECONDARY_NAV.map((item) => (
          <SidebarNavRow key={item.href} href={item.href} label={item.label} active={isPromotorNavActive(item.href, pathname)} />
        ))}
        {/*
          PromotorFlow entry per design.md §15. Inert until integration adapter
          defines target URL — no URL invented in M0.
        */}
        <span className="pc-nav-row pc-nav-row--inert">
          PromotorFlow <span aria-hidden="true">↗</span>
        </span>
      </nav>
    </aside>
  );
}
