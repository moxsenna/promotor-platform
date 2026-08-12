"use client";

import { useEffect, useState } from "react";

type ToastVariant = "success" | "error" | "warning";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  autoDismissMs?: number;
  onDismiss?: () => void;
}

/**
 * Toast component (design.md §34)
 * Minimal feedback messages. Auto-dismiss after 3 seconds by default.
 */
export function Toast({
  message,
  variant = "success",
  autoDismissMs = 3000,
  onDismiss,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismissMs) {
      const timer = setTimeout(() => {
        dismiss();
      }, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [autoDismissMs]);

  const dismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`pf-toast pf-toast--${variant}`}
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
      <button
        className="pf-toast-dismiss"
        onClick={dismiss}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
