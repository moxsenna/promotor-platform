import Link from "next/link";
import type { ReactNode } from "react";

type TextLinkProps = {
  href: string;
  children: ReactNode;
  /** Force external anchor (target=_blank) even for "/..." hrefs. */
  external?: boolean;
  variant?: "default" | "muted";
  /** Standalone link row with a 44px hit area (tertiary action, design.md §14). */
  standalone?: boolean;
  className?: string;
};

/** Real anchor — internal links via next/link, external via plain anchor. */
export function TextLink({ href, children, external = false, variant = "default", standalone = false, className }: TextLinkProps) {
  const classes = ["pc-link", `pc-link--${variant}`, standalone ? "pc-link--standalone" : "", className].filter(Boolean);
  const isInternal = !external && href.startsWith("/");
  if (isInternal) {
    return (
      <Link href={href} className={classes.join(" ")}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classes.join(" ")} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
