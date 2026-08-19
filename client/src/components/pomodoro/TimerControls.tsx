import { Play, Pause, RotateCcw, SkipForward, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TimerControls({
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
}: {
  mode: 'pomodoro' | 'stopwatch';
  isActive: boolean;
  isPaused: boolean;
  hasActiveSession: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  onReset: () => void;
  onStop: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={() => {
          if (isActive) onPause();
          else if (isPaused) onResume();
          else onStart();
        }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/30"
        aria-label={isActive ? 'Pause' : isPaused ? 'Resume' : 'Start'}
      >
        {isActive ? (
          <Pause className="w-7 h-7" />
        ) : (
          <Play className="w-7 h-7 ml-0.5" />
        )}
      </Button>

      <div className="flex items-center gap-3">
        {mode === 'stopwatch' && hasActiveSession && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onStop}
            className="rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300"
            title="Finish and record"
          >
            <Square className="w-4 h-4 fill-current" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          disabled={!hasActiveSession}
          className="rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-40"
          title="Reset (cancels session)"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        {mode === 'pomodoro' && hasActiveSession && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSkip}
            className="rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300"
            title="Skip (record full duration)"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}