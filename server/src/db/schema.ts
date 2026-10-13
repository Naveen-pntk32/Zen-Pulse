import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Profiles Table
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(), // Matches Supabase auth.users(id)
    email: text("email"),
    displayName: text("display_name"),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  }
);

// 2. Task Lists (Projects) Table
export const taskLists = pgTable(
  "task_lists",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    icon: text("icon").default("📋"),
    color: text("color").default("#6366f1"),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_task_lists_user").on(table.userId, table.sortOrder),
  ]
);

// 3. Tasks Table
export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    taskListId: uuid("task_list_id").references(() => taskLists.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").default("pending").notNull(), // 'pending' | 'completed'
    priority: text("priority").default("medium").notNull(), // 'low' | 'medium' | 'high'
    dueDate: text("due_date"), // 'YYYY-MM-DD'
    dueTime: text("due_time"), // 'HH:mm'
    recurrence: text("recurrence"), // 'daily' | 'weekly' | 'monthly' | null
    position: integer("position").default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_tasks_user_list").on(table.userId, table.taskListId),
    index("idx_tasks_user_status").on(table.userId, table.status),
    index("idx_tasks_due").on(table.userId, table.dueDate),
  ]
);

// 4. Subtasks Table
export const subtasks = pgTable(
  "subtasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    taskId: uuid("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull(),
    title: text("title").notNull(),
    completed: boolean("completed").default(false).notNull(),
    position: integer("position").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_subtasks_task").on(table.taskId),
    index("idx_subtasks_user").on(table.userId),
  ]
);

// 5. Habits Table
export const habits = pgTable(
  "habits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    name: text("name").notNull(),
    icon: text("icon").default("😊"),
    frequency: text("frequency").default("daily"),
    goalType: text("goal_type").default("simple"), // 'simple' | 'time'
    dailyGoalSeconds: integer("daily_goal_seconds").default(0),
    startDate: text("start_date"),
    goalDays: integer("goal_days"),
    section: text("section").default("others"),
    reminder: text("reminder"),
    autoPopup: boolean("auto_popup").default(false),
    archived: boolean("archived").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_habits_user_archived").on(table.userId, table.archived),
  ]
);

// 6. Habit Completions Table
export const habitCompletions = pgTable(
  "habit_completions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    habitId: uuid("habit_id").notNull().references(() => habits.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull(),
    date: text("date").notNull(), // 'YYYY-MM-DD'
    completed: boolean("completed").default(false),
    completedAutomatically: boolean("completed_automatically").default(false),
    actualFocusSeconds: integer("actual_focus_seconds").default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_habit_completions_unique").on(table.habitId, table.date),
    index("idx_habit_completions_user_date").on(table.userId, table.date),
  ]
);

// 7. Focus Sessions Table
export const focusSessions = pgTable(
  "focus_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    type: text("type").notNull(), // 'pomodoro' | 'stopwatch'
    targetType: text("target_type"), // 'task' | 'habit'
    targetId: uuid("target_id"),
    targetName: text("target_name").default(""),
    durationSeconds: integer("duration_seconds").default(0).notNull(),
    plannedDurationSeconds: integer("planned_duration_seconds"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    status: text("status").default("active").notNull(), // 'active' | 'completed' | 'cancelled' | 'paused'
    date: text("date").notNull(), // 'YYYY-MM-DD'
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_focus_sessions_user_date").on(table.userId, table.date),
    index("idx_focus_sessions_target").on(table.targetType, table.targetId, table.date),
  ]
);

// 8. User Settings Table
export const userSettings = pgTable(
  "user_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().unique(),
    focusDuration: integer("focus_duration").default(25),
    breakDuration: integer("break_duration").default(5),
    longBreakDuration: integer("long_break_duration").default(15),
    sessionsUntilLongBreak: integer("sessions_until_long_break").default(4),
    soundEnabled: boolean("sound_enabled").default(true),
    notificationsEnabled: boolean("notifications_enabled").default(true),
    dailyFocusGoalSeconds: integer("daily_focus_goal_seconds").default(10800),
    theme: text("theme").default("dark"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  }
);

// Relations definitions
export const taskListsRelations = relations(taskLists, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  taskList: one(taskLists, {
    fields: [tasks.taskListId],
    references: [taskLists.id],
  }),
  subtasks: many(subtasks),
}));

export const subtasksRelations = relations(subtasks, ({ one }) => ({
  task: one(tasks, {
    fields: [subtasks.taskId],
    references: [tasks.id],
  }),
}));

export const habitsRelations = relations(habits, ({ many }) => ({
  completions: many(habitCompletions),
}));

export const habitCompletionsRelations = relations(habitCompletions, ({ one }) => ({
  habit: one(habits, {
    fields: [habitCompletions.habitId],
    references: [habits.id],
  }),
}));

export type Profile = typeof profiles.$inferSelect;
export type TaskList = typeof taskLists.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Subtask = typeof subtasks.$inferSelect;
export type Habit = typeof habits.$inferSelect;
export type HabitCompletion = typeof habitCompletions.$inferSelect;
export type FocusSession = typeof focusSessions.$inferSelect;
export type UserSetting = typeof userSettings.$inferSelect;
