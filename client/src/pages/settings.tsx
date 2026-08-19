import { Moon, Sun, Database, Bell, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings, useUpdateSettings } from '@/services/settings.service';
import { useAuth } from '@/hooks/use-auth';
import { TIME_GOAL_OPTIONS } from '@/lib/defaults';
import { applyTheme } from '@/contexts/theme';

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-800 rounded-3xl border border-gray-700 p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-5">
        {icon}
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const { backend } = useAuth();

  if (!settings) return null;

  const set = (patch: Parameters<typeof updateSettings.mutate>[0]) => updateSettings.mutate(patch);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your preferences</p>
      </div>

      <SectionCard title="Timer" icon={<TimerIcon />}>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Focus Time</span>
            <span className="font-mono text-white">{settings.focusDuration} min</span>
          </div>
          <Slider value={[settings.focusDuration]} onValueChange={(v) => set({ focusDuration: v[0] })} min={5} max={60} step={5} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Break Time</span>
            <span className="font-mono text-white">{settings.breakDuration} min</span>
          </div>
          <Slider value={[settings.breakDuration]} onValueChange={(v) => set({ breakDuration: v[0] })} min={1} max={15} step={1} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Long Break</span>
            <span className="font-mono text-white">{settings.longBreakDuration} min</span>
          </div>
          <Slider value={[settings.longBreakDuration]} onValueChange={(v) => set({ longBreakDuration: v[0] })} min={10} max={30} step={5} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Sessions until Long Break</span>
            <span className="font-mono text-white">{settings.sessionsUntilLongBreak}</span>
          </div>
          <Slider value={[settings.sessionsUntilLongBreak]} onValueChange={(v) => set({ sessionsUntilLongBreak: v[0] })} min={2} max={6} step={1} />
        </div>
      </SectionCard>

      <SectionCard title="Daily Focus Goal" icon={<TargetIcon />}>
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-gray-300">
            Daily goal used for achievement tracking and auto check-in
          </div>
          <Select
            value={String(settings.dailyFocusGoalSeconds)}
            onValueChange={(v) => set({ dailyFocusGoalSeconds: Number(v) })}
          >
            <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              {TIME_GOAL_OPTIONS.map((opt) => (
                <SelectItem key={opt.seconds} value={String(opt.seconds)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SectionCard>

      <SectionCard title="Notifications" icon={<Bell className="w-5 h-5 text-sky-400" />}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-gray-300">
            <Volume2 className="w-4 h-4 text-gray-400" /> Sound Alerts
          </span>
          <Switch checked={settings.soundEnabled} onCheckedChange={(c) => set({ soundEnabled: c })} className="data-[state=checked]:bg-green-500" />
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-gray-300">
            <Bell className="w-4 h-4 text-gray-400" /> Web Notifications
          </span>
          <Switch checked={settings.notificationsEnabled} onCheckedChange={(c) => set({ notificationsEnabled: c })} className="data-[state=checked]:bg-green-500" />
        </div>
      </SectionCard>

      <SectionCard title="Appearance" icon={<Moon className="w-5 h-5 text-indigo-400" />}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-gray-300">
            {settings.theme === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            Dark Mode
          </span>
          <Switch
            checked={settings.theme === 'dark'}
            onCheckedChange={(c) => {
              applyTheme(c ? 'dark' : 'light');
              set({ theme: c ? 'dark' : 'light' });
            }}
            className="data-[state=checked]:bg-indigo-500"
          />
        </div>
      </SectionCard>

      <SectionCard title="Data" icon={<Database className="w-5 h-5 text-green-400" />}>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Storage mode</span>
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${backend === 'supabase' ? 'bg-green-400' : 'bg-amber-400'}`} />
            {backend === 'supabase' ? 'Supabase (cloud sync)' : 'Local browser storage'}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {backend === 'supabase'
            ? 'Your data is synced to the cloud and available across devices.'
            : 'Sign in from your profile to enable cloud sync.'}
        </p>
      </SectionCard>
    </div>
  );
}

function TimerIcon() {
  return <span className="w-5 h-5 text-red-400">⏱️</span>;
}
function TargetIcon() {
  return <span className="w-5 h-5 text-amber-400">🎯</span>;
}