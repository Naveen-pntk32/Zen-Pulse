import supabase from '@/config/supabase';
import { localDb } from '@/lib/local-db';
import { getBackend, getCurrentUserIdSync, makeId } from '@/lib/backend';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function mapRow(row: any): Task {
  const status: TaskStatus = row.status === 'completed' ? 'completed' : 'pending';
  return {
    id: row.id,
    title: row.title ?? 'Untitled',
    description: row.description ?? null,
    taskListId: row.task_list_id ?? null,
    status,
    priority: (row.priority as TaskPriority) ?? 'medium',
    dueDate: row.due_date ?? null,
    dueTime: row.due_time ?? null,
    completedAt: row.completed_at ?? null,
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

function toInsert(task: Partial<Task> & { title: string }, userId: string) {
  return {
    id: makeId(),
    user_id: userId,
    title: task.title,
    description: task.description ?? null,
    task_list_id: task.taskListId ?? null,
    status: task.status ?? 'pending',
    priority: task.priority ?? 'medium',
    due_date: task.dueDate ?? null,
    due_time: task.dueTime ?? null,
    completed_at: task.completedAt ?? null,
    created_at: new Date().toISOString(),
  };
}

function toPatch(patch: Partial<Task>) {
  return {
    title: patch.title,
    description: patch.description,
    task_list_id: patch.taskListId,
    status: patch.status,
    priority: patch.priority,
    due_date: patch.dueDate,
    due_time: patch.dueTime,
    completed_at: patch.completedAt,
  };
}

export const taskService = {
  async getAll(options?: { listId?: string | null; status?: TaskStatus }): Promise<Task[]> {
    if (getBackend() === 'supabase') {
      let query = supabase.from('tasks').select('*');
      if (options?.listId === null) {
        query = query.is('task_list_id', null);
      } else if (options?.listId) {
        query = query.eq('task_list_id', options.listId);
      }
      if (options?.status) {
        query = query.eq('status', options.status);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    }
    let tasks = localDb.getTasks() as Task[];
    if (options?.listId === null) tasks = tasks.filter((t) => !t.taskListId);
    else if (options?.listId) tasks = tasks.filter((t) => t.taskListId === options.listId);
    if (options?.status) tasks = tasks.filter((t) => t.status === options.status);
    return tasks.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async create(task: Partial<Task> & { title: string }, userId: string): Promise<Task> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase.from('tasks').insert(toInsert(task, userId)).select().single();
      if (error) throw error;
      return mapRow(data);
    }
    const newTask: Task = {
      id: makeId(),
      title: task.title,
      description: task.description ?? null,
      taskListId: task.taskListId ?? null,
      status: task.status ?? 'pending',
      priority: task.priority ?? 'medium',
      dueDate: task.dueDate ?? null,
      dueTime: task.dueTime ?? null,
      completedAt: task.completedAt ?? null,
      createdAt: new Date().toISOString(),
    };
    localDb.setTasks([...(localDb.getTasks() as Task[]), newTask]);
    return newTask;
  },

  async update(id: string, patch: Partial<Task>): Promise<Task> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase.from('tasks').update(toPatch(patch)).eq('id', id).select().single();
      if (error) throw error;
      return mapRow(data);
    }
    const tasks = localDb.getTasks() as Task[];
    const next = tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
    localDb.setTasks(next);
    return next.find((t) => t.id === id)!;
  },

  async remove(id: string): Promise<void> {
    if (getBackend() === 'supabase') {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      return;
    }
    localDb.setTasks((localDb.getTasks() as Task[]).filter((t) => t.id !== id));
  },

  /** Toggle a task between pending/completed. Preserves taskListId. */
  async toggle(id: string, currentStatus: TaskStatus): Promise<Task> {
    const completed = currentStatus !== 'completed';
    const patch: Partial<Task> = {
      status: completed ? 'completed' : 'pending',
      completedAt: completed ? new Date().toISOString() : null,
    };
    return this.update(id, patch);
  },
};

export function useTasks(options?: { listId?: string | null; status?: TaskStatus }) {
  const key = options?.listId === null ? 'none' : (options?.listId ?? 'all');
  return useQuery({
    queryKey: ['tasks', key, options?.status ?? 'all'],
    queryFn: () => taskService.getAll(options),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: Partial<Task> & { title: string }) => taskService.create(task, getCurrentUserIdSync() ?? 'local'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Task> }) => taskService.update(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['focus-targets'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}
