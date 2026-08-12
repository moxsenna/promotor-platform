"use client";

import type { ReactNode } from "react";
import Link from "next/link";

/**
 * PageHeader component (design.md §15.1)
 * Minimal header with title, optional date, and actions area.
 */
export function PageHeader({
  title,
  date,
  actions,
}: {
  title: string;
  date?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="pf-page-header">
      <div>
        <h1 className="pf-page-title">{title}</h1>
        {date && <p className="pf-page-date">{date}</p>}
      </div>
      {actions && <div className="pf-page-actions">{actions}</div>}
    </header>
  );
}
