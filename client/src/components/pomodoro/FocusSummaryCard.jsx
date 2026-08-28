import { AchievementRing } from "@/components/pomodoro/AchievementRing";
import { formatHours } from "@/lib/date";

const PERIOD_LABELS = {
  day: "Today",
  week: "This Week",
  month: "This Month",
};

function FocusSummaryCard({ period, totalSeconds, goalSeconds, achievementPercent }) {
  const isComplete = achievementPercent >= 100;

  return (
    <div className="flex items-center gap-6 p-1">
      <AchievementRing percent={achievementPercent} />
      <div className="space-y-1">
        <div
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          {PERIOD_LABELS[period] ?? "Focus"}
        </div>
        <div
          className="text-3xl font-bold font-mono tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {formatHours(totalSeconds)}
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          Focus Goal{" "}
          <span className="font-mono font-medium ml-1" style={{ color: "var(--text-secondary)" }}>
            {formatHours(goalSeconds)}
          </span>
        </div>
        <div
          className="text-xs font-semibold uppercase tracking-wider mt-1"
          style={{ color: isComplete ? "#4ade80" : "var(--brand-blue)" }}
        >
          Achievement {achievementPercent}%
        </div>
      </div>
    </div>
  );
}

export { FocusSummaryCard };
