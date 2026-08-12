import Link from "next/link";

/** Learner top bar — minimal chrome, editorial tone (design.md §28).
    Server component. */
export function LearnerHeader() {
  return (
    <header className="pc-learn-header">
      <Link href="/learn" className="pc-learn-brand">
        PromotorClass
      </Link>
    </header>
  );
}
