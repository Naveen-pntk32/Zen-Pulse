import { eq } from "drizzle-orm";
import { getDb } from "../config/database.js";
import {
  taskLists,
  tasks,
  habits,
  habitCompletions,
  focusSessions,
  userSettings,
} from "../db/schema.js";

export const migrateService = {
  async importUserData(userId: string, data: {
    taskLists?: any[];
    tasks?: any[];
    habits?: any[];
    habitCompletions?: any[];
    focusSessions?: any[];
    settings?: any;
  }) {
    const db = getDb();
    let importedTaskLists = 0;
    let importedTasks = 0;
    let importedHabits = 0;
    let importedCompletions = 0;
    let importedSessions = 0;
    let settingsUpdated = false;

    // 1. Task Lists
    if (Array.isArray(data.taskLists) && data.taskLists.length > 0) {
      for (const l of data.taskLists) {
        if (!l.name) continue;
        try {
          await db
            .insert(taskLists)
            .values({
              id: l.id,
              userId,
              name: l.name,
              icon: l.icon || "📋",
              color: l.color || "#6366f1",
              sortOrder: l.sortOrder ?? 0,
              createdAt: l.createdAt ? new Date(l.createdAt) : new Date(),
            })
            .onConflictDoNothing();
          importedTaskLists++;
        } catch (e) {
          // ignore duplicate
        }
      }
    }

    // 2. Tasks
    if (Array.isArray(data.tasks) && data.tasks.length > 0) {
      for (const t of data.tasks) {
        if (!t.title) continue;
        try {
          await db
            .insert(tasks)
            .values({
              id: t.id,
              userId,
              title: t.title,
              description: t.description || null,
              taskListId: t.taskListId || null,
              status: t.status || "pending",
              priority: t.priority || "medium",
              dueDate: t.dueDate || null,
              dueTime: t.dueTime || null,
              completedAt: t.completedAt ? new Date(t.completedAt) : null,
              createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
            })
            .onConflictDoNothing();
          importedTasks++;
        } catch (e) {
          // ignore duplicate
        }
      }
    }

    // 3. Habits
    if (Array.isArray(data.habits) && data.habits.length > 0) {
      for (const h of data.habits) {
        if (!h.name) continue;
        try {
          await db
            .insert(habits)
            .values({
              id: h.id,
              userId,
              name: h.name,
              icon: h.icon || "😊",
              frequency: h.frequency || "daily",
              goalType: h.goalType || "simple",
              dailyGoalSeconds: h.dailyGoalSeconds ?? 0,
              startDate: h.startDate || null,
              goalDays: h.goalDays ?? null,
              section: h.section || "others",
              reminder: h.reminder || null,
              autoPopup: h.autoPopup ?? false,
              archived: h.archived ?? false,
              createdAt: h.createdAt ? new Date(h.createdAt) : new Date(),
            })
            .onConflictDoNothing();
          importedHabits++;
        } catch (e) {
          // ignore duplicate
        }
      }
    }

    // 4. Habit Completions
    if (Array.isArray(data.habitCompletions) && data.habitCompletions.length > 0) {
      for (const c of data.habitCompletions) {
        if (!c.habitId || !c.date) continue;
        try {
          await db
            .insert(habitCompletions)
            .values({
              id: c.id,
              habitId: c.habitId,
              userId,
              date: c.date,
              completed: c.completed ?? false,
              completedAutomatically: c.completedAutomatically ?? false,
              actualFocusSeconds: c.actualFocusSeconds ?? 0,
              completedAt: c.completedAt ? new Date(c.completedAt) : null,
              createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
            })
            .onConflictDoNothing();
          importedCompletions++;
        } catch (e) {
          // ignore duplicate
        }
      }
    }

    // 5. Focus Sessions
    if (Array.isArray(data.focusSessions) && data.focusSessions.length > 0) {
      for (const s of data.focusSessions) {
        if (!s.startedAt || !s.date) continue;
        try {
          await db
            .insert(focusSessions)
            .values({
              id: s.id,
              userId,
              type: s.type || "pomodoro",
              targetType: s.targetType || null,
              targetId: s.targetId || null,
              targetName: s.targetName || "",
              durationSeconds: s.durationSeconds ?? 0,
              plannedDurationSeconds: s.plannedDurationSeconds ?? null,
              startedAt: new Date(s.startedAt),
              endedAt: s.endedAt ? new Date(s.endedAt) : null,
              status: s.status || "completed",
              date: s.date,
              createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
            })
            .onConflictDoNothing();
          importedSessions++;
        } catch (e) {
          // ignore duplicate
        }
      }
    }

    // 6. User Settings
    if (data.settings && Object.keys(data.settings).length > 0) {
      const s = data.settings;
      try {
        await db
          .insert(userSettings)
          .values({
            userId,
            focusDuration: s.focusDuration ?? 25,
            breakDuration: s.breakDuration ?? 5,
            longBreakDuration: s.longBreakDuration ?? 15,
            sessionsUntilLongBreak: s.sessionsUntilLongBreak ?? 4,
            soundEnabled: s.soundEnabled ?? true,
            notificationsEnabled: s.notificationsEnabled ?? true,
            dailyFocusGoalSeconds: s.dailyFocusGoalSeconds ?? 10800,
            theme: s.theme || "dark",
          })
          .onConflictDoNothing();
        settingsUpdated = true;
      } catch (e) {
        // ignore
      }
    }

    return {
      success: true,
      stats: {
        importedTaskLists,
        importedTasks,
        importedHabits,
        importedCompletions,
        importedSessions,
        settingsUpdated,
      },
    };
  },
};
