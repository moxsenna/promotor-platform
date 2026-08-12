"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ActivityIcon, BookIcon, HomeIcon, MenuIcon, UsersIcon } from "@/components/icons";

import { isPromotorNavActive, PROMOTOR_PRIMARY_NAV } from "./nav-items";

/**
 * Mobile bottom navigation (design.md §15): Beranda, Program, Peserta,
 * Aktivitas, Lainnya. All items have icons per PromotorTabBar.dc.html P0 spec.
 * "Lainnya" opens a full screen, not mini sheet.
 * Hidden on desktop (>=1024px). Client component — stateful for more sheet.
 */
export function PromotorMobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav aria-label="Navigasi utama" className="pc-mobile-nav">
        {PROMOTOR_PRIMARY_NAV.map((item) => {
          const active = isPromotorNavActive(item.href, pathname);
          
          // Icon mapping per PromotorTabBar.dc.html specification
          const IconComponent = (() => {
            switch (item.href) {
              case "/app":
                return HomeIcon;
              case "/app/programs":
                return BookIcon;
              case "/app/learners":
                return UsersIcon;
              case "/app/activity":
                return ActivityIcon;
              default:
                return null;
            }
          })();

          if (item.href === "/app/lainnya") {
            return (
              <button
                key={item.href}
                type="button"
                className={["pc-mobile-nav-item", moreOpen ? "pc-mobile-nav-item--active" : ""].filter(Boolean).join(" ")}
                aria-expanded={moreOpen}
                aria-controls="promotor-more-sheet"
                onClick={() => setMoreOpen((open) => !open)}
              >
                <MenuIcon />
                <span>Lainnya</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={["pc-mobile-nav-item", active ? "pc-mobile-nav-item--active" : ""].filter(Boolean).join(" ")}
            >
              {IconComponent && <IconComponent />}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {moreOpen ? (
        <>
          <button
            type="button"
            className="pc-mobile-nav-scrim"
            aria-label="Tutup menu Lainnya"
            onClick={() => setMoreOpen(false)}
          />
          <main id="promotor-more-sheet" aria-label="Lainnya" className="pc-mobile-full-screen">
            {/* Content will be loaded from /app/lainnya screen */}
            <div className="pc-mobile-sheet-header">
              <h1 style={{ margin: 0 }}>Lainnya</h1>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Tutup
              </button>
            </div>
            <div className="pc-mobile-sheet-content">
              <Link href="/app/templates" className="pc-sheet-row" onClick={() => setMoreOpen(false)}>
                Template
              </Link>
              {/*
                PromotorFlow entry per design.md §15. Inert until integration adapter
                defines target URL — no URL invented in M0.
              */}
              <span className="pc-sheet-row pc-sheet-row--inert">
                PromotorFlow <span aria-hidden="true">↗</span>
              </span>
              {/* Additional items per mockup 3f */}
              <Link href="/app/account" className="pc-sheet-row">Akun</Link>
              <Link href="/app/profile" className="pc-sheet-row">Profil publik</Link>
              <Link href="/app/language" className="pc-sheet-row">Bahasa</Link>
              <Link href="/app/billing" className="pc-sheet-row">Tagihan</Link>
              <Link href="/app/logout" className="pc-sheet-row">Keluar</Link>
            </div>
          </main>
        </>
      ) : null}
    </>
  );
}
