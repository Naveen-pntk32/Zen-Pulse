// localStorage-backed data store used when Supabase is unavailable (guest mode).

const KEYS = {
  taskLists: 'zp_task_lists',
  tasks: 'zp_tasks',
  habits: 'zp_habits',
  habitCompletions: 'zp_habit_completions',
  focusSessions: 'zp_focus_sessions',
  settings: 'zp_settings',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to persist ${key}:`, error);
  }
}

export const localDb = {
  getTaskLists() {
    return read<AnyRecord[]>(KEYS.taskLists, []);
  },
  setTaskLists(lists: AnyRecord[]) {
    write(KEYS.taskLists, lists);
  },
  getTasks() {
    return read<AnyRecord[]>(KEYS.tasks, []);
  },
  setTasks(tasks: AnyRecord[]) {
    write(KEYS.tasks, tasks);
  },
  getHabits() {
    return read<AnyRecord[]>(KEYS.habits, []);
  },
  setHabits(habits: AnyRecord[]) {
    write(KEYS.habits, habits);
  },
  getHabitCompletions() {
    return read<AnyRecord[]>(KEYS.habitCompletions, []);
  },
  setHabitCompletions(completions: AnyRecord[]) {
    write(KEYS.habitCompletions, completions);
  },
  getFocusSessions() {
    return read<AnyRecord[]>(KEYS.focusSessions, []);
  },
  setFocusSessions(sessions: AnyRecord[]) {
    write(KEYS.focusSessions, sessions);
  },
  getSettings() {
    return read<AnyRecord>(KEYS.settings, {});
  },
  setSettings(settings: AnyRecord) {
    write(KEYS.settings, settings);
  },
};

// Records stored in local mode are plain objects shaped like the TS interfaces.
type AnyRecord = Record<string, any>;
