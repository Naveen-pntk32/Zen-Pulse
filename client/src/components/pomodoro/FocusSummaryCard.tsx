import { AchievementRing } from '@/components/pomodoro/AchievementRing';
import { formatHours } from '@/lib/date';

const PERIOD_LABELS: Record<string, string> = {
  day: 'Today',
  week: 'This Week',
  month: 'This Month',
};

export function FocusSummaryCard({
  period,
  totalSeconds,
  goalSeconds,
  achievementPercent,
}: {
  period: string;
  totalSeconds: number;
  goalSeconds: number;
  achievementPercent: number;
}) {
  return (
    <div className="flex items-center gap-5">
      <AchievementRing percent={achievementPercent} />
      <div className="space-y-1">
        <div className="text-xs text-gray-500 uppercase tracking-wider">
          {PERIOD_LABELS[period] ?? 'Focus'}
        </div>
        <div className="text-2xl font-bold font-mono">{formatHours(totalSeconds)}</div>
        <div className="text-sm text-gray-400">
          Focus Goal <span className="font-mono text-gray-200">{formatHours(goalSeconds)}</span>
        </div>
        <div
          className={`text-xs font-medium ${
            achievementPercent >= 100 ? 'text-green-400' : 'text-indigo-400'
          }`}
        >
          Achievement {achievementPercent}%
        </div>
      </div>
    </div>
  );
}