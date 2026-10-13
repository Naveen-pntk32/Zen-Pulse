import { api } from "@/lib/api";
import { localDb } from "@/lib/local-db";
import { getBackend, makeId } from "@/lib/backend";
import { useQuery } from "@tanstack/react-query";

function mapRow(row) {
  return {
    id: row.id,
    type: row.type,
    targetType: row.targetType ?? row.target_type ?? null,
    targetId: row.targetId ?? row.target_id ?? null,
    targetName: row.targetName ?? row.target_name ?? "",
    durationSeconds: row.durationSeconds ?? row.duration_seconds ?? 0,
    plannedDurationSeconds: row.plannedDurationSeconds ?? row.planned_duration_seconds ?? null,
    startedAt: row.startedAt ?? row.started_at ?? new Date().toISOString(),
    endedAt: row.endedAt ?? row.ended_at ?? null,
    status: row.status,
    date: typeof row.date === "string" ? row.date.slice(0, 10) : row.date,
    createdAt: row.createdAt ?? row.created_at ?? new Date().toISOString(),
  };
}

const focusSessionService = {
  async getAll(from, to) {
    if (getBackend() !== "local") {
      try {
        const params = new URLSearchParams();
        if (from) params.append("from", from);
        if (to) params.append("to", to);
        const qs = params.toString();
        const data = await api.get(`/focus-sessions${qs ? `?${qs}` : ""}`);
        return (data ?? []).map(mapRow);
      } catch (err) {
        console.warn("[FocusSessionService] API getAll failed, falling back to localDb:", err);
      }
    }

    let sessions = localDb.getFocusSessions();
    if (from) sessions = sessions.filter((s) => s.date >= from);
    if (to) sessions = sessions.filter((s) => s.date <= to);
    return sessions.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  },

  async get(id) {
    if (getBackend() !== "local") {
      try {
        const data = await api.get(`/focus-sessions/${id}`);
        return data ? mapRow(data) : null;
      } catch (err) {
        console.warn("[FocusSessionService] API get failed, falling back to localDb:", err);
      }
    }
    return localDb.getFocusSessions().find((s) => s.id === id) ?? null;
  },

  async create(session, userId) {
    if (getBackend() !== "local") {
      try {
        const payload = {
          id: session.id,
          type: session.type,
          targetType: session.targetType ?? null,
          targetId: session.targetId ?? null,
          targetName: session.targetName ?? "",
          durationSeconds: session.durationSeconds ?? 0,
          plannedDurationSeconds: session.plannedDurationSeconds ?? null,
          startedAt: session.startedAt,
          endedAt: session.endedAt ?? null,
          status: session.status ?? "active",
          date: session.date,
        };
        const created = await api.post("/focus-sessions", payload);
        return mapRow(created);
      } catch (err) {
        console.warn("[FocusSessionService] API create failed, falling back to localDb:", err);
      }
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
      createdAt: new Date().toISOString(),
    };
    localDb.setFocusSessions([...localDb.getFocusSessions(), newSession]);
    return newSession;
  },

  async update(id, patch) {
    if (getBackend() !== "local") {
      try {
        const updated = await api.patch(`/focus-sessions/${id}`, patch);
        return mapRow(updated);
      } catch (err) {
        console.warn("[FocusSessionService] API update failed, falling back to localDb:", err);
      }
    }

    const sessions = localDb.getFocusSessions();
    const next = sessions.map((s) => (s.id === id ? { ...s, ...patch } : s));
    localDb.setFocusSessions(next);
    return next.find((s) => s.id === id);
  },

  async setStatus(id, status, durationSeconds, endedAt) {
    return this.update(id, { status, durationSeconds, endedAt });
  },

  async getDailyTotalForTarget(targetId, date) {
    if (getBackend() !== "local") {
      try {
        const data = await api.get(`/focus-sessions/stats?date=${date}&targetId=${targetId}`);
        return data.totalSeconds ?? 0;
      } catch (err) {
        console.warn("[FocusSessionService] API getDailyTotalForTarget failed:", err);
      }
    }

    return localDb
      .getFocusSessions()
      .filter((s) => s.targetId === targetId && s.date === date && s.status === "completed")
      .reduce((sum, s) => sum + s.durationSeconds, 0);
  },

  async getDailyTotal(date) {
    if (getBackend() !== "local") {
      try {
        const data = await api.get(`/focus-sessions/stats?date=${date}`);
        return data.totalSeconds ?? 0;
      } catch (err) {
        console.warn("[FocusSessionService] API getDailyTotal failed:", err);
      }
    }

    return localDb
      .getFocusSessions()
      .filter((s) => s.date === date && s.status === "completed")
      .reduce((sum, s) => sum + s.durationSeconds, 0);
  },
};

function useFocusSessions(from, to) {
  return useQuery({
    queryKey: ["focus-sessions", from ?? "none", to ?? "none"],
    queryFn: () => focusSessionService.getAll(from, to),
  });
}

export {
  focusSessionService,
  useFocusSessions,
};
