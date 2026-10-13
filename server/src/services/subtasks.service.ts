import { eq, and, asc } from "drizzle-orm";
import { getDb } from "../config/database.js";
import { tasks, subtasks } from "../db/schema.js";

export const subtasksService = {
  async getByTaskId(userId: string, taskId: string) {
    const db = getDb();
    // Verify parent task exists and belongs to user
    const [task] = await db
      .select({ id: tasks.id })
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .limit(1);

    if (!task) return null;

    const rows = await db
      .select()
      .from(subtasks)
      .where(and(eq(subtasks.taskId, taskId), eq(subtasks.userId, userId)))
      .orderBy(asc(subtasks.position));

    return rows.map((r) => ({
      id: r.id,
      taskId: r.taskId,
      title: r.title,
      completed: r.completed,
      position: r.position,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  },

  async create(userId: string, taskId: string, data: any) {
    const db = getDb();
    // Verify parent task exists and belongs to user
    const [task] = await db
      .select({ id: tasks.id })
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .limit(1);

    if (!task) return null;

    const [inserted] = await db
      .insert(subtasks)
      .values({
        taskId,
        userId,
        title: data.title,
        completed: data.completed ?? false,
        position: data.position ?? 0,
      })
      .returning();

    return {
      id: inserted.id,
      taskId: inserted.taskId,
      title: inserted.title,
      completed: inserted.completed,
      position: inserted.position,
      createdAt: inserted.createdAt.toISOString(),
      updatedAt: inserted.updatedAt.toISOString(),
    };
  },

  async update(userId: string, id: string, patch: any) {
    const db = getDb();
    const updateValues: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (patch.title !== undefined) updateValues.title = patch.title;
    if (patch.completed !== undefined) updateValues.completed = patch.completed;
    if (patch.position !== undefined) updateValues.position = patch.position;

    const [updated] = await db
      .update(subtasks)
      .set(updateValues)
      .where(and(eq(subtasks.id, id), eq(subtasks.userId, userId)))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      taskId: updated.taskId,
      title: updated.title,
      completed: updated.completed,
      position: updated.position,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  },

  async delete(userId: string, id: string) {
    const db = getDb();
    const [deleted] = await db
      .delete(subtasks)
      .where(and(eq(subtasks.id, id), eq(subtasks.userId, userId)))
      .returning();

    return !!deleted;
  },
};
