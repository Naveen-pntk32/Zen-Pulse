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
      <div className="flex items-center gap-2 mb-2.5">
        <span
          className={cn("w-2 h-2 rounded-full", meta?.dot)}
          style={{ opacity: 0.8 }}
        />
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-secondary)" }}
        >
          {meta?.label}
        </span>
        <span
          className="text-xs font-medium px-1.5 py-0.5 rounded-md"
          style={{
            background: "var(--surface-raised)",
            color:      "var(--text-muted)",
          }}
        >
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
