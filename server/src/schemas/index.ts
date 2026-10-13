import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(500),
  description: z.string().nullable().optional(),
  taskListId: z.string().uuid("Invalid task list ID").nullable().optional(),
  status: z.enum(["pending", "completed"]).optional().default("pending"),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  dueDate: z.string().nullable().optional(),
  dueTime: z.string().nullable().optional(),
  recurrence: z.enum(["daily", "weekly", "monthly"]).nullable().optional(),
  position: z.number().int().optional().default(0),
  completedAt: z.string().nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().nullable().optional(),
  taskListId: z.string().uuid().nullable().optional(),
  status: z.enum(["pending", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().nullable().optional(),
  dueTime: z.string().nullable().optional(),
  recurrence: z.enum(["daily", "weekly", "monthly"]).nullable().optional(),
  position: z.number().int().optional(),
  completedAt: z.string().nullable().optional(),
});

export const createTaskListSchema = z.object({
  name: z.string().min(1, "List name is required").max(100),
  description: z.string().nullable().optional(),
  icon: z.string().max(10).optional().default("📋"),
  color: z.string().max(20).optional().default("#6366f1"),
  sortOrder: z.number().int().optional().default(0),
});

export const updateTaskListSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().nullable().optional(),
  icon: z.string().max(10).optional(),
  color: z.string().max(20).optional(),
  sortOrder: z.number().int().optional(),
});

export const createSubtaskSchema = z.object({
  title: z.string().min(1, "Subtask title is required").max(300),
  completed: z.boolean().optional().default(false),
  position: z.number().int().optional().default(0),
});

export const updateSubtaskSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  completed: z.boolean().optional(),
  position: z.number().int().optional(),
});

export const createHabitSchema = z.object({
  name: z.string().min(1, "Habit name is required").max(100),
  icon: z.string().max(10).optional().default("😊"),
  frequency: z.string().optional().default("daily"),
  goalType: z.enum(["simple", "time"]).optional().default("simple"),
  dailyGoalSeconds: z.number().int().nonnegative().optional().default(0),
  startDate: z.string().optional(),
  goalDays: z.number().int().nullable().optional(),
  section: z.string().optional().default("others"),
  reminder: z.string().nullable().optional(),
  autoPopup: z.boolean().optional().default(false),
  archived: z.boolean().optional().default(false),
});

export const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().max(10).optional(),
  frequency: z.string().optional(),
  goalType: z.enum(["simple", "time"]).optional(),
  dailyGoalSeconds: z.number().int().nonnegative().optional(),
  startDate: z.string().optional(),
  goalDays: z.number().int().nullable().optional(),
  section: z.string().optional(),
  reminder: z.string().nullable().optional(),
  autoPopup: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export const upsertHabitCompletionSchema = z.object({
  habitId: z.string().uuid("Invalid habit ID"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  completed: z.boolean().optional().default(false),
  completedAutomatically: z.boolean().optional().default(false),
  actualFocusSeconds: z.number().int().nonnegative().optional().default(0),
  completedAt: z.string().nullable().optional(),
});

export const toggleHabitCompletionSchema = z.object({
  habitId: z.string().uuid("Invalid habit ID"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
});

export const createFocusSessionSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(["pomodoro", "stopwatch"]).default("pomodoro"),
  targetType: z.enum(["task", "habit"]).nullable().optional(),
  targetId: z.string().uuid().nullable().optional(),
  targetName: z.string().optional().default(""),
  durationSeconds: z.number().int().nonnegative().optional().default(0),
  plannedDurationSeconds: z.number().int().positive().nullable().optional(),
  startedAt: z.string(),
  endedAt: z.string().nullable().optional(),
  status: z.enum(["active", "completed", "cancelled", "paused"]).default("active"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
});

export const updateFocusSessionSchema = z.object({
  targetType: z.enum(["task", "habit"]).nullable().optional(),
  targetId: z.string().uuid().nullable().optional(),
  targetName: z.string().optional(),
  durationSeconds: z.number().int().nonnegative().optional(),
  plannedDurationSeconds: z.number().int().positive().nullable().optional(),
  endedAt: z.string().nullable().optional(),
  status: z.enum(["active", "completed", "cancelled", "paused"]).optional(),
});

export const updateSettingsSchema = z.object({
  focusDuration: z.number().int().min(1).max(180).optional(),
  breakDuration: z.number().int().min(1).max(60).optional(),
  longBreakDuration: z.number().int().min(1).max(120).optional(),
  sessionsUntilLongBreak: z.number().int().min(1).max(20).optional(),
  soundEnabled: z.boolean().optional(),
  notificationsEnabled: z.boolean().optional(),
  dailyFocusGoalSeconds: z.number().int().nonnegative().optional(),
  theme: z.enum(["dark", "light"]).optional(),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const migratePayloadSchema = z.object({
  taskLists: z.array(z.any()).optional().default([]),
  tasks: z.array(z.any()).optional().default([]),
  habits: z.array(z.any()).optional().default([]),
  habitCompletions: z.array(z.any()).optional().default([]),
  focusSessions: z.array(z.any()).optional().default([]),
  settings: z.record(z.any()).optional().default({}),
});

export const decomposeTaskSchema = z.object({
  taskId: z.string().uuid("Invalid task ID"),
});

