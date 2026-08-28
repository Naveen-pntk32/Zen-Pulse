import { cn } from "@/lib/utils";
import { Timer as TimerIcon, Hourglass } from "lucide-react";

function ModeToggle({ value, onChange, disabled }) {
  return (
    <div
      className="inline-flex rounded-xl p-1"
      style={{
        background: "var(--surface-raised)",
        border:     "1px solid var(--border)",
      }}
    >
      <button
        type="button"
        onClick={() => onChange("pomodoro")}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{
          background: value === "pomodoro" ? "var(--surface)"       : "transparent",
          color:      value === "pomodoro" ? "var(--brand-blue)"    : "var(--text-secondary)",
          boxShadow:  value === "pomodoro" ? "var(--shadow-card)"   : "none",
        }}
      >
        <TimerIcon className="w-4 h-4" />
        Pomo
      </button>
      <button
        type="button"
        onClick={() => onChange("stopwatch")}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{
          background: value === "stopwatch" ? "var(--surface)"       : "transparent",
          color:      value === "stopwatch" ? "var(--brand-amber)"   : "var(--text-secondary)",
          boxShadow:  value === "stopwatch" ? "var(--shadow-card)"   : "none",
        }}
      >
        <Hourglass className="w-4 h-4" />
        Stopwatch
      </button>
    </div>
  );
}

export { ModeToggle };
