import { api } from "@/lib/api";
import { localDb } from "@/lib/local-db";
import { getBackend } from "@/lib/backend";

async function migrateLocalToSupabase(userId) {
  if (getBackend() === "local" || !userId) return;

  const localLists = localDb.getTaskLists();
  const localTasks = localDb.getTasks();
  const localHabits = localDb.getHabits();
  const localCompletions = localDb.getHabitCompletions();
  const localSessions = localDb.getFocusSessions();
  const localSettings = localDb.getSettings();

  const hasData =
    localLists.length > 0 ||
    localTasks.length > 0 ||
    localHabits.length > 0 ||
    localCompletions.length > 0 ||
    localSessions.length > 0 ||
    (localSettings && Object.keys(localSettings).length > 0);

  if (!hasData) return;

  try {
    const payload = {
      taskLists: localLists,
      tasks: localTasks,
      habits: localHabits,
      habitCompletions: localCompletions,
      focusSessions: localSessions,
      settings: localSettings,
    };

    const res = await api.post("/migrate", payload);

    if (res?.success) {
      console.log("[Migration] Successfully migrated local data to PostgreSQL:", res.stats);
      localDb.setTaskLists([]);
      localDb.setTasks([]);
      localDb.setHabits([]);
      localDb.setHabitCompletions([]);
      localDb.setFocusSessions([]);
      localDb.setSettings({});
    }
  } catch (error) {
    console.warn("[Migration] Local data migration to backend failed. Preserving local data:", error);
  }
}

export {
  migrateLocalToSupabase,
};
