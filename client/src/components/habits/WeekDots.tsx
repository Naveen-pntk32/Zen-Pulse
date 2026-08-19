import { HabitCompletion } from '@/types';
import { addDays, getLocalDateKey, parseLocalDateKey } from '@/lib/date';
import { cn } from '@/lib/utils';

/** Shows 7-day completion dots for a habit, ending at the given date. */
export function WeekDots({
  habitId,
  endDate,
  completions,
}: {
  habitId: string;
  endDate: string;
  completions: HabitCompletion[];
}) {
  const days: string[] = [];
  const end = parseLocalDateKey(endDate);
  for (let i = 6; i >= 0; i--) {
    days.push(getLocalDateKey(addDays(end, -i)));
  }

  const completionFor = (date: string) =>
    completions.find((c) => c.habitId === habitId && c.date === date);

  return (
    <div className="flex items-center gap-1.5">
      {days.map((day) => {
        const done = completionFor(day);
        const isToday = day === getLocalDateKey();
        return (
          <div
            key={day}
            title={day}
            className={cn(
              'w-2.5 h-2.5 rounded-full transition-colors',
              done?.completed
                ? 'bg-green-400'
                : isToday
                  ? 'bg-gray-600 ring-1 ring-gray-500'
                  : 'bg-gray-700',
            )}
          />
        );
      })}
    </div>
  );
}