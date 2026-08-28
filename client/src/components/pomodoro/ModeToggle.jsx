import { cn } from "@/lib/utils";
import { Timer as TimerIcon, Hourglass } from "lucide-react";

function ModeToggle({ value, onChange, disabled }) {
  return (
    <div
      className="inline-flex rounded-[4px] p-1 bg-surface border border-border"
    >
      <button
        type="button"
        onClick={() => onChange("pomodoro")}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-4 py-1.5 rounded-[3px] text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-150 cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          value === "pomodoro"
            ? "bg-greptile-green text-black shadow-[0_0_12px_rgba(40,233,159,0.3)]"
            : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
        )}
      >
        <TimerIcon className="w-3.5 h-3.5" />
        <span>Pomodoro</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("stopwatch")}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-4 py-1.5 rounded-[3px] text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-150 cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          value === "stopwatch"
            ? "bg-sky text-black shadow-[0_0_12px_rgba(113,173,255,0.3)]"
            : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
        )}
      >
        <Hourglass className="w-3.5 h-3.5" />
        <span>Stopwatch</span>
      </button>
    </div>
  );
}

export { ModeToggle };
