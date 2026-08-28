import { Play, Pause, SkipForward, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex items-center justify-center gap-4 mt-2">
      {/* Play / Start / Resume / Pause Main Controls */}
      {!isActive ? (
        <Button
          onClick={onStart}
          variant="default"
          size="lg"
          className="h-12 px-8 text-sm gap-2 shadow-[0_0_24px_rgba(40,233,159,0.35)]"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>START {mode.toUpperCase()}</span>
        </Button>
      ) : isPaused ? (
        <div className="flex items-center gap-3">
          <Button
            onClick={onResume}
            variant="default"
            size="lg"
            className="h-11 px-6 text-xs gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>RESUME</span>
          </Button>
          
          <Button
            onClick={mode === "pomodoro" ? onSkip : onStop}
            variant="outline"
            size="lg"
            className="h-11 px-5 text-xs text-bloom hover:border-bloom/60 hover:text-bloom hover:bg-bloom/10"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>{mode === "pomodoro" ? "SKIP" : "STOP"}</span>
          </Button>

          <Button
            onClick={onReset}
            variant="ghost"
            size="icon"
            className="h-11 w-11"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button
            onClick={onPause}
            variant="secondary"
            size="lg"
            className="h-11 px-6 text-xs gap-2 border-border-strong hover:border-greptile-green/50"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>PAUSE</span>
          </Button>

          {mode === "pomodoro" && (
            <Button
              onClick={onSkip}
              variant="outline"
              size="lg"
              className="h-11 px-5 text-xs"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>SKIP</span>
            </Button>
          )}

          {mode === "stopwatch" && (
            <Button
              onClick={onStop}
              variant="outline"
              size="lg"
              className="h-11 px-5 text-xs text-bloom hover:border-bloom/60 hover:text-bloom hover:bg-bloom/10"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>STOP</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export { TimerControls };
