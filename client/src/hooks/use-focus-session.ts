import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { ActiveTimerState, FocusTarget, FocusSession } from '@/types';
import { focusSessionService } from '@/services/focus-session.service';
import { habitCompletionService } from '@/services/habit-completion.service';
import { getLocalDateKey } from '@/lib/date';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'zp_active_timer';

function loadState(): ActiveTimerState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ActiveTimerState) : null;
  } catch {
    return null;
  }
}

function persist(state: ActiveTimerState | null) {
  try {
    if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function currentElapsedMs(state: ActiveTimerState | null): number {
  if (!state) return 0;
  if (state.resumedAt) {
    return state.baseMs + (Date.now() - Date.parse(state.resumedAt));
  }
  return state.baseMs;
}

export interface UseFocusSessionOptions {
  plannedSeconds: number; // pomodoro duration in seconds
}

export function useFocusSession({ plannedSeconds }: UseFocusSessionOptions) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [state, setState] = useState<ActiveTimerState | null>(null);
  const [tick, setTick] = useState(0);
  const stateRef = useRef<ActiveTimerState | null>(null);
  stateRef.current = state;
  const plannedSecondsRef = useRef(plannedSeconds);
  plannedSecondsRef.current = plannedSeconds;

  const invalidateAnalytics = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['analytics'] });
    queryClient.invalidateQueries({ queryKey: ['focus-sessions'] });
    queryClient.invalidateQueries({ queryKey: ['habit-completions'] });
  }, [queryClient]);

  // Tick loop while active
  useEffect(() => {
    if (!state?.isActive) return;
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 250);
    return () => clearInterval(interval);
  }, [state?.isActive]);

  // Pomodoro auto-complete when elapsed >= planned
  useEffect(() => {
    const s = stateRef.current;
    if (!s || s.mode !== 'pomodoro' || !s.isActive) return;
    if (currentElapsedMs(s) >= s.plannedMs) {
      finishSession('completed');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  // Restore from localStorage on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const restored = loadState();
      if (!restored || cancelled) return;
      const elapsed = currentElapsedMs(restored);
      if (restored.mode === 'pomodoro' && elapsed >= restored.plannedMs) {
        // Finished while away — record it as completed with full planned duration.
        await completeRecordedSession(restored, restored.plannedMs, 'completed');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createSession = useCallback(
    async (mode: 'pomodoro' | 'stopwatch', target: FocusTarget | null, startedAt: string): Promise<FocusSession> => {
      const userId = user?.id ?? 'local';
      const plannedSecondsValue = mode === 'pomodoro' ? plannedSecondsRef.current : null;
      return focusSessionService.create(
        {
          type: mode,
          targetType: target?.type ?? null,
          targetId: target?.id ?? null,
          targetName: target?.name ?? '',
          plannedDurationSeconds: plannedSecondsValue,
          startedAt,
          date: getLocalDateKey(),
          status: 'active',
        },
        userId,
      );
    },
    [user],
  );

  const start = useCallback(
    async (mode: 'pomodoro' | 'stopwatch', target: FocusTarget | null) => {
      const s = stateRef.current;
      const nowIso = new Date().toISOString();
      if (s) {
        // Resume an existing session
        const next: ActiveTimerState = { ...s, resumedAt: nowIso, isActive: true, status: 'active' };
        setState(next);
        persist(next);
        return;
      }
      const session = await createSession(mode, target, nowIso);
      const next: ActiveTimerState = {
        sessionId: session.id,
        mode,
        target,
        plannedMs: mode === 'pomodoro' ? plannedSecondsRef.current * 1000 : 0,
        baseMs: 0,
        resumedAt: nowIso,
        isActive: true,
        status: 'active',
        updatedAt: nowIso,
      };
      setState(next);
      persist(next);
    },
    [createSession],
  );

  const pause = useCallback(() => {
    const s = stateRef.current;
    if (!s || !s.isActive) return;
    const elapsed = currentElapsedMs(s);
    const next: ActiveTimerState = { ...s, baseMs: elapsed, resumedAt: null, isActive: false, status: 'paused' };
    setState(next);
    persist(next);
  }, []);

  const resume = useCallback(() => {
    const s = stateRef.current;
    if (!s || s.isActive) return;
    const next: ActiveTimerState = { ...s, resumedAt: new Date().toISOString(), isActive: true, status: 'active' };
    setState(next);
    persist(next);
  }, []);

  const completeRecordedSession = useCallback(
    async (s: ActiveTimerState, durationMs: number, status: 'completed' | 'cancelled') => {
      if (!s.sessionId) return;
      const userId = user?.id ?? 'local';
      const durationSeconds = Math.max(1, Math.round(durationMs / 1000));
      await focusSessionService.setStatus(
        s.sessionId,
        status,
        durationSeconds,
        new Date().toISOString(),
      );
      if (status === 'completed') {
        const session: FocusSession = {
          id: s.sessionId,
          type: s.mode,
          targetType: s.target?.type ?? null,
          targetId: s.target?.id ?? null,
          targetName: s.target?.name ?? '',
          durationSeconds,
          plannedDurationSeconds: s.mode === 'pomodoro' ? s.plannedMs / 1000 : null,
          startedAt: s.updatedAt,
          endedAt: new Date().toISOString(),
          status: 'completed',
          date: getLocalDateKey(new Date(s.updatedAt)),
          createdAt: s.updatedAt,
        };
        const auto = await habitCompletionService.evaluateAutoCheckIn(session, userId);
        if (auto && auto.completedAutomatically) {
          const habitName = session.targetName || 'Habit';
          toast({
            title: 'Habit auto checked-in',
            description: `You reached the daily goal for "${habitName}" 🎉`,
          });
        }
      }
    },
    [user],
  );

  const finishSession = useCallback(
    async (status: 'completed' | 'cancelled') => {
      const s = stateRef.current;
      if (!s) return;
      const elapsed = status === 'cancelled' ? currentElapsedMs(s) : s.mode === 'pomodoro' ? s.plannedMs : currentElapsedMs(s);
      const durationMs = s.mode === 'pomodoro' && status === 'completed' ? s.plannedMs : elapsed;
      await completeRecordedSession(s, durationMs, status);
      persist(null);
      setState(null);
      invalidateAnalytics();
    },
    [completeRecordedSession, invalidateAnalytics],
  );

  const reset = useCallback(() => {
    finishSession('cancelled');
  }, [finishSession]);

  const stop = useCallback(() => {
    finishSession('completed');
  }, [finishSession]);

  const skip = useCallback(() => {
    // Skip completes the pomodoro with its full planned duration.
    const s = stateRef.current;
    if (!s) return;
    if (s.mode === 'pomodoro') {
      finishSession('completed');
    } else {
      finishSession('cancelled');
    }
  }, [finishSession]);

  const mode = state?.mode ?? 'pomodoro';
  const target = state?.target ?? null;
  const isActive = state?.isActive ?? false;
  const isPaused = state != null && !isActive;

  const elapsedMs = currentElapsedMs(state);
  const timeLeftMs = state?.mode === 'pomodoro' ? Math.max(0, state.plannedMs - elapsedMs) : elapsedMs;
  const progress = state?.mode === 'pomodoro' && state.plannedMs > 0
    ? Math.min(1, elapsedMs / state.plannedMs)
    : 0;
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
    skip,
  };
}
