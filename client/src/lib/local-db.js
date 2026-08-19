const KEYS = {
  taskLists: "zp_task_lists",
  tasks: "zp_tasks",
  habits: "zp_habits",
  habitCompletions: "zp_habit_completions",
  focusSessions: "zp_focus_sessions",
  settings: "zp_settings"
};
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to persist ${key}:`, error);
  }
}
const localDb = {
  getTaskLists() {
    return read(KEYS.taskLists, []);
  },
  setTaskLists(lists) {
    write(KEYS.taskLists, lists);
  },
  getTasks() {
    return read(KEYS.tasks, []);
  },
  setTasks(tasks) {
    write(KEYS.tasks, tasks);
  },
  getHabits() {
    return read(KEYS.habits, []);
  },
  setHabits(habits) {
    write(KEYS.habits, habits);
  },
  getHabitCompletions() {
    return read(KEYS.habitCompletions, []);
  },
  setHabitCompletions(completions) {
    write(KEYS.habitCompletions, completions);
  },
  getFocusSessions() {
    return read(KEYS.focusSessions, []);
  },
  setFocusSessions(sessions) {
    write(KEYS.focusSessions, sessions);
  },
  getSettings() {
    return read(KEYS.settings, {});
  },
  setSettings(settings) {
    write(KEYS.settings, settings);
  }
};
export {
  localDb
};
