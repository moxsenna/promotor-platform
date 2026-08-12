import type { ReactNode } from "react";

/** Learner content wrapper — reading-width column, larger editorial type.
    Server component. */
export function LearnerContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className={["pc-learn-main", className].filter(Boolean).join(" ")}>
      <div className="pc-container pc-container--narrow">{children}</div>
    </main>
  );
}
