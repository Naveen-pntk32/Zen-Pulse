import { CheckCircle2, Zap } from "lucide-react";
import { formatDayLabel, formatTimeHM } from "@/lib/date";

function AutoCheckInEvent({ events }) {
  if (!events || events.length === 0) return null;

  return (
    <div className="pt-2">
      <div className="flex items-center justify-between pb-1.5 mb-2.5 border-b border-border/40">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-greptile-green fill-greptile-green" />
          AUTO CHECK-IN LOG
        </h4>
        <span className="badge-tech badge-tech-green text-[9px] py-0">
          AUTOMATED
        </span>
      </div>

      <div className="space-y-1.5">
        {events.slice(0, 4).map((event, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 text-xs rounded-[4px] px-3 py-2 border border-greptile-green/30 bg-greptile-green/5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-greptile-green shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-foreground truncate">
                {event.habitName}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
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
