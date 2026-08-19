import supabase from '@/config/supabase';
import { localDb } from '@/lib/local-db';
import { getBackend, getCurrentUserIdSync, makeId } from '@/lib/backend';
import { TaskList } from '@/types';
import { buildDefaultTaskLists } from '@/lib/defaults';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function mapRow(row: any): TaskList {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon ?? '📋',
    color: row.color ?? '#6366f1',
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
  };
}

function toInsert(list: Omit<TaskList, 'id' | 'createdAt'>, userId: string) {
  return {
    id: makeId(),
    user_id: userId,
    name: list.name,
    icon: list.icon,
    color: list.color,
    sort_order: list.sortOrder,
    created_at: new Date().toISOString(),
  };
}

export const taskListService = {
  async getAll(): Promise<TaskList[]> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase
        .from('task_lists')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    }
    return (localDb.getTaskLists() as TaskList[]).sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async get(id: string): Promise<TaskList | null> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase.from('task_lists').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data ? mapRow(data) : null;
    }
    return (localDb.getTaskLists() as TaskList[]).find((l) => l.id === id) ?? null;
  },

  async create(list: Omit<TaskList, 'id' | 'createdAt'>, userId: string): Promise<TaskList> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase.from('task_lists').insert(toInsert(list, userId)).select().single();
      if (error) throw error;
      return mapRow(data);
    }
    const newList: TaskList = { ...list, id: makeId(), createdAt: new Date().toISOString() };
    localDb.setTaskLists([...(localDb.getTaskLists() as TaskList[]), newList]);
    return newList;
  },

  async update(id: string, patch: Partial<TaskList>): Promise<TaskList> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase
        .from('task_lists')
        .update({
          name: patch.name,
          icon: patch.icon,
          color: patch.color,
          sort_order: patch.sortOrder,
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return mapRow(data);
    }
    const lists = localDb.getTaskLists() as TaskList[];
    const next = lists.map((l) => (l.id === id ? { ...l, ...patch } : l));
    localDb.setTaskLists(next);
    return next.find((l) => l.id === id)!;
  },

  async remove(id: string): Promise<void> {
    if (getBackend() === 'supabase') {
      const { error } = await supabase.from('task_lists').delete().eq('id', id);
      if (error) throw error;
      return;
    }
    localDb.setTaskLists((localDb.getTaskLists() as TaskList[]).filter((l) => l.id !== id));
  },

  /** Seed the default lists. Returns existing lists if any exist. */
  async ensureDefaults(userId: string | null): Promise<TaskList[]> {
    const existing = await this.getAll();
    if (existing.length > 0) return existing;
    const defaults = buildDefaultTaskLists();
    if (getBackend() === 'supabase' && userId) {
      for (const d of defaults) {
        await this.create({ name: d.name, icon: d.icon, color: d.color, sortOrder: d.sortOrder }, userId);
      }
      return this.getAll();
    }
    localDb.setTaskLists(defaults);
    return defaults;
  },
};

export function useTaskLists() {
  return useQuery({ queryKey: ['task-lists'], queryFn: taskListService.getAll });
}

export function useCreateTaskList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (list: Omit<TaskList, 'id' | 'createdAt'>) => taskListService.create(list, getCurrentUserIdSync() ?? 'local'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['task-lists'] }),
  });
}

export function useUpdateTaskList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<TaskList> }) => taskListService.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['task-lists'] }),
  });
}

export function useDeleteTaskList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskListService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useEnsureTaskLists() {
  return useQuery({
    queryKey: ['task-lists', 'ensure', getCurrentUserIdSync() ?? 'local'],
    queryFn: () => taskListService.ensureDefaults(getCurrentUserIdSync() ?? null),
  });
}
