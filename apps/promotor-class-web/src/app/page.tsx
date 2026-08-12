import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PromotorClass",
};

export default function HomePage() {
  return (
    <main style={{ maxWidth: "42rem", margin: "0 auto", padding: "4rem 1.5rem 2rem" }}>
      <h1 style={{ margin: 0, fontSize: "1.5rem", lineHeight: 1.3 }}>PromotorClass</h1>
      <p style={{ margin: "0.75rem 0 0", maxWidth: "38rem" }}>
        Kelas yang dikelola promotor untuk peserta belajar.
      </p>
      <ul style={{ margin: "1.5rem 0 0", paddingLeft: "1.25rem" }}>
        <li>
          <a href="/app">Promotor workspace</a>
        </li>
        <li>
          <a href="/learn">Learner experience</a>
        </li>
      </ul>
    </main>
  );
}
