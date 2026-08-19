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
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" }
];
function FocusStatisticsPanel() {
  const [period, setPeriod] = useState("day");
  const { data, isLoading } = useAnalytics(period);
  return <div className="bg-gray-800 rounded-3xl border border-gray-700 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Focus Statistics</h2>
        <div className="inline-flex bg-gray-900 rounded-xl p-1 border border-gray-700">
          {PERIODS.map((p) => <button
    key={p.value}
    onClick={() => setPeriod(p.value)}
    className={cn(
      "px-3 py-1 rounded-lg text-xs font-medium transition-all",
      period === p.value ? "bg-indigo-500 text-white" : "text-gray-400 hover:text-white"
    )}
  >
              {p.label}
            </button>)}
        </div>
      </div>

      {isLoading || !data ? <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
        </div> : <>
          <FocusSummaryCard
    period={period}
    totalSeconds={data.totalSeconds}
    goalSeconds={data.goalSeconds}
    achievementPercent={data.achievementPercent}
  />

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Focus Breakdown</h4>
            <FocusBreakdown items={data.breakdown} />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Focus History</h4>
            <FocusHistoryChart data={data.history} />
          </div>

          <div className="pt-1">
            <BestFocusCard bestFocus={data.bestFocus} />
          </div>

          <AutoCheckInEvent events={data.autoCheckIns} />
        </>}
    </div>;
}
export {
  FocusStatisticsPanel
};
