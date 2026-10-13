import { api } from "@/lib/api";
import { localDb } from "@/lib/local-db";
import { getBackend, getCurrentUserIdSync, makeId } from "@/lib/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon ?? "😊",
    frequency: row.frequency ?? "daily",
    goalType: row.goalType ?? row.goal_type ?? "simple",
    dailyGoalSeconds: row.dailyGoalSeconds ?? row.daily_goal_seconds ?? 0,
    startDate: row.startDate ?? row.start_date ?? new Date().toISOString().slice(0, 10),
    goalDays: row.goalDays ?? row.goal_days ?? null,
    section: row.section ?? "others",
    reminder: row.reminder ?? null,
    autoPopup: row.autoPopup ?? row.auto_popup ?? false,
    archived: row.archived ?? false,
    createdAt: row.createdAt ?? row.created_at ?? new Date().toISOString(),
  };
}

const habitService = {
  async getAll(options) {
    if (getBackend() !== "local") {
      try {
        const params = new URLSearchParams();
        if (options?.includeArchived) params.append("includeArchived", "true");
        const qs = params.toString();
        const data = await api.get(`/habits${qs ? `?${qs}` : ""}`);
        return (data ?? []).map(mapRow);
      } catch (err) {
        console.warn("[HabitService] API getAll failed, falling back to localDb:", err);
      }
    }

    let habits = localDb.getHabits();
    if (!options?.includeArchived) habits = habits.filter((h) => !h.archived);
    return habits;
  },

  async get(id) {
    if (getBackend() !== "local") {
      try {
        const data = await api.get(`/habits/${id}`);
        return data ? mapRow(data) : null;
      } catch (err) {
        console.warn("[HabitService] API get failed, falling back to localDb:", err);
      }
    }
    return localDb.getHabits().find((h) => h.id === id) ?? null;
  },

  async create(habit, userId) {
    if (getBackend() !== "local") {
      try {
        const payload = {
          name: habit.name,
          icon: habit.icon ?? "😊",
          frequency: habit.frequency ?? "daily",
          goalType: habit.goalType ?? "simple",
          dailyGoalSeconds: habit.dailyGoalSeconds ?? 0,
          startDate: habit.startDate ?? new Date().toISOString().slice(0, 10),
          goalDays: habit.goalDays ?? null,
          section: habit.section ?? "others",
          reminder: habit.reminder ?? null,
          autoPopup: habit.autoPopup ?? false,
          archived: habit.archived ?? false,
        };
        const created = await api.post("/habits", payload);
        return mapRow(created);
      } catch (err) {
        console.warn("[HabitService] API create failed, falling back to localDb:", err);
      }
    }

    const newHabit = {
      id: makeId(),
      name: habit.name,
      icon: habit.icon ?? "😊",
      frequency: habit.frequency ?? "daily",
      goalType: habit.goalType ?? "simple",
      dailyGoalSeconds: habit.dailyGoalSeconds ?? 0,
      startDate: habit.startDate ?? new Date().toISOString().slice(0, 10),
      goalDays: habit.goalDays ?? null,
      section: habit.section ?? "others",
      reminder: habit.reminder ?? null,
      autoPopup: habit.autoPopup ?? false,
      archived: habit.archived ?? false,
      createdAt: new Date().toISOString(),
    };
    localDb.setHabits([...localDb.getHabits(), newHabit]);
    return newHabit;
  },

  async update(id, patch) {
    if (getBackend() !== "local") {
      try {
        const updated = await api.patch(`/habits/${id}`, patch);
        return mapRow(updated);
      } catch (err) {
        console.warn("[HabitService] API update failed, falling back to localDb:", err);
      }
    }

    const habits = localDb.getHabits();
    const next = habits.map((h) => (h.id === id ? { ...h, ...patch } : h));
    localDb.setHabits(next);
    return next.find((h) => h.id === id);
  },

  async remove(id) {
    if (getBackend() !== "local") {
      try {
        await api.delete(`/habits/${id}`);
        return;
      } catch (err) {
        console.warn("[HabitService] API remove failed, falling back to localDb:", err);
      }
    }

    localDb.setHabits(localDb.getHabits().filter((h) => h.id !== id));
  },

  async archive(id, archived) {
    return this.update(id, { archived });
  },
};

function useHabits(options) {
  return useQuery({
    queryKey: ["habits", options?.includeArchived ?? false],
    queryFn: () => habitService.getAll(options),
  });
}

function useCreateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (habit) => habitService.create(habit, getCurrentUserIdSync() ?? "local"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["focus-targets"] });
    },
  });
}

function useUpdateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => habitService.update(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["focus-targets"] });
    },
  });
}

function useDeleteHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: habitService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["habit-completions"] });
      queryClient.invalidateQueries({ queryKey: ["focus-targets"] });
    },
  });
}

export {
  habitService,
  useCreateHabit,
  useDeleteHabit,
  useHabits,
  useUpdateHabit,
};
