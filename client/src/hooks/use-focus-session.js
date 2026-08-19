import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { focusSessionService } from "@/services/focus-session.service";
import { habitCompletionService } from "@/services/habit-completion.service";
import { getLocalDateKey } from "@/lib/date";
import { toast } from "@/hooks/use-toast";
const STORAGE_KEY = "zp_active_timer";
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function persist(state) {
  try {
    if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}
function currentElapsedMs(state) {
  if (!state) return 0;
  if (state.resumedAt) {
    return state.baseMs + (Date.now() - Date.parse(state.resumedAt));
  }
  return state.baseMs;
}
function useFocusSession({ plannedSeconds }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [state, setState] = useState(null);
  const [tick, setTick] = useState(0);
  const stateRef = useRef(null);
  stateRef.current = state;
  const plannedSecondsRef = useRef(plannedSeconds);
  plannedSecondsRef.current = plannedSeconds;
  const invalidateAnalytics = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
    queryClient.invalidateQueries({ queryKey: ["focus-sessions"] });
    queryClient.invalidateQueries({ queryKey: ["habit-completions"] });
  }, [queryClient]);
  useEffect(() => {
    if (!state?.isActive) return;
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 250);
    return () => clearInterval(interval);
  }, [state?.isActive]);
  useEffect(() => {
    const s = stateRef.current;
    if (!s || s.mode !== "pomodoro" || !s.isActive) return;
    if (currentElapsedMs(s) >= s.plannedMs) {
      finishSession("completed");
    }
  }, [tick]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const restored = loadState();
      if (!restored || cancelled) return;
      const elapsed = currentElapsedMs(restored);
      if (restored.mode === "pomodoro" && elapsed >= restored.plannedMs) {
        await completeRecordedSession(restored, restored.plannedMs, "completed");
        persist(null);
        setState(null);
        invalidateAnalytics();
      } else {
        setState(restored);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const createSession = useCallback(
    async (mode2, target2, startedAt) => {
      const userId = user?.id ?? "local";
      const plannedSecondsValue = mode2 === "pomodoro" ? plannedSecondsRef.current : null;
      return focusSessionService.create(
        {
          type: mode2,
          targetType: target2?.type ?? null,
          targetId: target2?.id ?? null,
          targetName: target2?.name ?? "",
          plannedDurationSeconds: plannedSecondsValue,
          startedAt,
          date: getLocalDateKey(),
          status: "active"
        },
        userId
      );
    },
    [user]
  );
  const start = useCallback(
    async (mode2, target2) => {
      const s = stateRef.current;
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      if (s) {
        const next2 = { ...s, resumedAt: nowIso, isActive: true, status: "active" };
        setState(next2);
        persist(next2);
        return;
      }
      const session = await createSession(mode2, target2, nowIso);
      const next = {
        sessionId: session.id,
        mode: mode2,
        target: target2,
        plannedMs: mode2 === "pomodoro" ? plannedSecondsRef.current * 1e3 : 0,
        baseMs: 0,
        resumedAt: nowIso,
        isActive: true,
        status: "active",
        updatedAt: nowIso
      };
      setState(next);
      persist(next);
    },
    [createSession]
  );
  const pause = useCallback(() => {
    const s = stateRef.current;
    if (!s || !s.isActive) return;
    const elapsed = currentElapsedMs(s);
    const next = { ...s, baseMs: elapsed, resumedAt: null, isActive: false, status: "paused" };
    setState(next);
    persist(next);
  }, []);
  const resume = useCallback(() => {
    const s = stateRef.current;
    if (!s || s.isActive) return;
    const next = { ...s, resumedAt: (/* @__PURE__ */ new Date()).toISOString(), isActive: true, status: "active" };
    setState(next);
    persist(next);
  }, []);
  const completeRecordedSession = useCallback(
    async (s, durationMs, status) => {
      if (!s.sessionId) return;
      const userId = user?.id ?? "local";
      const durationSeconds = Math.max(1, Math.round(durationMs / 1e3));
      await focusSessionService.setStatus(
        s.sessionId,
        status,
        durationSeconds,
        (/* @__PURE__ */ new Date()).toISOString()
      );
      if (status === "completed") {
        const session = {
          id: s.sessionId,
          type: s.mode,
          targetType: s.target?.type ?? null,
          targetId: s.target?.id ?? null,
          targetName: s.target?.name ?? "",
          durationSeconds,
          plannedDurationSeconds: s.mode === "pomodoro" ? s.plannedMs / 1e3 : null,
          startedAt: s.updatedAt,
          endedAt: (/* @__PURE__ */ new Date()).toISOString(),
          status: "completed",
          date: getLocalDateKey(new Date(s.updatedAt)),
          createdAt: s.updatedAt
        };
        const auto = await habitCompletionService.evaluateAutoCheckIn(session, userId);
        if (auto && auto.completedAutomatically) {
          const habitName = session.targetName || "Habit";
          toast({
            title: "Habit auto checked-in",
            description: `You reached the daily goal for "${habitName}" \u{1F389}`
          });
        }
      }
    },
    [user]
  );
  const finishSession = useCallback(
    async (status) => {
      const s = stateRef.current;
      if (!s) return;
      const elapsed = status === "cancelled" ? currentElapsedMs(s) : s.mode === "pomodoro" ? s.plannedMs : currentElapsedMs(s);
      const durationMs = s.mode === "pomodoro" && status === "completed" ? s.plannedMs : elapsed;
      await completeRecordedSession(s, durationMs, status);
      persist(null);
      setState(null);
      invalidateAnalytics();
    },
    [completeRecordedSession, invalidateAnalytics]
  );
  const reset = useCallback(() => {
    finishSession("cancelled");
  }, [finishSession]);
  const stop = useCallback(() => {
    finishSession("completed");
  }, [finishSession]);
  const skip = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    if (s.mode === "pomodoro") {
      finishSession("completed");
    } else {
      finishSession("cancelled");
    }
  }, [finishSession]);
  const mode = state?.mode ?? "pomodoro";
  const target = state?.target ?? null;
  const isActive = state?.isActive ?? false;
  const isPaused = state != null && !isActive;
  const elapsedMs = currentElapsedMs(state);
  const timeLeftMs = state?.mode === "pomodoro" ? Math.max(0, state.plannedMs - elapsedMs) : elapsedMs;
  const progress = state?.mode === "pomodoro" && state.plannedMs > 0 ? Math.min(1, elapsedMs / state.plannedMs) : 0;
  const hasActiveSession = state != null;
  return {
    mode,
    target,
    isActive,
    isPaused,
    hasActiveSession,
    elapsedMs,
    timeLeftMs,
    progress,
    start,
    pause,
    resume,
    reset,
    stop,
    skip
  };
}
export {
  useFocusSession
};
