import { Play, Pause, RotateCcw, SkipForward, Square } from "lucide-react";
import { cn } from "@/lib/utils";

function TimerControls({
  mode,
  isActive,
  isPaused,
  hasActiveSession,
  onStart,
  onPause,
  onResume,
  onSkip,
  onReset,
  onStop,
}) {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Play/Pause Main Button */}
      <button
        onClick={() => {
          if (isActive) onPause();
          else if (isPaused) onResume();
          else onStart();
        }}
        className={cn(
          "w-[72px] h-[72px] rounded-full flex items-center justify-center transition-transform duration-150 active:scale-95",
          "btn-primary" // applies brand-blue, hover, and shimmer from global css
        )}
        style={{
          boxShadow: isActive
            ? "0 0 0 4px var(--surface-raised), 0 0 0 8px rgba(71,114,250,0.2)"
            : "var(--shadow-card)",
        }}
        aria-label={isActive ? "Pause" : isPaused ? "Resume" : "Start"}
      >
        {isActive ? (
          <Pause className="w-8 h-8 text-white" fill="currentColor" />
        ) : (
          <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
        )}
      </button>

      {/* Secondary Controls */}
      <div className="flex items-center gap-3">
        {mode === "stopwatch" && hasActiveSession && (
          <button
            onClick={onStop}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-150"
            style={{
              background: "var(--surface)",
              color:      "var(--text-secondary)",
              border:     "1px solid var(--border)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--surface-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--surface)"; }}
            title="Finish and record"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        )}
        
        <button
          onClick={onReset}
          disabled={!hasActiveSession}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: "var(--surface)",
            color:      "var(--text-secondary)",
            border:     "1px solid var(--border)",
          }}
          onMouseEnter={(e) => { if (hasActiveSession) { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--surface-hover)"; } }}
          onMouseLeave={(e) => { if (hasActiveSession) { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--surface)"; } }}
          title="Reset (cancels session)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {mode === "pomodoro" && hasActiveSession && (
          <button
            onClick={onSkip}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-150"
            style={{
              background: "var(--surface)",
              color:      "var(--text-secondary)",
              border:     "1px solid var(--border)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--surface-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--surface)"; }}
            title="Skip (record full duration)"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export { TimerControls };
