import { addDays, getLocalDateKey, parseLocalDateKey } from "@/lib/date";

function WeekDots({ habitId, endDate, completions }) {
  const days = [];
  const end = parseLocalDateKey(endDate);
  
  for (let i = 6; i >= 0; i--) {
    days.push(getLocalDateKey(addDays(end, -i)));
  }

  const completionFor = (date) =>
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
            className="w-2.5 h-2.5 rounded-full transition-colors duration-150"
            style={{
              background: done?.completed
                ? "#4ade80"
                : isToday
                ? "var(--border-strong)"
                : "var(--surface)",
              boxShadow: isToday && !done?.completed
                ? "0 0 0 1px var(--border)"
                : "none",
            }}
          />
        );
      })}
    </div>
  );
}

export { WeekDots };
