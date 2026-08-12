"use client";

import { useState } from "react";
import { Container, Divider, PageHeader, TextLink } from "@/components/foundation";

type TemplateItem = {
  id: string;
  category: "Lead magnet" | "Aftersales";
  title: string;
  meta: string;
  lessonsCount: number;
  reflectionCount: number;
  durationEst: string;
  lessonsPreview: Array<{ num: string; title: string; type: string }>;
};

const TEMPLATES: TemplateItem[] = [
  {
    id: "tmpl-1",
    category: "Lead magnet",
    title: "7 Hari Kenali Cara Belajar Anak",
    meta: "7 pelajaran · 2 refleksi · CTA konsultasi",
    lessonsCount: 7,
    reflectionCount: 2,
    durationEst: "perkiraan 42 menit total",
    lessonsPreview: [
      { num: "01", title: "Selamat datang", type: "video 4 menit" },
      { num: "02", title: "Anak bukan tidak mau belajar", type: "video" },
      { num: "03", title: "Apa tantangan terbesar Anda?", type: "refleksi" },
      { num: "04", title: "Mengenali pola belajar anak", type: "artikel" },
      { num: "05", title: "Lembar kerja pola belajar", type: "unduhan" },
    ],
  },
  {
    id: "tmpl-2",
    category: "Lead magnet",
    title: "7 Hari Memahami Potensi Remaja",
    meta: "7 pelajaran · 1 lembar kerja",
    lessonsCount: 7,
    reflectionCount: 1,
    durationEst: "perkiraan 35 menit total",
    lessonsPreview: [
      { num: "01", title: "Pengantar dunia remaja", type: "video 5 menit" },
      { num: "02", title: "Komunikasi tanpa menghakimi", type: "artikel" },
      { num: "03", title: "Refleksi hubungan orang tua-anak", type: "refleksi" },
    ],
  },
  {
    id: "tmpl-3",
    category: "Aftersales",
    title: "30 Hari Setelah Tes",
    meta: "12 pelajaran · 3 refleksi · CTA sesi privat",
    lessonsCount: 12,
    reflectionCount: 3,
    durationEst: "perkiraan 90 menit total",
    lessonsPreview: [
      { num: "01", title: "Memahami hasil tes Anda", type: "video 10 menit" },
      { num: "02", title: "Langkah pertama penerapan", type: "artikel" },
      { num: "03", title: "Evaluasi mingguan", type: "refleksi" },
    ],
  },
];

