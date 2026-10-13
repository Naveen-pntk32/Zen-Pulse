import { eq, and, gte, lte, desc } from "drizzle-orm";
import { getDb } from "../config/database.js";
import { focusSessions } from "../db/schema.js";

export const focusSessionsService = {
  async getAll(userId: string, options?: { from?: string; to?: string }) {
    const db = getDb();
    const conditions = [eq(focusSessions.userId, userId)];

    if (options?.from) {
      conditions.push(gte(focusSessions.date, options.from));
    }
    if (options?.to) {
      conditions.push(lte(focusSessions.date, options.to));
    }

    const rows = await db
      .select()
      .from(focusSessions)
      .where(and(...conditions))
      .orderBy(desc(focusSessions.startedAt));

    return rows.map((r) => ({
      id: r.id,
      type: r.type,
      targetType: r.targetType,
      targetId: r.targetId,
      targetName: r.targetName,
      durationSeconds: r.durationSeconds,
      plannedDurationSeconds: r.plannedDurationSeconds,
      startedAt: r.startedAt.toISOString(),
      endedAt: r.endedAt ? r.endedAt.toISOString() : null,
      status: r.status,
      date: r.date,
      createdAt: r.createdAt.toISOString(),
    }));
  },

  async getById(userId: string, id: string) {
    const db = getDb();
    const [row] = await db
      .select()
      .from(focusSessions)
      .where(and(eq(focusSessions.id, id), eq(focusSessions.userId, userId)))
      .limit(1);

    if (!row) return null;

    return {
      id: row.id,
      type: row.type,
      targetType: row.targetType,
      targetId: row.targetId,
      targetName: row.targetName,
      durationSeconds: row.durationSeconds,
      plannedDurationSeconds: row.plannedDurationSeconds,
      startedAt: row.startedAt.toISOString(),
      endedAt: row.endedAt ? row.endedAt.toISOString() : null,
      status: row.status,
      date: row.date,
      createdAt: row.createdAt.toISOString(),
    };
  },

  async create(userId: string, data: any) {
    const db = getDb();
    const [inserted] = await db
      .insert(focusSessions)
      .values({
        id: data.id,
        userId,
        type: data.type ?? "pomodoro",
        targetType: data.targetType ?? null,
        targetId: data.targetId ?? null,
        targetName: data.targetName ?? "",
        durationSeconds: data.durationSeconds ?? 0,
        plannedDurationSeconds: data.plannedDurationSeconds ?? null,
        startedAt: new Date(data.startedAt),
        endedAt: data.endedAt ? new Date(data.endedAt) : null,
        status: data.status ?? "active",
        date: data.date,
      })
      .returning();

    return {
      id: inserted.id,
      type: inserted.type,
      targetType: inserted.targetType,
      targetId: inserted.targetId,
      targetName: inserted.targetName,
      durationSeconds: inserted.durationSeconds,
      plannedDurationSeconds: inserted.plannedDurationSeconds,
      startedAt: inserted.startedAt.toISOString(),
      endedAt: inserted.endedAt ? inserted.endedAt.toISOString() : null,
      status: inserted.status,
      date: inserted.date,
      createdAt: inserted.createdAt.toISOString(),
    };
  },

  async update(userId: string, id: string, patch: any) {
    const db = getDb();
    const updateValues: Record<string, any> = {};

    if (patch.targetType !== undefined) updateValues.targetType = patch.targetType;
    if (patch.targetId !== undefined) updateValues.targetId = patch.targetId;
    if (patch.targetName !== undefined) updateValues.targetName = patch.targetName;
    if (patch.durationSeconds !== undefined) updateValues.durationSeconds = patch.durationSeconds;
    if (patch.plannedDurationSeconds !== undefined) updateValues.plannedDurationSeconds = patch.plannedDurationSeconds;
    if (patch.endedAt !== undefined) updateValues.endedAt = patch.endedAt ? new Date(patch.endedAt) : null;
    if (patch.status !== undefined) updateValues.status = patch.status;

    const [updated] = await db
      .update(focusSessions)
      .set(updateValues)
      .where(and(eq(focusSessions.id, id), eq(focusSessions.userId, userId)))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      type: updated.type,
      targetType: updated.targetType,
      targetId: updated.targetId,
      targetName: updated.targetName,
      durationSeconds: updated.durationSeconds,
      plannedDurationSeconds: updated.plannedDurationSeconds,
      startedAt: updated.startedAt.toISOString(),
      endedAt: updated.endedAt ? updated.endedAt.toISOString() : null,
      status: updated.status,
      date: updated.date,
      createdAt: updated.createdAt.toISOString(),
    };
  },

  async getDailyTotal(userId: string, date: string) {
    const db = getDb();
    const rows = await db
      .select({ durationSeconds: focusSessions.durationSeconds })
      .from(focusSessions)
      .where(
        and(
          eq(focusSessions.userId, userId),
          eq(focusSessions.date, date),
          eq(focusSessions.status, "completed")
        )
      );

    return rows.reduce((sum, r) => sum + (r.durationSeconds ?? 0), 0);
  },

  async getDailyTotalForTarget(userId: string, targetId: string, date: string) {
    const db = getDb();
    const rows = await db
      .select({ durationSeconds: focusSessions.durationSeconds })
      .from(focusSessions)
      .where(
        and(
          eq(focusSessions.userId, userId),
          eq(focusSessions.targetId, targetId),
          eq(focusSessions.date, date),
          eq(focusSessions.status, "completed")
        )
      );

    return rows.reduce((sum, r) => sum + (r.durationSeconds ?? 0), 0);
  },
};
