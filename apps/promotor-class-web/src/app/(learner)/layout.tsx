import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Peserta belajar",
};

export default function LearnerLayout({ children }: { children: ReactNode }) {
  return children;
}
