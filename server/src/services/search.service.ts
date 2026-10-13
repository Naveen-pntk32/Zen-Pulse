import { eq, and, ilike } from "drizzle-orm";
import { getDb } from "../config/database.js";
import { tasks, habits } from "../db/schema.js";

export const searchService = {
  async search(userId: string, query: string) {
    const q = query.trim();
    if (!q) {
      return { tasks: [], habits: [] };
    }

    const db = getDb();
    const searchPattern = `%${q}%`;

    const [userTasks, userHabits] = await Promise.all([
      db
        .select()
        .from(tasks)
        .where(and(eq(tasks.userId, userId), ilike(tasks.title, searchPattern))),
      db
        .select()
        .from(habits)
        .where(and(eq(habits.userId, userId), ilike(habits.name, searchPattern))),
    ]);

    return {
      tasks: userTasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        taskListId: t.taskListId,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        dueTime: t.dueTime,
        completedAt: t.completedAt ? t.completedAt.toISOString() : null,
        createdAt: t.createdAt.toISOString(),
      })),
      habits: userHabits.map((h) => ({
        id: h.id,
        name: h.name,
        icon: h.icon,
        frequency: h.frequency,
        goalType: h.goalType,
        dailyGoalSeconds: h.dailyGoalSeconds,
        startDate: h.startDate,
        goalDays: h.goalDays,
        section: h.section,
        reminder: h.reminder,
        autoPopup: h.autoPopup,
        archived: h.archived,
        createdAt: h.createdAt.toISOString(),
      })),
    };
  },
};
