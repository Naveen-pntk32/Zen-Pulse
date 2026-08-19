import supabase from '@/config/supabase';
import { localDb } from '@/lib/local-db';
import { getBackend, getCurrentUserIdSync } from '@/lib/backend';
import { AnalyticsSummary, FocusSession, Habit, HabitCompletion } from '@/types';
import {
  addDays,
  dateKeysInRange,
  endOfMonth,
  endOfWeek,
  getLocalDateKey,
  parseLocalDateKey,
  startOfMonth,
  startOfWeek,
} from '@/lib/date';
import { useQuery } from '@tanstack/react-query';

export type AnalyticsPeriod = 'day' | 'week' | 'month';

function aggregateCompleted(sessions: FocusSession[]): FocusSession[] {
  return sessions.filter((s) => s.status === 'completed' && s.durationSeconds > 0);
}

function totalSeconds(sessions: FocusSession[]): number {
  return sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
}

export const analyticsService = {
  async getSummary(period: AnalyticsPeriod): Promise<AnalyticsSummary> {
    const today = new Date();
    let fromDate: Date;
    let toDate: Date;

    if (period === 'day') {
      fromDate = today;
      toDate = today;
    } else if (period === 'week') {
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

    // Goal from settings
    const settings = await this.fetchSettings();
    const goalSeconds = settings?.dailyFocusGoalSeconds ?? 10800;
    const totalSec = totalSeconds(completed);

    // Breakdown by target
    const breakdownMap = new Map<string, { targetName: string; seconds: number; icon: string; type: FocusSession['targetType'] }>();
    for (const s of completed) {
      const key = s.targetId ?? `__none__${s.targetName}`;
      const name = s.targetName || 'Unfocused';
      const existing = breakdownMap.get(key);
      if (existing) {
        existing.seconds += s.durationSeconds;
      } else {
        breakdownMap.set(key, { targetName: name, seconds: s.durationSeconds, icon: this.iconFor(s, period), type: s.targetType });
      }
    }
    const breakdown = Array.from(breakdownMap.values()).sort((a, b) => b.seconds - a.seconds);

    // History (Day view shows the last 7 days)
    const history = await this.buildHistory(period);

    // Best focus day across the history window
    const historyRange = analyticsService.historyRange(period);
    const historySessions = await this.fetchSessions(
      getLocalDateKey(historyRange.from),
      getLocalDateKey(historyRange.to),
    );
    const historyCompleted = aggregateCompleted(historySessions);
    let bestFocus: AnalyticsSummary['bestFocus'] = null;
    const dailyTotals = new Map<string, number>();
    for (const s of historyCompleted) {
      dailyTotals.set(s.date, (dailyTotals.get(s.date) ?? 0) + s.durationSeconds);
    }
    for (const [date, secs] of dailyTotals.entries()) {
      if (!bestFocus || secs > bestFocus.seconds) {
        bestFocus = { date, seconds: secs };
      }
    }

    // Auto check-in events (recent)
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

  async fetchSessions(fromKey: string, toKey: string): Promise<FocusSession[]> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .gte('date', fromKey)
        .lte('date', toKey);
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        id: r.id,
        type: r.type,
        targetType: r.target_type ?? null,
        targetId: r.target_id ?? null,
        targetName: r.target_name ?? '',
        durationSeconds: r.duration_seconds ?? 0,
        plannedDurationSeconds: r.planned_duration_seconds ?? null,
        startedAt: r.started_at,
        endedAt: r.ended_at ?? null,
        status: r.status,
        date: String(r.date).slice(0, 10),
        createdAt: r.created_at,
      }));
    }
    return (localDb.getFocusSessions() as FocusSession[]).filter(
      (s) => s.date >= fromKey && s.date <= toKey,
    );
  },

  async fetchSettings(): Promise<{ dailyFocusGoalSeconds: number } | null> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase.from('user_settings').select('daily_focus_goal_seconds').maybeSingle();
      if (error) return null;
      return data ? { dailyFocusGoalSeconds: data.daily_focus_goal_seconds ?? 10800 } : null;
    }
    const settings = localDb.getSettings();
    return settings ? { dailyFocusGoalSeconds: settings.dailyFocusGoalSeconds ?? 10800 } : null;
  },

  async fetchAutoCheckIns(): Promise<AnalyticsSummary['autoCheckIns']> {
    let completions: HabitCompletion[];
    let habits: { id: string; name: string }[];
    if (getBackend() === 'supabase') {
      const [cRes, hRes] = await Promise.all([
        supabase.from('habit_completions').select('*').eq('completed_automatically', true).order('created_at', { ascending: false }).limit(10),
        supabase.from('habits').select('*').limit(100),
      ]);
      completions = (cRes.data ?? []).map((r: any) => ({
        id: r.id, habitId: r.habit_id, date: String(r.date).slice(0, 10), completed: r.completed,
        completedAutomatically: r.completed_automatically, actualFocusSeconds: r.actual_focus_seconds,
        completedAt: r.completed_at, createdAt: r.created_at,
      }));
      habits = (hRes.data ?? []).map((r: any) => ({ id: r.id, name: r.name }));
    } else {
      completions = (localDb.getHabitCompletions() as HabitCompletion[]).filter((c) => c.completedAutomatically);
      habits = localDb.getHabits() as Habit[];
    }
    const habitName = (id: string) => habits.find((h) => h.id === id)?.name ?? 'Habit';
    return completions.slice(0, 10).map((c) => ({
      habitName: habitName(c.habitId),
      date: c.date,
      completedAt: c.completedAt ?? new Date().toISOString(),
    }));
  },

  iconFor(s: FocusSession, _period: AnalyticsPeriod): string {
    // Icon stored with the habit; tasks get a generic icon. Resolved in the panel via lookup.
    return s.targetType === 'habit' ? '' : '✅';
  },

  historyRange(period: AnalyticsPeriod): { from: Date; to: Date } {
    const today = new Date();
    if (period === 'day') {
      return { from: addDays(today, -6), to: today };
    }
    if (period === 'week') {
      return { from: startOfWeek(today), to: endOfWeek(today) };
    }
    return { from: startOfMonth(today), to: endOfMonth(today) };
  },

  async buildHistory(period: AnalyticsPeriod): Promise<{ label: string; seconds: number }[]> {
    const { from: fromDate, to: toDate } = this.historyRange(period);

    if (period === 'month') {
      // Weekly buckets for the current month
      const keys = dateKeysInRange(fromDate, toDate);
      const sessions = await this.fetchSessions(getLocalDateKey(fromDate), getLocalDateKey(toDate));
      const completed = aggregateCompleted(sessions);
      const weeks: { label: string; seconds: number }[] = [];
      let labelIndex = 1;

      const bucketKey = (d: string) => getLocalDateKey(startOfWeek(parseLocalDateKey(d)));

      const weekTotals = new Map<string, number>();
      for (const key of keys) {
        const wk = bucketKey(key);
        weekTotals.set(wk, 0);
      }
      for (const s of completed) {
        const wk = bucketKey(s.date);
        if (weekTotals.has(wk)) {
          weekTotals.set(wk, (weekTotals.get(wk) ?? 0) + s.durationSeconds);
        }
      }
      for (const wk of weekTotals.keys()) {
        weeks.push({ label: `Wk ${labelIndex++}`, seconds: weekTotals.get(wk) ?? 0 });
      }
      if (weeks.length === 0 && fromDate.getMonth() === toDate.getMonth()) {
        return [{ label: 'Wk 1', seconds: 0 }];
      }
      return weeks;
    }

    // day / week: daily buckets
    const keys = dateKeysInRange(fromDate, toDate);
    const sessions = await this.fetchSessions(keys[0], keys[keys.length - 1]);
    const completed = aggregateCompleted(sessions);
    const byDay = new Map<string, number>();
    for (const s of completed) byDay.set(s.date, (byDay.get(s.date) ?? 0) + s.durationSeconds);

    const weekday = (key: string) =>
      parseLocalDateKey(key).toLocaleDateString('en-US', { weekday: 'short' });

    return keys.map((key) => ({ label: weekday(key), seconds: byDay.get(key) ?? 0 }));
  },
};

export function useAnalytics(period: AnalyticsPeriod) {
  return useQuery({
    queryKey: ['analytics', period, getCurrentUserIdSync() ?? 'local'],
    queryFn: () => analyticsService.getSummary(period),
  });
}
