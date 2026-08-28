import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, formatDayWithWeekday, getLocalDateKey } from "@/lib/date";

function DateNavigator({ date, onChange }) {
  const canGoBack = date > "1970-01-01";
  
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onChange(getLocalDateKey(addDays(new Date(date), -1)))}
        disabled={!canGoBack}
        className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => { if (canGoBack) { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--surface-hover)"; } }}
        onMouseLeave={(e) => { if (canGoBack) { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; } }}
        aria-label="Previous day"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="text-center">
        <div className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          {formatDayWithWeekday(date)}
        </div>
        {date === getLocalDateKey() && (
          <div className="text-xs font-medium mt-0.5" style={{ color: "var(--brand-blue)" }}>
            Today
          </div>
        )}
      </div>

      <button
        onClick={() => onChange(getLocalDateKey(addDays(new Date(date), 1)))}
        className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-150"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--surface-hover)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
        aria-label="Next day"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export { DateNavigator };
