import supabase from '@/config/supabase';
import { localDb } from '@/lib/local-db';
import { getBackend, getCurrentUserIdSync, makeId } from '@/lib/backend';
import { UserSettings } from '@/types';
import { DEFAULT_USER_SETTINGS } from '@/lib/defaults';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function mapRow(row: any): UserSettings {
  return {
    focusDuration: row.focus_duration ?? DEFAULT_USER_SETTINGS.focusDuration,
    breakDuration: row.break_duration ?? DEFAULT_USER_SETTINGS.breakDuration,
    longBreakDuration: row.long_break_duration ?? DEFAULT_USER_SETTINGS.longBreakDuration,
    sessionsUntilLongBreak: row.sessions_until_long_break ?? DEFAULT_USER_SETTINGS.sessionsUntilLongBreak,
    soundEnabled: row.sound_enabled ?? DEFAULT_USER_SETTINGS.soundEnabled,
    notificationsEnabled: row.notifications_enabled ?? DEFAULT_USER_SETTINGS.notificationsEnabled,
    dailyFocusGoalSeconds: row.daily_focus_goal_seconds ?? DEFAULT_USER_SETTINGS.dailyFocusGoalSeconds,
    theme: row.theme ?? DEFAULT_USER_SETTINGS.theme,
  };
}

export const settingsService = {
  async get(): Promise<UserSettings> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase.from('user_settings').select('*').maybeSingle();
      if (error) throw error;
      return data ? mapRow(data) : DEFAULT_USER_SETTINGS;
    }
    const local = localDb.getSettings();
    return local && Object.keys(local).length > 0
      ? { ...DEFAULT_USER_SETTINGS, ...local }
      : DEFAULT_USER_SETTINGS;
  },

  async update(patch: Partial<UserSettings>): Promise<UserSettings> {
    if (getBackend() === 'supabase') {
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          focus_duration: patch.focusDuration,
          break_duration: patch.breakDuration,
          long_break_duration: patch.longBreakDuration,
          sessions_until_long_break: patch.sessionsUntilLongBreak,
          sound_enabled: patch.soundEnabled,
          notifications_enabled: patch.notificationsEnabled,
          daily_focus_goal_seconds: patch.dailyFocusGoalSeconds,
          theme: patch.theme,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return mapRow(data);
    }
    const current = await this.get();
    const next = { ...current, ...patch };
    localDb.setSettings(next);
    return next;
  },

  async ensureDefaults(userId: string | null): Promise<UserSettings> {
    const existing = await this.get();
    const hasAny = existing && Object.keys(existing).some((k) => (existing as any)[k] !== undefined);
    if (hasAny) return existing;
    if (getBackend() === 'supabase' && userId) {
      await supabase.from('user_settings').upsert({
        user_id: userId,
        id: makeId(),
        focus_duration: DEFAULT_USER_SETTINGS.focusDuration,
        break_duration: DEFAULT_USER_SETTINGS.breakDuration,
        long_break_duration: DEFAULT_USER_SETTINGS.longBreakDuration,
        sessions_until_long_break: DEFAULT_USER_SETTINGS.sessionsUntilLongBreak,
        sound_enabled: DEFAULT_USER_SETTINGS.soundEnabled,
        notifications_enabled: DEFAULT_USER_SETTINGS.notificationsEnabled,
        daily_focus_goal_seconds: DEFAULT_USER_SETTINGS.dailyFocusGoalSeconds,
        theme: DEFAULT_USER_SETTINGS.theme,
      });
      return this.get();
    }
    localDb.setSettings(DEFAULT_USER_SETTINGS);
    return DEFAULT_USER_SETTINGS;
  },
};

export function useSettings() {
  return useQuery({ queryKey: ['settings'], queryFn: settingsService.get });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useEnsureSettings() {
  return useQuery({
    queryKey: ['settings', 'ensure', getCurrentUserIdSync() ?? 'local'],
    queryFn: () => settingsService.ensureDefaults(getCurrentUserIdSync() ?? null),
  });
}
