import { api } from "@/lib/api";
import { localDb } from "@/lib/local-db";
import { getBackend, getCurrentUserIdSync, makeId } from "@/lib/backend";
import { habitService } from "@/services/habit.service";
import { focusSessionService } from "@/services/focus-session.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function mapRow(row) {
  return {
    id: row.id,
    habitId: row.habitId ?? row.habit_id,
    date: typeof row.date === "string" ? row.date.slice(0, 10) : row.date,
    completed: row.completed ?? false,
    completedAutomatically: row.completedAutomatically ?? row.completed_automatically ?? false,
    actualFocusSeconds: row.actualFocusSeconds ?? row.actual_focus_seconds ?? 0,
    completedAt: row.completedAt ?? row.completed_at ?? null,
    createdAt: row.createdAt ?? row.created_at ?? new Date().toISOString(),
  };
}

const habitCompletionService = {
  async getAllForDate(date) {
    if (getBackend() !== "local") {
      try {
        const data = await api.get(`/habit-completions?date=${date}`);
        return (data ?? []).map(mapRow);
      } catch (err) {
        console.warn("[HabitCompletionService] API getAllForDate failed, falling back to localDb:", err);
      }
    }
    return localDb.getHabitCompletions().filter((c) => c.date === date);
  },

  async getAllBetween(from, to) {
    if (getBackend() !== "local") {
      try {
        const data = await api.get(`/habit-completions?from=${from}&to=${to}`);
        return (data ?? []).map(mapRow);
      } catch (err) {
        console.warn("[HabitCompletionService] API getAllBetween failed, falling back to localDb:", err);
      }
    }
    return localDb.getHabitCompletions().filter((c) => c.date >= from && c.date <= to);
  },

  async get(habitId, date) {
    const completions = await this.getAllForDate(date);
    return completions.find((c) => c.habitId === habitId) ?? null;
  },

  async upsert(completion, userId) {
    if (getBackend() !== "local") {
      try {
        const payload = {
          habitId: completion.habitId,
          date: completion.date,
          completed: completion.completed ?? false,
          completedAutomatically: completion.completedAutomatically ?? false,
          actualFocusSeconds: completion.actualFocusSeconds ?? 0,
          completedAt: completion.completedAt ?? null,
        };
        const data = await api.post("/habit-completions", payload);
        return mapRow(data);
      } catch (err) {
        console.warn("[HabitCompletionService] API upsert failed, falling back to localDb:", err);
      }
    }

    const completions = localDb.getHabitCompletions();
    const existing = completions.find((c) => c.habitId === completion.habitId && c.date === completion.date);
    let result;
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

  async toggleManual(habitId, date, userId) {
    if (getBackend() !== "local") {
      try {
        const data = await api.post("/habit-completions/toggle", { habitId, date });
        return mapRow(data);
      } catch (err) {
        console.warn("[HabitCompletionService] API toggleManual failed, falling back to localDb:", err);
      }
    }

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
      userId
    );
  },

  async getActualFocusSeconds(habitId, date) {
    const completion = await this.get(habitId, date);
    if (completion) return completion.actualFocusSeconds;
    return focusSessionService.getDailyTotalForTarget(habitId, date);
  },

  async evaluateAutoCheckIn(session, userId) {
    if (session.targetType !== "habit" || !session.targetId) return null;
    const habit = await habitService.get(session.targetId);
    if (!habit || habit.archived) return null;
    if (habit.goalType !== "time" || habit.dailyGoalSeconds <= 0) return null;

    const totalSeconds = await focusSessionService.getDailyTotalForTarget(habit.id, session.date);
    if (totalSeconds < habit.dailyGoalSeconds) return null;

    const existing = await this.get(habit.id, session.date);
    if (existing && existing.completed) {
      if (existing.completedAutomatically && existing.actualFocusSeconds !== totalSeconds) {
        return this.upsert(
          { habitId: habit.id, date: session.date, actualFocusSeconds: totalSeconds },
          userId
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
      userId
    );
  },
};

function useHabitCompletions(date) {
  return useQuery({
    queryKey: ["habit-completions", date],
    queryFn: () => habitCompletionService.getAllForDate(date),
  });
}

function useHabitCompletionsBetween(from, to) {
  return useQuery({
    queryKey: ["habit-completions", from, to],
    queryFn: () => habitCompletionService.getAllBetween(from, to),
  });
}

function useToggleHabitCompletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ habitId, date }) =>
      habitCompletionService.toggleManual(habitId, date, getCurrentUserIdSync() ?? "local"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habit-completions"] }),
  });
}

export {
  habitCompletionService,
  useHabitCompletions,
  useHabitCompletionsBetween,
  useToggleHabitCompletion,
};
