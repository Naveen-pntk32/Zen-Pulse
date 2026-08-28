import { formatClock } from "@/lib/date";
import { cn } from "@/lib/utils";

function TimerDisplay({
  mode,
  timeLeftMs,
  elapsedMs,
  progress,
  statusLabel,
  isActive,
  isPaused,
}) {
  const display = mode === "pomodoro" ? timeLeftMs : elapsedMs;
  
  const circumference = 2 * Math.PI * 88;
  const dashOffset =
    mode === "pomodoro"
      ? circumference * (1 - Math.min(1, Math.max(0, progress)))
      : 0;

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-blue)" />
            <stop offset="100%" stopColor="#6f9bff" />
          </linearGradient>
        </defs>
        
        {/* Track */}
        <circle
          cx="100"
          cy="100"
          r="88"
          stroke="var(--surface)"
          strokeWidth="6"
          fill="none"
        />
        
        {/* Progress */}
        <circle
          cx="100"
          cy="100"
          r="88"
          stroke="url(#timer-gradient)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-300"
          style={{ opacity: isPaused ? 0.5 : 1 }}
        />
      </svg>
      
      {/* Time Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className={cn(
            "font-mono text-5xl font-bold tracking-tight",
            isActive ? "text-zp-primary" : isPaused ? "text-zp-muted" : "text-zp-primary"
          )}
          style={{
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatClock(display)}
        </div>
        <div
          className="text-[13px] mt-2 font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {statusLabel}
        </div>
      </div>
    </div>
  );
}

export { TimerDisplay };
