import supabase from "@/config/supabase";
import { localDb } from "@/lib/local-db";
import { getBackend, getCurrentUserIdSync, makeId } from "@/lib/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon ?? "\u{1F60A}",
    frequency: row.frequency ?? "daily",
    goalType: row.goal_type ?? "simple",
    dailyGoalSeconds: row.daily_goal_seconds ?? 0,
    startDate: row.start_date ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    goalDays: row.goal_days ?? null,
    section: row.section ?? "others",
    reminder: row.reminder ?? null,
    autoPopup: row.auto_popup ?? false,
    archived: row.archived ?? false,
    createdAt: row.created_at ?? (/* @__PURE__ */ new Date()).toISOString()
  };
}
function toInsert(habit, userId) {
  return {
    id: makeId(),
    user_id: userId,
    name: habit.name,
    icon: habit.icon ?? "\u{1F60A}",
    frequency: habit.frequency ?? "daily",
    goal_type: habit.goalType ?? "simple",
    daily_goal_seconds: habit.dailyGoalSeconds ?? 0,
    start_date: habit.startDate ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    goal_days: habit.goalDays ?? null,
    section: habit.section ?? "others",
    reminder: habit.reminder ?? null,
    auto_popup: habit.autoPopup ?? false,
    archived: habit.archived ?? false,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function toPatch(patch) {
  return {
    name: patch.name,
    icon: patch.icon,
    frequency: patch.frequency,
    goal_type: patch.goalType,
    daily_goal_seconds: patch.dailyGoalSeconds,
    start_date: patch.startDate,
    goal_days: patch.goalDays,
    section: patch.section,
    reminder: patch.reminder,
    auto_popup: patch.autoPopup,
    archived: patch.archived
  };
}
const habitService = {
  async getAll(options) {
    if (getBackend() === "supabase") {
      let query = supabase.from("habits").select("*").order("created_at", { ascending: true });
      if (!options?.includeArchived) {
        query = query.eq("archived", false);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map(mapRow);
    }
    let habits = localDb.getHabits();
    if (!options?.includeArchived) habits = habits.filter((h) => !h.archived);
    return habits;
  },
  async get(id) {
    if (getBackend() === "supabase") {
      const { data, error } = await supabase.from("habits").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? mapRow(data) : null;
    }
    return localDb.getHabits().find((h) => h.id === id) ?? null;
  },
  async create(habit, userId) {
    if (getBackend() === "supabase") {
      const { data, error } = await supabase.from("habits").insert(toInsert(habit, userId)).select().single();
      if (error) throw error;
      return mapRow(data);
    }
    const newHabit = {
      id: makeId(),
      name: habit.name,
      icon: habit.icon ?? "\u{1F60A}",
      frequency: habit.frequency ?? "daily",
      goalType: habit.goalType ?? "simple",
      dailyGoalSeconds: habit.dailyGoalSeconds ?? 0,
      startDate: habit.startDate ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      goalDays: habit.goalDays ?? null,
      section: habit.section ?? "others",
      reminder: habit.reminder ?? null,
      autoPopup: habit.autoPopup ?? false,
      archived: habit.archived ?? false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    localDb.setHabits([...localDb.getHabits(), newHabit]);
    return newHabit;
  },
  async update(id, patch) {
    if (getBackend() === "supabase") {
      const { data, error } = await supabase.from("habits").update(toPatch(patch)).eq("id", id).select().single();
      if (error) throw error;
      return mapRow(data);
    }
    const habits = localDb.getHabits();
    const next = habits.map((h) => h.id === id ? { ...h, ...patch } : h);
    localDb.setHabits(next);
    return next.find((h) => h.id === id);
  },
  async remove(id) {
    if (getBackend() === "supabase") {
      const { error } = await supabase.from("habits").delete().eq("id", id);
      if (error) throw error;
      return;
    }
    localDb.setHabits(localDb.getHabits().filter((h) => h.id !== id));
  },
  async archive(id, archived) {
    return this.update(id, { archived });
  }
};
function useHabits(options) {
  return useQuery({ queryKey: ["habits", options?.includeArchived ?? false], queryFn: () => habitService.getAll(options) });
}
function useCreateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (habit) => habitService.create(habit, getCurrentUserIdSync() ?? "local"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["focus-targets"] });
    }
  });
}
function useUpdateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => habitService.update(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["focus-targets"] });
    }
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
    }
  });
}
export {
  habitService,
  useCreateHabit,
  useDeleteHabit,
  useHabits,
  useUpdateHabit
};
