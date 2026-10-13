import { eq, and, desc, sql } from "drizzle-orm";
import { getDb } from "../config/database.js";
import { tasks, subtasks } from "../db/schema.js";

export const tasksService = {
  async getAll(userId: string, options?: { listId?: string | null; status?: string; priority?: string }) {
    const db = getDb();
    const conditions = [eq(tasks.userId, userId)];

    if (options?.listId === null) {
      conditions.push(sql`${tasks.taskListId} IS NULL`);
    } else if (options?.listId && options.listId !== "all") {
      conditions.push(eq(tasks.taskListId, options.listId));
    }

    if (options?.status && options.status !== "all") {
      conditions.push(eq(tasks.status, options.status));
    }

    if (options?.priority) {
      conditions.push(eq(tasks.priority, options.priority));
    }

    const rows = await db
      .select()
      .from(tasks)
      .where(and(...conditions))
      .orderBy(desc(tasks.createdAt));

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      taskListId: r.taskListId,
      status: r.status,
      priority: r.priority,
      dueDate: r.dueDate,
      dueTime: r.dueTime,
      recurrence: r.recurrence,
      position: r.position,
      completedAt: r.completedAt ? r.completedAt.toISOString() : null,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  },

  async getById(userId: string, id: string) {
    const db = getDb();
    const [row] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .limit(1);

    if (!row) return null;

    const taskSubtasks = await db
      .select()
      .from(subtasks)
      .where(and(eq(subtasks.taskId, id), eq(subtasks.userId, userId)))
      .orderBy(subtasks.position);

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      taskListId: row.taskListId,
      status: row.status,
      priority: row.priority,
      dueDate: row.dueDate,
      dueTime: row.dueTime,
      recurrence: row.recurrence,
      position: row.position,
      completedAt: row.completedAt ? row.completedAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      subtasks: taskSubtasks,
    };
  },

  async create(userId: string, data: any) {
    const db = getDb();
    const [inserted] = await db
      .insert(tasks)
      .values({
        userId,
        title: data.title,
        description: data.description ?? null,
        taskListId: data.taskListId ?? null,
        status: data.status ?? "pending",
        priority: data.priority ?? "medium",
        dueDate: data.dueDate ?? null,
        dueTime: data.dueTime ?? null,
        recurrence: data.recurrence ?? null,
        position: data.position ?? 0,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      })
      .returning();

    return {
      id: inserted.id,
      title: inserted.title,
      description: inserted.description,
      taskListId: inserted.taskListId,
      status: inserted.status,
      priority: inserted.priority,
      dueDate: inserted.dueDate,
      dueTime: inserted.dueTime,
      recurrence: inserted.recurrence,
      position: inserted.position,
      completedAt: inserted.completedAt ? inserted.completedAt.toISOString() : null,
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
    if (patch.description !== undefined) updateValues.description = patch.description;
    if (patch.taskListId !== undefined) updateValues.taskListId = patch.taskListId;
    if (patch.status !== undefined) updateValues.status = patch.status;
    if (patch.priority !== undefined) updateValues.priority = patch.priority;
    if (patch.dueDate !== undefined) updateValues.dueDate = patch.dueDate;
    if (patch.dueTime !== undefined) updateValues.dueTime = patch.dueTime;
    if (patch.recurrence !== undefined) updateValues.recurrence = patch.recurrence;
    if (patch.position !== undefined) updateValues.position = patch.position;
    if (patch.completedAt !== undefined) {
      updateValues.completedAt = patch.completedAt ? new Date(patch.completedAt) : null;
    }

    const [updated] = await db
      .update(tasks)
      .set(updateValues)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      taskListId: updated.taskListId,
      status: updated.status,
      priority: updated.priority,
      dueDate: updated.dueDate,
      dueTime: updated.dueTime,
      recurrence: updated.recurrence,
      position: updated.position,
      completedAt: updated.completedAt ? updated.completedAt.toISOString() : null,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  },

  async delete(userId: string, id: string) {
    const db = getDb();
    const [deleted] = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    return !!deleted;
  },
};
