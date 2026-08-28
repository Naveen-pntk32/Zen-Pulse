import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { Timer as TimerIcon, Lightbulb } from "lucide-react";
import { ModeToggle } from "@/components/pomodoro/ModeToggle";
import { FocusTargetSelector } from "@/components/pomodoro/FocusTargetSelector";
import { TimerDisplay } from "@/components/pomodoro/TimerDisplay";
import { TimerControls } from "@/components/pomodoro/TimerControls";
import { TimerSettings } from "@/components/pomodoro/TimerSettings";
import { FocusStatisticsPanel } from "@/components/pomodoro/FocusStatisticsPanel";
import { useFocusSession } from "@/hooks/use-focus-session";
import { useSettings } from "@/services/settings.service";
import { useHabits } from "@/services/habit.service";
import { useTasks } from "@/services/task.service";
import { useFocusSessions } from "@/services/focus-session.service";
import { getLocalDateKey } from "@/lib/date";

const TIPS = [
  "Take a 5 minute break after each focus session.",
  "Aim for at least one deep work block every day.",
  "Turn off notifications while you focus.",
  "Hydrate during your breaks to stay sharp.",
  "Pick one target and give it your full attention."
];

function PomodoroPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  
  const { data: settings } = useSettings();
  const { data: habits }   = useHabits();
  const { data: tasks }    = useTasks();
  
  const today = getLocalDateKey();
  const { data: todaySessions } = useFocusSessions(today, today);

  const [selectedMode, setSelectedMode] = useState(
    params.get("mode") === "stopwatch" ? "stopwatch" : "pomodoro"
  );
  const [selectedTarget, setSelectedTarget] = useState(null);

  useEffect(() => {
    const targetType = params.get("target");
    const targetId   = params.get("id");
    if (!targetType || !targetId) return;
    
    if (targetType === "habit" && habits) {
      const habit = habits.find((h) => h.id === targetId);
      if (habit) setSelectedTarget({ type: "habit", id: habit.id, name: habit.name });
    }
    if (targetType === "task" && tasks) {
      const task = tasks.find((t) => t.id === targetId);
      if (task) setSelectedTarget({ type: "task", id: task.id, name: task.title });
    }
  }, [params, habits, tasks]);

  const focus = useFocusSession({
    plannedSeconds: settings?.focusDuration ?? 25
  });

  const displayMode   = focus.hasActiveSession ? focus.mode : selectedMode;
  const displayTarget = focus.hasActiveSession ? focus.target : selectedTarget;

  const statusLabel = displayTarget
    ? displayMode === "pomodoro"
      ? `Focus: ${displayTarget.name}`
      : `Stopwatch · ${displayTarget.name}`
    : displayMode === "pomodoro"
    ? "Focus Time"
    : "Stopwatch";

  const completedPomodorosToday = todaySessions?.filter(
    (s) => s.type === "pomodoro" && s.status === "completed"
  ).length ?? 0;
  
  const tip = TIPS[Math.floor(completedPomodorosToday) % TIPS.length];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <TimerIcon className="w-6 h-6" style={{ color: "var(--brand-blue)" }} />
            Pomodoro
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Deep work tracking and timers
          </p>
        </div>
        <ModeToggle
          value={displayMode}
          onChange={setSelectedMode}
          disabled={focus.hasActiveSession}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Timer card */}
        <div
          className="rounded-3xl p-8 flex flex-col items-center space-y-8"
          style={{
            background: "var(--surface-raised)",
            border:     "1px solid var(--border)",
            boxShadow:  "var(--shadow-card)",
          }}
        >
          {/* Target Selector */}
          <div className="w-full max-w-[280px]">
            <label
              className="text-[11px] font-semibold uppercase tracking-widest mb-2 block text-center"
              style={{ color: "var(--text-muted)" }}
            >
              What are you focusing on?
            </label>
            <FocusTargetSelector
              value={displayTarget}
              onChange={setSelectedTarget}
              disabled={focus.hasActiveSession}
            />
          </div>

          {/* Clock Display */}
          <div className="py-4 w-full">
            <TimerDisplay
              mode={displayMode}
              timeLeftMs={focus.timeLeftMs}
              elapsedMs={focus.elapsedMs}
              progress={focus.progress}
              statusLabel={statusLabel}
              isActive={focus.isActive}
              isPaused={focus.isPaused}
            />
          </div>

          {/* Session Counter */}
          {displayMode === "pomodoro" && (
            <div
              className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide"
              style={{
                background: "rgba(71,114,250,0.12)",
                color:      "var(--brand-blue)",
              }}
            >
              🍅 Pomodoro {completedPomodorosToday}/{settings?.sessionsUntilLongBreak ?? 4}
            </div>
          )}

          {/* Controls */}
          <TimerControls
            mode={displayMode}
            isActive={focus.isActive}
            isPaused={focus.isPaused}
            hasActiveSession={focus.hasActiveSession}
            onStart={() => focus.start(selectedMode, selectedTarget)}
            onPause={focus.pause}
            onResume={focus.resume}
            onSkip={focus.skip}
            onReset={focus.reset}
            onStop={focus.stop}
          />

          {/* Settings & Reset footer */}
          <div className="flex items-center justify-between w-full pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <TimerSettings />
            <div className="text-[11px] font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              {displayMode === "pomodoro" ? "Skip ⏭ Reset" : "Reset"}
            </div>
          </div>

          {/* Tip */}
          <div
            className="flex items-start gap-2.5 text-sm p-4 w-full rounded-2xl"
            style={{ background: "var(--surface)" }}
          >
            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--brand-amber)" }} />
            <span style={{ color: "var(--text-secondary)" }}>
              Tip: {tip}
            </span>
          </div>
        </div>

        {/* Statistics panel */}
        <FocusStatisticsPanel />
      </div>
    </div>
  );
}

export { PomodoroPage as default };
