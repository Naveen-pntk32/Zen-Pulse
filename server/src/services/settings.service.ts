import { eq } from "drizzle-orm";
import { getDb } from "../config/database.js";
import { userSettings } from "../db/schema.js";

export const DEFAULT_SETTINGS = {
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  soundEnabled: true,
  notificationsEnabled: true,
  dailyFocusGoalSeconds: 10800,
  theme: "dark",
};

export const settingsService = {
  async get(userId: string) {
    const db = getDb();
    const [row] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    if (!row) return DEFAULT_SETTINGS;

    return {
      focusDuration: row.focusDuration ?? DEFAULT_SETTINGS.focusDuration,
      breakDuration: row.breakDuration ?? DEFAULT_SETTINGS.breakDuration,
      longBreakDuration: row.longBreakDuration ?? DEFAULT_SETTINGS.longBreakDuration,
      sessionsUntilLongBreak: row.sessionsUntilLongBreak ?? DEFAULT_SETTINGS.sessionsUntilLongBreak,
      soundEnabled: row.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled,
      notificationsEnabled: row.notificationsEnabled ?? DEFAULT_SETTINGS.notificationsEnabled,
      dailyFocusGoalSeconds: row.dailyFocusGoalSeconds ?? DEFAULT_SETTINGS.dailyFocusGoalSeconds,
      theme: row.theme ?? DEFAULT_SETTINGS.theme,
    };
  },

  async update(userId: string, patch: any) {
    const db = getDb();
    const updateValues: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (patch.focusDuration !== undefined) updateValues.focusDuration = patch.focusDuration;
    if (patch.breakDuration !== undefined) updateValues.breakDuration = patch.breakDuration;
    if (patch.longBreakDuration !== undefined) updateValues.longBreakDuration = patch.longBreakDuration;
    if (patch.sessionsUntilLongBreak !== undefined) updateValues.sessionsUntilLongBreak = patch.sessionsUntilLongBreak;
    if (patch.soundEnabled !== undefined) updateValues.soundEnabled = patch.soundEnabled;
    if (patch.notificationsEnabled !== undefined) updateValues.notificationsEnabled = patch.notificationsEnabled;
    if (patch.dailyFocusGoalSeconds !== undefined) updateValues.dailyFocusGoalSeconds = patch.dailyFocusGoalSeconds;
    if (patch.theme !== undefined) updateValues.theme = patch.theme;

    const [result] = await db
      .insert(userSettings)
      .values({
        userId,
        ...DEFAULT_SETTINGS,
        ...updateValues,
      })
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: updateValues,
      })
      .returning();

    return {
      focusDuration: result.focusDuration ?? DEFAULT_SETTINGS.focusDuration,
      breakDuration: result.breakDuration ?? DEFAULT_SETTINGS.breakDuration,
      longBreakDuration: result.longBreakDuration ?? DEFAULT_SETTINGS.longBreakDuration,
      sessionsUntilLongBreak: result.sessionsUntilLongBreak ?? DEFAULT_SETTINGS.sessionsUntilLongBreak,
      soundEnabled: result.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled,
      notificationsEnabled: result.notificationsEnabled ?? DEFAULT_SETTINGS.notificationsEnabled,
      dailyFocusGoalSeconds: result.dailyFocusGoalSeconds ?? DEFAULT_SETTINGS.dailyFocusGoalSeconds,
      theme: result.theme ?? DEFAULT_SETTINGS.theme,
    };
  },

  async ensureDefaults(userId: string) {
    return this.get(userId);
  },
};
