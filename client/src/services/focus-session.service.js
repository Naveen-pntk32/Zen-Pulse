import supabase from "@/config/supabase";
import { localDb } from "@/lib/local-db";
import { getBackend, makeId } from "@/lib/backend";
import { useQuery } from "@tanstack/react-query";
function mapRow(row) {
  return {
    id: row.id,
    type: row.type,
    targetType: row.target_type ?? null,
    targetId: row.target_id ?? null,
    targetName: row.target_name ?? "",
    durationSeconds: row.duration_seconds ?? 0,
    plannedDurationSeconds: row.planned_duration_seconds ?? null,
    startedAt: row.started_at ?? (/* @__PURE__ */ new Date()).toISOString(),
    endedAt: row.ended_at ?? null,
    status: row.status,
    date: typeof row.date === "string" ? row.date.slice(0, 10) : row.date,
    createdAt: row.created_at ?? (/* @__PURE__ */ new Date()).toISOString()
  };
}
function toInsert(session, userId) {
  return {
    id: session.id ?? makeId(),
    user_id: userId,
    type: session.type,
    target_type: session.targetType ?? null,
    target_id: session.targetId ?? null,
    target_name: session.targetName ?? "",
    duration_seconds: session.durationSeconds ?? 0,
    planned_duration_seconds: session.plannedDurationSeconds ?? null,
    started_at: session.startedAt,
    ended_at: session.endedAt ?? null,
    status: session.status ?? "active",
    date: session.date,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function toPatch(patch) {
  return {
    target_type: patch.targetType,
    target_id: patch.targetId,
    target_name: patch.targetName,
    duration_seconds: patch.durationSeconds,
    planned_duration_seconds: patch.plannedDurationSeconds,
    ended_at: patch.endedAt,
    status: patch.status
  };
}
const focusSessionService = {
  async getAll(from, to) {
    if (getBackend() === "supabase") {
      let query = supabase.from("focus_sessions").select("*");
      if (from) query = query.gte("date", from);
      if (to) query = query.lte("date", to);
      const { data, error } = await query.order("started_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    }
    let sessions = localDb.getFocusSessions();
    if (from) sessions = sessions.filter((s) => s.date >= from);
    if (to) sessions = sessions.filter((s) => s.date <= to);
    return sessions.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  },
  async get(id) {
    if (getBackend() === "supabase") {
      const { data, error } = await supabase.from("focus_sessions").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? mapRow(data) : null;
    }
    return localDb.getFocusSessions().find((s) => s.id === id) ?? null;
  },
  async create(session, userId) {
    if (getBackend() === "supabase") {
      const { data, error } = await supabase.from("focus_sessions").insert(toInsert(session, userId)).select().single();
      if (error) throw error;
      return mapRow(data);
    }
    const newSession = {
      id: session.id ?? makeId(),
      type: session.type ?? "pomodoro",
      targetType: session.targetType ?? null,
      targetId: session.targetId ?? null,
      targetName: session.targetName ?? "",
      durationSeconds: session.durationSeconds ?? 0,
      plannedDurationSeconds: session.plannedDurationSeconds ?? null,
      startedAt: session.startedAt,
      endedAt: session.endedAt ?? null,
      status: session.status ?? "active",
      date: session.date,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    localDb.setFocusSessions([...localDb.getFocusSessions(), newSession]);
    return newSession;
  },
  async update(id, patch) {
    if (getBackend() === "supabase") {
      const { data, error } = await supabase.from("focus_sessions").update(toPatch(patch)).eq("id", id).select().single();
      if (error) throw error;
      return mapRow(data);
    }
    const sessions = localDb.getFocusSessions();
    const next = sessions.map((s) => s.id === id ? { ...s, ...patch } : s);
    localDb.setFocusSessions(next);
    return next.find((s) => s.id === id);
  },
  async setStatus(id, status, durationSeconds, endedAt) {
    return this.update(id, { status, durationSeconds, endedAt });
  },
  /** Sum of completed session seconds for a target on a date. */
  async getDailyTotalForTarget(targetId, date) {
    if (getBackend() === "supabase") {
      const { data, error } = await supabase.from("focus_sessions").select("duration_seconds").eq("target_id", targetId).eq("date", date).eq("status", "completed");
      if (error) throw error;
      return (data ?? []).reduce((sum, r) => sum + (r.duration_seconds ?? 0), 0);
    }
    return localDb.getFocusSessions().filter((s) => s.targetId === targetId && s.date === date && s.status === "completed").reduce((sum, s) => sum + s.durationSeconds, 0);
  },
  /** Sum of completed session seconds on a date (all targets). */
  async getDailyTotal(date) {
    if (getBackend() === "supabase") {
      const { data, error } = await supabase.from("focus_sessions").select("duration_seconds").eq("date", date).eq("status", "completed");
      if (error) throw error;
      return (data ?? []).reduce((sum, r) => sum + (r.duration_seconds ?? 0), 0);
    }
    return localDb.getFocusSessions().filter((s) => s.date === date && s.status === "completed").reduce((sum, s) => sum + s.durationSeconds, 0);
  }
};
function useFocusSessions(from, to) {
  return useQuery({
    queryKey: ["focus-sessions", from ?? "none", to ?? "none"],
    queryFn: () => focusSessionService.getAll(from, to)
  });
}
export {
  focusSessionService,
  useFocusSessions
};
