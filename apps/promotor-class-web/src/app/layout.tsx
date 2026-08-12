import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "PromotorClass",
    template: "%s — PromotorClass",
  },
  description: "PromotorClass — kelas yang dikelola promotor untuk peserta belajar.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
