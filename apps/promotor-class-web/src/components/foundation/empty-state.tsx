import type { ReactNode } from "react";

type EmptyStateProps = {
  /** Heading shown in medium weight */
  title: string;
  /** Description shown below heading in muted color */
  description?: string;
  /** Optional primary action button rendered at bottom */
  action?: ReactNode;
  /** Optional secondary text rendered under action */
  actionNote?: string;
  className?: string;
};

/**
 * Empty state component — design.md §21
 * Shown when there's no data to display. Use one per section or page.
 * Desktop uses centered layout with optional action. Mobile mirrors this structure.
 */
export function EmptyState({ title, description, action, actionNote, className }: EmptyStateProps) {
  return (
    <div className={["pc-empty-state", className].filter(Boolean).join(" ")}>
      <div style={{ textAlign: "center", padding: "var(--space-8) var(--space-5)" }}>
        <div style={{ fontSize: "var(--font-size-16)", fontWeight: "var(--weight-medium)", marginBottom: "var(--space-1_5)" }}>
          {title}
        </div>
        {description && (
          <div style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginBottom: "var(--space-4)" }}>
            {description}
          </div>
        )}
        {action && (
          <div style={{ marginTop: "var(--space-4)" }}>{action}</div>
        )}
        {actionNote && (
          <div style={{ fontSize: "var(--font-size-12)", color: "var(--color-text-faint)", marginTop: "var(--space-2)" }}>
            {actionNote}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// LOADING STATE — Mockup 4g pattern
// ============================================================

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Memuat..." }: LoadingStateProps) {
  return (
    <div className="pc-loading-state" style={{ textAlign: "center", padding: "var(--space-8) var(--space-5)" }}>
      <div style={{ 
        display: "inline-block",
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        border: `3px solid var(--color-border)`,
        borderTopColor: "var(--color-accent)",
        animation: "spin 0.8s linear infinite"
      }} />
      <div style={{ fontSize: "var(--font-size-14)", color: "var(--color-text-muted)", marginTop: "var(--space-3)" }}>
        {message}
      </div>
    </div>
  );
}

// ============================================================
// OFFLINE STATE — Mockup 4g offline indicator
// ============================================================

type OfflineStateProps = {
  onRetry?: () => void;
};

export function OfflineState({ onRetry }: OfflineStateProps) {
  return (
    <div className="pc-offline-state" style={{ textAlign: "center", padding: "var(--space-8) var(--space-5)" }}>
      <div style={{ fontSize: "var(--font-size-16)", fontWeight: "var(--weight-medium)", marginBottom: "var(--space-1_5)" }}>
        Tidak ada koneksi internet
      </div>
      <div style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginBottom: "var(--space-4)" }}>
        Periksa koneksi Anda dan coba lagi.
      </div>
      {onRetry && (
        <button onClick={onRetry} style={{
          background: "var(--color-accent)",
          color: "#fff",
          font: "500 var(--font-size-13) inherit",
          padding: "var(--space-2_5) var(--space-3)",
          borderRadius: "var(--radius-md)",
          border: "none",
          cursor: "pointer",
          minWidth: "160px",
          minHeight: "48px"
        }}>
          Coba lagi
        </button>
      )}
    </div>
  );
}
