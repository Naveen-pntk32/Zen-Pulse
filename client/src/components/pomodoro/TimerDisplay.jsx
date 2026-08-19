import { formatClock } from "@/lib/date";
import { cn } from "@/lib/utils";
function TimerDisplay({
  mode,
  timeLeftMs,
  elapsedMs,
  progress,
  statusLabel,
  isActive,
  isPaused
}) {
  const display = mode === "pomodoro" ? timeLeftMs : elapsedMs;
  const circumference = 2 * Math.PI * 88;
  const dashOffset = mode === "pomodoro" ? circumference * (1 - Math.min(1, Math.max(0, progress))) : 0;
  return <div className="relative w-56 h-56 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
        <circle
    cx="100"
    cy="100"
    r="88"
    stroke="currentColor"
    strokeWidth="8"
    fill="none"
    className="text-gray-700"
  />
        <circle
    cx="100"
    cy="100"
    r="88"
    stroke="url(#timer-gradient)"
    strokeWidth="8"
    fill="none"
    strokeLinecap="round"
    strokeDasharray={circumference}
    strokeDashoffset={dashOffset}
    className="transition-[stroke-dashoffset] duration-300"
    style={{ opacity: isPaused ? 0.6 : 1 }}
  />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
    className={cn(
      "font-mono text-4xl font-bold",
      isActive ? "text-white" : isPaused ? "text-gray-300" : "text-gray-100"
    )}
  >
          {formatClock(display)}
        </div>
        <div className="text-sm text-gray-400 mt-1">{statusLabel}</div>
      </div>
    </div>;
}
export {
  TimerDisplay
};
