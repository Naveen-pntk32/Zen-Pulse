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
  useToggleHabitCompletion
} from "@/services/habit-completion.service";
function DailyCheckIn({ date, onChange }) {
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { data: todayCompletions, isLoading: todayLoading } = useHabitCompletions(date);
  const rangeFrom = getLocalDateKey(addDays(parseLocalDateKey(date), -59));
  const { data: rangeCompletions } = useHabitCompletionsBetween(rangeFrom, date);
  const toggleCompletion = useToggleHabitCompletion();
  const activeHabits = (habits ?? []).filter((h) => h.startDate <= date && (h.goalDays === null || (() => {
    const start = parseLocalDateKey(h.startDate);
    const target = parseLocalDateKey(date);
    const dayDiff = Math.floor((target.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24));
    return dayDiff < (h.goalDays ?? 0);
  })()));
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
  return <div className="space-y-6">
      {
    /* Date navigator */
  }
      <div className="bg-gray-800 rounded-3xl border border-gray-700 p-5">
        <DateNavigator date={date} onChange={onChange} />
      </div>

      {
    /* Check-in status */
  }
      <div
    className={`rounded-3xl border p-6 text-center ${allDone ? "bg-green-500/10 border-green-500/30" : "bg-gray-800 border-gray-700"}`}
  >
        {allDone ? <>
            <div className="text-3xl mb-2">✅</div>
            <div className="text-lg font-semibold text-green-400">Great job!</div>
            <div className="text-sm text-gray-400">You're on a roll!</div>
          </> : <>
            <div className="text-3xl mb-2">📅</div>
            <div className="text-lg font-semibold">
              {completedCount} of {activeHabits.length} habits done
            </div>
            <div className="text-sm text-gray-400">
              {isFuture ? "Future date \u2014 check-ins locked" : "Keep going!"}
            </div>
          </>}
        {streak > 0 && <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full">
            <Flame className="w-4 h-4" />
            {streak} day streak
          </div>}
      </div>

      {
    /* Today's habits */
  }
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Today's Habits
        </h3>
        {habitsLoading || todayLoading ? <div className="flex justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
          </div> : activeHabits.length === 0 ? <div className="text-center text-gray-500 py-10 bg-gray-800 rounded-2xl border border-gray-700">
            <p>No habits yet</p>
            <p className="text-sm mt-1">Create a habit with the form on the left</p>
          </div> : <div className="space-y-5">
            {HABIT_SECTION_ORDER.map((section) => {
    const sectionHabits = activeHabits.filter((h) => h.section === section);
    if (sectionHabits.length === 0) return null;
    return <HabitSection
      key={section}
      section={section}
      habits={sectionHabits}
      completions={weekCompletions}
      date={date}
      onToggle={handleToggle}
      disabled={isFuture}
    />;
  })}
          </div>}
      </div>
    </div>;
}
export {
  DailyCheckIn
};
