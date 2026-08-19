import { Trophy } from 'lucide-react';
import { formatDayLabel, formatHours } from '@/lib/date';

export function BestFocusCard({
  bestFocus,
}: {
  bestFocus: { date: string; seconds: number } | null;
}) {
  if (!bestFocus) return null;

  return (
    <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
        <Trophy className="w-5 h-5 text-amber-400" />
      </div>
      <div>
        <div className="text-sm text-gray-300 font-medium">Best Focus</div>
        <div className="text-xs text-gray-500">
          {formatDayLabel(bestFocus.date)} ·{' '}
          <span className="font-mono text-amber-400">{formatHours(bestFocus.seconds)}</span>
        </div>
      </div>
    </div>
  );
}