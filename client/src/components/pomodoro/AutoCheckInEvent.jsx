import { CheckCircle2 } from "lucide-react";
import { formatDayLabel, formatTimeHM } from "@/lib/date";
function AutoCheckInEvent({
  events
}) {
  if (events.length === 0) return null;
  return <div>
      <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-green-400" />
        Auto Check-in
      </h4>
      <div className="space-y-2">
        {events.slice(0, 5).map((event, i) => <div key={i} className="flex items-center gap-2 text-sm bg-green-500/5 border border-green-500/20 rounded-xl px-3 py-2">
            <span className="text-green-400">✅</span>
            <div className="flex-1 min-w-0">
              <div className="text-gray-200 text-xs truncate">{event.habitName}</div>
              <div className="text-gray-500 text-[11px]">
                {formatDayLabel(event.date)} · {formatTimeHM(new Date(event.completedAt))}
              </div>
            </div>
          </div>)}
      </div>
    </div>;
}
export {
  AutoCheckInEvent
};
