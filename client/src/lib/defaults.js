import { makeId } from "@/lib/backend";
const DEFAULT_TASK_LISTS = [
  { name: "Gaming", icon: "\u{1F3AE}", color: "#a855f7", sortOrder: 0 },
  { name: "Work", icon: "\u{1F4BC}", color: "#3b82f6", sortOrder: 1 },
  { name: "Personal", icon: "\u{1F3E0}", color: "#22c55e", sortOrder: 2 },
  { name: "Learning", icon: "\u{1F4D8}", color: "#f59e0b", sortOrder: 3 }
];
function buildDefaultTaskLists() {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return DEFAULT_TASK_LISTS.map((l) => ({ ...l, id: makeId(), createdAt: now }));
}
const DEFAULT_USER_SETTINGS = {
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  soundEnabled: true,
  notificationsEnabled: true,
  dailyFocusGoalSeconds: 10800,
  // 3 hours
  theme: "dark"
};
const HABIT_SECTIONS = [
  { value: "morning", label: "Morning", dot: "bg-amber-400", text: "text-amber-400" },
  { value: "afternoon", label: "Afternoon", dot: "bg-sky-400", text: "text-sky-400" },
  { value: "night", label: "Night", dot: "bg-indigo-400", text: "text-indigo-400" },
  { value: "others", label: "Others", dot: "bg-gray-400", text: "text-gray-400" }
];
const HABIT_SECTION_ORDER = ["morning", "afternoon", "night", "others"];
const HABIT_ICONS = [
  "\u{1F60A}",
  "\u{1F4AA}",
  "\u{1F4DA}",
  "\u{1F9D8}",
  "\u{1F3C3}",
  "\u{1F319}",
  "\u2600\uFE0F",
  "\u{1F957}",
  "\u{1F4A7}",
  "\u270D\uFE0F",
  "\u{1F3AF}",
  "\u{1F9E0}",
  "\u{1F3B5}",
  "\u{1F331}",
  "\u{1F4BB}",
  "\u{1F3A8}",
  "\u{1F4D6}",
  "\u{1F6B6}",
  "\u{1F6CC}",
  "\u{1F64F}"
];
const LIST_COLORS = ["#6366f1", "#a855f7", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6"];
const LIST_ICONS = ["\u{1F4CB}", "\u{1F3AE}", "\u{1F4BC}", "\u{1F3E0}", "\u{1F4D8}", "\u{1F3CB}\uFE0F", "\u{1F3A8}", "\u2708\uFE0F", "\u{1F6D2}", "\u2764\uFE0F", "\u{1F4BB}", "\u{1F9EA}"];
const TIME_GOAL_OPTIONS = [
  { label: "15 minutes", seconds: 900 },
  { label: "30 minutes", seconds: 1800 },
  { label: "1 hour", seconds: 3600 },
  { label: "2 hours", seconds: 7200 },
  { label: "3 hours", seconds: 10800 },
  { label: "4 hours", seconds: 14400 },
  { label: "6 hours", seconds: 21600 },
  { label: "8 hours", seconds: 28800 }
];
function goalOptionLabel(seconds) {
  const found = TIME_GOAL_OPTIONS.find((o) => o.seconds === seconds);
  if (found) return found.label;
  const h = seconds / 3600;
  if (h >= 1) return `${h} hours`;
  return `${Math.round(seconds / 60)} minutes`;
}
export {
  DEFAULT_TASK_LISTS,
  DEFAULT_USER_SETTINGS,
  HABIT_ICONS,
  HABIT_SECTIONS,
  HABIT_SECTION_ORDER,
  LIST_COLORS,
  LIST_ICONS,
  TIME_GOAL_OPTIONS,
  buildDefaultTaskLists,
  goalOptionLabel
};
