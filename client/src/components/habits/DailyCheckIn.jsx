import { useMemo } from "react";
import { Loader2, Flame } from "lucide-react";
import { DateNavigator } from "@/components/habits/DateNavigator";
import { HabitSection } from "@/components/habits/HabitSection";
import { HABIT_SECTION_ORDER } from "@/lib/defaults";
import { addDays, getLocalDateKey, parseLocalDateKey } from "@/lib/date";
import { useHabits } from "@/services/habit.service";
import {
  useHabitCompletions,
  useHabitCompletionsBetween,
  useToggleHabitCompletion,
} from "@/services/habit-completion.service";

function DailyCheckIn({ date, onChange }) {
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { data: todayCompletions, isLoading: todayLoading } = useHabitCompletions(date);

  const rangeFrom = getLocalDateKey(addDays(parseLocalDateKey(date), -59));
  const { data: rangeCompletions } = useHabitCompletionsBetween(rangeFrom, date);

  const toggleCompletion = useToggleHabitCompletion();

  const activeHabits = (habits ?? []).filter(
    (h) =>
      h.startDate <= date &&
      (h.goalDays === null ||
        (() => {
          const start = parseLocalDateKey(h.startDate);
          const target = parseLocalDateKey(date);
          const dayDiff = Math.floor(
            (target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
          );
          return dayDiff < (h.goalDays ?? 0);
        })())
  );

  const completedCount = todayCompletions?.filter((c) => c.completed).length ?? 0;
  const allDone = activeHabits.length > 0 && completedCount >= activeHabits.length;

  const streak = useMemo(() => {
    const doneByDate = new Set(
      (rangeCompletions ?? []).filter((c) => c.completed).map((c) => c.date)
    );
    let count = 0;
    let cursor = new Date(date);
    if (date > getLocalDateKey()) cursor = new Date(getLocalDateKey());

    while (doneByDate.has(getLocalDateKey(cursor))) {
      count++;
      cursor = addDays(cursor, -1);
    }
    return count;
  }, [rangeCompletions, date]);

  const isFuture = date > getLocalDateKey();

  const handleToggle = (habit) => {
    if (isFuture) return;
    toggleCompletion.mutate({ habitId: habit.id, date });
  };

  const weekCompletions = (rangeCompletions ?? []).filter(
    (c) => c.date >= getLocalDateKey(addDays(parseLocalDateKey(date), -6))
  );

  return (
    <div className="space-y-6">
      {/* Date navigator */}
      <div
        className="rounded-3xl p-5"
        style={{
          background: "var(--surface-raised)",
          border:     "1px solid var(--border)",
        }}
      >
        <DateNavigator date={date} onChange={onChange} />
      </div>

      {/* Check-in status */}
      <div
        className="rounded-3xl p-6 text-center transition-all duration-300"
        style={{
          background:  allDone ? "rgba(74,222,128,0.08)" : "var(--surface-raised)",
          border:      allDone ? "1px solid rgba(74,222,128,0.3)" : "1px solid var(--border)",
        }}
      >
        {allDone ? (
          <>
            <div className="text-4xl mb-3 mt-2">✅</div>
            <div className="text-xl font-bold mb-1" style={{ color: "#4ade80" }}>
              Great job!
            </div>
            <div className="text-[13px]" style={{ color: "var(--text-muted)" }}>
              You're on a roll! All habits completed today.
            </div>
          </>
        ) : (
          <>
            <div className="text-4xl mb-3 mt-2">📅</div>
            <div className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
              {completedCount} of {activeHabits.length} habits done
            </div>
            <div className="text-[13px]" style={{ color: "var(--text-muted)" }}>
              {isFuture ? "Future date — check-ins locked" : "Keep going! You got this."}
            </div>
          </>
        )}
        
        {streak > 0 && (
          <div
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide"
            style={{
              color:      "#f97316",
              background: "rgba(249,115,22,0.12)",
            }}
          >
            <Flame className="w-3.5 h-3.5" />
            {streak} day streak
          </div>
        )}
      </div>

      {/* Today's habits */}
      <div>
        {habitsLoading || todayLoading ? (
          <div className="flex justify-center py-16">
            <Loader2
              className="w-5 h-5 animate-spin"
              style={{ color: "var(--brand-blue)" }}
            />
          </div>
        ) : activeHabits.length === 0 ? (
          <div
            className="text-center py-16 rounded-3xl"
            style={{
              background: "var(--surface-raised)",
              border:     "1px solid var(--border)",
            }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              No habits scheduled
            </p>
            <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
              Create a habit with the form to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {HABIT_SECTION_ORDER.map((section) => {
              const sectionHabits = activeHabits.filter((h) => h.section === section);
              if (sectionHabits.length === 0) return null;
              
              return (
                <HabitSection
                  key={section}
                  section={section}
                  habits={sectionHabits}
                  completions={weekCompletions}
                  date={date}
                  onToggle={handleToggle}
                  disabled={isFuture}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export { DailyCheckIn };
