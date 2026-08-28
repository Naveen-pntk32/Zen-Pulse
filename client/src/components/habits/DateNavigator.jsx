import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { addDays, formatDayWithWeekday, getLocalDateKey } from "@/lib/date";

function DateNavigator({ date, onChange }) {
  const canGoBack = date > "1970-01-01";
  const isToday = date === getLocalDateKey();
  
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onChange(getLocalDateKey(addDays(new Date(date), -1)))}
        disabled={!canGoBack}
        className="p-1.5 rounded-[4px] border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-border-strong hover:bg-surface-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Previous day"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-greptile-green" />
          <span className="text-sm font-bold font-display uppercase tracking-wider text-foreground">
            {formatDayWithWeekday(date)}
          </span>
        </div>
        {isToday ? (
          <span className="badge-tech badge-tech-green text-[9px] mt-1">
            TODAY
          </span>
        ) : (
          <span className="text-[10px] font-mono uppercase text-muted-foreground mt-0.5">
            HISTORICAL LOG
          </span>
        )}
      </div>

      <button
        onClick={() => onChange(getLocalDateKey(addDays(new Date(date), 1)))}
        className="p-1.5 rounded-[4px] border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-border-strong hover:bg-surface-hover transition-colors cursor-pointer"
        aria-label="Next day"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export { DateNavigator };
