import { useState, useEffect } from 'react';
import { Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { storage } from '@/lib/storage';
import { PomodoroSettings } from '@/types/timer';

export function QuickSettings() {
  const [settings, setSettings] = useState<PomodoroSettings>(storage.getSettings());

  useEffect(() => {
    setSettings(storage.getSettings());
  }, []);

  const updateSetting = (key: keyof PomodoroSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    storage.saveSettings({ [key]: value });
  };

  const handleFocusDurationChange = (value: number[]) => {
    updateSetting('focusDuration', value[0]);
  };

  const handleBreakDurationChange = (value: number[]) => {
    updateSetting('breakDuration', value[0]);
  };

  const toggleSound = () => {
    updateSetting('soundEnabled', !settings.soundEnabled);
  };

  const toggleNotifications = () => {
    updateSetting('notificationsEnabled', !settings.notificationsEnabled);
  };

  return (
    <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Sliders className="w-5 h-5 text-purple-400" />
        Quick Settings
      </h2>

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
            onValueChange={handleFocusDurationChange}
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
            onValueChange={handleBreakDurationChange}
            min={3}
            max={15}
            step={1}
            className="w-full"
          />
        </div>

        {/* Notification Settings */}
        <div className="pt-4 border-t border-gray-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Sound Alerts</span>
            <Button
              onClick={toggleSound}
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
              onClick={toggleNotifications}
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
  );
}
