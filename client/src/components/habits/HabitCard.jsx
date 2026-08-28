import { CheckCircle2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { goalOptionLabel } from "@/lib/defaults";
import { WeekDots } from "@/components/habits/WeekDots";
import { formatDuration } from "@/lib/date";

function HabitCard({ habit, completion, completions, date, onToggle, disabled }) {
  const completed = completion?.completed ?? false;
  
  const goalText =
    habit.goalType === "time"
      ? `${goalOptionLabel(habit.dailyGoalSeconds)} GOAL`
      : "ACHIEVE ALL";
      
  const progress =
    habit.goalType === "time" && habit.dailyGoalSeconds > 0
      ? Math.min(
          100,
          Math.round(
            ((completion?.actualFocusSeconds ?? 0) / habit.dailyGoalSeconds) * 100
          )
        )
      : 0;

  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-4 py-3 rounded-[6px] border transition-all duration-150 relative",
        completed
          ? "bg-greptile-green/[0.04] border-greptile-green/30"
          : "bg-surface-raised border-border/80 hover:border-greptile-green/40 hover:bg-surface-elevated"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(habit)}
        disabled={disabled}
        className={cn(
          "shrink-0 w-[18px] h-[18px] rounded-[3px] border flex items-center justify-center transition-all duration-150 cursor-pointer",
          disabled && "opacity-40 cursor-not-allowed",
          completed
            ? "border-greptile-green bg-greptile-green text-black shadow-[0_0_8px_rgba(40,233,159,0.4)]"
            : "border-border-strong hover:border-greptile-green bg-surface"
        )}
        aria-label={`Check in ${habit.name}`}
      >
        {completed && <Check className="w-3 h-3 stroke-[3]" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{habit.icon || "😊"}</span>
          <span
            className={cn("font-medium text-sm font-sans truncate text-foreground", completed && "line-through text-muted-foreground")}
          >
            {habit.name}
          </span>
          {completion?.completedAutomatically && completed && (
            <span
              className="badge-tech badge-tech-green text-[9px] py-0"
            >
              <CheckCircle2 className="w-2.5 h-2.5" />
              AUTO
            </span>
          )}
        </div>
        
        <div
          className="text-[10px] font-mono mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-muted-foreground uppercase"
        >
          <span>DAILY · {goalText}</span>
          {habit.goalType === "time" && completion && completion.actualFocusSeconds > 0 && (
            <span className="text-greptile-green font-bold">
              {formatDuration(completion.actualFocusSeconds)} LOGGED
            </span>
          )}
          {habit.goalType === "time" && (
            <span className="text-sky font-bold">[{progress}%]</span>
          )}
        </div>
      </div>

      {/* Week Dots */}
      <div className="shrink-0 ml-2">
        <WeekDots habitId={habit.id} endDate={date} completions={completions} />
      </div>
    </div>
  );
}

export { HabitCard };
