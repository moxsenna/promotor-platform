import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  /** Contextual action rendered on the right (e.g. tertiary text link). */
  action?: ReactNode;
  className?: string;
};

/** Section-level heading block. Renders h2. */
export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <div className={["pc-section-header", className].filter(Boolean).join(" ")}>
      <h2 className="pc-section-title">{title}</h2>
      {action ? <div className="pc-section-action">{action}</div> : null}
    </div>
  );
}
