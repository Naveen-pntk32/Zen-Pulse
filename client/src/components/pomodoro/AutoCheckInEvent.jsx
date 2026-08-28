import { CheckCircle2 } from "lucide-react";
import { formatDayLabel, formatTimeHM } from "@/lib/date";

function AutoCheckInEvent({ events }) {
  if (events.length === 0) return null;

  return (
    <div className="pt-2">
      <h4
        className="text-[11px] font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5"
        style={{ color: "var(--text-muted)" }}
      >
        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#4ade80" }} />
        Auto Check-in
      </h4>
      <div className="space-y-2">
        {events.slice(0, 5).map((event, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm rounded-xl px-3.5 py-2.5 transition-colors duration-150"
            style={{
              background: "rgba(74,222,128,0.06)",
              border:     "1px solid rgba(74,222,128,0.2)",
            }}
          >
            <span style={{ color: "#4ade80" }}>✅</span>
            <div className="flex-1 min-w-0">
              <div
                className="text-[13px] font-medium truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {event.habitName}
              </div>
              <div
                className="text-[11px] mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                {formatDayLabel(event.date)} · {formatTimeHM(new Date(event.completedAt))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { AutoCheckInEvent };
