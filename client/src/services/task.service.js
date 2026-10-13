import { api } from "@/lib/api";
import { localDb } from "@/lib/local-db";
import { getBackend, getCurrentUserIdSync, makeId } from "@/lib/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function mapRow(row) {
  const status = row.status === "completed" ? "completed" : "pending";
  return {
    id: row.id,
    title: row.title ?? "Untitled",
    description: row.description ?? null,
    taskListId: row.taskListId ?? row.task_list_id ?? null,
    status,
    priority: row.priority ?? "medium",
    dueDate: row.dueDate ?? row.due_date ?? null,
    dueTime: row.dueTime ?? row.due_time ?? null,
    recurrence: row.recurrence ?? null,
    position: row.position ?? 0,
    completedAt: row.completedAt ?? row.completed_at ?? null,
    createdAt: row.createdAt ?? row.created_at ?? new Date().toISOString(),
  };
}

const taskService = {
  async getAll(options) {
    if (getBackend() !== "local") {
      try {
        const params = new URLSearchParams();
        if (options?.listId === null) params.append("listId", "null");
        else if (options?.listId) params.append("listId", options.listId);
        if (options?.status) params.append("status", options.status);
        if (options?.priority) params.append("priority", options.priority);

        const qs = params.toString();
        const data = await api.get(`/tasks${qs ? `?${qs}` : ""}`);
        return (data ?? []).map(mapRow);
      } catch (err) {
        console.warn("[TaskService] API getAll failed, falling back to localDb:", err);
      }
    }

    let tasks = localDb.getTasks();
    if (options?.listId === null) tasks = tasks.filter((t) => !t.taskListId);
    else if (options?.listId) tasks = tasks.filter((t) => t.taskListId === options.listId);
    if (options?.status) tasks = tasks.filter((t) => t.status === options.status);
    return tasks.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async create(task, userId) {
    if (getBackend() !== "local") {
      try {
        const payload = {
          title: task.title,
          description: task.description ?? null,
          taskListId: task.taskListId ?? null,
          status: task.status ?? "pending",
          priority: task.priority ?? "medium",
          dueDate: task.dueDate ?? null,
          dueTime: task.dueTime ?? null,
          recurrence: task.recurrence ?? null,
          position: task.position ?? 0,
          completedAt: task.completedAt ?? null,
        };
        const created = await api.post("/tasks", payload);
        return mapRow(created);
      } catch (err) {
        console.warn("[TaskService] API create failed, falling back to localDb:", err);
      }
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
      recurrence: task.recurrence ?? null,
      position: task.position ?? 0,
      completedAt: task.completedAt ?? null,
      createdAt: new Date().toISOString(),
    };
    localDb.setTasks([...localDb.getTasks(), newTask]);
    return newTask;
  },

  async update(id, patch) {
    if (getBackend() !== "local") {
      try {
        const updated = await api.patch(`/tasks/${id}`, patch);
        return mapRow(updated);
      } catch (err) {
        console.warn("[TaskService] API update failed, falling back to localDb:", err);
      }
    }

    const tasks = localDb.getTasks();
    const next = tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
    localDb.setTasks(next);
    return next.find((t) => t.id === id);
  },

  async remove(id) {
    if (getBackend() !== "local") {
      try {
        await api.delete(`/tasks/${id}`);
        return;
      } catch (err) {
        console.warn("[TaskService] API remove failed, falling back to localDb:", err);
      }
    }

    localDb.setTasks(localDb.getTasks().filter((t) => t.id !== id));
  },

  async toggle(id, currentStatus) {
    const completed = currentStatus !== "completed";
    const patch = {
      status: completed ? "completed" : "pending",
      completedAt: completed ? new Date().toISOString() : null,
    };
    return this.update(id, patch);
  },
};

function useTasks(options) {
  const key = options?.listId === null ? "none" : options?.listId ?? "all";
  return useQuery({
    queryKey: ["tasks", key, options?.status ?? "all"],
    queryFn: () => taskService.getAll(options),
  });
}

function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task) => taskService.create(task, getCurrentUserIdSync() ?? "local"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => taskService.update(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["focus-targets"] });
    },
  });
}

function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export {
  taskService,
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
};
