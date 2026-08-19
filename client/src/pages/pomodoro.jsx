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
  const { data: habits } = useHabits();
  const { data: tasks } = useTasks();
  const today = getLocalDateKey();
  const { data: todaySessions } = useFocusSessions(today, today);
  const [selectedMode, setSelectedMode] = useState(
    params.get("mode") === "stopwatch" ? "stopwatch" : "pomodoro"
  );
  const [selectedTarget, setSelectedTarget] = useState(null);
  useEffect(() => {
    const targetType = params.get("target");
    const targetId = params.get("id");
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
  const displayMode = focus.hasActiveSession ? focus.mode : selectedMode;
  const displayTarget = focus.hasActiveSession ? focus.target : selectedTarget;
  const statusLabel = displayTarget ? displayMode === "pomodoro" ? `Focus: ${displayTarget.name}` : `Stopwatch \xB7 ${displayTarget.name}` : displayMode === "pomodoro" ? "Focus Time" : "Stopwatch";
  const completedPomodorosToday = todaySessions?.filter((s) => s.type === "pomodoro" && s.status === "completed").length ?? 0;
  const tip = TIPS[Math.floor(completedPomodorosToday) % TIPS.length];
  return <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TimerIcon className="w-6 h-6 text-indigo-400" />
          Pomodoro
        </h1>
        <ModeToggle
    value={displayMode}
    onChange={setSelectedMode}
    disabled={focus.hasActiveSession}
  />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
        {
    /* Timer card */
  }
        <div className="bg-gray-800 rounded-3xl border border-gray-700 p-6 flex flex-col items-center space-y-6">
          <div className="w-full max-w-xs">
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              What are you focusing on?
            </label>
            <FocusTargetSelector
    value={displayTarget}
    onChange={setSelectedTarget}
    disabled={focus.hasActiveSession}
  />
          </div>

          <TimerDisplay
    mode={displayMode}
    timeLeftMs={focus.timeLeftMs}
    elapsedMs={focus.elapsedMs}
    progress={focus.progress}
    statusLabel={statusLabel}
    isActive={focus.isActive}
    isPaused={focus.isPaused}
  />

          {displayMode === "pomodoro" && <div className="text-sm text-gray-400">
              🍅 Pomodoro {completedPomodorosToday}/{settings?.sessionsUntilLongBreak ?? 4}
            </div>}

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

          <div className="flex items-center justify-between w-full">
            <TimerSettings />
            <div className="text-xs text-gray-500">{displayMode === "pomodoro" ? "Skip \u{1F504} Reset" : "Reset"}</div>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-500 bg-gray-900/60 rounded-2xl p-3 w-full">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>Tip: {tip}</span>
          </div>
        </div>

        {
    /* Statistics */
  }
        <FocusStatisticsPanel />
      </div>
    </div>;
}
export {
  PomodoroPage as default
};
