import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Promotor",
};

export default function PromotorLayout({ children }: { children: ReactNode }) {
  return children;
}
