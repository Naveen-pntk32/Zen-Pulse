export interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  datetime: string;
  status: 'scheduled' | 'completed' | 'overdue';
  createdAt: string;
}

export interface PomodoroSettings {
  focusDuration: number; // minutes
  breakDuration: number; // minutes
  longBreakDuration: number; // minutes
  sessionsUntilLongBreak: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface PomodoroSession {
  id: string;
  type: 'focus' | 'break' | 'longBreak';
  duration: number;
  completed: boolean;
  startTime: string;
  endTime?: string;
}

export interface DailyStats {
  date: string;
  pomodoros: number;
  focusHours: number;
  tasksCompleted: number;
  streak: number;
}

export interface MediaInfo {
  title: string;
  artist: string;
  artwork: string;
  duration: number;
  position: number;
  playbackState: 'playing' | 'paused' | 'none';
  source: string;
}

export interface LapTime {
  id: string;
  lapNumber: number;
  time: string;
  totalTime: string;
}
