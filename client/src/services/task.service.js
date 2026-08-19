import supabase from "@/config/supabase";
import { localDb } from "@/lib/local-db";
import { getBackend, getCurrentUserIdSync, makeId } from "@/lib/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
function mapRow(row) {
  const status = row.status === "completed" ? "completed" : "pending";
  return {
    id: row.id,
    title: row.title ?? "Untitled",
    description: row.description ?? null,
    taskListId: row.task_list_id ?? null,
    status,
    priority: row.priority ?? "medium",
    dueDate: row.due_date ?? null,
    dueTime: row.due_time ?? null,
    completedAt: row.completed_at ?? null,
    createdAt: row.created_at ?? (/* @__PURE__ */ new Date()).toISOString()
  };
}
function toInsert(task, userId) {
  return {
    id: makeId(),
    user_id: userId,
    title: task.title,
    description: task.description ?? null,
    task_list_id: task.taskListId ?? null,
    status: task.status ?? "pending",
    priority: task.priority ?? "medium",
    due_date: task.dueDate ?? null,
    due_time: task.dueTime ?? null,
    completed_at: task.completedAt ?? null,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function toPatch(patch) {
  return {
    title: patch.title,
    description: patch.description,
    task_list_id: patch.taskListId,
    status: patch.status,
    priority: patch.priority,
    due_date: patch.dueDate,
    due_time: patch.dueTime,
    completed_at: patch.completedAt
  };
}
const taskService = {
  async getAll(options) {
    if (getBackend() === "supabase") {
      let query = supabase.from("tasks").select("*");
      if (options?.listId === null) {
        query = query.is("task_list_id", null);
      } else if (options?.listId) {
        query = query.eq("task_list_id", options.listId);
      }
      if (options?.status) {
        query = query.eq("status", options.status);
      }
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    }
    let tasks = localDb.getTasks();
    if (options?.listId === null) tasks = tasks.filter((t) => !t.taskListId);
    else if (options?.listId) tasks = tasks.filter((t) => t.taskListId === options.listId);
    if (options?.status) tasks = tasks.filter((t) => t.status === options.status);
    return tasks.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async create(task, userId) {
    if (getBackend() === "supabase") {
      const { data, error } = await supabase.from("tasks").insert(toInsert(task, userId)).select().single();
      if (error) throw error;
      return mapRow(data);
    }
    const newTask = {
      id: makeId(),
      title: task.title,
      description: task.description ?? null,
      taskListId: task.taskListId ?? null,
      status: task.status ?? "pending",
      priority: task.priority ?? "medium",
      dueDate: task.dueDate ?? null,
      dueTime: task.dueTime ?? null,
      completedAt: task.completedAt ?? null,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    localDb.setTasks([...localDb.getTasks(), newTask]);
    return newTask;
  },
  async update(id, patch) {
    if (getBackend() === "supabase") {
      const { data, error } = await supabase.from("tasks").update(toPatch(patch)).eq("id", id).select().single();
      if (error) throw error;
      return mapRow(data);
    }
    const tasks = localDb.getTasks();
    const next = tasks.map((t) => t.id === id ? { ...t, ...patch } : t);
    localDb.setTasks(next);
    return next.find((t) => t.id === id);
  },
  async remove(id) {
    if (getBackend() === "supabase") {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
      return;
    }
    localDb.setTasks(localDb.getTasks().filter((t) => t.id !== id));
  },
  /** Toggle a task between pending/completed. Preserves taskListId. */
  async toggle(id, currentStatus) {
    const completed = currentStatus !== "completed";
    const patch = {
      status: completed ? "completed" : "pending",
      completedAt: completed ? (/* @__PURE__ */ new Date()).toISOString() : null
    };
    return this.update(id, patch);
  }
};
function useTasks(options) {
  const key = options?.listId === null ? "none" : options?.listId ?? "all";
  return useQuery({
    queryKey: ["tasks", key, options?.status ?? "all"],
    queryFn: () => taskService.getAll(options)
  });
}
function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task) => taskService.create(task, getCurrentUserIdSync() ?? "local"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });
}
function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => taskService.update(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["focus-targets"] });
    }
  });
}
function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] })
  });
}
export {
  taskService,
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask
};
