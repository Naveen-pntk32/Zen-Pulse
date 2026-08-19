function pad(n) {
  return n.toString().padStart(2, "0");
}
function getLocalDateKey(d = /* @__PURE__ */ new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function parseLocalDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatDateKey(date) {
  return getLocalDateKey(date);
}
function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function startOfWeek(d) {
  const date = startOfDay(d);
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  return date;
}
function endOfWeek(d) {
  const date = startOfWeek(d);
  date.setDate(date.getDate() + 6);
  return date;
}
function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addDays(d, days) {
  const date = new Date(d);
  date.setDate(date.getDate() + days);
  return date;
}
function dateKeysInRange(start, end) {
  const keys = [];
  let cursor = startOfDay(start);
  const last = startOfDay(end);
  while (cursor <= last) {
    keys.push(getLocalDateKey(cursor));
    cursor = addDays(cursor, 1);
  }
  return keys;
}
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function formatDayLabel(key) {
  return parseLocalDateKey(key).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function formatDayWithWeekday(key) {
  return parseLocalDateKey(key).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function formatTimeHM(date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
function formatHours(seconds) {
  const hours = seconds / 3600;
  if (hours >= 1) {
    return `${hours.toFixed(2)} hrs`;
  }
  return `${Math.max(0, Math.floor(seconds / 60))} min`;
}
function formatDuration(seconds) {
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor(s % 3600 / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}
function formatClock(ms) {
  const totalSec = Math.floor(ms / 1e3);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor(totalSec % 3600 / 60);
  const s = totalSec % 60;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}
export {
  addDays,
  dateKeysInRange,
  endOfMonth,
  endOfWeek,
  formatClock,
  formatDateKey,
  formatDayLabel,
  formatDayWithWeekday,
  formatDuration,
  formatHours,
  formatTimeHM,
  getLocalDateKey,
  isSameDay,
  pad,
  parseLocalDateKey,
  startOfDay,
  startOfMonth,
  startOfWeek
};
