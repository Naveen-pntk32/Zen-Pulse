import { cn } from '@/lib/utils';
import { Timer as TimerIcon, Hourglass } from 'lucide-react';

export function ModeToggle({
  value,
  onChange,
  disabled,
}: {
  value: 'pomodoro' | 'stopwatch';
  onChange: (mode: 'pomodoro' | 'stopwatch') => void;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex bg-gray-800 rounded-2xl p-1 border border-gray-700">
      <button
        type="button"
        onClick={() => onChange('pomodoro')}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all',
          value === 'pomodoro'
            ? 'bg-indigo-500 text-white shadow'
            : 'text-gray-400 hover:text-white',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <TimerIcon className="w-4 h-4" />
        Pomo
      </button>
      <button
        type="button"
        onClick={() => onChange('stopwatch')}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all',
          value === 'stopwatch'
            ? 'bg-indigo-500 text-white shadow'
            : 'text-gray-400 hover:text-white',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <Hourglass className="w-4 h-4" />
        Stopwatch
      </button>
    </div>
  );
}