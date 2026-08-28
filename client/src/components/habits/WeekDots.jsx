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
    <div className="flex items-center gap-1">
      {days.map((day) => {
        const done = completionFor(day);
        const isToday = day === getLocalDateKey();

        return (
          <div
            key={day}
            title={`${day}: ${done?.completed ? "Completed" : "Not completed"}`}
            className="w-2.5 h-2.5 rounded-[2px] transition-all duration-150"
            style={{
              backgroundColor: done?.completed
                ? "var(--greptile-green)"
                : isToday
                ? "rgba(85, 83, 104, 0.6)"
                : "rgba(85, 83, 104, 0.25)",
              boxShadow: done?.completed
                ? "0 0 6px rgba(40,233,159,0.5)"
                : "none",
              border: isToday && !done?.completed ? "1px solid var(--greptile-green)" : "none"
            }}
          />
        );
      })}
    </div>
  );
}

export { WeekDots };
