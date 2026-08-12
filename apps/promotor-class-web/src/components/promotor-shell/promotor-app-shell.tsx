import type { ReactNode } from "react";

import { PromotorMobileNav } from "./promotor-mobile-nav";
import { PromotorSidebar } from "./promotor-sidebar";
import { PromotorTopBar } from "./promotor-top-bar";

/**
 * Promotor workspace shell: desktop sidebar + top bar, mobile bottom nav.
 * Compact, utility-first, action-oriented (design.md §16, §15).
 */
export function PromotorAppShell({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="pc-app-shell">
      <PromotorSidebar />
      <div className="pc-app-column">
        <PromotorTopBar actions={actions} />
        <main className="pc-app-main">{children}</main>
      </div>
      <PromotorMobileNav />
    </div>
  );
}
