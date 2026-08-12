"use client";

type Severity = "neutral" | "accent" | "success" | "warning" | "danger";

interface StatusTextProps {
  value: string;
  severity?: Severity;
  withDot?: boolean;
}

/**
 * StatusText component (design.md §28)
 * Text-based status with optional dot indicator. No colored pills unless meaningful.
 */
export function StatusText({
  value,
  severity = "neutral",
  withDot = true,
}: StatusTextProps) {
  const classes = [
    "pf-status",
    severity !== "neutral" ? `pf-status--${severity}` : "",
  ].filter(Boolean);

  return (
    <span className={classes.join(" ")}>
      {withDot && <span className="pf-status-dot" aria-hidden="true" />}
      <span>{value}</span>
    </span>
  );
}
