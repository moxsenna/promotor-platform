"use client";

import { useState } from "react";
import { Container, Divider, EmptyState, PageHeader, SectionHeader, Stack, StatusText, TextLink } from "@/components/foundation";
import { lessonTypeLabel, programStatusLabel, programTypeLabel } from "@/lib/labels";

type ProgramView = {
  program: {
    id: string;
    title: string;
    description: string;
    type: any;
    status: any;
  };
  modules: Array<{
    module: { id: string; title: string; position: number };
    lessons: Array<{ id: string; title: string; type: any; position: number }>;
  }>;
};

type ProgramWorkspaceClientProps = {
  view: ProgramView;
  learnerCount: number;
  lessonCount: number;
};

export function ProgramWorkspaceClient({ view, learnerCount, lessonCount }: ProgramWorkspaceClientProps) {
  const [activeTab, setActiveTab] = useState<"materi" | "peserta" | "analitik" | "pengaturan">("materi");
  const [reorderMode, setReorderMode] = useState(false);
  const [addLessonOpen, setAddLessonOpen] = useState(false);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);

  const tone = view.program.status === "published" ? "success" : "neutral";

  return (
    <>
      {/* DESKTOP VIEW (Mockup 2c) */}
      <section className="pc-desktop-only">
        <Container>
          <Stack gap="8">
            <div>
              <TextLink href="/app/programs" standalone>
                ← Program
              </TextLink>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "var(--space-2)" }}>
                <div>
                  <PageHeader title={view.program.title} description={view.program.description} />
                  <p className="pc-meta">
                    {programTypeLabel(view.program.type)} · {lessonCount} pelajaran · {learnerCount} peserta
                  </p>
                  <StatusText tone={tone}>{programStatusLabel(view.program.status)}</StatusText>
                </div>

                {/* Share Link Box (2c desktop right panel snippet) */}
                <div style={{ padding: "14px 18px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", background: "var(--color-surface)", width: "320px" }}>
                  <div style={{ fontSize: "12px", color: "#9A9C97" }}>Tautan pendaftaran</div>
                  <div style={{ fontSize: "14px", fontWeight: "500", marginTop: "4px", color: "#20211F" }}>rina.promotorclass.id/belajar-anak</div>
                  <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                    <button
                      onClick={() => setShareSheetOpen(true)}
                      style={{ flex: 1, minHeight: "36px", border: "none", background: "#167A68", color: "#fff", fontSize: "13px", fontWeight: "500", borderRadius: "6px", cursor: "pointer" }}
                    >
                      Bagikan
                    </button>
                    <button style={{ minHeight: "36px", padding: "0 12px", border: "1px solid var(--color-border)", background: "#fff", fontSize: "13px", borderRadius: "6px", cursor: "pointer" }}>
                      Salin
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Workspace Navigation Tabs */}
            <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid var(--color-border)" }}>
              {(["materi", "peserta", "analitik", "pengaturan"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: activeTab === tab ? "2px solid #167A68" : "2px solid transparent",
                    color: activeTab === tab ? "#167A68" : "#73756F",
                    fontWeight: "500",
                    fontSize: "14px",
                    paddingBottom: "10px",
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {tab === "materi" ? "Materi" : tab === "peserta" ? "Peserta (84)" : tab === "analitik" ? "Analitik" : "Pengaturan"}
                </button>
              ))}
            </div>

            {activeTab === "materi" && (
              <Stack gap="6">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <SectionHeader title="Kurikulum" />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => setReorderMode(!reorderMode)}
                      style={{ minHeight: "36px", padding: "0 14px", border: "1px solid var(--color-border)", background: "#fff", fontSize: "13px", fontWeight: "500", borderRadius: "6px", cursor: "pointer" }}
                    >
                      {reorderMode ? "Selesai ubah urutan" : "Ubah urutan"}
                    </button>
                    <button
                      onClick={() => setAddLessonOpen(true)}
                      style={{ minHeight: "36px", padding: "0 14px", border: "none", background: "#167A68", color: "#fff", fontSize: "13px", fontWeight: "500", borderRadius: "6px", cursor: "pointer" }}
                    >
                      + Tambah pelajaran
                    </button>
                  </div>
                </div>

                {view.modules.length === 0 ? (
                  <EmptyState title="Belum ada materi" description="Kurikulum program akan tampil di sini." />
                ) : (
                  view.modules.map(({ module, lessons }) => (
                    <Stack gap="2" key={module.id}>
                      <h3 className="pc-module-title">{module.title}</h3>
                      {lessons.map((lesson, idx) => (
                        <div className="pc-list-row" key={lesson.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Stack gap="1">
                            <p style={{ fontWeight: "500" }}>
                              {String(idx + 1).padStart(2, "0")} · {lesson.title}
                            </p>
                            <p className="pc-meta">{lessonTypeLabel(lesson.type)} · wajib</p>
                          </Stack>
                          {reorderMode ? (
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button style={{ width: "36px", height: "36px", border: "1px solid var(--color-border)", borderRadius: "4px", background: "#fff", cursor: "pointer" }}>↑</button>
                              <button style={{ width: "36px", height: "36px", border: "1px solid var(--color-border)", borderRadius: "4px", background: "#fff", cursor: "pointer" }}>↓</button>
                            </div>
                          ) : (
                            <span style={{ color: "#9A9C97", cursor: "pointer" }}>⋯</span>
                          )}
                        </div>
                      ))}
                    </Stack>
                  ))
                )}
              </Stack>
            )}

            {activeTab === "peserta" && (
              <Stack gap="4">
                <SectionHeader title="Daftar Peserta Program" />
                <div className="pc-list-row">
                  <p style={{ fontWeight: "500" }}>Ayu Rahma</p>
                  <p className="pc-meta">Selesai 100% · minat tinggi (0.92) · aktif hari ini</p>
                </div>
                <div className="pc-list-row">
                  <p style={{ fontWeight: "500" }}>Nina Wulandari</p>
                  <p className="pc-meta">Progres 45% · minat sedang (0.64) · aktif 2 hari lalu</p>
                </div>
              </Stack>
            )}

            {activeTab === "analitik" && (
              <Stack gap="4">
                <SectionHeader title="Ringkasan Corong Belajar" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                  <div style={{ padding: "16px", border: "1px solid var(--color-border)", borderRadius: "6px" }}>
                    <div style={{ fontSize: "24px", fontWeight: "600" }}>84</div>
                    <div style={{ fontSize: "13px", color: "#73756F" }}>Terdaftar</div>
                  </div>
                  <div style={{ padding: "16px", border: "1px solid var(--color-border)", borderRadius: "6px" }}>
                    <div style={{ fontSize: "24px", fontWeight: "600" }}>76</div>
                    <div style={{ fontSize: "13px", color: "#73756F" }}>Mulai belajar</div>
                  </div>
                  <div style={{ padding: "16px", border: "1px solid var(--color-border)", borderRadius: "6px" }}>
                    <div style={{ fontSize: "24px", fontWeight: "600" }}>44</div>
                    <div style={{ fontSize: "13px", color: "#73756F" }}>Selesai</div>
                  </div>
                  <div style={{ padding: "16px", border: "1px solid var(--color-border)", borderRadius: "6px" }}>
                    <div style={{ fontSize: "24px", fontWeight: "600" }}>15</div>
                    <div style={{ fontSize: "13px", color: "#73756F" }}>Klik konsultasi</div>
                  </div>
                </div>
              </Stack>
            )}

            {activeTab === "pengaturan" && (
              <Stack gap="4">
                <SectionHeader title="Pengaturan Program" />
                <div style={{ padding: "16px", border: "1px solid var(--color-border)", borderRadius: "6px" }}>
                  <div style={{ fontSize: "14px", fontWeight: "500" }}>Akses Program</div>
                  <div style={{ fontSize: "13px", color: "#73756F" }}>Publik (siapa saja bisa mendaftar)</div>
                </div>
              </Stack>
            )}
          </Stack>
        </Container>
      </section>

      {/* MOBILE VIEW (Mockup 3c, 4b, 4c, 4d) */}
      <section className="pc-mobile-only" style={{ paddingBottom: "80px" }}>
        <div style={{ padding: "14px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <TextLink href="/app/programs" standalone>
              ← Program
            </TextLink>
            <span style={{ fontSize: "13px", color: "#73756F" }}>⋯</span>
          </div>
          <h1 style={{ font: "600 20px/1.35 inherit", margin: "12px 0 0" }}>{view.program.title}</h1>
          <div style={{ fontSize: "13px", color: "#73756F", marginTop: "4px" }}>
            {programTypeLabel(view.program.type)} · {learnerCount} peserta · {lessonCount} pelajaran
          </div>

          {/* Mobile Tabs */}
          <div style={{ display: "flex", gap: "18px", marginTop: "16px", borderBottom: "1px solid var(--color-border)", fontSize: "14px" }}>
            <button
              onClick={() => setActiveTab("materi")}
              style={{ background: "none", border: "none", borderBottom: activeTab === "materi" ? "2px solid #167A68" : "none", color: activeTab === "materi" ? "#167A68" : "#73756F", fontWeight: "500", paddingBottom: "10px" }}
            >
              Materi
            </button>
            <button
              onClick={() => setActiveTab("peserta")}
              style={{ background: "none", border: "none", borderBottom: activeTab === "peserta" ? "2px solid #167A68" : "none", color: activeTab === "peserta" ? "#167A68" : "#73756F", fontWeight: "500", paddingBottom: "10px" }}
            >
              Peserta (84)
            </button>
            <button
              onClick={() => setActiveTab("analitik")}
              style={{ background: "none", border: "none", borderBottom: activeTab === "analitik" ? "2px solid #167A68" : "none", color: activeTab === "analitik" ? "#167A68" : "#73756F", fontWeight: "500", paddingBottom: "10px" }}
            >
              Analitik
            </button>
            <button
              onClick={() => setActiveTab("pengaturan")}
              style={{ background: "none", border: "none", borderBottom: activeTab === "pengaturan" ? "2px solid #167A68" : "none", color: activeTab === "pengaturan" ? "#167A68" : "#73756F", fontWeight: "500", paddingBottom: "10px" }}
            >
              Pengaturan
            </button>
          </div>
        </div>

        {/* Mobile Tab Content */}
        <div style={{ padding: "0 20px" }}>
          {activeTab === "materi" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "16px 0 4px" }}>
                <div style={{ fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#9A9C97" }}>
                  Hari 1 — Memahami masalah
                </div>
                <button onClick={() => setReorderMode(!reorderMode)} style={{ background: "none", border: "none", color: "#167A68", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
                  {reorderMode ? "Selesai" : "Ubah urutan"}
                </button>
              </div>

              {view.modules.map(({ module, lessons }) => (
                <div key={module.id}>
                  {lessons.map((lesson, idx) => (
                    <div key={lesson.id} style={{ display: "flex", gap: "12px", alignItems: "baseline", padding: "14px 0", borderBottom: "1px solid var(--color-border)" }}>
                      <div style={{ width: "20px", fontSize: "13px", color: "#9A9C97", fontVariantNumeric: "tabular-nums" }}>
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "15px", fontWeight: "500", lineHeight: "1.35" }}>{lesson.title}</div>
                        <div style={{ fontSize: "13px", color: "#9A9C97", marginTop: "2px" }}>{lessonTypeLabel(lesson.type)} · wajib</div>
                      </div>
                      {reorderMode ? (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button style={{ width: "32px", height: "32px", border: "1px solid var(--color-border)", borderRadius: "4px" }}>↑</button>
                          <button style={{ width: "32px", height: "32px", border: "1px solid var(--color-border)", borderRadius: "4px" }}>↓</button>
                        </div>
                      ) : (
                        <span style={{ color: "#9A9C97" }}>⋯</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeTab === "peserta" && (
            <div style={{ paddingTop: "12px" }}>
              <div style={{ padding: "14px 0", borderBottom: "1px solid var(--color-border)" }}>
                <div style={{ fontSize: "15px", fontWeight: "500" }}>Ayu Rahma</div>
                <div style={{ fontSize: "13px", color: "#73756F", marginTop: "3px" }}>Selesai 100% · minat tinggi 0.92</div>
              </div>
              <div style={{ padding: "14px 0", borderBottom: "1px solid var(--color-border)" }}>
                <div style={{ fontSize: "15px", fontWeight: "500" }}>Nina Wulandari</div>
                <div style={{ fontSize: "13px", color: "#73756F", marginTop: "3px" }}>Progres 45% · minat sedang 0.64</div>
              </div>
            </div>
          )}

          {activeTab === "analitik" && (
            <div style={{ paddingTop: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                <div style={{ padding: "12px 0", borderBottom: "1px solid var(--color-border)" }}>
                  <div style={{ font: "600 24px/1 inherit", fontVariantNumeric: "tabular-nums" }}>84</div>
                  <div style={{ fontSize: "13px", color: "#73756F", marginTop: "4px" }}>Terdaftar</div>
                </div>
                <div style={{ padding: "12px 0", borderBottom: "1px solid var(--color-border)" }}>
                  <div style={{ font: "600 24px/1 inherit", fontVariantNumeric: "tabular-nums" }}>76</div>
                  <div style={{ fontSize: "13px", color: "#73756F", marginTop: "4px" }}>Mulai belajar</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pengaturan" && (
            <div style={{ paddingTop: "16px" }}>
              <div style={{ fontSize: "15px", fontWeight: "500" }}>Akses: Publik</div>
              <div style={{ fontSize: "13px", color: "#73756F", marginTop: "4px" }}>Tautan pendaftaran terbuka.</div>
            </div>
          )}
        </div>

        {/* Sticky Mobile Action Bar (Mockup 3c bottom bar) */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, padding: "12px 20px 20px", borderTop: "1px solid var(--color-border)", background: "#F7F7F5", display: "flex", gap: "10px" }}>
          <button
            onClick={() => setAddLessonOpen(true)}
            style={{ flex: 1, minHeight: "48px", border: "none", background: "#167A68", color: "#fff", font: "500 15px inherit", borderRadius: "6px", cursor: "pointer" }}
          >
            + Tambah pelajaran
          </button>
          <button
            onClick={() => setShareSheetOpen(true)}
            style={{ flex: "none", minHeight: "48px", padding: "0 16px", border: "1px solid var(--color-border)", background: "#fff", color: "#20211F", font: "500 15px inherit", borderRadius: "6px", cursor: "pointer" }}
          >
            Bagikan
          </button>
        </div>
      </section>

      {/* TAMBAH PELAJARAN BOTTOM SHEET (Mockup 3c sheet) */}
      {addLessonOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
          <div onClick={() => setAddLessonOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(32, 33, 31, 0.32)" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: "500px", background: "#fff", borderRadius: "10px 10px 0 0", boxShadow: "0 -8px 24px rgba(32, 33, 31, 0.18)", padding: "20px", zIndex: 101 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: "16px", fontWeight: "600" }}>Tambah pelajaran</div>
              <button onClick={() => setAddLessonOpen(false)} style={{ background: "none", border: "none", fontSize: "14px", color: "#73756F", cursor: "pointer" }}>
                Tutup
              </button>
            </div>
            <div style={{ fontSize: "13px", color: "#73756F", marginTop: "4px" }}>Masuk ke Hari 1 — Memahami masalah</div>
            <div style={{ marginTop: "12px", borderTop: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "52px", borderBottom: "1px solid var(--color-border)", fontSize: "15px" }}>
                Video <span style={{ fontSize: "13px", color: "#9A9C97" }}>Tautan YouTube unlisted</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "52px", borderBottom: "1px solid var(--color-border)", fontSize: "15px" }}>
                Artikel <span style={{ fontSize: "13px", color: "#9A9C97" }}>Teks</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "52px", borderBottom: "1px solid var(--color-border)", fontSize: "15px" }}>
                Refleksi <span style={{ fontSize: "13px", color: "#9A9C97" }}>Pertanyaan untuk peserta</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHARE BOTTOM SHEET (Mockup 4d) */}
      {shareSheetOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
          <div onClick={() => setShareSheetOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(32, 33, 31, 0.32)" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: "500px", background: "#fff", borderRadius: "10px 10px 0 0", boxShadow: "0 -8px 24px rgba(32, 33, 31, 0.18)", padding: "20px 20px 24px", zIndex: 101 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: "16px", fontWeight: "600" }}>Bagikan program</div>
              <button onClick={() => setShareSheetOpen(false)} style={{ background: "none", border: "none", fontSize: "14px", color: "#73756F", cursor: "pointer" }}>
                Tutup
              </button>
            </div>
            <div style={{ fontSize: "13px", color: "#73756F", marginTop: "4px" }}>rina.promotorclass.id/belajar-anak</div>
            <div style={{ marginTop: "14px" }}>
              <div style={{ fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>Pesan yang ikut terkirim</div>
              <textarea
                defaultValue="Saya buka kelas gratis 7 hari untuk orang tua yang anaknya sulit diajak belajar. Daftarnya di sini: rina.promotorclass.id/belajar-anak"
                style={{ width: "100%", height: "90px", font: "inherit", fontSize: "14px", padding: "10px", border: "1px solid var(--color-border)", borderRadius: "6px", resize: "none" }}
              />
            </div>
            <div style={{ marginTop: "12px", borderTop: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "48px", borderBottom: "1px solid var(--color-border)", fontSize: "15px" }}>
                Kirim lewat WhatsApp <span style={{ fontSize: "13px", color: "#9A9C97" }}>Pilih kontak</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "48px", fontSize: "15px" }}>
                Salin teks + tautan <span style={{ fontSize: "13px", color: "#9A9C97" }}>Untuk caption</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
