"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { MenuIcon } from "@/components/icons";

import { isPromotorNavActive, PROMOTOR_PRIMARY_NAV } from "./nav-items";

/**
 * Mobile bottom navigation (design.md §15): Beranda, Program, Peserta,
 * Aktivitas, Lainnya. "Lainnya" opens a bottom sheet with secondary items.
 * Hidden on desktop (>=1024px). Client component — the sheet is interactive
 * state, so the component must be stateful.
 */
export function PromotorMobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav aria-label="Navigasi utama" className="pc-mobile-nav">
        {PROMOTOR_PRIMARY_NAV.map((item) => {
          const active = isPromotorNavActive(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={["pc-mobile-nav-item", active ? "pc-mobile-nav-item--active" : ""].filter(Boolean).join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          className={["pc-mobile-nav-item", moreOpen ? "pc-mobile-nav-item--active" : ""].filter(Boolean).join(" ")}
          aria-expanded={moreOpen}
          aria-controls="promotor-more-sheet"
          onClick={() => setMoreOpen((open) => !open)}
        >
          <MenuIcon />
          <span>Lainnya</span>
        </button>
      </nav>
      {moreOpen ? (
        <>
          <button
            type="button"
            className="pc-mobile-nav-scrim"
            aria-label="Tutup menu Lainnya"
            onClick={() => setMoreOpen(false)}
          />
          <nav id="promotor-more-sheet" aria-label="Lainnya" className="pc-mobile-sheet">
            <Link href="/app/templates" className="pc-sheet-row" onClick={() => setMoreOpen(false)}>
              Template
            </Link>
            {/*
              PromotorFlow entry per design.md §15. Inert until the integration
              adapter defines a real target URL — no URL is invented in M0.
            */}
            <span className="pc-sheet-row pc-sheet-row--inert">
              PromotorFlow <span aria-hidden="true">↗</span>
            </span>
          </nav>
        </>
      ) : null}
    </>
  );
}
