import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/services/analytics.service";
import { FocusSummaryCard } from "@/components/pomodoro/FocusSummaryCard";
import { FocusBreakdown } from "@/components/pomodoro/FocusBreakdown";
import { FocusHistoryChart } from "@/components/pomodoro/FocusHistoryChart";
import { AutoCheckInEvent } from "@/components/pomodoro/AutoCheckInEvent";
import { BestFocusCard } from "@/components/pomodoro/BestFocusCard";

const PERIODS = [
  { value: "day",   label: "Day" },
  { value: "week",  label: "Week" },
  { value: "month", label: "Month" },
];

function FocusStatisticsPanel() {
  const [period, setPeriod] = useState("day");
  const { data, isLoading } = useAnalytics(period);

  return (
    <div
      className="rounded-3xl p-6 lg:p-8 space-y-8"
      style={{
        background: "var(--surface-raised)",
        border:     "1px solid var(--border)",
      }}
    >
      {/* Header & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
          Focus Statistics
        </h2>
        
        <div
          className="inline-flex rounded-xl p-1 shrink-0"
          style={{
            background: "var(--surface)",
            border:     "1px solid var(--border)",
          }}
        >
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150"
              style={{
                background: period === p.value ? "var(--brand-blue)" : "transparent",
                color:      period === p.value ? "#ffffff" : "var(--text-secondary)",
                boxShadow:  period === p.value ? "var(--shadow-card)" : "none",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !data ? (
        <div className="flex justify-center py-16">
          <Loader2
            className="w-5 h-5 animate-spin"
            style={{ color: "var(--brand-blue)" }}
          />
        </div>
      ) : (
        <div className="space-y-8">
          <FocusSummaryCard
            period={period}
            totalSeconds={data.totalSeconds}
            goalSeconds={data.goalSeconds}
            achievementPercent={data.achievementPercent}
          />

          <div className="pt-2">
            <h4
              className="text-[11px] font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              Focus Breakdown
            </h4>
            <FocusBreakdown items={data.breakdown} />
          </div>

          <div className="pt-2">
            <h4
              className="text-[11px] font-semibold uppercase tracking-widest mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Focus History
            </h4>
            <FocusHistoryChart data={data.history} />
          </div>

          <div className="pt-2">
            <BestFocusCard bestFocus={data.bestFocus} />
          </div>

          <AutoCheckInEvent events={data.autoCheckIns} />
        </div>
      )}
    </div>
  );
}

export { FocusStatisticsPanel };
