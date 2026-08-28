import { Settings, X, Bell, Volume2 } from "lucide-react";
import { useState } from "react";
import { useSettings, useUpdateSettings } from "@/services/settings.service";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

function TimerSettings() {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const [open, setOpen] = useState(false);

  if (!settings) return null;
  const set = (patch) => updateSettings.mutate(patch);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-[4px] border border-border/80 bg-surface text-muted-foreground hover:text-greptile-green hover:border-greptile-green/50 hover:bg-greptile-green/5 transition-all cursor-pointer"
        aria-label="Timer settings"
        title="Timer Options"
      >
        <Settings className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-[8px] p-6 bg-surface-elevated border border-border shadow-2xl animate-scale-in space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-greptile-green" />
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-foreground">
                  Timer Configuration
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-[3px] text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Duration Sliders */}
            <div className="space-y-4 rounded-[6px] p-4 bg-surface border border-border/60">
              {/* Focus Duration */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground uppercase">FOCUS DURATION</span>
                  <span className="text-greptile-green font-bold">{settings.focusDuration} MINS</span>
                </div>
                <input
                  type="range" min="5" max="90" step="5"
                  value={settings.focusDuration}
                  onChange={(e) => set({ focusDuration: Number(e.target.value) })}
                  className="w-full accent-greptile-green cursor-pointer"
                />
              </div>

              {/* Short Break */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground uppercase">SHORT BREAK</span>
                  <span className="text-sky font-bold">{settings.breakDuration} MINS</span>
                </div>
                <input
                  type="range" min="1" max="15" step="1"
                  value={settings.breakDuration}
                  onChange={(e) => set({ breakDuration: Number(e.target.value) })}
                  className="w-full accent-sky cursor-pointer"
                />
              </div>

              {/* Long Break */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground uppercase">LONG BREAK</span>
                  <span className="text-lavender font-bold">{settings.longBreakDuration} MINS</span>
                </div>
                <input
                  type="range" min="10" max="45" step="5"
                  value={settings.longBreakDuration}
                  onChange={(e) => set({ longBreakDuration: Number(e.target.value) })}
                  className="w-full accent-lavender cursor-pointer"
                />
              </div>

              {/* Sessions until long break */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground uppercase">POMOS PER LONG BREAK</span>
                  <span className="text-neon font-bold">{settings.sessionsUntilLongBreak} CYCLES</span>
                </div>
                <input
                  type="range" min="2" max="8" step="1"
                  value={settings.sessionsUntilLongBreak}
                  onChange={(e) => set({ sessionsUntilLongBreak: Number(e.target.value) })}
                  className="w-full accent-neon cursor-pointer"
                />
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-[4px] border border-border/60 bg-surface">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-greptile-green" />
                  <span className="text-xs font-sans text-foreground font-medium">Audio Completion Chime</span>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(c) => set({ soundEnabled: c })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-[4px] border border-border/60 bg-surface">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-sky" />
                  <span className="text-xs font-sans text-foreground font-medium">Desktop Web Notifications</span>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(c) => set({ notificationsEnabled: c })}
                />
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2 border-t border-border/40">
              <Button
                variant="default"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Apply & Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { TimerSettings };
