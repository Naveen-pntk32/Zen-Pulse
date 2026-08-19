import supabase from '@/config/supabase';
import { localDb } from '@/lib/local-db';
import { getBackend, getCurrentUserIdSync, makeId } from '@/lib/backend';
import { Habit } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function mapRow(row: any): Habit {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon ?? '😊',
    frequency: row.frequency ?? 'daily',
    goalType: row.goal_type ?? 'simple',
    dailyGoalSeconds: row.daily_goal_seconds ?? 0,
    startDate: row.start_date ?? new Date().toISOString().slice(0, 10),
    goalDays: row.goal_days ?? null,
    section: row.section ?? 'others',
    reminder: row.reminder ?? null,
    autoPopup: row.auto_popup ?? false,
    archived: row.archived ?? false,
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

function toInsert(habit: Partial<Habit> & { name: string }, userId: string) {
  return {
    id: makeId(),
    user_id: userId,
    name: habit.name,
    icon: habit.icon ?? '😊',
    frequency: habit.frequency ?? 'daily',
    goal_type: habit.goalType ?? 'simple',
    daily_goal_seconds: habit.dailyGoalSeconds ?? 0,
    start_date: habit.startDate ?? new Date().toISOString().slice(0, 10),
    goal_days: habit.goalDays ?? null,
    section: habit.section ?? 'others',
    reminder: habit.reminder ?? null,
    auto_popup: habit.autoPopup ?? false,
    archived: habit.archived ?? false,
    created_at: new Date().toISOString(),
  };
}

function toPatch(patch: Partial<Habit>) {
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
    archived: patch.archived,
  };
}

export const habitService = {
  async getAll(options?: { includeArchived?: boolean }): Promise<Habit[]> {
    if (getBackend() === 'supabase') {
      let query = supabase.from('habits').select('*').order('created_at', { ascending: true });
      if (!options?.includeArchived) {
        query = query.eq('archived', false);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map(mapRow);
    }
    let habits = localDb.getHabits() as Habit[];
    if (!options?.includeArchived) habits = habits.filter((h) => !h.archived);
    return habits;
  },

  async get(id: string): Promise<Habit | null> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase.from('habits').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data ? mapRow(data) : null;
    }
    return (localDb.getHabits() as Habit[]).find((h) => h.id === id) ?? null;
  },

  async create(habit: Partial<Habit> & { name: string }, userId: string): Promise<Habit> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase.from('habits').insert(toInsert(habit, userId)).select().single();
      if (error) throw error;
      return mapRow(data);
    }
    const newHabit: Habit = {
      id: makeId(),
      name: habit.name,
      icon: habit.icon ?? '😊',
      frequency: habit.frequency ?? 'daily',
      goalType: habit.goalType ?? 'simple',
      dailyGoalSeconds: habit.dailyGoalSeconds ?? 0,
      startDate: habit.startDate ?? new Date().toISOString().slice(0, 10),
      goalDays: habit.goalDays ?? null,
      section: habit.section ?? 'others',
      reminder: habit.reminder ?? null,
      autoPopup: habit.autoPopup ?? false,
      archived: habit.archived ?? false,
      createdAt: new Date().toISOString(),
    };
    localDb.setHabits([...(localDb.getHabits() as Habit[]), newHabit]);
    return newHabit;
  },

  async update(id: string, patch: Partial<Habit>): Promise<Habit> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase.from('habits').update(toPatch(patch)).eq('id', id).select().single();
      if (error) throw error;
      return mapRow(data);
    }
    const habits = localDb.getHabits() as Habit[];
    const next = habits.map((h) => (h.id === id ? { ...h, ...patch } : h));
    localDb.setHabits(next);
    return next.find((h) => h.id === id)!;
  },

  async remove(id: string): Promise<void> {
    if (getBackend() === 'supabase') {
      const { error } = await supabase.from('habits').delete().eq('id', id);
      if (error) throw error;
      return;
    }
    localDb.setHabits((localDb.getHabits() as Habit[]).filter((h) => h.id !== id));
  },

  async archive(id: string, archived: boolean): Promise<Habit> {
    return this.update(id, { archived });
  },
};

export function useHabits(options?: { includeArchived?: boolean }) {
  return useQuery({ queryKey: ['habits', options?.includeArchived ?? false], queryFn: () => habitService.getAll(options) });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (habit: Partial<Habit> & { name: string }) => habitService.create(habit, getCurrentUserIdSync() ?? 'local'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['focus-targets'] });
    },
  });
}

export function useUpdateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Habit> }) => habitService.update(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['focus-targets'] });
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: habitService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit-completions'] });
      queryClient.invalidateQueries({ queryKey: ['focus-targets'] });
    },
  });
}
