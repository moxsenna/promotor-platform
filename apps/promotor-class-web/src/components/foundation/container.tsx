import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  size?: "default" | "narrow" | "wide";
  className?: string;
};

/** Page content wrapper. "narrow" caps width at the reading width (720px). */
export function Container({ children, size = "default", className }: ContainerProps) {
  const classes = [
    "pc-container",
    size === "narrow" ? "pc-container--narrow" : "",
    size === "wide" ? "pc-container--wide" : "",
    className,
  ].filter(Boolean);
  return <div className={classes.join(" ")}>{children}</div>;
}
