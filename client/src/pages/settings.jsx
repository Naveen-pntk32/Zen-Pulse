import { Moon, Sun, Database, Bell, Volume2, Timer as TimerIcon, Target, Sliders, Shield } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/services/settings.service";
import { useAuth } from "@/hooks/use-auth";
import { TIME_GOAL_OPTIONS } from "@/lib/defaults";
import { applyTheme } from "@/contexts/theme";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

function SectionCard({ title, icon, children }) {
  return (
    <div
      className="rounded-[8px] p-5 sm:p-6 bg-surface-raised border border-border/80 shadow-md space-y-4"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-border/40">
        {icon}
        <h2 className="text-xs font-bold font-display uppercase tracking-wider text-foreground">
          {title}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const { backend } = useAuth();

  if (!settings) return null;
  const set = (patch) => updateSettings.mutate(patch);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2.5 text-foreground">
            <Sliders className="w-5 h-5 text-greptile-green" />
            System Preferences
          </h1>
          <span className="badge-tech badge-tech-green">
            CONFIG OK
          </span>
        </div>
        <p className="text-xs font-sans text-muted-foreground mt-1">
          Customize timers, notification thresholds, appearance, and backend sync parameters.
        </p>
      </div>

      {/* Timer Settings */}
      <SectionCard title="Timer Durations" icon={<TimerIcon className="w-4 h-4 text-greptile-green" />}>
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

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground uppercase">CYCLES UNTIL LONG BREAK</span>
            <span className="text-neon font-bold">{settings.sessionsUntilLongBreak} CYCLES</span>
          </div>
          <input
            type="range" min="2" max="8" step="1"
            value={settings.sessionsUntilLongBreak}
            onChange={(e) => set({ sessionsUntilLongBreak: Number(e.target.value) })}
            className="w-full accent-neon cursor-pointer"
          />
        </div>
      </SectionCard>

      {/* Daily Focus Goal */}
      <SectionCard title="Daily Focus Target" icon={<Target className="w-4 h-4 text-neon" />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs font-sans text-muted-foreground">
            Target duration benchmark used for achievement calculation and automated habit triggers.
          </div>
          <select
            value={String(settings.dailyFocusGoalSeconds)}
            onChange={(e) => set({ dailyFocusGoalSeconds: Number(e.target.value) })}
            className="w-full sm:w-48 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-[4px] bg-surface border border-input-border text-foreground outline-none focus:border-greptile-green cursor-pointer"
          >
            {TIME_GOAL_OPTIONS.map((opt) => (
              <option key={opt.seconds} value={String(opt.seconds)}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notification Protocols" icon={<Bell className="w-4 h-4 text-sky" />}>
        <div className="flex items-center justify-between p-3 rounded-[4px] border border-border/60 bg-surface">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-4 h-4 text-greptile-green" />
            <span className="text-xs font-sans font-medium text-foreground">Sound Alert Upon Completion</span>
          </div>
          <Switch
            checked={settings.soundEnabled}
            onCheckedChange={(c) => set({ soundEnabled: c })}
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-[4px] border border-border/60 bg-surface">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-sky" />
            <span className="text-xs font-sans font-medium text-foreground">Desktop Browser Notifications</span>
          </div>
          <Switch
            checked={settings.notificationsEnabled}
            onCheckedChange={(c) => set({ notificationsEnabled: c })}
          />
        </div>
      </SectionCard>

      {/* Appearance */}
      <SectionCard title="Visual Theme" icon={<Moon className="w-4 h-4 text-lavender" />}>
        <div className="flex items-center justify-between p-3 rounded-[4px] border border-border/60 bg-surface">
          <div className="flex items-center gap-2.5">
            {settings.theme === "light" ? (
              <Sun className="w-4 h-4 text-neon" />
            ) : (
              <Moon className="w-4 h-4 text-lavender" />
            )}
            <span className="text-xs font-sans font-medium text-foreground">
              {settings.theme === "light" ? "Light Mode Active" : "Dark Obsidian Theme Active"}
            </span>
          </div>
          <Switch
            checked={settings.theme === "dark"}
            onCheckedChange={(c) => {
              applyTheme(c ? "dark" : "light");
              set({ theme: c ? "dark" : "light" });
            }}
          />
        </div>
      </SectionCard>

      {/* Data / Storage Mode */}
      <SectionCard title="Storage & Persistence" icon={<Database className="w-4 h-4 text-greptile-green" />}>
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-muted-foreground uppercase">CURRENT STORAGE ENGINE</span>
          <span className="badge-tech badge-tech-green">
            {backend === "supabase" ? "SUPABASE (CLOUD SYNC)" : "LOCALSTORAGE (OFFLINE)"}
          </span>
        </div>
        <p className="text-xs font-sans text-muted-foreground">
          {backend === "supabase"
            ? "Your workspace is securely synced to Supabase cloud storage."
            : "Sign in via Profile to enable cross-device cloud synchronization."}
        </p>
      </SectionCard>
    </div>
  );
}

export { SettingsPage as default };