export function TemplatesClient() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [programName, setProgramName] = useState("");
  const [copyLessonsText, setCopyLessonsText] = useState(true);
  const [copyCtaButton, setCopyCtaButton] = useState(true);

  const handleOpenTemplate = (tmpl: TemplateItem) => {
    setSelectedTemplate(tmpl);
    setProgramName(tmpl.title);
  };

  const handleCopyTemplate = () => {
    setSelectedTemplate(null);
    if (typeof window !== "undefined") {
      window.location.href = "/app/programs";
    }
  };

  const leadMagnetTemplates = TEMPLATES.filter((t) => t.category === "Lead magnet");
  const aftersalesTemplates = TEMPLATES.filter((t) => t.category === "Aftersales");

  return (
    <>
      {/* DESKTOP VIEW */}
      <section className="pc-desktop-only">
        <Container>
          <PageHeader
            title="Template Program"
            description="Salin, ganti isinya, publikasikan. Semua template memakai bahasa yang bisa Anda ubah."
          />
          <Divider />

          <div style={{ marginTop: "var(--space-6)" }}>
            <h2 style={{ fontSize: "var(--font-size-12)", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "var(--space-3)" }}>
              Lead magnet
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-4)" }}>
              {leadMagnetTemplates.map((t) => (
                <div key={t.id} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-5)", background: "var(--color-surface)" }}>
                  <div style={{ fontSize: "var(--font-size-16)", fontWeight: "var(--weight-semibold)", lineHeight: 1.35 }}>{t.title}</div>
                  <div style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>{t.meta}</div>
                  <button
                    onClick={() => handleOpenTemplate(t)}
                    style={{ marginTop: "var(--space-4)", background: "none", border: "none", color: "#167A68", fontWeight: "var(--weight-medium)", fontSize: "var(--font-size-14)", cursor: "pointer", padding: 0 }}
                  >
                    Pakai template →
                  </button>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: "var(--font-size-12)", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-faint)", margin: "var(--space-8) 0 var(--space-3)" }}>
              Aftersales
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-4)" }}>
              {aftersalesTemplates.map((t) => (
                <div key={t.id} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-5)", background: "var(--color-surface)" }}>
                  <div style={{ fontSize: "var(--font-size-16)", fontWeight: "var(--weight-semibold)", lineHeight: 1.35 }}>{t.title}</div>
                  <div style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>{t.meta}</div>
                  <button
                    onClick={() => handleOpenTemplate(t)}
                    style={{ marginTop: "var(--space-4)", background: "none", border: "none", color: "#167A68", fontWeight: "var(--weight-medium)", fontSize: "var(--font-size-14)", cursor: "pointer", padding: 0 }}
                  >
                    Pakai template →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* MOBILE VIEW (Mockup 4e) */}
      <section className="pc-mobile-only">
        <div style={{ padding: "var(--space-4) var(--space-4) 0" }}>
          <TextLink href="/app/lainnya" standalone>
            ← Lainnya
          </TextLink>
          <h1 style={{ fontSize: "24px", fontWeight: "var(--weight-semibold)", margin: "12px 0 0", lineHeight: 1.2 }}>Template</h1>
          <div style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginTop: "6px", lineHeight: 1.5 }}>
            Salin, ganti isinya, publikasikan. Semua template memakai bahasa yang bisa Anda ubah.
          </div>

          {/* Lead magnet group */}
          <div style={{ fontSize: "var(--font-size-12)", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-faint)", padding: "20px 0 4px" }}>
            Lead magnet
          </div>
          {leadMagnetTemplates.map((t) => (
            <div key={t.id} style={{ padding: "14px 0", borderBottom: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "var(--font-size-16)", fontWeight: "var(--weight-semibold)", lineHeight: 1.35 }}>{t.title}</div>
              <div style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginTop: "4px" }}>{t.meta}</div>
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleOpenTemplate(t)}
                  style={{ background: "none", border: "none", color: "#167A68", fontSize: "var(--font-size-14)", fontWeight: "var(--weight-medium)", cursor: "pointer", padding: 0 }}
                >
                  Pakai template →
                </button>
              </div>
            </div>
          ))}

          {/* Aftersales group */}
          <div style={{ fontSize: "var(--font-size-12)", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-faint)", padding: "24px 0 4px" }}>
            Aftersales
          </div>
          {aftersalesTemplates.map((t) => (
            <div key={t.id} style={{ padding: "14px 0", borderBottom: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "var(--font-size-16)", fontWeight: "var(--weight-semibold)", lineHeight: 1.35 }}>{t.title}</div>
              <div style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginTop: "4px" }}>{t.meta}</div>
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleOpenTemplate(t)}
                  style={{ background: "none", border: "none", color: "#167A68", fontSize: "var(--font-size-14)", fontWeight: "var(--weight-medium)", cursor: "pointer", padding: 0 }}
                >
                  Pakai template →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PAKAI TEMPLATE BOTTOM SHEET / MODAL (Mockup 4e right card) */}
      {selectedTemplate && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
          {/* Backdrop */}
          <div onClick={() => setSelectedTemplate(null)} style={{ position: "absolute", inset: 0, background: "rgba(32, 33, 31, 0.4)" }} />

          {/* Card / Sheet */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              background: "#fff",
              borderRadius: "12px 12px 0 0",
              boxShadow: "0 -8px 24px rgba(32, 33, 31, 0.18)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--color-border)" }}>
              <button onClick={() => setSelectedTemplate(null)} style={{ background: "none", border: "none", fontSize: "14px", color: "#73756F", cursor: "pointer", padding: 0 }}>
                Batal
              </button>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>Pakai template</span>
              <button onClick={handleCopyTemplate} style={{ background: "none", border: "none", fontSize: "14px", color: "#167A68", fontWeight: "500", cursor: "pointer", padding: 0 }}>
                Salin
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", margin: 0, lineHeight: 1.3 }}>{selectedTemplate.title}</h2>
              <div style={{ fontSize: "13px", color: "#73756F", marginTop: "6px" }}>
                {selectedTemplate.lessonsCount} pelajaran · {selectedTemplate.reflectionCount} refleksi · {selectedTemplate.durationEst}
              </div>

              <div style={{ marginTop: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>Nama program Anda</label>
                <input
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  style={{ width: "100%", minHeight: "48px", font: "inherit", fontSize: "16px", padding: "12px", border: "1px solid var(--color-border)", borderRadius: "6px", color: "#20211F" }}
                />
              </div>

              <div style={{ fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#9A9C97", margin: "22px 0 4px" }}>
                Isi template
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: "10px 10px", fontSize: "14px", lineHeight: 1.5, paddingTop: "8px" }}>
                {selectedTemplate.lessonsPreview.map((lp) => (
                  <div key={lp.num} style={{ display: "contents" }}>
                    <div style={{ color: "#9A9C97", fontVariantNumeric: "tabular-nums" }}>{lp.num}</div>
                    <div>
                      {lp.title}
                      <span style={{ color: "#9A9C97" }}> · {lp.type}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid var(--color-border)" }}>
                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "48px", fontSize: "15px", cursor: "pointer" }}>
                  Ikut menyalin teks pelajaran
                  <input type="checkbox" checked={copyLessonsText} onChange={(e) => setCopyLessonsText(e.target.checked)} />
                </label>
                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "48px", fontSize: "15px", cursor: "pointer" }}>
                  Ikut menyalin tombol konsultasi
                  <input type="checkbox" checked={copyCtaButton} onChange={(e) => setCopyCtaButton(e.target.checked)} />
                </label>
              </div>

              <div style={{ fontSize: "13px", color: "#9A9C97", lineHeight: 1.6, marginTop: "8px" }}>
                Video tetap perlu Anda isi sendiri — template hanya menyiapkan struktur dan teks.
              </div>
            </div>

            {/* Footer */}
            <div style={{ flex: "none", padding: "12px 20px 20px", borderTop: "1px solid var(--color-border)", background: "#F7F7F5" }}>
              <button
                onClick={handleCopyTemplate}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "48px", background: "#167A68", color: "#fff", fontSize: "15px", fontWeight: "500", borderRadius: "6px", border: "none", cursor: "pointer" }}
              >
                Salin ke program saya
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
