import type { ReactNode } from "react";

import { PromotorMobileNav } from "./promotor-mobile-nav";
import { PromotorSidebar } from "./promotor-sidebar";
// REMEDIATION: Global PromotorTopBar removed per mockup v2 spec.
// Desktop has no topbar unless explicitly shown by screen contract.
// Mobile has screen-owned compact headers, not global app header.

/**
 * Promotor workspace shell: desktop sidebar + main content area, mobile bottom nav.
 * Compact, utility-first, action-oriented (design.md §16, §15).
 * 
 * REMEDIATION PER MOCKUP V2:
 * - No global PromotorTopBar — screens define their own headers where needed
 * - Sidebar 200px width per desktop mockup
 * - Mobile bottom nav with 5 icon+label items
 */
export function PromotorAppShell({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="pc-app-shell">
      <PromotorSidebar />
      <main className="pc-app-main">{children}</main>
      <PromotorMobileNav />
    </div>
  );
}
