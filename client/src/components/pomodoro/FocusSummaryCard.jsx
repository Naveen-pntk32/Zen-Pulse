import { AchievementRing } from "@/components/pomodoro/AchievementRing";
import { formatHours } from "@/lib/date";

const PERIOD_LABELS = {
  day: "TODAY'S TARGET",
  week: "WEEKLY TARGET",
  month: "MONTHLY TARGET",
};

function FocusSummaryCard({ period, totalSeconds, goalSeconds, achievementPercent }) {
  const isComplete = achievementPercent >= 100;

  return (
    <div className="flex items-center gap-5 p-4 rounded-[6px] border border-border/60 bg-surface/40">
      <AchievementRing percent={achievementPercent} />
      <div className="space-y-1 min-w-0">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
          {PERIOD_LABELS[period] ?? "FOCUS STATS"}
        </div>
        <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
          {formatHours(totalSeconds)}
        </div>
        <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
          <span>GOAL:</span>
          <span className="font-bold text-foreground">{formatHours(goalSeconds)}</span>
        </div>
        <div className="pt-1">
          <span className={isComplete ? "badge-tech badge-tech-green" : "badge-tech badge-tech-sky"}>
            {achievementPercent}% ACHIEVED
          </span>
        </div>
      </div>
    </div>
  );
}

export { FocusSummaryCard };
