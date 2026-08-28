import { Moon, Sun, Database, Bell, Volume2, Timer as TimerIcon, Target } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/services/settings.service";
import { useAuth } from "@/hooks/use-auth";
import { TIME_GOAL_OPTIONS } from "@/lib/defaults";
import { applyTheme } from "@/contexts/theme";
import { cn } from "@/lib/utils";

function SectionCard({ title, icon, children }) {
  return (
    <div
      className="rounded-3xl p-6 lg:p-8"
      style={{
        background: "var(--surface-raised)",
        border:     "1px solid var(--border)",
      }}
    >
      <h2
        className="flex items-center gap-2.5 text-[15px] uppercase tracking-widest font-semibold mb-6 pb-4 border-b"
        style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}
      >
        {icon}
        {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const { backend } = useAuth();

  if (!settings) return null;
  const set = (patch) => updateSettings.mutate(patch);

  const Toggle = ({ checked, onChange }) => (
    <div
      className="w-10 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer"
      style={{
        background:  checked ? "var(--brand-blue)" : "var(--surface)",
        border:      checked ? "1px solid transparent" : "1px solid var(--border-strong)",
      }}
      onClick={() => onChange(!checked)}
    >
      <div
        className={cn(
          "w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Manage your preferences and focus configuration
        </p>
      </div>

      {/* Timer Settings */}
      <SectionCard title="Timer" icon={<TimerIcon className="w-5 h-5" style={{ color: "var(--brand-blue)" }} />}>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: "var(--text-primary)" }}>Focus Time</span>
            <span className="font-mono font-medium" style={{ color: "var(--text-secondary)" }}>
              {settings.focusDuration} min
            </span>
          </div>
          <input
            type="range" min="5" max="60" step="5"
            value={settings.focusDuration}
            onChange={(e) => set({ focusDuration: Number(e.target.value) })}
            className="w-full"
            style={{ accentColor: "var(--brand-blue)" }}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: "var(--text-primary)" }}>Break Time</span>
            <span className="font-mono font-medium" style={{ color: "var(--text-secondary)" }}>
              {settings.breakDuration} min
            </span>
          </div>
          <input
            type="range" min="1" max="15" step="1"
            value={settings.breakDuration}
            onChange={(e) => set({ breakDuration: Number(e.target.value) })}
            className="w-full"
            style={{ accentColor: "var(--brand-blue)" }}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: "var(--text-primary)" }}>Long Break</span>
            <span className="font-mono font-medium" style={{ color: "var(--text-secondary)" }}>
              {settings.longBreakDuration} min
            </span>
          </div>
          <input
            type="range" min="10" max="30" step="5"
            value={settings.longBreakDuration}
            onChange={(e) => set({ longBreakDuration: Number(e.target.value) })}
            className="w-full"
            style={{ accentColor: "var(--brand-blue)" }}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: "var(--text-primary)" }}>Sessions until Long Break</span>
            <span className="font-mono font-medium" style={{ color: "var(--text-secondary)" }}>
              {settings.sessionsUntilLongBreak}
            </span>
          </div>
          <input
            type="range" min="2" max="6" step="1"
            value={settings.sessionsUntilLongBreak}
            onChange={(e) => set({ sessionsUntilLongBreak: Number(e.target.value) })}
            className="w-full"
            style={{ accentColor: "var(--brand-blue)" }}
          />
        </div>
      </SectionCard>

      {/* Daily Goal */}
      <SectionCard title="Daily Focus Goal" icon={<Target className="w-5 h-5" style={{ color: "var(--brand-amber)" }} />}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-[13px] font-medium" style={{ color: "var(--text-muted)" }}>
            Daily goal used for achievement tracking and auto check-in.
          </div>
          <select
            value={String(settings.dailyFocusGoalSeconds)}
            onChange={(e) => set({ dailyFocusGoalSeconds: Number(e.target.value) })}
            className="w-full sm:w-48 px-3.5 py-2.5 text-[13px] font-medium rounded-xl outline-none cursor-pointer"
            style={{
              background: "var(--surface)",
              border:     "1px solid var(--border-strong)",
              color:      "var(--text-primary)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--brand-blue)")}
            onBlur={(e)  => (e.target.style.borderColor = "var(--border-strong)")}
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
      <SectionCard title="Notifications" icon={<Bell className="w-5 h-5" style={{ color: "#38bdf8" }} />}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[15px] font-medium" style={{ color: "var(--text-primary)" }}>
            <Volume2 className="w-4 h-4" style={{ color: "var(--text-muted)" }} /> Sound Alerts
          </span>
          <Toggle
            checked={settings.soundEnabled}
            onChange={(c) => set({ soundEnabled: c })}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[15px] font-medium" style={{ color: "var(--text-primary)" }}>
            <Bell className="w-4 h-4" style={{ color: "var(--text-muted)" }} /> Web Notifications
          </span>
          <Toggle
            checked={settings.notificationsEnabled}
            onChange={(c) => set({ notificationsEnabled: c })}
          />
        </div>
      </SectionCard>

      {/* Appearance */}
      <SectionCard title="Appearance" icon={<Moon className="w-5 h-5" style={{ color: "#a78bfa" }} />}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[15px] font-medium" style={{ color: "var(--text-primary)" }}>
            {settings.theme === "light" ? (
              <Sun className="w-4 h-4" style={{ color: "var(--brand-amber)" }} />
            ) : (
              <Moon className="w-4 h-4" style={{ color: "#a78bfa" }} />
            )}
            Dark Mode
          </span>
          <Toggle
            checked={settings.theme === "dark"}
            onChange={(c) => {
              applyTheme(c ? "dark" : "light");
              set({ theme: c ? "dark" : "light" });
            }}
          />
        </div>
      </SectionCard>

      {/* Data */}
      <SectionCard title="Data" icon={<Database className="w-5 h-5" style={{ color: "#4ade80" }} />}>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>Storage mode</span>
          <span className="flex items-center gap-1.5 font-medium px-3 py-1 rounded-lg" style={{ background: "var(--surface)", color: "var(--text-secondary)" }}>
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: backend === "supabase" ? "#4ade80" : "var(--brand-amber)" }}
            />
            {backend === "supabase" ? "Supabase (cloud sync)" : "Local storage"}
          </span>
        </div>
        <p className="text-[13px] mt-2" style={{ color: "var(--text-muted)" }}>
          {backend === "supabase"
            ? "Your data is synced to the cloud and available across devices."
            : "Sign in from your profile to enable cloud sync. Local data is lost when you clear browser data."}
        </p>
      </SectionCard>
    </div>
  );
}

export { SettingsPage as default };
