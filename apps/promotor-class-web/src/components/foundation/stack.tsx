import type { ReactNode } from "react";

/** Spacing scale tokens, design.md §8: 4/8/12/16/24/32/48/64. */
export type SpaceToken = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

type StackProps = {
  children: ReactNode;
  gap?: SpaceToken;
  className?: string;
};

/** Vertical stack with token spacing. */
export function Stack({ children, gap = "4", className }: StackProps) {
  return <div className={["pc-stack", `pc-stack--${gap}`, className].filter(Boolean).join(" ")}>{children}</div>;
}

type InlineProps = {
  children: ReactNode;
  gap?: SpaceToken;
  wrap?: boolean;
  align?: "start" | "center" | "end" | "baseline";
  className?: string;
};

/** Horizontal inline group with token spacing. */
export function Inline({ children, gap = "4", wrap = true, align, className }: InlineProps) {
  const classes = [
    "pc-inline",
    wrap ? "" : "pc-inline--no-wrap",
    align ? `pc-inline--align-${align}` : "",
    `pc-inline--${gap}`,
    className,
  ].filter(Boolean);
  return <div className={classes.join(" ")}>{children}</div>;
}
