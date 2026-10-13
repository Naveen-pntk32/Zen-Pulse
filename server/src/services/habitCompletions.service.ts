import { eq, and, gte, lte } from "drizzle-orm";
import { getDb } from "../config/database.js";
import { habitCompletions } from "../db/schema.js";

export const habitCompletionsService = {
  async getAllForDate(userId: string, date: string) {
    const db = getDb();
    const rows = await db
      .select()
      .from(habitCompletions)
      .where(and(eq(habitCompletions.userId, userId), eq(habitCompletions.date, date)));

    return rows.map((r) => ({
      id: r.id,
      habitId: r.habitId,
      date: r.date,
      completed: r.completed ?? false,
      completedAutomatically: r.completedAutomatically ?? false,
      actualFocusSeconds: r.actualFocusSeconds ?? 0,
      completedAt: r.completedAt ? r.completedAt.toISOString() : null,
      createdAt: r.createdAt.toISOString(),
    }));
  },

  async getAllBetween(userId: string, from: string, to: string) {
    const db = getDb();
    const rows = await db
      .select()
      .from(habitCompletions)
      .where(
        and(
          eq(habitCompletions.userId, userId),
          gte(habitCompletions.date, from),
          lte(habitCompletions.date, to)
        )
      );

    return rows.map((r) => ({
      id: r.id,
      habitId: r.habitId,
      date: r.date,
      completed: r.completed ?? false,
      completedAutomatically: r.completedAutomatically ?? false,
      actualFocusSeconds: r.actualFocusSeconds ?? 0,
      completedAt: r.completedAt ? r.completedAt.toISOString() : null,
      createdAt: r.createdAt.toISOString(),
    }));
  },

  async get(userId: string, habitId: string, date: string) {
    const db = getDb();
    const [row] = await db
      .select()
      .from(habitCompletions)
      .where(
        and(
          eq(habitCompletions.userId, userId),
          eq(habitCompletions.habitId, habitId),
          eq(habitCompletions.date, date)
        )
      )
      .limit(1);

    if (!row) return null;

    return {
      id: row.id,
      habitId: row.habitId,
      date: row.date,
      completed: row.completed ?? false,
      completedAutomatically: row.completedAutomatically ?? false,
      actualFocusSeconds: row.actualFocusSeconds ?? 0,
      completedAt: row.completedAt ? row.completedAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
    };
  },

  async upsert(userId: string, data: any) {
    const db = getDb();
    const [result] = await db
      .insert(habitCompletions)
      .values({
        habitId: data.habitId,
        userId,
        date: data.date,
        completed: data.completed ?? false,
        completedAutomatically: data.completedAutomatically ?? false,
        actualFocusSeconds: data.actualFocusSeconds ?? 0,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      })
      .onConflictDoUpdate({
        target: [habitCompletions.habitId, habitCompletions.date],
        set: {
          completed: data.completed,
          completedAutomatically: data.completedAutomatically,
          actualFocusSeconds: data.actualFocusSeconds,
          completedAt: data.completedAt ? new Date(data.completedAt) : null,
        },
      })
      .returning();

    return {
      id: result.id,
      habitId: result.habitId,
      date: result.date,
      completed: result.completed ?? false,
      completedAutomatically: result.completedAutomatically ?? false,
      actualFocusSeconds: result.actualFocusSeconds ?? 0,
      completedAt: result.completedAt ? result.completedAt.toISOString() : null,
      createdAt: result.createdAt.toISOString(),
    };
  },

  async toggleManual(userId: string, habitId: string, date: string) {
    const existing = await this.get(userId, habitId, date);
    const nowCompleted = !(existing?.completed ?? false);

    return this.upsert(userId, {
      habitId,
      date,
      completed: nowCompleted,
      completedAutomatically: existing?.completedAutomatically ?? false,
      actualFocusSeconds: existing?.actualFocusSeconds ?? 0,
      completedAt: nowCompleted ? new Date().toISOString() : null,
    });
  },
};
