import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useCreateTask } from "@/services/task.service";

const PRIORITIES = [
  { value: "low",    label: "Low",    color: "#60a5fa" },
  { value: "medium", label: "Med",    color: "#f59e0b" },
  { value: "high",   label: "High",   color: "#ef4444" },
];

function AddTaskForm({ listId }) {
  const createTask = useCreateTask();
  const [open,     setOpen]     = useState(false);
  const [title,    setTitle]    = useState("");
  const [dueDate,  setDueDate]  = useState("");
  const [dueTime,  setDueTime]  = useState("");
  const [priority, setPriority] = useState("medium");

  const reset = () => {
    setTitle(""); setDueDate(""); setDueTime(""); setPriority("medium"); setOpen(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await createTask.mutateAsync({
      title: title.trim(),
      taskListId: listId,
      dueDate:  dueDate  || null,
      dueTime:  dueTime  || null,
      priority,
    });
    reset();
  };

  /* ── Collapsed trigger ───────────────────────────────────── */
  if (!open) {
    return (
      <button
        id="add-task-trigger"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border border-dashed text-sm font-medium transition-all duration-150"
        style={{
          borderColor: "var(--border-strong)",
          color: "var(--text-muted)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--brand-blue)";
          e.currentTarget.style.color       = "var(--brand-blue)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-strong)";
          e.currentTarget.style.color       = "var(--text-muted)";
        }}
      >
        <Plus className="w-4 h-4" />
        Add task
      </button>
    );
  }

  /* ── Expanded form ───────────────────────────────────────── */
  return (
    <div
      id="add-task-form"
      className="rounded-xl border p-4 space-y-3 animate-slide-up"
      style={{
        background:   "var(--surface-raised)",
        borderColor:  "var(--brand-blue)",
        boxShadow:    "0 0 0 3px rgba(71,114,250,0.08)",
      }}
    >
      {/* Title input */}
      <input
        id="add-task-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What do you need to do?"
        autoFocus
        className="w-full bg-transparent text-sm outline-none"
        style={{ color: "var(--text-primary)" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") reset();
        }}
      />

      {/* Date / time / priority row */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          id="add-task-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="text-xs rounded-lg px-2.5 py-1.5 outline-none [color-scheme:dark] transition-colors duration-150"
          style={{
            background:   "var(--surface)",
            border:       "1px solid var(--border)",
            color:        dueDate ? "var(--text-primary)" : "var(--text-muted)",
          }}
        />
        <input
          id="add-task-due-time"
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          className="text-xs rounded-lg px-2.5 py-1.5 outline-none [color-scheme:dark] transition-colors duration-150"
          style={{
            background:   "var(--surface)",
            border:       "1px solid var(--border)",
            color:        dueTime ? "var(--text-primary)" : "var(--text-muted)",
          }}
        />

        {/* Priority pills */}
        <div className="flex items-center gap-1 ml-auto">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              id={`priority-${p.value}`}
              type="button"
              onClick={() => setPriority(p.value)}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-150"
              style={{
                color:      priority === p.value ? "#fff" : p.color,
                background: priority === p.value ? p.color : `${p.color}18`,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          id="add-task-cancel"
          type="button"
          onClick={reset}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--surface-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
        >
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
        <button
          id="add-task-submit"
          type="button"
          onClick={handleSubmit}
          disabled={!title.trim() || createTask.isPending}
          className="btn-pill btn-primary px-4 py-1.5 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createTask.isPending ? "Adding…" : "Add Task"}
        </button>
      </div>
    </div>
  );
}

export { AddTaskForm };
