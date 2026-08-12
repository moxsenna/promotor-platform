import type { ComponentProps, ReactNode } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
  children: ReactNode;
};

/**
 * Semantic button. Min 44px touch target.
 * One dominant primary action per region (design.md §14).
 */
export function Button({
  variant = "primary",
  fullWidth = false,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    "pc-btn",
    `pc-btn--${variant}`,
    fullWidth ? "pc-btn--full" : "",
    className,
  ].filter(Boolean);
  return (
    <button type={type} className={classes.join(" ")} {...rest}>
      {children}
    </button>
  );
}
