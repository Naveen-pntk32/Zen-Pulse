import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { Timer as TimerIcon, Lightbulb, Sparkles, Sliders } from "lucide-react";
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
import { cn } from "@/lib/utils";

const TIPS = [
  "Take a 5-minute break after each focus block to consolidate memory.",
  "Deep work sessions over 45 minutes build compound productivity.",
  "Link focus sessions to specific habits to automate daily check-ins.",
  "Eliminate secondary browser tabs during your focus interval.",
  "Single-tasking outperforms multi-tasking by up to 40%."
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
    plannedSeconds: (settings?.focusDuration ?? 25) * 60
  });

  const displayMode   = focus.hasActiveSession ? focus.mode : selectedMode;
  const displayTarget = focus.hasActiveSession ? focus.target : selectedTarget;

  const completedPomodorosToday = todaySessions?.filter(
    (s) => s.type === "pomodoro" && s.status === "completed"
  ).length ?? 0;
  
  const tip = TIPS[Math.floor(completedPomodorosToday) % TIPS.length];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2.5 text-foreground">
            <TimerIcon className="w-5 h-5 text-greptile-green" />
            Focus Control Station
          </h1>
          <p className="text-xs font-sans text-muted-foreground mt-1">
            Precision Pomodoro timer and stopwatch calibrated with automatic habit sync.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <ModeToggle
            value={displayMode}
            onChange={setSelectedMode}
            disabled={focus.hasActiveSession}
          />
          <TimerSettings />
        </div>
      </div>

      {/* Main 2-Column Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Timer & Controls Station (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center rounded-[8px] p-6 sm:p-8 border border-border/80 bg-surface-raised/90 backdrop-blur-md shadow-xl relative overflow-hidden">
          
          {/* Top Target Selector */}
          <div className="w-full max-w-md mb-8">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold mb-2">
              // ACTIVE TARGET
            </div>
            <FocusTargetSelector
              value={displayTarget}
              onChange={setSelectedTarget}
              disabled={focus.hasActiveSession}
            />
          </div>

          {/* Clock Display Ring */}
          <div className="w-full my-2 flex items-center justify-center">
            <TimerDisplay
              mode={displayMode}
              timeLeftMs={focus.timeLeftMs}
              elapsedMs={focus.elapsedMs}
              progress={focus.progress}
              isActive={focus.isActive}
              isPaused={focus.isPaused}
            />
          </div>

          {/* Session Progress Cycles Indicator */}
          {displayMode === "pomodoro" && (
            <div className="flex flex-col items-center gap-2 my-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                CYCLE PROGRESS ({completedPomodorosToday % (settings?.sessionsUntilLongBreak ?? 4)} / {settings?.sessionsUntilLongBreak ?? 4})
              </span>
              <div className="flex items-center gap-2">
                {[...Array(settings?.sessionsUntilLongBreak ?? 4)].map((_, i) => {
                  const completed = i < (completedPomodorosToday % (settings?.sessionsUntilLongBreak ?? 4));
                  return (
                    <div
                      key={i}
                      className={cn(
                        "w-3 h-3 rounded-[2px] transition-all",
                        completed
                          ? "bg-greptile-green shadow-[0_0_8px_rgba(40,233,159,0.5)]"
                          : "bg-surface border border-border"
                      )}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="w-full mt-4">
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
          </div>

          {/* Productivity Tip Box */}
          <div className="w-full mt-8 pt-4 border-t border-border/40 flex items-center gap-2 text-xs font-sans text-muted-foreground">
            <Lightbulb className="w-4 h-4 text-neon shrink-0" />
            <span className="truncate">{tip}</span>
          </div>
        </div>

        {/* Right Column: Live Statistics & Analytics (5 cols) */}
        <div className="lg:col-span-5">
          <FocusStatisticsPanel />
        </div>
      </div>
    </div>
  );
}

export { PomodoroPage as default };
