import { eq, and, gte, lte, desc } from "drizzle-orm";
import { getDb } from "../config/database.js";
import { focusSessions, userSettings, habitCompletions, habits } from "../db/schema.js";
import { DEFAULT_SETTINGS } from "./settings.service.js";

function getLocalDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseLocalDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(d: Date): Date {
  const res = new Date(d);
  const day = res.getDay();
  const diff = (day + 6) % 7; // Monday = 0
  res.setDate(res.getDate() - diff);
  res.setHours(0, 0, 0, 0);
  return res;
}

function endOfWeek(d: Date): Date {
  const start = startOfWeek(d);
  return addDays(start, 6);
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function dateKeysInRange(from: Date, to: Date): string[] {
  const keys: string[] = [];
  let curr = new Date(from);
  while (curr <= to) {
    keys.push(getLocalDateKey(curr));
    curr = addDays(curr, 1);
  }
  return keys;
}

export const analyticsService = {
  async getSummary(userId: string, period: "day" | "week" | "month") {
    const db = getDb();
    const today = new Date();
    let fromDate: Date;
    let toDate: Date;

    if (period === "day") {
      fromDate = today;
      toDate = today;
    } else if (period === "week") {
      fromDate = startOfWeek(today);
      toDate = endOfWeek(today);
    } else {
      fromDate = startOfMonth(today);
      toDate = endOfMonth(today);
    }

    const fromKey = getLocalDateKey(fromDate);
    const toKey = getLocalDateKey(toDate);

    // Fetch settings for goalSeconds
    const [settingsRow] = await db
      .select({ dailyFocusGoalSeconds: userSettings.dailyFocusGoalSeconds })
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    const goalSeconds = settingsRow?.dailyFocusGoalSeconds ?? DEFAULT_SETTINGS.dailyFocusGoalSeconds;

    // Fetch focus sessions for current period
    const currentSessions = await db
      .select()
      .from(focusSessions)
      .where(
        and(
          eq(focusSessions.userId, userId),
          gte(focusSessions.date, fromKey),
          lte(focusSessions.date, toKey),
          eq(focusSessions.status, "completed")
        )
      );

    const totalSec = currentSessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0);

    // Breakdown map
    const breakdownMap = new Map<string, { targetName: string; seconds: number; icon: string; type: string | null }>();
    for (const s of currentSessions) {
      if (!s.durationSeconds) continue;
      const key = s.targetId ?? `__none__${s.targetName}`;
      const name = s.targetName || "Unfocused";
      const icon = s.targetType === "habit" ? "" : "✅";
      const existing = breakdownMap.get(key);
      if (existing) {
        existing.seconds += s.durationSeconds;
      } else {
        breakdownMap.set(key, { targetName: name, seconds: s.durationSeconds, icon, type: s.targetType });
      }
    }
    const breakdown = Array.from(breakdownMap.values()).sort((a, b) => b.seconds - a.seconds);

    // Build history
    const history = await this.buildHistory(userId, period);

    // Best focus day across the history range
    let bestFocus: { date: string; seconds: number } | null = null;
    let historyFromDate: Date;
    let historyToDate: Date;
    if (period === "day") {
      historyFromDate = addDays(today, -6);
      historyToDate = today;
    } else if (period === "week") {
      historyFromDate = startOfWeek(today);
      historyToDate = endOfWeek(today);
    } else {
      historyFromDate = startOfMonth(today);
      historyToDate = endOfMonth(today);
    }

    const historySessions = await db
      .select()
      .from(focusSessions)
      .where(
        and(
          eq(focusSessions.userId, userId),
          gte(focusSessions.date, getLocalDateKey(historyFromDate)),
          lte(focusSessions.date, getLocalDateKey(historyToDate)),
          eq(focusSessions.status, "completed")
        )
      );

    const dailyTotals = new Map<string, number>();
    for (const s of historySessions) {
      dailyTotals.set(s.date, (dailyTotals.get(s.date) ?? 0) + s.durationSeconds);
    }
    for (const [date, secs] of dailyTotals.entries()) {
      if (!bestFocus || secs > bestFocus.seconds) {
        bestFocus = { date, seconds: secs };
      }
    }

    // Auto check-ins
    const recentAutoCompletions = await db
      .select({
        id: habitCompletions.id,
        habitId: habitCompletions.habitId,
        date: habitCompletions.date,
        completedAt: habitCompletions.completedAt,
        habitName: habits.name,
      })
      .from(habitCompletions)
      .leftJoin(habits, eq(habitCompletions.habitId, habits.id))
      .where(
        and(
          eq(habitCompletions.userId, userId),
          eq(habitCompletions.completedAutomatically, true)
        )
      )
      .orderBy(desc(habitCompletions.createdAt))
      .limit(10);

    const autoCheckIns = recentAutoCompletions.map((c) => ({
      habitName: c.habitName ?? "Habit",
      date: c.date,
      completedAt: c.completedAt ? c.completedAt.toISOString() : new Date().toISOString(),
    }));

    return {
      totalSeconds: totalSec,
      goalSeconds,
      achievementPercent: goalSeconds > 0 ? Math.round((totalSec / goalSeconds) * 100) : 0,
      breakdown,
      history,
      bestFocus,
      autoCheckIns,
    };
  },

  async buildHistory(userId: string, period: "day" | "week" | "month") {
    const db = getDb();
    const today = new Date();
    let fromDate: Date;
    let toDate: Date;

    if (period === "day") {
      fromDate = addDays(today, -6);
      toDate = today;
    } else if (period === "week") {
      fromDate = startOfWeek(today);
      toDate = endOfWeek(today);
    } else {
      fromDate = startOfMonth(today);
      toDate = endOfMonth(today);
    }

    if (period === "month") {
      const keys = dateKeysInRange(fromDate, toDate);
      const sessions = await db
        .select()
        .from(focusSessions)
        .where(
          and(
            eq(focusSessions.userId, userId),
            gte(focusSessions.date, getLocalDateKey(fromDate)),
            lte(focusSessions.date, getLocalDateKey(toDate)),
            eq(focusSessions.status, "completed")
          )
        );

      let labelIndex = 1;
      const bucketKey = (d: string) => getLocalDateKey(startOfWeek(parseLocalDateKey(d)));
      const weekTotals = new Map<string, number>();
      for (const key of keys) {
        const wk = bucketKey(key);
        if (!weekTotals.has(wk)) weekTotals.set(wk, 0);
      }
      for (const s of sessions) {
        const wk = bucketKey(s.date);
        if (weekTotals.has(wk)) {
          weekTotals.set(wk, (weekTotals.get(wk) ?? 0) + s.durationSeconds);
        }
      }
      const weeks: { label: string; seconds: number }[] = [];
      for (const wk of weekTotals.keys()) {
        weeks.push({ label: `Wk ${labelIndex++}`, seconds: weekTotals.get(wk) ?? 0 });
      }
      return weeks.length > 0 ? weeks : [{ label: "Wk 1", seconds: 0 }];
    }

    const keys = dateKeysInRange(fromDate, toDate);
    const sessions = await db
      .select()
      .from(focusSessions)
      .where(
        and(
          eq(focusSessions.userId, userId),
          gte(focusSessions.date, keys[0]),
          lte(focusSessions.date, keys[keys.length - 1]),
          eq(focusSessions.status, "completed")
        )
      );

    const byDay = new Map<string, number>();
    for (const s of sessions) {
      byDay.set(s.date, (byDay.get(s.date) ?? 0) + s.durationSeconds);
    }

    const weekday = (key: string) =>
      parseLocalDateKey(key).toLocaleDateString("en-US", { weekday: "short" });

    return keys.map((key) => ({
      label: weekday(key),
      seconds: byDay.get(key) ?? 0,
    }));
  },
};
