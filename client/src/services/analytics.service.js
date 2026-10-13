import { api } from "@/lib/api";
import { localDb } from "@/lib/local-db";
import { getBackend, getCurrentUserIdSync } from "@/lib/backend";
import {
  addDays,
  dateKeysInRange,
  endOfMonth,
  endOfWeek,
  getLocalDateKey,
  parseLocalDateKey,
  startOfMonth,
  startOfWeek,
} from "@/lib/date";
import { useQuery } from "@tanstack/react-query";

function aggregateCompleted(sessions) {
  return sessions.filter((s) => s.status === "completed" && s.durationSeconds > 0);
}

function totalSeconds(sessions) {
  return sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
}

const analyticsService = {
  async getSummary(period) {
    if (getBackend() !== "local") {
      try {
        const data = await api.get(`/analytics/summary?period=${period}`);
        return data;
      } catch (err) {
        console.warn("[AnalyticsService] API getSummary failed, falling back to local calculation:", err);
      }
    }

    const today = new Date();
    let fromDate;
    let toDate;

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

    const sessions = await this.fetchSessions(fromKey, toKey);
    const completed = aggregateCompleted(sessions);

    const settings = await this.fetchSettings();
    const goalSeconds = settings?.dailyFocusGoalSeconds ?? 10800;
    const totalSec = totalSeconds(completed);

    const breakdownMap = new Map();
    for (const s of completed) {
      const key = s.targetId ?? `__none__${s.targetName}`;
      const name = s.targetName || "Unfocused";
      const existing = breakdownMap.get(key);
      if (existing) {
        existing.seconds += s.durationSeconds;
      } else {
        breakdownMap.set(key, {
          targetName: name,
          seconds: s.durationSeconds,
          icon: this.iconFor(s, period),
          type: s.targetType,
        });
      }
    }
    const breakdown = Array.from(breakdownMap.values()).sort((a, b) => b.seconds - a.seconds);

    const history = await this.buildHistory(period);

    const historyRange = analyticsService.historyRange(period);
    const historySessions = await this.fetchSessions(
      getLocalDateKey(historyRange.from),
      getLocalDateKey(historyRange.to)
    );
    const historyCompleted = aggregateCompleted(historySessions);

    let bestFocus = null;
    const dailyTotals = new Map();
    for (const s of historyCompleted) {
      dailyTotals.set(s.date, (dailyTotals.get(s.date) ?? 0) + s.durationSeconds);
    }
    for (const [date, secs] of dailyTotals.entries()) {
      if (!bestFocus || secs > bestFocus.seconds) {
        bestFocus = { date, seconds: secs };
      }
    }

    const autoCheckIns = await this.fetchAutoCheckIns();

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

  async fetchSessions(fromKey, toKey) {
    return localDb
      .getFocusSessions()
      .filter((s) => s.date >= fromKey && s.date <= toKey);
  },

  async fetchSettings() {
    const settings = localDb.getSettings();
    return settings ? { dailyFocusGoalSeconds: settings.dailyFocusGoalSeconds ?? 10800 } : null;
  },

  async fetchAutoCheckIns() {
    const completions = localDb.getHabitCompletions().filter((c) => c.completedAutomatically);
    const habits = localDb.getHabits();
    const habitName = (id) => habits.find((h) => h.id === id)?.name ?? "Habit";

    return completions.slice(0, 10).map((c) => ({
      habitName: habitName(c.habitId),
      date: c.date,
      completedAt: c.completedAt ?? new Date().toISOString(),
    }));
  },

  iconFor(s, _period) {
    return s.targetType === "habit" ? "" : "✅";
  },

  historyRange(period) {
    const today = new Date();
    if (period === "day") {
      return { from: addDays(today, -6), to: today };
    }
    if (period === "week") {
      return { from: startOfWeek(today), to: endOfWeek(today) };
    }
    return { from: startOfMonth(today), to: endOfMonth(today) };
  },

  async buildHistory(period) {
    const { from: fromDate, to: toDate } = this.historyRange(period);

    if (period === "month") {
      const keys2 = dateKeysInRange(fromDate, toDate);
      const sessions2 = await this.fetchSessions(getLocalDateKey(fromDate), getLocalDateKey(toDate));
      const completed2 = aggregateCompleted(sessions2);

      const weeks = [];
      let labelIndex = 1;
      const bucketKey = (d) => getLocalDateKey(startOfWeek(parseLocalDateKey(d)));
      const weekTotals = new Map();
      for (const key of keys2) {
        const wk = bucketKey(key);
        weekTotals.set(wk, 0);
      }
      for (const s of completed2) {
        const wk = bucketKey(s.date);
        if (weekTotals.has(wk)) {
          weekTotals.set(wk, (weekTotals.get(wk) ?? 0) + s.durationSeconds);
        }
      }
      for (const wk of weekTotals.keys()) {
        weeks.push({ label: `Wk ${labelIndex++}`, seconds: weekTotals.get(wk) ?? 0 });
      }
      if (weeks.length === 0 && fromDate.getMonth() === toDate.getMonth()) {
        return [{ label: "Wk 1", seconds: 0 }];
      }
      return weeks;
    }

    const keys = dateKeysInRange(fromDate, toDate);
    const sessions = await this.fetchSessions(keys[0], keys[keys.length - 1]);
    const completed = aggregateCompleted(sessions);
    const byDay = new Map();
    for (const s of completed) byDay.set(s.date, (byDay.get(s.date) ?? 0) + s.durationSeconds);
    const weekday = (key) => parseLocalDateKey(key).toLocaleDateString("en-US", { weekday: "short" });
    return keys.map((key) => ({ label: weekday(key), seconds: byDay.get(key) ?? 0 }));
  },
};

function useAnalytics(period) {
  return useQuery({
    queryKey: ["analytics", period, getCurrentUserIdSync() ?? "local"],
    queryFn: () => analyticsService.getSummary(period),
  });
}

export {
  analyticsService,
  useAnalytics,
};
