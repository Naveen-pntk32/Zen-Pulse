import { eq, and, asc } from "drizzle-orm";
import { getDb } from "../config/database.js";
import { taskLists, tasks } from "../db/schema.js";

const DEFAULT_LISTS = [
  { name: "Gaming", icon: "🎮", color: "#a855f7", sortOrder: 0 },
  { name: "Work", icon: "💼", color: "#3b82f6", sortOrder: 1 },
  { name: "Personal", icon: "🏠", color: "#22c55e", sortOrder: 2 },
  { name: "Learning", icon: "📙", color: "#f59e0b", sortOrder: 3 },
];

export const projectsService = {
  async getAll(userId: string) {
    const db = getDb();
    const rows = await db
      .select()
      .from(taskLists)
      .where(eq(taskLists.userId, userId))
      .orderBy(asc(taskLists.sortOrder));

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      icon: r.icon,
      color: r.color,
      sortOrder: r.sortOrder,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  },

  async getById(userId: string, id: string) {
    const db = getDb();
    const [row] = await db
      .select()
      .from(taskLists)
      .where(and(eq(taskLists.id, id), eq(taskLists.userId, userId)))
      .limit(1);

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      icon: row.icon,
      color: row.color,
      sortOrder: row.sortOrder,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  },

  async create(userId: string, data: any) {
    const db = getDb();
    const [inserted] = await db
      .insert(taskLists)
      .values({
        userId,
        name: data.name,
        description: data.description ?? null,
        icon: data.icon ?? "📋",
        color: data.color ?? "#6366f1",
        sortOrder: data.sortOrder ?? 0,
      })
      .returning();

    return {
      id: inserted.id,
      name: inserted.name,
      description: inserted.description,
      icon: inserted.icon,
      color: inserted.color,
      sortOrder: inserted.sortOrder,
      createdAt: inserted.createdAt.toISOString(),
      updatedAt: inserted.updatedAt.toISOString(),
    };
  },

  async update(userId: string, id: string, patch: any) {
    const db = getDb();
    const updateValues: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (patch.name !== undefined) updateValues.name = patch.name;
    if (patch.description !== undefined) updateValues.description = patch.description;
    if (patch.icon !== undefined) updateValues.icon = patch.icon;
    if (patch.color !== undefined) updateValues.color = patch.color;
    if (patch.sortOrder !== undefined) updateValues.sortOrder = patch.sortOrder;

    const [updated] = await db
      .update(taskLists)
      .set(updateValues)
      .where(and(eq(taskLists.id, id), eq(taskLists.userId, userId)))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      icon: updated.icon,
      color: updated.color,
      sortOrder: updated.sortOrder,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  },

  async delete(userId: string, id: string) {
    const db = getDb();
    // Related tasks have task_list_id SET NULL via foreign key constraint
    const [deleted] = await db
      .delete(taskLists)
      .where(and(eq(taskLists.id, id), eq(taskLists.userId, userId)))
      .returning();

    return !!deleted;
  },

  async ensureDefaults(userId: string) {
    const existing = await this.getAll(userId);
    if (existing.length > 0) return existing;

    const created: any[] = [];
    for (const d of DEFAULT_LISTS) {
      const item = await this.create(userId, d);
      created.push(item);
    }
    return created;
  },
};
