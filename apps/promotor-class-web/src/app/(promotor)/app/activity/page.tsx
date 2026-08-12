import type { Metadata } from "next";

import { Container, Divider, StatusText, TextLink } from "@/components/foundation";

export const metadata: Metadata = {
  title: "Aktivitas",
};

/**
 * Activity feed (design.md §25). Shows timestamped activity rows with action + target.
 * Per FRONTEND_MOCKUP_GAP_REPORT.md - use canonical cast Ayu/Nina/Dimas/Nadia.
 */

type ActivityItem = {
  time: string;
  actor: string;
  action: string;
  category: "selesai" | "refleksi" | "pendaftaran" | "konsultasi";
};

/**
 * Canonical activity data per mockups 2g/3f
 * Ayu Rahma, Nina Wulandari, Dimas Pratama, Nadia Putri
 */
const ACTIVITY_ITEMS: ActivityItem[] = [
  // Hari ini
  { time: "14:32", actor: "Ayu Rahma", action: "Menyelesaikan Rencana Tindakan", category: "selesai" },
  { time: "14:05", actor: "Nina Wulandari", action: "Mengisi refleksi Hari 6", category: "refleksi" },
  { time: "13:20", actor: "Dimas Pratama", action: "Mengikuti konsultasi Privat", category: "konsultasi" },
  
  // Kemarin
  { time: "18:45", actor: "Nadia Putri", action: "Selesai Hari 3 dari 8", category: "selesai" },
  { time: "16:30", actor: "Ayu Rahma", action: "Mengunggah lembar kerja PDF", category: "selesai" },
  { time: "14:15", actor: "Nina Wulandari", action: "Mulai program Parenting Growth", category: "pendaftaran" },
  
  // Lebih lama lagi
  { time: "Senin, 11 Agu", actor: "Dimas Pratama", action: "Klik tombol konsultasi", category: "konsultasi" },
  { time: "Minggu, 10 Agu", actor: "Ayu Rahma", action: "Menyelesaikan seluruh program", category: "selesai" },
];

// Group activities by date
function groupActivitiesByDate(activities: ActivityItem[]): Array<{ date: string; items: ActivityItem[] }> {
  const groups: Array<{ date: string; items: ActivityItem[] }> = [];
  let currentDate: string | null = null;
  let currentGroup: ActivityItem[] = [];

  activities.forEach((activity) => {
    const isToday = !activity.time.includes(":") || activity.time === "Hari ini";
    const isYesterday = activity.time === "Kemarin";
    
    if (isToday && currentDate !== "Hari ini") {
      if (currentGroup.length > 0) {
        groups.push({ date: currentDate!, items: currentGroup });
      }
      currentDate = "Hari ini";
      currentGroup = [activity];
    } else if (isYesterday && currentDate !== "Kemarin") {
      if (currentGroup.length > 0) {
        groups.push({ date: currentDate!, items: currentGroup });
      }
      currentDate = "Kemarin";
      currentGroup = [activity];
    } else if (!isToday && !isYesterday && currentDate !== activity.time) {
      if (currentGroup.length > 0) {
        groups.push({ date: currentDate!, items: currentGroup });
      }
      currentDate = activity.time;
      currentGroup = [activity];
    } else {
      currentGroup.push(activity);
    }
  });

  if (currentGroup.length > 0) {
    groups.push({ date: currentDate!, items: currentGroup });
  }

  return groups;
}

export default function ActivityPage() {
  const groupedActivities = groupActivitiesByDate(ACTIVITY_ITEMS);

  return (
    <>
      <DesktopActivity activities={groupedActivities} />
      <MobileActivity activities={groupedActivities} />
    </>
  );
}

// ============================================================
// DESKTOP VERSION — Mockup 2g
// ============================================================

