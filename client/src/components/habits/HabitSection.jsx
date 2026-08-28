import { HABIT_SECTIONS } from "@/lib/defaults";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitContextMenu } from "@/components/habits/HabitContextMenu";
import { cn } from "@/lib/utils";

function HabitSection({ section, habits, completions, date, onToggle, disabled }) {
  const meta = HABIT_SECTIONS.find((s) => s.value === section);
  if (habits.length === 0) return null;

  return (
    <div className="mb-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-border/30">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-greptile-green" />
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-muted-foreground">
            // {meta?.label ?? section.toUpperCase()}
          </span>
        </div>
        <span className="badge-tech text-[9px] py-0 px-1.5">
          {habits.length}
        </span>
      </div>

      {/* Cards */}
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

export { HabitSection };
