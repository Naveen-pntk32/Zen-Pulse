import { useHabits } from "@/services/habit.service";
import { useTasks } from "@/services/task.service";
import { Loader2 } from "lucide-react";

function FocusTargetSelector({ value, onChange, disabled }) {
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  const loading = habitsLoading || tasksLoading;
  const selectedValue = value ? `${value.type}:${value.id}` : "none";

  if (loading) {
    return (
      <div
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <span style={{ color: "var(--text-muted)" }}>Loading targets...</span>
        <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--text-muted)" }} />
      </div>
    );
  }

  return (
    <select
      value={selectedValue}
      onChange={(e) => {
        const v = e.target.value;
        if (v === "none") {
          onChange(null);
          return;
        }
        const [type, id] = v.split(":");
        const name =
          type === "habit"
            ? habits?.find((h) => h.id === id)?.name
            : tasks?.find((t) => t.id === id)?.title;
        onChange({ type, id, name: name ?? "" });
      }}
      disabled={disabled}
      className="w-full px-3.5 py-2.5 rounded-xl text-[13px] font-medium outline-none transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: "var(--surface)",
        border:     "1px solid var(--border-strong)",
        color:      "var(--text-primary)",
      }}
      onFocus={(e) => (e.target.style.borderColor = "var(--brand-blue)")}
      onBlur={(e)  => (e.target.style.borderColor = "var(--border-strong)")}
    >
      <option value="none">No specific target</option>
      
      {habits && habits.length > 0 && (
        <optgroup label="Habits">
          {habits.map((h) => (
            <option key={`habit:${h.id}`} value={`habit:${h.id}`}>
              {h.icon} {h.name}
            </option>
          ))}
        </optgroup>
      )}

      {tasks && tasks.filter((t) => t.status === "pending").length > 0 && (
        <optgroup label="Tasks">
          {tasks
            .filter((t) => t.status === "pending")
            .map((t) => (
              <option key={`task:${t.id}`} value={`task:${t.id}`}>
                {t.title}
              </option>
            ))}
        </optgroup>
      )}
    </select>
  );
}

export { FocusTargetSelector };
