import { Trophy } from "lucide-react";
import { formatDayLabel, formatHours } from "@/lib/date";

function BestFocusCard({ bestFocus }) {
  if (!bestFocus) return null;

  return (
    <div
      className="flex items-center gap-3 rounded-2xl p-4 border transition-colors duration-150"
      style={{
        background: "rgba(245,158,11,0.08)",
        borderColor: "rgba(245,158,11,0.2)",
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "rgba(245,158,11,0.15)" }}
      >
        <Trophy className="w-5 h-5" style={{ color: "var(--brand-amber)" }} />
      </div>
      <div>
        <div className="text-[13px] font-semibold tracking-wide uppercase" style={{ color: "var(--text-secondary)" }}>
          Best Focus
        </div>
        <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {formatDayLabel(bestFocus.date)} ·{" "}
          <span className="font-mono font-medium" style={{ color: "var(--brand-amber)" }}>
            {formatHours(bestFocus.seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}

export { BestFocusCard };
