import { useState } from "react";
import { Loader2, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/services/analytics.service";
import { FocusSummaryCard } from "@/components/pomodoro/FocusSummaryCard";
import { FocusBreakdown } from "@/components/pomodoro/FocusBreakdown";
import { FocusHistoryChart } from "@/components/pomodoro/FocusHistoryChart";
import { AutoCheckInEvent } from "@/components/pomodoro/AutoCheckInEvent";
import { BestFocusCard } from "@/components/pomodoro/BestFocusCard";

const PERIODS = [
  { value: "day",   label: "DAY" },
  { value: "week",  label: "WEEK" },
  { value: "month", label: "MONTH" },
];

function FocusStatisticsPanel() {
  const [period, setPeriod] = useState("day");
  const { data, isLoading } = useAnalytics(period);

  return (
    <div
      className="rounded-[8px] p-5 sm:p-6 space-y-6 border border-border/80 bg-surface-raised/90 backdrop-blur-md shadow-xl"
    >
      {/* Header & Period Selector */}
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-greptile-green" />
          <h2 className="text-sm font-bold font-display uppercase tracking-wider text-foreground">
            Productivity Analytics
          </h2>
        </div>
        
        <div
          className="inline-flex rounded-[4px] p-0.5 bg-surface border border-border"
        >
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                "px-3 py-1 rounded-[3px] text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer",
                period === p.value
                  ? "bg-greptile-green text-black shadow-[0_0_8px_rgba(40,233,159,0.3)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !data ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-greptile-green" />
        </div>
      ) : (
        <div className="space-y-6">
          <FocusSummaryCard
            period={period}
            totalSeconds={data.totalSeconds}
            goalSeconds={data.goalSeconds}
            achievementPercent={data.achievementPercent}
          />

          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold mb-2.5">
              // FOCUS BREAKDOWN
            </h4>
            <FocusBreakdown items={data.breakdown} />
          </div>

          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold mb-2">
              // ACTIVITY TIMELINE
            </h4>
            <FocusHistoryChart data={data.history} />
          </div>

          <BestFocusCard bestFocus={data.bestFocus} />

          <AutoCheckInEvent events={data.autoCheckIns} />
        </div>
      )}
    </div>
  );
}

export { FocusStatisticsPanel };
