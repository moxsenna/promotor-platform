import type { ReactNode } from "react";

/** Top bar — carries the workspace brand on mobile (sidebar hidden there)
    and a slot for contextual actions. Server component. */
export function PromotorTopBar({ actions }: { actions?: ReactNode }) {
  return (
    <header className="pc-top-bar">
      <span className="pc-top-bar-brand">PromotorClass</span>
      {actions ? <div>{actions}</div> : null}
    </header>
  );
}
