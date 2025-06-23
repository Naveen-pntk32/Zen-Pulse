import { useState, useEffect, useCallback } from 'react';
import { Timer, Settings, Play, Pause, RotateCcw, SkipForward, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTimer } from '@/hooks/use-timer';
import { useNotifications } from '@/hooks/use-notifications';
import { storage } from '@/lib/storage';
import { PomodoroSettings } from '@/types/timer';

type TimerMode = 'focus' | 'break' | 'longBreak';

export function PomodoroTimer() {
  const [settings, setSettings] = useState<PomodoroSettings>(storage.getSettings());
  const [mode, setMode] = useState<TimerMode>('focus');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [sessionsInCycle, setSessionsInCycle] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const { showNotification, requestPermission, isGranted } = useNotifications();

  const getDuration = useCallback(() => {
    switch (mode) {
      case 'focus':
        return settings.focusDuration * 60;
      case 'break':
        return settings.breakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
      default:
        return settings.focusDuration * 60;
    }
  }, [mode, settings]);

  const onTimerComplete = useCallback(() => {
    if (settings.soundEnabled) {
      // Play notification sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEgAzOC0fPNfyYFJ3zM8d2OPQsXabHq7KNOFApEneHzwWEiBC2AzvTNfSsHKXTP892RQAoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCMGLYbS8d2OPQoUXrDp66hVFAxGoN/yv2EiBC2AzfPRgCAD==');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }

    if (settings.notificationsEnabled && isGranted) {
      const message = mode === 'focus' 
        ? 'Focus session completed! Time for a break.' 
        : 'Break time is over! Ready for another focus session?';
      
      showNotification('Pomodoro Timer', {
        body: message,
        tag: 'pomodoro-complete',
      });
    }

    // Handle session completion
    if (mode === 'focus') {
      const newSessionsInCycle = sessionsInCycle + 1;
      setSessionsInCycle(newSessionsInCycle);
      setCompletedSessions(prev => prev + 1);
      
      // Update daily stats
      const todayStats = storage.getTodayStats();
      storage.updateTodayStats({
        pomodoros: todayStats.pomodoros + 1,
        focusHours: todayStats.focusHours + (settings.focusDuration / 60),
      });

      // Determine next break type
      if (newSessionsInCycle >= settings.sessionsUntilLongBreak) {
        setMode('longBreak');
        setSessionsInCycle(0);
      } else {
        setMode('break');
      }
    } else {
      setMode('focus');
    }
  }, [mode, settings, sessionsInCycle, showNotification, isGranted]);

  const updateSetting = (key: keyof PomodoroSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    storage.saveSettings({ [key]: value });
  };

  const { timeLeft, isActive, progress, start, pause, reset, skip, toggle } = useTimer({
    duration: getDuration(),
    onComplete: onTimerComplete,
  });

  useEffect(() => {
    if (settings.notificationsEnabled && !isGranted) {
      requestPermission();
    }
  }, [settings.notificationsEnabled, isGranted, requestPermission]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (mode) {
      case 'focus':
        return 'Focus Time';
      case 'break':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Focus Time';
    }
  };

  const getProgressColor = () => {
    switch (mode) {
      case 'focus':
        return 'text-red-400';
      case 'break':
        return 'text-green-400';
      case 'longBreak':
        return 'text-blue-400';
      default:
        return 'text-red-400';
    }
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress * circumference);

  const renderSessionDots = () => {
    const dots = [];
    for (let i = 0; i < settings.sessionsUntilLongBreak; i++) {
      const isCompleted = i < sessionsInCycle;
      dots.push(
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            isCompleted ? 'bg-green-400' : 'bg-gray-700'
          }`}
        />
      );
    }
    return dots;
  };

  return (
    <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Timer className="w-5 h-5 text-red-400" />
          Pomodoro Timer
        </h2>
        <Button
          onClick={() => setShowSettings(!showSettings)}
          variant="ghost"
          size="icon"
          className="rounded-full bg-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Timer Circle */}
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className={`timer-ring ${getProgressColor()}`}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`font-mono text-3xl font-bold ${getProgressColor()}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-400">{getStatusText()}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center space-y-4">
          <Button
            onClick={toggle}
            className={`w-16 h-16 rounded-full shadow-lg hover:shadow-xl ${
              mode === 'focus' 
                ? 'bg-red-400 hover:bg-red-500' 
                : mode === 'break'
                ? 'bg-green-400 hover:bg-green-500'
                : 'bg-blue-400 hover:bg-blue-500'
            } text-white`}
          >
            {isActive ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8" />
            )}
          </Button>
          
          <div className="flex space-x-3">
            <Button
              onClick={reset}
              variant="ghost"
              size="icon"
              className="rounded-full bg-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button
              onClick={skip}
              variant="ghost"
              size="icon"
              className="rounded-full bg-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="text-center text-sm">
            <div className="text-green-400">Completed: {completedSessions}</div>
            <div className="text-gray-400">Daily Goal: 8</div>
          </div>
        </div>
      </div>

      {/* Session Progress */}
      <div className="mt-6 flex justify-center space-x-2">
        {renderSessionDots()}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-6 p-4 bg-gray-700 rounded-2xl border border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Timer Settings</h3>
            <Button
              onClick={() => setShowSettings(false)}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Focus Duration */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Focus Time</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm text-white">{settings.focusDuration}</span>
                  <span className="text-xs text-gray-400">min</span>
                </div>
              </div>
              <Slider
                value={[settings.focusDuration]}
                onValueChange={(value) => updateSetting('focusDuration', value[0])}
                min={15}
                max={60}
                step={5}
                className="w-full"
              />
            </div>

            {/* Break Duration */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Break Time</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm text-white">{settings.breakDuration}</span>
                  <span className="text-xs text-gray-400">min</span>
                </div>
              </div>
              <Slider
                value={[settings.breakDuration]}
                onValueChange={(value) => updateSetting('breakDuration', value[0])}
                min={3}
                max={15}
                step={1}
                className="w-full"
              />
            </div>

            {/* Long Break Duration */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Long Break</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm text-white">{settings.longBreakDuration}</span>
                  <span className="text-xs text-gray-400">min</span>
                </div>
              </div>
              <Slider
                value={[settings.longBreakDuration]}
                onValueChange={(value) => updateSetting('longBreakDuration', value[0])}
                min={15}
                max={30}
                step={5}
                className="w-full"
              />
            </div>

            {/* Notification Settings */}
            <div className="pt-4 border-t border-gray-600 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Sound Alerts</span>
                <Button
                  onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-all ${
                    settings.soundEnabled ? 'bg-green-400' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Web Notifications</span>
                <Button
                  onClick={() => updateSetting('notificationsEnabled', !settings.notificationsEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-all ${
                    settings.notificationsEnabled ? 'bg-green-400' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                      settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
