import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Habit, HabitCompletion } from '@/types';
import { goalOptionLabel } from '@/lib/defaults';
import { WeekDots } from '@/components/habits/WeekDots';
import { formatDuration } from '@/lib/date';

export function HabitCard({
  habit,
  completion,
  completions,
  date,
  onToggle,
  disabled,
}: {
  habit: Habit;
  completion?: HabitCompletion | null;
  completions: HabitCompletion[];
  date: string;
  onToggle: (habit: Habit) => void;
  disabled?: boolean;
}) {
  const completed = completion?.completed ?? false;
  const goalText =
    habit.goalType === 'time'
      ? `${goalOptionLabel(habit.dailyGoalSeconds)} goal`
      : 'Achieve it all';

  const progress =
    habit.goalType === 'time' && habit.dailyGoalSeconds > 0
      ? Math.min(100, Math.round(((completion?.actualFocusSeconds ?? 0) / habit.dailyGoalSeconds) * 100))
      : 0;

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3.5 rounded-2xl border transition-colors',
        completed
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-gray-800 border-gray-700 hover:border-gray-600',
      )}
    >
      <Checkbox
        checked={completed}
        disabled={disabled}
        onCheckedChange={() => onToggle(habit)}
        className={cn(
          'shrink-0 border-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500',
          disabled && 'opacity-40',
        )}
        aria-label={`Check in ${habit.name}`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">{habit.icon || '😊'}</span>
          <span className={cn('font-medium text-sm truncate', completed && 'text-gray-400 line-through')}>
            {habit.name}
          </span>
          {completion?.completedAutomatically && completed && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full shrink-0">
              <CheckCircle2 className="w-3 h-3" />
              Auto
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>
            Daily · {goalText}
          </span>
          {habit.goalType === 'time' && completion && completion.actualFocusSeconds > 0 && (
            <span className="text-gray-400">
              {formatDuration(completion.actualFocusSeconds)} focused
            </span>
          )}
          <span className="text-indigo-400">{progress}%</span>
        </div>
      </div>

      <div className="shrink-0">
        <WeekDots habitId={habit.id} endDate={date} completions={completions} />
      </div>
    </div>
  );
}