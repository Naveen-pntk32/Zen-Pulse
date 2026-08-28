import { useMemo } from "react";
import { Loader2, Flame, CheckCircle2, Calendar, Target } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
      <div className="rounded-[8px] p-4 bg-surface border border-border/80 shadow-sm">
        <DateNavigator date={date} onChange={onChange} />
      </div>

      {/* Check-in status banner */}
      <div
        className={cn(
          "rounded-[8px] p-6 text-center transition-all duration-300 border relative overflow-hidden",
          allDone
            ? "bg-greptile-green/10 border-greptile-green/50 shadow-[0_0_24px_rgba(40,233,159,0.15)]"
            : "bg-surface-raised border-border"
        )}
      >
        {allDone ? (
          <>
            <div className="w-10 h-10 mx-auto mb-2 rounded-[4px] bg-greptile-green text-black flex items-center justify-center shadow-[0_0_16px_rgba(40,233,159,0.4)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-base font-bold font-display uppercase tracking-wider text-greptile-green">
              DAILY GOALS ACCOMPLISHED!
            </div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">
              ALL {activeHabits.length} HABIT PROTOCOLS RESOLVED
            </p>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {completedCount} / {activeHabits.length}
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-0.5">
              {isFuture ? "FUTURE DATE — CHECK-INS LOCKED" : "DAILY PROTOCOLS COMPLETED"}
            </div>
          </>
        )}
        
        {streak > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-[3px] border border-coral/40 bg-coral/10 text-coral">
            <Flame className="w-3.5 h-3.5" />
            <span>{streak} DAY STREAK MAINTAINED</span>
          </div>
        )}
      </div>

      {/* Habits List by Routine Section */}
      <div>
        {habitsLoading || todayLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-greptile-green" />
          </div>
        ) : activeHabits.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-[6px] border border-dashed border-border/60 bg-surface/30 space-y-2">
            <Target className="w-8 h-8 mx-auto text-muted-foreground/30" />
            <p className="text-sm font-bold font-display text-foreground">
              No habit routines scheduled for this date
            </p>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Create a new habit routine to initiate tracking
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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
