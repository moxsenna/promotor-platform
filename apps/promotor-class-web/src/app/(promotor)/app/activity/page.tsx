import type { Metadata } from "next";

import { Container, Divider } from "@/components/foundation";

export const metadata: Metadata = {
  title: "Aktivitas",
};

/**
 * Activity feed (design.md §25). Shows timestamped activity rows with action + target.
 * M0 has no activity query exposed through module boundaries, so renders mock sample.
 */
export default function ActivityPage() {
  // Mock sample activities per Turn 4a design
  const activities = [
    { time: "14:32", action: "Rina menyelesaikan Video Pengantar" },
    { time: "13:45", action: "Budi mengisi refleksi Hari 3" },
    { time: "11:20", action: "Siti mengunggah lembar kerja PDF" },
    { time: "09:15", action: "Ahmad menyelesaikan Artikel Harian" },
    { time: "08:30", action: "Dewi menandai pelajaran selesai" },
  ];

  return (
    <Container size="wide">
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h1 className="pc-page-title">Aktivitas</h1>
        <p className="pc-meta pc-meta--muted">Riwayat aktivitas belajar peserta.</p>
        
        <Divider />
        
        {/* Timeline container for consistent spacing */}
        <div className="pc-timeline-container">
          {/* Sample mock data rows per Turn 4a format */}
          {activities.map((activity, idx) => (
            <div key={idx} className="pc-timeline-item">
              <div className="pc-timestamp-label">{activity.time}</div>
              <div className="pc-timeline-text">{activity.action}</div>
            </div>
          ))}
          
          {/* Additional historic items */}
          <div className="pc-timeline-item">
            <div className="pc-timestamp-label">Kemarin</div>
            <div className="pc-timeline-text">Lima peserta menyelesaikan program minggu ini</div>
          </div>
          <div className="pc-timeline-item">
            <div className="pc-timestamp-label">Hari Senin</div>
            <div className="pc-timeline-text">Program dipublikasikan ke 84 peserta terdaftar</div>
          </div>
        </div>
      </div>
    </Container>
  );
}
