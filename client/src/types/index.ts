export * from './timer';

// -----------------------------------------------------------------------------
// Core entities for the ZenPulse evolution
// -----------------------------------------------------------------------------

export type FocusTargetType = 'task' | 'habit';

export interface FocusTarget {
  type: FocusTargetType;
  id: string;
  name: string;
}

export interface TaskList {
  id: string;
  name: string;
  icon: string;
  color: string;
  sortOrder: number;
  createdAt: string;
}

export type TaskStatus = 'pending' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  taskListId: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null; // YYYY-MM-DD
  dueTime: string | null; // HH:mm
  completedAt: string | null; // ISO timestamp
  createdAt: string; // ISO timestamp
}

export type HabitFrequency = 'daily' | 'weekly' | 'custom';
export type HabitGoalType = 'time' | 'count' | 'simple';
export type HabitSection = 'morning' | 'afternoon' | 'night' | 'others';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  frequency: HabitFrequency;
  goalType: HabitGoalType;
  dailyGoalSeconds: number;
  startDate: string; // YYYY-MM-DD
  goalDays: number | null; // null = forever
  section: HabitSection;
  reminder: string | null;
  autoPopup: boolean;
  archived: boolean;
  createdAt: string; // ISO timestamp
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAutomatically: boolean;
  actualFocusSeconds: number;
  completedAt: string | null; // ISO timestamp
  createdAt: string; // ISO timestamp
}

export type FocusSessionType = 'pomodoro' | 'stopwatch';
export type FocusSessionStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export interface FocusSession {
  id: string;
  type: FocusSessionType;
  targetType: FocusTargetType | null;
  targetId: string | null;
  targetName: string;
  durationSeconds: number;
  plannedDurationSeconds: number | null;
  startedAt: string; // ISO timestamp
  endedAt: string | null; // ISO timestamp
  status: FocusSessionStatus;
  date: string; // YYYY-MM-DD (local start date)
  createdAt: string; // ISO timestamp
}

export interface UserSettings {
  focusDuration: number; // minutes
  breakDuration: number; // minutes
  longBreakDuration: number; // minutes
  sessionsUntilLongBreak: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  dailyFocusGoalSeconds: number;
  theme: 'dark' | 'light';
}

// -----------------------------------------------------------------------------
// Active timer persistence (localStorage write-through cache)
// -----------------------------------------------------------------------------

export interface ActiveTimerState {
  sessionId: string | null;
  mode: 'pomodoro' | 'stopwatch';
  target: FocusTarget | null;
  plannedMs: number; // pomodoro: full duration in ms
  baseMs: number; // accumulated ms before the current run
  resumedAt: string | null; // ISO timestamp of last resume, null when paused
  isActive: boolean;
  status: 'active' | 'paused';
  updatedAt: string;
}

export interface AnalyticsSummary {
  totalSeconds: number;
  goalSeconds: number;
  achievementPercent: number;
  breakdown: { targetName: string; seconds: number; icon: string; type: FocusTargetType | null }[];
  history: { label: string; seconds: number }[];
  bestFocus: { date: string; seconds: number } | null;
  autoCheckIns: { habitName: string; date: string; completedAt: string }[];
}
