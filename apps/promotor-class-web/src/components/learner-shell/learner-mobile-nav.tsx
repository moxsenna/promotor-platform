"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BookIcon, ListIcon, UserIcon } from "@/components/icons";

/** Mobile bottom navigation for learners (design.md §37): Belajar,
    Program saya, Akun. Calm and minimal — white surface, no chrome.
    Hidden on desktop: learner experience stays content-first. */
export function LearnerMobileNav() {
  const pathname = usePathname();

  const belajarActive = pathname === "/learn" || (pathname.startsWith("/learn/") && !pathname.startsWith("/learn/programs"));
  const programActive = pathname === "/learn/programs" || pathname.startsWith("/learn/programs/");

  return (
    <nav aria-label="Navigasi peserta" className="pc-learn-nav">
      <Link
        href="/learn"
        aria-current={belajarActive ? "page" : undefined}
        className={["pc-learn-nav-item", belajarActive ? "pc-learn-nav-item--active" : ""].filter(Boolean).join(" ")}
      >
        <BookIcon />
        <span>Belajar</span>
      </Link>
      <Link
        href="/learn/programs"
        aria-current={programActive ? "page" : undefined}
        className={["pc-learn-nav-item", programActive ? "pc-learn-nav-item--active" : ""].filter(Boolean).join(" ")}
      >
        <ListIcon />
        <span>Program saya</span>
      </Link>
      {/*
        Akun tab per mockup. Inert until an account surface exists in M0 —
        no route is invented.
      */}
      <span className="pc-learn-nav-item pc-learn-nav-item--inert">
        <UserIcon />
        <span>Akun</span>
      </span>
    </nav>
  );
}