function DesktopActivity({ activities }: { activities: Array<{ date: string; items: ActivityItem[] }> }) {
  return (
    <section className="pc-desktop-only">
      <Container size="wide">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingBottom: "var(--space-2)" }}>
          <h1 style={{ fontSize: "var(--font-size-28)", fontWeight: "var(--weight-semibold)", margin: 0 }}>Aktivitas</h1>
        </div>
        
        <p style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
          Riwayat aktivitas belajar peserta.
        </p>

        {/* Filters */}
        <div style={{ 
          display: "flex", 
          gap: "var(--space-4)", 
          marginTop: "var(--space-5)",
          borderBottom: `1px solid var(--color-border-dark)`,
          paddingBottom: "var(--space-2)"
        }}>
          <span style={{ 
            fontSize: "var(--font-size-14)", 
            fontWeight: "var(--weight-medium)", 
            color: "var(--color-accent)",
            borderBottom: `2px solid var(--color-accent)`,
            paddingBottom: "var(--space-1)"
          }}>
            Semua
          </span>
          <span style={{ 
            fontSize: "var(--font-size-14)", 
            fontWeight: "var(--weight-medium)",
            color: "var(--color-text-muted)"
          }}>
            Pendaftaran
          </span>
          <span style={{ 
            fontSize: "var(--font-size-14)", 
            fontWeight: "var(--weight-medium)",
            color: "var(--color-text-muted)"
          }}>
            Selesai
          </span>
          <span style={{ 
            fontSize: "var(--font-size-14)", 
            fontWeight: "var(--weight-medium)",
            color: "var(--color-text-muted)"
          }}>
            Refleksi
          </span>
          <span style={{ 
            fontSize: "var(--font-size-14)", 
            fontWeight: "var(--weight-medium)",
            color: "var(--color-text-muted)"
          }}>
            Konsultasi
          </span>
        </div>

        {/* Activity timeline */}
        <div style={{ padding: "var(--space-5) 0" }}>
          {activities.map((group: { date: string; items: ActivityItem[] }, groupIdx: number) => (
            <div key={group.date}>
              {group.items.map((activity: ActivityItem, idx: number) => {
                const showTimeDivider = groupIdx === 0 && idx === 0 ? false : true;
                const separator = showTimeDivider ? `${activity.time}` : "";
                
                return (
                  <div key={`${group.date}-${idx}`} style={{ 
                    display: "flex", 
                    alignItems: "flex-start",
                    gap: "var(--space-4)",
                    paddingBottom: "var(--space-3)",
                    borderBottom: `1px solid var(--color-border)`
                  }}>
                    <div style={{ 
                      flex: "none", 
                      width: "56px",
                      fontSize: "var(--font-size-13)",
                      color: "var(--color-text-faint)",
                      fontVariantNumeric: "tabular-nums",
                      paddingTop: "1px"
                    }}>
                      {separator}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--weight-medium)" }}>
                        {activity.actor} {activity.action}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {groupIdx < activities.length - 1 && (
                <div style={{ 
                  display: "flex", 
                  alignItems: "center",
                  gap: "var(--space-4)",
                  padding: "var(--space-4) 0",
                  marginTop: "var(--space-2)"
                }}>
                  <div style={{ flex: "none", width: "56px", fontSize: "var(--font-size-13)", color: "var(--color-text-faint)" }}>
                    {group.date}
                  </div>
                  <Divider />
                </div>
              )}
            </div>
          ))}
          
          <a href="/app/activity/all" style={{ 
            display: "inline-block", 
            marginTop: "var(--space-4)",
            fontSize: "var(--font-size-13)",
            textDecoration: "none",
            color: "var(--color-text-muted)"
          }}>
            Lihat semua aktivitas →
          </a>
        </div>
      </Container>
    </section>
  );
}

// ============================================================
// MOBILE VERSION — Mockup 3f
// ============================================================

function MobileActivity({ activities }: { activities: Array<{ date: string; items: ActivityItem[] }> }) {
  return (
    <section className="pc-mobile-only">
      <Container>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
          <h1 style={{ fontSize: "var(--font-size-24)", fontWeight: "var(--weight-semibold)", margin: 0 }}>Aktivitas</h1>
        </div>
        
        <p style={{ fontSize: "var(--font-size-13)", color: "var(--color-text-muted)", marginBottom: "var(--space-3)" }}>
          Riwayat aktivitas belajar peserta.
        </p>

        {/* Filters - simplified for mobile */}
        <div style={{ 
          display: "flex", 
          gap: "var(--space-3)",
          marginBottom: "var(--space-4)",
          overflowX: "auto",
          paddingBottom: "var(--space-1)"
        }}>
          <span style={{ 
            fontSize: "var(--font-size-13)", 
            fontWeight: "var(--weight-medium)", 
            color: "var(--color-accent)",
            borderBottom: `2px solid var(--color-accent)`,
            paddingBottom: "var(--space-1)"
          }}>
            Semua
          </span>
          <span style={{ 
            fontSize: "var(--font-size-13)", 
            fontWeight: "var(--weight-medium)",
            color: "var(--color-text-muted)",
            whiteSpace: "nowrap"
          }}>
            Selesai
          </span>
          <span style={{ 
            fontSize: "var(--font-size-13)", 
            fontWeight: "var(--weight-medium)",
            color: "var(--color-text-muted)",
            whiteSpace: "nowrap"
          }}>
            Refleksi
          </span>
        </div>

        {/* Activity timeline */}
        <div style={{ padding: "0 var(--space-3)" }}>
          {activities.map((group: { date: string; items: ActivityItem[] }, groupIdx: number) => (
            <div key={group.date}>
              {groupIdx > 0 && (
                <div style={{ 
                  padding: "var(--space-3) 0",
                  marginTop: "var(--space-4)"
                }}>
                  <span style={{ 
                    fontSize: "var(--font-size-13)", 
                    color: "var(--color-text-faint)",
                    fontWeight: "var(--weight-medium)"
                  }}>
                    {group.date}
                  </span>
                </div>
              )}
              
              {group.items.map((activity: ActivityItem, idx: number) => (
                <div key={`${group.date}-${idx}`} style={{ 
                  display: "flex", 
                  alignItems: "flex-start",
                  gap: "var(--space-3)",
                  paddingBottom: "var(--space-3)",
                  borderBottom: idx < group.items.length - 1 ? `1px solid var(--color-border)` : "none"
                }}>
                  <div style={{ 
                    flex: "none", 
                    width: "48px",
                    fontSize: "var(--font-size-13)",
                    color: "var(--color-text-faint)",
                    fontVariantNumeric: "tabular-nums",
                    paddingTop: "1px"
                  }}>
                    {activity.time}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--weight-medium)" }}>
                      {activity.actor} {activity.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
