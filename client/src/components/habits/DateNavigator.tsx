import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addDays, formatDayWithWeekday, getLocalDateKey } from '@/lib/date';

export function DateNavigator({
  date,
  onChange,
}: {
  date: string;
  onChange: (date: string) => void;
}) {
  const canGoBack = date > '1970-01-01';

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange(getLocalDateKey(addDays(new Date(date), -1)))}
        disabled={!canGoBack}
        className="rounded-full text-gray-400 hover:text-white hover:bg-gray-700"
        aria-label="Previous day"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <div className="text-center">
        <div className="text-base font-semibold">{formatDayWithWeekday(date)}</div>
        {date === getLocalDateKey() && (
          <div className="text-xs text-indigo-400 font-medium">Today</div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange(getLocalDateKey(addDays(new Date(date), 1)))}
        className="rounded-full text-gray-400 hover:text-white hover:bg-gray-700"
        aria-label="Next day"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}