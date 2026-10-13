import { eq } from "drizzle-orm";
import { getDb } from "../config/database.js";
import { profiles } from "../db/schema.js";

export const profileService = {
  async get(userId: string, email?: string) {
    const db = getDb();
    const [row] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (row) {
      return {
        id: row.id,
        email: row.email || email,
        displayName: row.displayName || (email ? email.split("@")[0] : "User"),
        avatarUrl: row.avatarUrl,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      };
    }

    // Auto-create initial profile on first fetch
    const [created] = await db
      .insert(profiles)
      .values({
        id: userId,
        email: email ?? null,
        displayName: email ? email.split("@")[0] : "User",
      })
      .onConflictDoNothing()
      .returning();

    if (created) {
      return {
        id: created.id,
        email: created.email,
        displayName: created.displayName,
        avatarUrl: created.avatarUrl,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      };
    }

    return {
      id: userId,
      email,
      displayName: email ? email.split("@")[0] : "User",
      avatarUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async update(userId: string, patch: any) {
    const db = getDb();
    const updateValues: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (patch.displayName !== undefined) updateValues.displayName = patch.displayName;
    if (patch.avatarUrl !== undefined) updateValues.avatarUrl = patch.avatarUrl;

    const [updated] = await db
      .update(profiles)
      .set(updateValues)
      .where(eq(profiles.id, userId))
      .returning();

    if (!updated) return null;

    return {
      id: updated.id,
      email: updated.email,
      displayName: updated.displayName,
      avatarUrl: updated.avatarUrl,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  },
};
