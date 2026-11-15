export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type ContributionData = {
  total: number;
  days: ContributionDay[];
  /** Weeks (columns) of 7 slots, Sunday-first. `null` pads the first/last week. */
  weeks: (ContributionDay | null)[][];
  busiest: ContributionDay | null;
  activeDays: number;
  longestStreak: number;
};

type ApiResponse = {
  total?: Record<string, number>;
  contributions?: { date: string; count: number; level: number }[];
};

/**
 * Server-only. Fetches the last year of contributions; returns null on any failure so
 * the section can render its fallback instead of a broken grid.
 */
export async function getContributions(user: string): Promise<ContributionData | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiResponse;
    const raw = json.contributions;
    if (!Array.isArray(raw) || raw.length === 0) return null;

    const days: ContributionDay[] = raw
      .filter((d) => typeof d?.date === "string" && typeof d?.count === "number")
      .map((d) => ({
        date: d.date,
        count: d.count,
        level: Math.max(0, Math.min(4, Math.round(d.level))) as ContributionDay["level"],
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    if (days.length === 0) return null;

    const total =
      typeof json.total?.lastYear === "number" ? json.total.lastYear : days.reduce((s, d) => s + d.count, 0);

    const weeks: (ContributionDay | null)[][] = [];
    const firstDow = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
    let week: (ContributionDay | null)[] = Array.from({ length: firstDow }, () => null);
    for (const d of days) {
      week.push(d);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }

    let busiest: ContributionDay | null = null;
    let streak = 0;
    let longestStreak = 0;
    let activeDays = 0;
    for (const d of days) {
      if (d.count > 0) {
        activeDays++;
        streak++;
        longestStreak = Math.max(longestStreak, streak);
      } else streak = 0;
      if (!busiest || d.count > busiest.count) busiest = d;
    }

    return { total, days, weeks, busiest: busiest && busiest.count > 0 ? busiest : null, activeDays, longestStreak };
  } catch {
    return null;
  }
}
