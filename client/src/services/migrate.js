import supabase from "@/config/supabase";
import { localDb } from "@/lib/local-db";
import { getBackend, makeId } from "@/lib/backend";
async function migrateLocalToSupabase(userId) {
  if (getBackend() !== "supabase") return;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const localLists = localDb.getTaskLists();
  if (localLists.length > 0) {
    const { data } = await supabase.from("task_lists").select("id").limit(1);
    if (!data || data.length === 0) {
      await supabase.from("task_lists").insert(
        localLists.map((l) => ({
          id: l.id,
          user_id: userId,
          name: l.name,
          icon: l.icon,
          color: l.color,
          sort_order: l.sortOrder,
          created_at: l.createdAt
        }))
      );
    }
  }
  const localTasks = localDb.getTasks();
  if (localTasks.length > 0) {
    const { data } = await supabase.from("tasks").select("id").limit(1);
    if (!data || data.length === 0) {
      await supabase.from("tasks").insert(
        localTasks.map((t) => ({
          id: t.id,
          user_id: userId,
          title: t.title,
          description: t.description ?? null,
          task_list_id: t.taskListId ?? null,
          status: t.status,
          priority: t.priority ?? "medium",
          due_date: t.dueDate ?? null,
          due_time: t.dueTime ?? null,
          completed_at: t.completedAt ?? null,
          created_at: t.createdAt
        }))
      );
    }
  }
  const localHabits = localDb.getHabits();
  if (localHabits.length > 0) {
    const { data } = await supabase.from("habits").select("id").limit(1);
    if (!data || data.length === 0) {
      await supabase.from("habits").insert(
        localHabits.map((h) => ({
          id: h.id,
          user_id: userId,
          name: h.name,
          icon: h.icon,
          frequency: h.frequency,
          goal_type: h.goalType,
          daily_goal_seconds: h.dailyGoalSeconds,
          start_date: h.startDate,
          goal_days: h.goalDays,
          section: h.section,
          reminder: h.reminder,
          auto_popup: h.autoPopup,
          archived: h.archived,
          created_at: h.createdAt
        }))
      );
    }
  }
  const localCompletions = localDb.getHabitCompletions();
  if (localCompletions.length > 0) {
    const { data } = await supabase.from("habit_completions").select("id").limit(1);
    if (!data || data.length === 0) {
      await supabase.from("habit_completions").insert(
        localCompletions.map((c) => ({
          id: c.id,
          habit_id: c.habitId,
          user_id: userId,
          date: c.date,
          completed: c.completed,
          completed_automatically: c.completedAutomatically,
          actual_focus_seconds: c.actualFocusSeconds,
          completed_at: c.completedAt,
          created_at: c.createdAt
        }))
      );
    }
  }
  const localSessions = localDb.getFocusSessions();
  if (localSessions.length > 0) {
    const { data } = await supabase.from("focus_sessions").select("id").limit(1);
    if (!data || data.length === 0) {
      await supabase.from("focus_sessions").insert(
        localSessions.map((s) => ({
          id: s.id,
          user_id: userId,
          type: s.type,
          target_type: s.targetType,
          target_id: s.targetId,
          target_name: s.targetName,
          duration_seconds: s.durationSeconds,
          planned_duration_seconds: s.plannedDurationSeconds,
          started_at: s.startedAt,
          ended_at: s.endedAt,
          status: s.status,
          date: s.date,
          created_at: s.createdAt
        }))
      );
    }
  }
  const localSettings = localDb.getSettings();
  if (localSettings && Object.keys(localSettings).length > 0) {
    const { data } = await supabase.from("user_settings").select("id").limit(1);
    if (!data || data.length === 0) {
      await supabase.from("user_settings").insert({
        id: makeId(),
        user_id: userId,
        focus_duration: localSettings.focusDuration ?? 25,
        break_duration: localSettings.breakDuration ?? 5,
        long_break_duration: localSettings.longBreakDuration ?? 15,
        sessions_until_long_break: localSettings.sessionsUntilLongBreak ?? 4,
        sound_enabled: localSettings.soundEnabled ?? true,
        notifications_enabled: localSettings.notificationsEnabled ?? true,
        daily_focus_goal_seconds: localSettings.dailyFocusGoalSeconds ?? 10800,
        theme: localSettings.theme ?? "dark"
      });
    }
  }
  localDb.setTaskLists([]);
  localDb.setTasks([]);
  localDb.setHabits([]);
  localDb.setHabitCompletions([]);
  localDb.setFocusSessions([]);
  localDb.setSettings({});
}
export {
  migrateLocalToSupabase
};
