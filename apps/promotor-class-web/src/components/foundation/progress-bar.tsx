type ProgressBarProps = {
  /** Progress 0–100. Clamped. */
  value: number;
  /** Accessible name (e.g. "Progress program"). */
  label?: string;
  size?: "sm" | "md";
  className?: string;
};

/** Thin progress line (design.md §31 — no giant progress ring).
    Accessible via role="progressbar" + aria-* attributes. */
export function ProgressBar({ value, label, size = "sm", className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  const classes = ["pc-progress", size === "md" ? "pc-progress--md" : "", className].filter(Boolean);
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
      className={classes.join(" ")}
    >
      <div className="pc-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
