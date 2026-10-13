import { eq, and, asc } from "drizzle-orm";
import { getDb } from "../config/database.js";
import { habits } from "../db/schema.js";

export const habitsService = {
  async getAll(userId: string, options?: { includeArchived?: boolean }) {
    const db = getDb();
    const conditions = [eq(habits.userId, userId)];

    if (!options?.includeArchived) {
      conditions.push(eq(habits.archived, false));
    }

    const rows = await db
      .select()
      .from(habits)
      .where(and(...conditions))
      .orderBy(asc(habits.createdAt));

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      icon: r.icon,
      frequency: r.frequency,
      goalType: r.goalType,
      dailyGoalSeconds: r.dailyGoalSeconds,
      startDate: r.startDate,
      goalDays: r.goalDays,
      section: r.section,
      reminder: r.reminder,
      autoPopup: r.autoPopup,
      archived: r.archived,
      createdAt: r.createdAt.toISOString(),
    }));
  },

  async getById(userId: string, id: string) {
    const db = getDb();
    const [row] = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, id), eq(habits.userId, userId)))
      .limit(1);

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      icon: row.icon,
      frequency: row.frequency,
      goalType: row.goalType,
      dailyGoalSeconds: row.dailyGoalSeconds,
      startDate: row.startDate,
      goalDays: row.goalDays,
      section: row.section,
      reminder: row.reminder,
      autoPopup: row.autoPopup,
      archived: row.archived,
      createdAt: row.createdAt.toISOString(),
    };
  },

  async create(userId: string, data: any) {
    const db = getDb();
    const [inserted] = await db
      .insert(habits)
      .values({
        userId,
        name: data.name,
        icon: data.icon ?? "😊",
        frequency: data.frequency ?? "daily",
        goalType: data.goalType ?? "simple",
        dailyGoalSeconds: data.dailyGoalSeconds ?? 0,
        startDate: data.startDate ?? new Date().toISOString().slice(0, 10),
        goalDays: data.goalDays ?? null,
        section: data.section ?? "others",
        reminder: data.reminder ?? null,
        autoPopup: data.autoPopup ?? false,
        archived: data.archived ?? false,
      })
      .returning();

    return {
      id: inserted.id,
      name: inserted.name,
      icon: inserted.icon,
      frequency: inserted.frequency,
      goalType: inserted.goalType,
      dailyGoalSeconds: inserted.dailyGoalSeconds,
      startDate: inserted.startDate,
      goalDays: inserted.goalDays,
      section: inserted.section,
      reminder: inserted.reminder,
      autoPopup: inserted.autoPopup,
      archived: inserted.archived,
      createdAt: inserted.createdAt.toISOString(),
    };
  },

  async update(userId: string, id: string, patch: any) {
    const db = getDb();
    const updateValues: Record<string, any> = {};

    if (patch.name !== undefined) updateValues.name = patch.name;
    if (patch.icon !== undefined) updateValues.icon = patch.icon;
    if (patch.frequency !== undefined) updateValues.frequency = patch.frequency;
    if (patch.goalType !== undefined) updateValues.goalType = patch.goalType;
    if (patch.dailyGoalSeconds !== undefined) updateValues.dailyGoalSeconds = patch.dailyGoalSeconds;
    if (patch.startDate !== undefined) updateValues.startDate = patch.startDate;
    if (patch.goalDays !== undefined) updateValues.goalDays = patch.goalDays;
    if (patch.section !== undefined) updateValues.section = patch.section;
    if (patch.reminder !== undefined) updateValues.reminder = patch.reminder;
    if (patch.autoPopup !== undefined) updateValues.autoPopup = patch.autoPopup;
    if (patch.archived !== undefined) updateValues.archived = patch.archived;

    const [updated] = await db
      .update(habits)
      .set(updateValues)
      .where(and(eq(habits.id, id), eq(habits.userId, userId)))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      name: updated.name,
      icon: updated.icon,
      frequency: updated.frequency,
      goalType: updated.goalType,
      dailyGoalSeconds: updated.dailyGoalSeconds,
      startDate: updated.startDate,
      goalDays: updated.goalDays,
      section: updated.section,
      reminder: updated.reminder,
      autoPopup: updated.autoPopup,
      archived: updated.archived,
      createdAt: updated.createdAt.toISOString(),
    };
  },

  async delete(userId: string, id: string) {
    const db = getDb();
    const [deleted] = await db
      .delete(habits)
      .where(and(eq(habits.id, id), eq(habits.userId, userId)))
      .returning();

    return !!deleted;
  },
};
