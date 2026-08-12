import type { ReactNode } from "react";

type StatusTextProps = {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
  className?: string;
};

/** Status label with a small dot indicator. Status is never conveyed by color
    alone — the text always carries the meaning (design.md §12, §41). */
export function StatusText({ children, tone = "neutral", className }: StatusTextProps) {
  return (
    <span className={["pc-status", `pc-status--${tone}`, className].filter(Boolean).join(" ")}>
      <span className="pc-status-dot" aria-hidden="true" />
      {children}
    </span>
  );
}
