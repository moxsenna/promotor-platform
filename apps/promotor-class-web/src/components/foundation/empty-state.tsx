import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Optional primary action (design.md §34 empty states). */
  action?: ReactNode;
  className?: string;
};

/** Empty state — concrete copy, no illustration (design.md §34). */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={["pc-empty-state", className].filter(Boolean).join(" ")}>
      <h3 className="pc-empty-title">{title}</h3>
      {description ? <p className="pc-empty-desc">{description}</p> : null}
      {action ? <div className="pc-empty-action">{action}</div> : null}
    </div>
  );
}
