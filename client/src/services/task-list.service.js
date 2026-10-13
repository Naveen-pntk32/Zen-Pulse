import { api } from "@/lib/api";
import { localDb } from "@/lib/local-db";
import { getBackend, getCurrentUserIdSync, makeId } from "@/lib/backend";
import { buildDefaultTaskLists } from "@/lib/defaults";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    icon: row.icon ?? "📋",
    color: row.color ?? "#6366f1",
    sortOrder: row.sortOrder ?? row.sort_order ?? 0,
    createdAt: row.createdAt ?? row.created_at ?? new Date().toISOString(),
  };
}

const taskListService = {
  async getAll() {
    if (getBackend() !== "local") {
      try {
        const data = await api.get("/task-lists");
        return (data ?? []).map(mapRow);
      } catch (err) {
        console.warn("[TaskListService] API getAll failed, falling back to localDb:", err);
      }
    }
    return localDb.getTaskLists().sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async get(id) {
    if (getBackend() !== "local") {
      try {
        const data = await api.get(`/task-lists/${id}`);
        return data ? mapRow(data) : null;
      } catch (err) {
        console.warn("[TaskListService] API get failed, falling back to localDb:", err);
      }
    }
    return localDb.getTaskLists().find((l) => l.id === id) ?? null;
  },

  async create(list, userId) {
    if (getBackend() !== "local") {
      try {
        const payload = {
          name: list.name,
          description: list.description ?? null,
          icon: list.icon,
          color: list.color,
          sortOrder: list.sortOrder,
        };
        const created = await api.post("/task-lists", payload);
        return mapRow(created);
      } catch (err) {
        console.warn("[TaskListService] API create failed, falling back to localDb:", err);
      }
    }

    const newList = { ...list, id: makeId(), createdAt: new Date().toISOString() };
    localDb.setTaskLists([...localDb.getTaskLists(), newList]);
    return newList;
  },

  async update(id, patch) {
    if (getBackend() !== "local") {
      try {
        const updated = await api.patch(`/task-lists/${id}`, {
          name: patch.name,
          description: patch.description,
          icon: patch.icon,
          color: patch.color,
          sortOrder: patch.sortOrder,
        });
        return mapRow(updated);
      } catch (err) {
        console.warn("[TaskListService] API update failed, falling back to localDb:", err);
      }
    }

    const lists = localDb.getTaskLists();
    const next = lists.map((l) => (l.id === id ? { ...l, ...patch } : l));
    localDb.setTaskLists(next);
    return next.find((l) => l.id === id);
  },

  async remove(id) {
    if (getBackend() !== "local") {
      try {
        await api.delete(`/task-lists/${id}`);
        return;
      } catch (err) {
        console.warn("[TaskListService] API remove failed, falling back to localDb:", err);
      }
    }

    localDb.setTaskLists(localDb.getTaskLists().filter((l) => l.id !== id));
  },

  async ensureDefaults(userId) {
    if (getBackend() !== "local" && userId) {
      try {
        const defaults = await api.post("/task-lists/ensure-defaults", {});
        if (defaults && defaults.length > 0) {
          return defaults.map(mapRow);
        }
      } catch (err) {
        console.warn("[TaskListService] API ensureDefaults failed:", err);
      }
    }

    const existing = await this.getAll();
    if (existing.length > 0) return existing;

    const defaults = buildDefaultTaskLists();
    localDb.setTaskLists(defaults);
    return defaults;
  },
};

function useTaskLists() {
  return useQuery({ queryKey: ["task-lists"], queryFn: taskListService.getAll });
}

function useCreateTaskList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (list) => taskListService.create(list, getCurrentUserIdSync() ?? "local"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task-lists"] }),
  });
}

function useUpdateTaskList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => taskListService.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task-lists"] }),
  });
}

function useDeleteTaskList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskListService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-lists"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

function useEnsureTaskLists() {
  return useQuery({
    queryKey: ["task-lists", "ensure", getCurrentUserIdSync() ?? "local"],
    queryFn: () => taskListService.ensureDefaults(getCurrentUserIdSync() ?? null),
  });
}

export {
  taskListService,
  useCreateTaskList,
  useDeleteTaskList,
  useEnsureTaskLists,
  useTaskLists,
  useUpdateTaskList,
};
