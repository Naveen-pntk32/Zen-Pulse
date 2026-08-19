import supabase from '@/config/supabase';
import { localDb } from '@/lib/local-db';
import { getBackend, getCurrentUserIdSync, makeId } from '@/lib/backend';
import { HabitCompletion, FocusSession } from '@/types';
import { habitService } from '@/services/habit.service';
import { focusSessionService } from '@/services/focus-session.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function mapRow(row: any): HabitCompletion {
  return {
    id: row.id,
    habitId: row.habit_id,
    date: typeof row.date === 'string' ? row.date.slice(0, 10) : row.date,
    completed: row.completed ?? false,
    completedAutomatically: row.completed_automatically ?? false,
    actualFocusSeconds: row.actual_focus_seconds ?? 0,
    completedAt: row.completed_at ?? null,
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

export const habitCompletionService = {
  async getAllForDate(date: string): Promise<HabitCompletion[]> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('date', date);
      if (error) throw error;
      return (data ?? []).map(mapRow);
    }
    return (localDb.getHabitCompletions() as HabitCompletion[]).filter((c) => c.date === date);
  },

  async getAllBetween(from: string, to: string): Promise<HabitCompletion[]> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .gte('date', from)
        .lte('date', to);
      if (error) throw error;
      return (data ?? []).map(mapRow);
    }
    return (localDb.getHabitCompletions() as HabitCompletion[]).filter(
      (c) => c.date >= from && c.date <= to,
    );
  },

  async get(habitId: string, date: string): Promise<HabitCompletion | null> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('habit_id', habitId)
        .eq('date', date)
        .maybeSingle();
      if (error) throw error;
      return data ? mapRow(data) : null;
    }
    return (localDb.getHabitCompletions() as HabitCompletion[]).find(
      (c) => c.habitId === habitId && c.date === date,
    ) ?? null;
  },

  async upsert(completion: Partial<HabitCompletion> & { habitId: string; date: string }, userId: string): Promise<HabitCompletion> {
    if (getBackend() === 'supabase') {
      const payload = {
        habit_id: completion.habitId,
        user_id: userId,
        date: completion.date,
        completed: completion.completed ?? false,
        completed_automatically: completion.completedAutomatically ?? false,
        actual_focus_seconds: completion.actualFocusSeconds ?? 0,
        completed_at: completion.completedAt ?? null,
      };
      const { data, error } = await supabase
        .from('habit_completions')
        .upsert(payload, { onConflict: 'habit_id,date' })
        .select()
        .single();
      if (error) throw error;
      return mapRow(data);
    }
    const completions = localDb.getHabitCompletions() as HabitCompletion[];
    const existing = completions.find((c) => c.habitId === completion.habitId && c.date === completion.date);
    let result: HabitCompletion;
    if (existing) {
      result = {
        ...existing,
        completed: completion.completed ?? existing.completed,
        completedAutomatically: completion.completedAutomatically ?? existing.completedAutomatically,
        actualFocusSeconds: completion.actualFocusSeconds ?? existing.actualFocusSeconds,
        completedAt: completion.completedAt ?? existing.completedAt,
      };
      localDb.setHabitCompletions(completions.map((c) => (c.id === existing.id ? result : c)));
    } else {
      result = {
        id: makeId(),
        habitId: completion.habitId,
        date: completion.date,
        completed: completion.completed ?? false,
        completedAutomatically: completion.completedAutomatically ?? false,
        actualFocusSeconds: completion.actualFocusSeconds ?? 0,
        completedAt: completion.completedAt ?? null,
        createdAt: new Date().toISOString(),
      };
      localDb.setHabitCompletions([...completions, result]);
    }
    return result;
  },

  /** Manual check-in toggle for a habit on a date. */
  async toggleManual(habitId: string, date: string, userId: string): Promise<HabitCompletion> {
    const existing = await this.get(habitId, date);
    const nowCompleted = !(existing?.completed ?? false);
    return this.upsert(
      {
        habitId,
        date,
        completed: nowCompleted,
        completedAutomatically: existing?.completedAutomatically ?? false,
        actualFocusSeconds: existing?.actualFocusSeconds ?? 0,
        completedAt: nowCompleted ? new Date().toISOString() : null,
      },
      userId,
    );
  },

  /** Return the actual focused seconds for a habit on a date. */
  async getActualFocusSeconds(habitId: string, date: string): Promise<number> {
    const completion = await this.get(habitId, date);
    if (completion) return completion.actualFocusSeconds;
    return focusSessionService.getDailyTotalForTarget(habitId, date);
  },

  /**
   * Automatic check-in. Called after every completed focus session.
   * Idempotent: never overwrites an existing manual completion, never duplicates.
   */
  async evaluateAutoCheckIn(session: FocusSession, userId: string): Promise<HabitCompletion | null> {
    if (session.targetType !== 'habit' || !session.targetId) return null;

    const habit = await habitService.get(session.targetId);
    if (!habit || habit.archived) return null;
    if (habit.goalType !== 'time' || habit.dailyGoalSeconds <= 0) return null;

    const totalSeconds = await focusSessionService.getDailyTotalForTarget(habit.id, session.date);
    if (totalSeconds < habit.dailyGoalSeconds) return null;

    const existing = await this.get(habit.id, session.date);
    if (existing && existing.completed) {
      // Preserve manual check-ins; if auto-completed already, keep actualFocusSeconds fresh.
      if (existing.completedAutomatically && existing.actualFocusSeconds !== totalSeconds) {
        return this.upsert(
          { habitId: habit.id, date: session.date, actualFocusSeconds: totalSeconds },
          userId,
        );
      }
      return existing;
    }

    return this.upsert(
      {
        habitId: habit.id,
        date: session.date,
        completed: true,
        completedAutomatically: true,
        actualFocusSeconds: totalSeconds,
        completedAt: new Date().toISOString(),
      },
      userId,
    );
  },
};

export function useHabitCompletions(date: string) {
  return useQuery({
    queryKey: ['habit-completions', date],
    queryFn: () => habitCompletionService.getAllForDate(date),
  });
}

export function useHabitCompletionsBetween(from: string, to: string) {
  return useQuery({
    queryKey: ['habit-completions', from, to],
    queryFn: () => habitCompletionService.getAllBetween(from, to),
  });
}

export function useToggleHabitCompletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ habitId, date }: { habitId: string; date: string }) =>
      habitCompletionService.toggleManual(habitId, date, getCurrentUserIdSync() ?? 'local'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habit-completions'] }),
  });
}
