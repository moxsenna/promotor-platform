import type { Metadata } from "next";
import type { ReactNode } from "react";

import { LearnerContent } from "@/components/learner-shell/learner-content";
import { LearnerHeader } from "@/components/learner-shell/learner-header";
import { LearnerMobileNav } from "@/components/learner-shell/learner-mobile-nav";

export const metadata: Metadata = {
  title: "Peserta belajar",
};

export default function LearnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pc-learn-shell">
      <LearnerHeader />
      <LearnerContent>{children}</LearnerContent>
      <LearnerMobileNav />
    </div>
  );
}
