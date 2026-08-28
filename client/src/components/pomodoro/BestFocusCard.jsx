import { Trophy } from "lucide-react";
import { formatDayLabel, formatHours } from "@/lib/date";

function BestFocusCard({ bestFocus }) {
  if (!bestFocus) return null;

  return (
    <div
      className="flex items-center gap-3 rounded-[6px] p-3.5 border border-neon/30 bg-neon/5"
    >
      <div
        className="w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 bg-neon/15 border border-neon/40"
      >
        <Trophy className="w-4 h-4 text-neon" />
      </div>
      <div>
        <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-neon">
          // PEAK FOCUS RECORD
        </div>
        <div className="text-xs font-mono mt-0.5 text-foreground">
          {formatDayLabel(bestFocus.date)} ·{" "}
          <span className="font-bold text-greptile-green">
            {formatHours(bestFocus.seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}

export { BestFocusCard };
