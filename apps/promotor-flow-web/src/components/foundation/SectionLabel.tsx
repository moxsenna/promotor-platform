"use client";

import type { ReactNode } from "react";

/**
 * SectionLabel component (design.md §19)
 * Small uppercase label for section headers.
 */
export function SectionLabel({
  label,
  count,
  action,
}: {
  label: string;
  count?: number;
  action?: ReactNode;
}) {
  return (
    <div className="pf-section-header">
      <h2 className="pf-section-title">{label}</h2>
      {(count !== undefined || action) && (
        <div className="pf-inline--align-center pf-inline--4">
          {count !== undefined && (
            <span className="pf-section-count" aria-label={`${count} items`}>
              {count}
            </span>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
    </div>
  );
}
