import { useState } from "react";
import { useSettings, useUpdateSettings } from "@/services/settings.service";
import { formatClock } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function TimerDisplay({
  mode,
  timeLeftMs,
  elapsedMs,
  progress,
  isActive,
  isPaused,
}) {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const display = mode === "pomodoro" ? timeLeftMs : elapsedMs;
  
  const circumference = 2 * Math.PI * 88;
  const dashOffset =
    mode === "pomodoro"
      ? circumference * (1 - Math.min(1, Math.max(0, progress)))
      : 0;

  const handleTextClick = () => {
    if (mode === "pomodoro" && !isActive && !isPaused && settings) {
      setEditValue(settings.focusDuration.toString());
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    const val = parseInt(editValue, 10);
    if (!isNaN(val) && val >= 1 && val <= 180) {
      updateSettings.mutate({ focusDuration: val });
    }
    setIsEditing(false);
  };

  return (
    <div className="relative w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] mx-auto select-none">
      {/* Ambient glow behind ring */}
      <div 
        className={cn(
          "absolute inset-4 rounded-full filter blur-2xl opacity-20 transition-opacity duration-500 pointer-events-none",
          isActive ? "bg-greptile-green opacity-30" : "bg-greptile-green/20"
        )}
      />

      <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 200 200">
        <defs>
          <filter id="mint-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx="100"
          cy="100"
          r="88"
          stroke="rgba(85, 83, 104, 0.25)"
          strokeWidth="6"
          fill="none"
          strokeDasharray="4 3"
        />
        
        {/* Progress Arc */}
        <circle
          cx="100"
          cy="100"
          r="88"
          stroke={mode === "stopwatch" ? "#71adff" : "var(--greptile-green)"}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          filter="url(#mint-glow)"
          className="transition-[stroke-dashoffset] duration-300 ease-linear"
        />

        {/* Precision Knob Indicator */}
        <circle
          cx="100"
          cy="12"
          r="5"
          fill="#0c0c11"
          stroke={mode === "stopwatch" ? "#71adff" : "var(--greptile-green)"}
          strokeWidth="2.5"
          className="transition-transform duration-300 ease-linear"
          style={{
            transformOrigin: "100px 100px",
            transform: `rotate(${360 * (mode === "pomodoro" ? progress : 0)}deg)`
          }}
        />
      </svg>
      
      {/* Time Text & State Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        {!isEditing ? (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              {mode === "pomodoro" ? (isActive ? "// FOCUS IN PROGRESS" : "[CLICK TO SET DURATION]") : "// RUNNING TIMER"}
            </span>

            <div
              onClick={handleTextClick}
              className={cn(
                "font-mono font-bold tracking-tight text-foreground",
                mode === "pomodoro" && !isActive && !isPaused ? "cursor-pointer hover:text-greptile-green transition-colors" : ""
              )}
              style={{
                fontSize: "clamp(2.75rem, 6vw, 3.5rem)",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
              title={mode === "pomodoro" && !isActive && !isPaused ? "Edit duration" : undefined}
            >
              {formatClock(display)}
            </div>

            <span className="text-[10px] font-mono uppercase tracking-wider text-greptile-green mt-2 bg-greptile-green/10 px-2 py-0.5 rounded-[2px] border border-greptile-green/30">
              {isPaused ? "PAUSED" : isActive ? "ACTIVE" : "READY"}
            </span>
          </div>
        ) : (
          <div 
            className="absolute z-50 rounded-[6px] p-4 flex flex-col gap-3 shadow-2xl bg-surface-elevated border border-border animate-scale-in"
            style={{ 
              width: "220px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
              // SET FOCUS DURATION
            </div>

            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="number"
                min="1" max="180"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                className="w-20 bg-surface text-foreground font-mono border border-greptile-green rounded-[4px] px-2 py-1 text-sm text-center focus:outline-none"
              />
              <span className="text-muted-foreground text-xs font-mono">MINS</span>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <Button 
                variant="default"
                size="sm"
                onClick={handleSave}
                className="flex-1 text-xs"
              >
                Save
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="flex-1 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { TimerDisplay };
