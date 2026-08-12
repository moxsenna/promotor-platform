import type { ComponentProps } from "react";

export function Divider({ className, ...rest }: ComponentProps<"hr">) {
  return <hr className={["pc-divider", className].filter(Boolean).join(" ")} {...rest} />;
}
