import supabase from "@/config/supabase";
import { localDb } from "@/lib/local-db";
import { getBackend, getCurrentUserIdSync, makeId } from "@/lib/backend";
import { buildDefaultTaskLists } from "@/lib/defaults";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon ?? "\u{1F4CB}",
    color: row.color ?? "#6366f1",
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at ?? row.createdAt ?? (/* @__PURE__ */ new Date()).toISOString()
  };
}
function toInsert(list, userId) {
  return {
    id: makeId(),
    user_id: userId,
    name: list.name,
    icon: list.icon,
    color: list.color,
    sort_order: list.sortOrder,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
const taskListService = {
  async getAll() {
    if (getBackend() === "supabase") {
      const { data, error } = await supabase.from("task_lists").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    }
    return localDb.getTaskLists().sort((a, b) => a.sortOrder - b.sortOrder);
  },
  async get(id) {
    if (getBackend() === "supabase") {
      const { data, error } = await supabase.from("task_lists").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? mapRow(data) : null;
    }
    return localDb.getTaskLists().find((l) => l.id === id) ?? null;
  },
  async create(list, userId) {
    if (getBackend() === "supabase") {
      const { data, error } = await supabase.from("task_lists").insert(toInsert(list, userId)).select().single();
      if (error) throw error;
      return mapRow(data);
    }
    const newList = { ...list, id: makeId(), createdAt: (/* @__PURE__ */ new Date()).toISOString() };
    localDb.setTaskLists([...localDb.getTaskLists(), newList]);
    return newList;
  },
  async update(id, patch) {
    if (getBackend() === "supabase") {
      const { data, error } = await supabase.from("task_lists").update({
        name: patch.name,
        icon: patch.icon,
        color: patch.color,
        sort_order: patch.sortOrder
      }).eq("id", id).select().single();
      if (error) throw error;
      return mapRow(data);
    }
    const lists = localDb.getTaskLists();
    const next = lists.map((l) => l.id === id ? { ...l, ...patch } : l);
    localDb.setTaskLists(next);
    return next.find((l) => l.id === id);
  },
  async remove(id) {
    if (getBackend() === "supabase") {
      const { error } = await supabase.from("task_lists").delete().eq("id", id);
      if (error) throw error;
      return;
    }
    localDb.setTaskLists(localDb.getTaskLists().filter((l) => l.id !== id));
  },
  /** Seed the default lists. Returns existing lists if any exist. */
  async ensureDefaults(userId) {
    const existing = await this.getAll();
    if (existing.length > 0) return existing;
    const defaults = buildDefaultTaskLists();
    if (getBackend() === "supabase" && userId) {
      for (const d of defaults) {
        await this.create({ name: d.name, icon: d.icon, color: d.color, sortOrder: d.sortOrder }, userId);
      }
      return this.getAll();
    }
    localDb.setTaskLists(defaults);
    return defaults;
  }
};
function useTaskLists() {
  return useQuery({ queryKey: ["task-lists"], queryFn: taskListService.getAll });
}
function useCreateTaskList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (list) => taskListService.create(list, getCurrentUserIdSync() ?? "local"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task-lists"] })
  });
}
function useUpdateTaskList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => taskListService.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task-lists"] })
  });
}
function useDeleteTaskList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskListService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-lists"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });
}
function useEnsureTaskLists() {
  return useQuery({
    queryKey: ["task-lists", "ensure", getCurrentUserIdSync() ?? "local"],
    queryFn: () => taskListService.ensureDefaults(getCurrentUserIdSync() ?? null)
  });
}
export {
  taskListService,
  useCreateTaskList,
  useDeleteTaskList,
  useEnsureTaskLists,
  useTaskLists,
  useUpdateTaskList
};
