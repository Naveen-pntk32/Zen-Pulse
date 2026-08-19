import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { useSettings, useUpdateSettings } from "@/services/settings.service";
function TimerSettings() {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const [open, setOpen] = useState(false);
  if (!settings) return null;
  const set = (patch) => updateSettings.mutate(patch);
  return <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
    variant="ghost"
    size="icon"
    className="rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300"
    aria-label="Timer settings"
  >
          <Settings className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gray-800 border-gray-700 text-gray-100 p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Timer Settings</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400" onClick={() => setOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Focus Time</span>
            <span className="font-mono text-white">{settings.focusDuration} min</span>
          </div>
          <Slider
    value={[settings.focusDuration]}
    onValueChange={(v) => set({ focusDuration: v[0] })}
    min={5}
    max={60}
    step={5}
  />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Break Time</span>
            <span className="font-mono text-white">{settings.breakDuration} min</span>
          </div>
          <Slider
    value={[settings.breakDuration]}
    onValueChange={(v) => set({ breakDuration: v[0] })}
    min={1}
    max={15}
    step={1}
  />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Long Break</span>
            <span className="font-mono text-white">{settings.longBreakDuration} min</span>
          </div>
          <Slider
    value={[settings.longBreakDuration]}
    onValueChange={(v) => set({ longBreakDuration: v[0] })}
    min={10}
    max={30}
    step={5}
  />
        </div>

        <div className="pt-2 border-t border-gray-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Sound Alerts</span>
            <Switch
    checked={settings.soundEnabled}
    onCheckedChange={(c) => set({ soundEnabled: c })}
    className="data-[state=checked]:bg-green-500"
  />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Web Notifications</span>
            <Switch
    checked={settings.notificationsEnabled}
    onCheckedChange={(c) => set({ notificationsEnabled: c })}
    className="data-[state=checked]:bg-green-500"
  />
          </div>
        </div>
      </PopoverContent>
    </Popover>;
}
export {
  TimerSettings
};
