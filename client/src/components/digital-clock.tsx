import { useState, useEffect } from 'react';
import { Clock, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DigitalClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would toggle the global theme
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTimezone = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz.split('/').pop() || 'UTC';
  };

  const getTemperature = () => {
    // Mock temperature - in a real app, this would come from a weather API
    return '72°F';
  };

  return (
    <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Digital Clock
        </h2>
        <Button
          onClick={toggleDarkMode}
          variant="ghost"
          size="icon"
          className="rounded-full bg-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>
      </div>
      
      <div className="text-center">
        <div className="font-mono text-4xl md:text-6xl font-bold mb-2 text-blue-400">
          {formatTime(currentTime)}
        </div>
        <div className="font-mono text-lg text-gray-400">
          {formatDate(currentTime)}
        </div>
        <div className="mt-4 flex justify-center space-x-4 text-sm">
          <div className="text-green-400">
            {getTimezone()}
          </div>
          <div className="text-gray-400">|</div>
          <div className="text-amber-400">
            {getTemperature()}
          </div>
        </div>
      </div>
    </div>
  );
}
