import { Timer as StopwatchIcon, Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStopwatch } from '@/hooks/use-timer';

export function Timer() {
  const { time, isActive, laps, start, pause, reset, lap, toggle } = useStopwatch();

  const formatTime = (centiseconds: number) => {
    const totalSeconds = Math.floor(centiseconds / 100);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const cs = centiseconds % 100;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  const formatLapTime = (centiseconds: number) => {
    return formatTime(centiseconds);
  };

  return (
    <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
        <StopwatchIcon className="w-5 h-5 text-blue-400" />
        Timer
      </h2>

      <div className="text-center">
        <div className="font-mono text-4xl font-bold mb-6 text-blue-400">
          {formatTime(time)}
        </div>
        
        <div className="flex justify-center space-x-4 mb-6">
          <Button
            onClick={toggle}
            className="w-12 h-12 rounded-full bg-blue-400 hover:bg-blue-500 text-white"
          >
            {isActive ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </Button>
          <Button
            onClick={lap}
            disabled={!isActive || time === 0}
            className="w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-500 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <Flag className="w-6 h-6" />
          </Button>
          <Button
            onClick={reset}
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>
        </div>

        {/* Lap Times */}
        {laps.length > 0 && (
          <div className="max-h-32 overflow-y-auto space-y-2">
            {laps.map((lapData, index) => (
              <div
                key={index}
                className="flex justify-between text-sm bg-gray-700 rounded-lg p-2"
              >
                <span className="text-gray-400">Lap {index + 1}</span>
                <span className="font-mono">{formatLapTime(lapData.lapTime)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
