import type { Metadata } from "next";

import { Container, Divider, TextLink } from "@/components/foundation";

export const metadata: Metadata = {
  title: "Lainnya",
};

/**
 * Lainnya screen — mobile menu destination per mockup 3f
 * Contains: Template, Akun, Profil publik, Bahasa, Tagihan, Integrasi PromotorFlow, Keluar
 */

type MenuSection = {
  title: string;
  items: Array<{ label: string; href?: string; action?: () => void; disabled?: boolean }>;
};

const MENU_SECTIONS: MenuSection[] = [
  {
    title: "",
    items: [
      { label: "Template", href: "/app/templates" },
      { label: "Akun", href: "/app/settings/account" },
      { label: "Profil publik", href: "/app/settings/profile" },
      { label: "Bahasa", href: "/app/settings/language" },
    ],
  },
  {
    title: "Manajemen",
    items: [
      { label: "Tagihan & pembayaran", href: "/app/settings/billing" },
      { 
        label: "Integrasi PromotorFlow", 
        href: "/app/integrations/promotorflow",
        disabled: false
      },
    ],
  },
  {
    title: "",
    items: [
      { label: "Keluar", action: () => alert("Logout feature pending"), disabled: true },
    ],
  },
];

export default function LainnyaPage() {
  return (
    <Container>
      {/* Header space - maintains consistent top padding */}
      <div style={{ paddingTop: "var(--space-5)" }}>
        <h1 style={{ fontSize: "var(--font-size-24)", fontWeight: "var(--weight-semibold)", margin: 0 }}>Lainnya</h1>
        <p style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginTop: "var(--space-1_5)" }}>
          Pengaturan dan manajemen akun.
        </p>
      </div>

      {/* Settings sections */}
      <Divider style={{ marginTop: "var(--space-5)" }} />
      
      <div style={{ padding: "var(--space-5) 0" }}>
        {MENU_SECTIONS.map((section, sectionIdx) => (
          <div key={section.title}>
            {section.title && (
              <div style={{ 
                fontSize: "var(--font-size-12)", 
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--color-text-faint)",
                marginBottom: "var(--space-2)",
                paddingLeft: "var(--space-3)"
              }}>
                {section.title}
              </div>
            )}

            {section.items.map((item, itemIdx) => {
              if (!item.disabled) {
                return (
                  <a 
                    key={`${section.title}-${itemIdx}`}
                    href={item.href || "#"}
                    style={{ 
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      minHeight: "56px",
                      padding: "var(--space-3)",
                      borderBottom: `1px solid ${itemIdx === section.items.length - 1 && sectionIdx === MENU_SECTIONS.length - 1 ? "transparent" : "var(--color-border)"}`
                    }}
                  >
                    <span style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--weight-medium)" }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: "var(--font-size-14)", color: "var(--color-text-faint)" }}>→</span>
                  </a>
                );
              } else {
                // Disabled/inert item
                return (
                  <span
                    key={`${section.title}-${itemIdx}`}
                    style={{ 
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      minHeight: "56px",
                      padding: "var(--space-3)",
                      color: "var(--color-text-faint)",
                      borderBottom: itemIdx === section.items.length - 1 && sectionIdx === MENU_SECTIONS.length - 1 ? "none" : `1px solid var(--color-border)`
                    }}
                  >
                    <span style={{ fontSize: "var(--font-size-14)" }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: "var(--font-size-14)" }}>↗</span>
                  </span>
                );
              }
            })}
          </div>
        ))}
      </div>

      {/* Bottom spacing for mobile nav */}
      <div style={{ paddingBottom: "calc(74px + var(--space-4))" }} />
    </Container>
  );
}
