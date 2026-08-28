import { CheckCircle2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { goalOptionLabel } from "@/lib/defaults";
import { WeekDots } from "@/components/habits/WeekDots";
import { formatDuration } from "@/lib/date";

function HabitCard({ habit, completion, completions, date, onToggle, disabled }) {
  const completed = completion?.completed ?? false;
  
  const goalText =
    habit.goalType === "time"
      ? `${goalOptionLabel(habit.dailyGoalSeconds)} goal`
      : "Achieve it all";
      
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
        "group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150",
        completed ? "opacity-90" : "hover:border-white/[0.14]"
      )}
      style={{
        background:  completed ? "rgba(74,222,128,0.06)" : "var(--surface-raised)",
        borderColor: completed ? "rgba(74,222,128,0.3)"  : "var(--border)",
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(habit)}
        disabled={disabled}
        className={cn(
          "shrink-0 w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-all duration-150",
          disabled && "opacity-40 cursor-not-allowed"
        )}
        style={{
          borderColor: completed ? "#4ade80" : "var(--border-strong)",
          background:  completed ? "#4ade80" : "transparent",
        }}
        aria-label={`Check in ${habit.name}`}
      >
        {completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">{habit.icon || "😊"}</span>
          <span
            className={cn("font-medium text-[15px] truncate", completed && "line-through")}
            style={{ color: completed ? "var(--text-muted)" : "var(--text-primary)" }}
          >
            {habit.name}
          </span>
          {completion?.completedAutomatically && completed && (
            <span
              className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 uppercase tracking-wide"
              style={{ color: "#4ade80", background: "rgba(74,222,128,0.15)" }}
            >
              <CheckCircle2 className="w-2.5 h-2.5" />
              Auto
            </span>
          )}
        </div>
        
        <div
          className="text-[11px] mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          <span>Daily · {goalText}</span>
          {habit.goalType === "time" && completion && completion.actualFocusSeconds > 0 && (
            <span style={{ color: "var(--text-secondary)" }}>
              {formatDuration(completion.actualFocusSeconds)} focused
            </span>
          )}
          {habit.goalType === "time" && (
            <span style={{ color: "var(--brand-blue)" }}>{progress}%</span>
          )}
        </div>
      </div>

      {/* Week Dots */}
      <div className="shrink-0 ml-4 opacity-70 group-hover:opacity-100 transition-opacity">
        <WeekDots habitId={habit.id} endDate={date} completions={completions} />
      </div>
    </div>
  );
}

export { HabitCard };
