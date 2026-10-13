import { api } from "@/lib/api";
import { localDb } from "@/lib/local-db";
import { getBackend, getCurrentUserIdSync } from "@/lib/backend";
import { DEFAULT_USER_SETTINGS } from "@/lib/defaults";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function mapRow(row) {
  return {
    focusDuration: row.focusDuration ?? row.focus_duration ?? DEFAULT_USER_SETTINGS.focusDuration,
    breakDuration: row.breakDuration ?? row.break_duration ?? DEFAULT_USER_SETTINGS.breakDuration,
    longBreakDuration: row.longBreakDuration ?? row.long_break_duration ?? DEFAULT_USER_SETTINGS.longBreakDuration,
    sessionsUntilLongBreak: row.sessionsUntilLongBreak ?? row.sessions_until_long_break ?? DEFAULT_USER_SETTINGS.sessionsUntilLongBreak,
    soundEnabled: row.soundEnabled ?? row.sound_enabled ?? DEFAULT_USER_SETTINGS.soundEnabled,
    notificationsEnabled: row.notificationsEnabled ?? row.notifications_enabled ?? DEFAULT_USER_SETTINGS.notificationsEnabled,
    dailyFocusGoalSeconds: row.dailyFocusGoalSeconds ?? row.daily_focus_goal_seconds ?? DEFAULT_USER_SETTINGS.dailyFocusGoalSeconds,
    theme: row.theme ?? DEFAULT_USER_SETTINGS.theme,
  };
}

const settingsService = {
  async get() {
    if (getBackend() !== "local") {
      try {
        const data = await api.get("/settings");
        return data ? mapRow(data) : DEFAULT_USER_SETTINGS;
      } catch (err) {
        console.warn("[SettingsService] API get failed, falling back to localDb:", err);
      }
    }

    const local = localDb.getSettings();
    return local && Object.keys(local).length > 0 ? { ...DEFAULT_USER_SETTINGS, ...local } : DEFAULT_USER_SETTINGS;
  },

  async update(patch) {
    if (getBackend() !== "local") {
      try {
        const data = await api.patch("/settings", patch);
        return mapRow(data);
      } catch (err) {
        console.warn("[SettingsService] API update failed, falling back to localDb:", err);
      }
    }

    const current = await this.get();
    const next = { ...current, ...patch };
    localDb.setSettings(next);
    return next;
  },

  async ensureDefaults(userId) {
    if (getBackend() !== "local" && userId) {
      try {
        const data = await api.post("/settings/ensure-defaults", {});
        if (data) return mapRow(data);
      } catch (err) {
        console.warn("[SettingsService] API ensureDefaults failed:", err);
      }
    }

    const existing = await this.get();
    const hasAny = existing && Object.keys(existing).some((k) => existing[k] !== undefined);
    if (hasAny) return existing;

    localDb.setSettings(DEFAULT_USER_SETTINGS);
    return DEFAULT_USER_SETTINGS;
  },
};

function useSettings() {
  return useQuery({ queryKey: ["settings"], queryFn: settingsService.get });
}

function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch) => settingsService.update(patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

function useEnsureSettings() {
  return useQuery({
    queryKey: ["settings", "ensure", getCurrentUserIdSync() ?? "local"],
    queryFn: () => settingsService.ensureDefaults(getCurrentUserIdSync() ?? null),
  });
}

export {
  settingsService,
  useEnsureSettings,
  useSettings,
  useUpdateSettings,
};
