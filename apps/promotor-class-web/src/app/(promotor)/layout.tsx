import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PromotorAppShell } from "@/components/promotor-shell/promotor-app-shell";

export const metadata: Metadata = {
  title: "Promotor",
};

export default function PromotorLayout({ children }: { children: ReactNode }) {
  return <PromotorAppShell>{children}</PromotorAppShell>;
}
