import { Habit, HabitCompletion } from '@/types';
import { HABIT_SECTIONS } from '@/lib/defaults';
import { HabitCard } from '@/components/habits/HabitCard';
import { HabitContextMenu } from '@/components/habits/HabitContextMenu';
import { cn } from '@/lib/utils';

export function HabitSection({
  section,
  habits,
  completions,
  date,
  onToggle,
  disabled,
}: {
  section: string;
  habits: Habit[];
  completions: HabitCompletion[];
  date: string;
  onToggle: (habit: Habit) => void;
  disabled?: boolean;
}) {
  const meta = HABIT_SECTIONS.find((s) => s.value === section);
  if (habits.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className={cn('w-2.5 h-2.5 rounded-full', meta?.dot)} />
        <span className={cn('text-sm font-semibold', meta?.text)}>{meta?.label}</span>
        <span className="text-xs text-gray-500">({habits.length})</span>
      </div>
      <div className="space-y-2">
        {habits.map((habit) => (
          <HabitContextMenu key={habit.id} habit={habit}>
            <HabitCard
              habit={habit}
              completion={completions.find((c) => c.habitId === habit.id)}
              completions={completions}
              date={date}
              onToggle={onToggle}
              disabled={disabled}
            />
          </HabitContextMenu>
        ))}
      </div>
    </div>
  );
}