import { Settings, X } from "lucide-react";
import { useState } from "react";
import { useSettings, useUpdateSettings } from "@/services/settings.service";
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
        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--surface-hover)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
        aria-label="Timer settings"
      >
        <Settings className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 animate-slide-up"
            style={{
              background: "var(--surface-raised)",
              border:     "1px solid var(--border-strong)",
              boxShadow:  "var(--shadow-modal)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                Timer Settings
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--surface-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Focus Time */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>Focus Time</span>
                  <span className="font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                    {settings.focusDuration} min
                  </span>
                </div>
                <input
                  type="range"
                  min="5" max="60" step="5"
                  value={settings.focusDuration}
                  onChange={(e) => set({ focusDuration: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                  style={{ accentColor: "var(--brand-blue)" }}
                />
              </div>

              {/* Break Time */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>Break Time</span>
                  <span className="font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                    {settings.breakDuration} min
                  </span>
                </div>
                <input
                  type="range"
                  min="1" max="15" step="1"
                  value={settings.breakDuration}
                  onChange={(e) => set({ breakDuration: Number(e.target.value) })}
                  className="w-full"
                  style={{ accentColor: "var(--brand-blue)" }}
                />
              </div>

              {/* Long Break */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>Long Break</span>
                  <span className="font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                    {settings.longBreakDuration} min
                  </span>
                </div>
                <input
                  type="range"
                  min="10" max="30" step="5"
                  value={settings.longBreakDuration}
                  onChange={(e) => set({ longBreakDuration: Number(e.target.value) })}
                  className="w-full"
                  style={{ accentColor: "var(--brand-blue)" }}
                />
              </div>

              <div className="pt-4 border-t space-y-4" style={{ borderColor: "var(--border)" }}>
                {/* Sound Alerts */}
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Sound Alerts
                  </span>
                  <div
                    className={cn(
                      "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out",
                      settings.soundEnabled ? "bg-brand" : "bg-zp-surface border border-zp"
                    )}
                    style={{
                      background: settings.soundEnabled ? "var(--brand-blue)" : "var(--surface)",
                      borderColor: settings.soundEnabled ? "transparent" : "var(--border-strong)",
                    }}
                    onClick={() => set({ soundEnabled: !settings.soundEnabled })}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm",
                        settings.soundEnabled ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </div>
                </label>

                {/* Web Notifications */}
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Web Notifications
                  </span>
                  <div
                    className={cn(
                      "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out",
                      settings.notificationsEnabled ? "bg-brand" : "bg-zp-surface border border-zp"
                    )}
                    style={{
                      background: settings.notificationsEnabled ? "var(--brand-blue)" : "var(--surface)",
                      borderColor: settings.notificationsEnabled ? "transparent" : "var(--border-strong)",
                    }}
                    onClick={() => set({ notificationsEnabled: !settings.notificationsEnabled })}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm",
                        settings.notificationsEnabled ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </div>
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="btn-pill btn-primary px-5 py-2 text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { TimerSettings };
