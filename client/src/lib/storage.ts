import { Task, PomodoroSettings, DailyStats, PomodoroSession } from '@/types/timer';

const STORAGE_KEYS = {
  TASKS: 'pomodoro_tasks',
  SETTINGS: 'pomodoro_settings',
  STATS: 'pomodoro_stats',
  SESSIONS: 'pomodoro_sessions',
} as const;

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  soundEnabled: true,
  notificationsEnabled: true,
};

export const storage = {
  // Tasks
  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  },

  addTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'scheduled',
    };
    
    const tasks = this.getTasks();
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  },

  deleteTask(id: string): void {
    const tasks = this.getTasks().filter(task => task.id !== id);
    this.saveTasks(tasks);
  },

  updateTaskStatus(id: string, status: Task['status']): void {
    const tasks = this.getTasks().map(task =>
      task.id === id ? { ...task, status } : task
    );
    this.saveTasks(tasks);
  },

  // Settings
  getSettings(): PomodoroSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: Partial<PomodoroSettings>): void {
    try {
      const currentSettings = this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  // Stats
  getStats(): DailyStats[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveStats(stats: DailyStats[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  },

  getTodayStats(): DailyStats {
    const today = new Date().toISOString().split('T')[0];
    const stats = this.getStats();
    const todayStats = stats.find(s => s.date === today);
    
    if (todayStats) {
      return todayStats;
    }

    const newStats: DailyStats = {
      date: today,
      pomodoros: 0,
      focusHours: 0,
      tasksCompleted: 0,
      streak: this.calculateStreak(),
    };

    stats.push(newStats);
    this.saveStats(stats);
    return newStats;
  },

  updateTodayStats(updates: Partial<Omit<DailyStats, 'date'>>): void {
    const stats = this.getStats();
    const today = new Date().toISOString().split('T')[0];
    const todayIndex = stats.findIndex(s => s.date === today);
    
    if (todayIndex >= 0) {
      stats[todayIndex] = { ...stats[todayIndex], ...updates };
    } else {
      stats.push({
        date: today,
        pomodoros: 0,
        focusHours: 0,
        tasksCompleted: 0,
        streak: this.calculateStreak(),
        ...updates,
      });
    }
    
    this.saveStats(stats);
  },

  calculateStreak(): number {
    const stats = this.getStats();
    if (stats.length === 0) return 0;
    
    stats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < stats.length; i++) {
      const statDate = new Date(stats[i].date);
      const diffDays = Math.floor((today.getTime() - statDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i && stats[i].pomodoros > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  },

  // Sessions
  getSessions(): PomodoroSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSessions(sessions: PomodoroSession[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  },

  addSession(session: Omit<PomodoroSession, 'id'>): PomodoroSession {
    const newSession: PomodoroSession = {
      ...session,
      id: crypto.randomUUID(),
    };
    
    const sessions = this.getSessions();
    sessions.push(newSession);
    this.saveSessions(sessions);
    return newSession;
  },
};
