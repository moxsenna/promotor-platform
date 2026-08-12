import type { ComponentProps, ReactNode } from "react";

type IconButtonProps = Omit<ComponentProps<"button">, "aria-label"> & {
  /** Required: icon-only controls must expose an accessible name (design.md §41). */
  "aria-label": string;
  children: ReactNode;
};

/** Square 44px icon-only button. aria-label is mandatory. */
export function IconButton({
  "aria-label": ariaLabel,
  type = "button",
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button type={type} aria-label={ariaLabel} className={["pc-icon-btn", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </button>
  );
}
