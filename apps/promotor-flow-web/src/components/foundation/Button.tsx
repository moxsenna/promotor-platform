"use client";

import type { ComponentProps, ReactNode } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  children: ReactNode;
};

/**
 * Semantic button (design.md §20-§21)
 * Min 44px touch target. One dominant primary action per region.
 */
export function Button({
  variant = "primary",
  fullWidth = false,
  type = "button",
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = [
    "pf-btn",
    `pf-btn--${variant}`,
    fullWidth ? "pf-btn--full" : "",
    className,
  ].filter(Boolean);

  return (
    <button
      type={type}
      className={classes.join(" ")}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
