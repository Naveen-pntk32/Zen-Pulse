import { HabitSection, TaskList, UserSettings } from '@/types';
import { makeId } from '@/lib/backend';

export const DEFAULT_TASK_LISTS: Omit<TaskList, 'id' | 'createdAt'>[] = [
  { name: 'Gaming', icon: '🎮', color: '#a855f7', sortOrder: 0 },
  { name: 'Work', icon: '💼', color: '#3b82f6', sortOrder: 1 },
  { name: 'Personal', icon: '🏠', color: '#22c55e', sortOrder: 2 },
  { name: 'Learning', icon: '📘', color: '#f59e0b', sortOrder: 3 },
];

export function buildDefaultTaskLists(): TaskList[] {
  const now = new Date().toISOString();
  return DEFAULT_TASK_LISTS.map((l) => ({ ...l, id: makeId(), createdAt: now }));
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  soundEnabled: true,
  notificationsEnabled: true,
  dailyFocusGoalSeconds: 10800, // 3 hours
  theme: 'dark',
};

export const HABIT_SECTIONS: { value: HabitSection; label: string; dot: string; text: string }[] = [
  { value: 'morning', label: 'Morning', dot: 'bg-amber-400', text: 'text-amber-400' },
  { value: 'afternoon', label: 'Afternoon', dot: 'bg-sky-400', text: 'text-sky-400' },
  { value: 'night', label: 'Night', dot: 'bg-indigo-400', text: 'text-indigo-400' },
  { value: 'others', label: 'Others', dot: 'bg-gray-400', text: 'text-gray-400' },
];

export const HABIT_SECTION_ORDER: HabitSection[] = ['morning', 'afternoon', 'night', 'others'];

export const HABIT_ICONS = [
  '😊', '💪', '📚', '🧘', '🏃', '🌙', '☀️', '🥗', '💧', '✍️',
  '🎯', '🧠', '🎵', '🌱', '💻', '🎨', '📖', '🚶', '🛌', '🙏',
];

export const LIST_COLORS = ['#6366f1', '#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

export const LIST_ICONS = ['📋', '🎮', '💼', '🏠', '📘', '🏋️', '🎨', '✈️', '🛒', '❤️', '💻', '🧪'];

export const TIME_GOAL_OPTIONS = [
  { label: '15 minutes', seconds: 900 },
  { label: '30 minutes', seconds: 1800 },
  { label: '1 hour', seconds: 3600 },
  { label: '2 hours', seconds: 7200 },
  { label: '3 hours', seconds: 10800 },
  { label: '4 hours', seconds: 14400 },
  { label: '6 hours', seconds: 21600 },
  { label: '8 hours', seconds: 28800 },
];

export function goalOptionLabel(seconds: number): string {
  const found = TIME_GOAL_OPTIONS.find((o) => o.seconds === seconds);
  if (found) return found.label;
  const h = seconds / 3600;
  if (h >= 1) return `${h} hours`;
  return `${Math.round(seconds / 60)} minutes`;
}
