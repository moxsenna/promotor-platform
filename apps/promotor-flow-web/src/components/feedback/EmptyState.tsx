import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * EmptyState component (design.md §31)
 * Clean empty state without decorative illustrations. Helpful action-oriented copy.
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="pf-empty-state">
      <h2 className="pf-empty-title">{title}</h2>
      {description && <p className="pf-empty-desc">{description}</p>}
      {action && <div className="pf-empty-action">{action}</div>}
    </div>
  );
}
