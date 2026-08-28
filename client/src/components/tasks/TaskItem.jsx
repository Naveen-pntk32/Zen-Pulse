import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Calendar, Flag, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateTask, useDeleteTask } from "@/services/task.service";

const PRIORITY_CONFIG = {
  low:    { color: "#60a5fa", label: "Low",    bg: "rgba(96,165,250,0.12)"  },
  medium: { color: "#f59e0b", label: "Medium", bg: "rgba(245,158,11,0.12)" },
  high:   { color: "#ef4444", label: "High",   bg: "rgba(239,68,68,0.12)"  },
};

function TaskItem({ task, listIcon }) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [editing, setEditing]   = useState(false);
  const [draft,   setDraft]     = useState(task.title);
  const [deleting, setDeleting] = useState(false);

  const isCompleted = task.status === "completed";

  const handleToggle = () => {
    updateTask.mutate({
      id: task.id,
      patch: {
        status:      isCompleted ? "pending" : "completed",
        completedAt: isCompleted ? null : new Date().toISOString(),
      },
    });
  };

  const saveEdit = () => {
    if (draft.trim() && draft.trim() !== task.title) {
      updateTask.mutate({ id: task.id, patch: { title: draft.trim() } });
    }
    setEditing(false);
  };

  const handleDelete = () => {
    setDeleting(true);
    deleteTask.mutate(task.id);
  };

  const dueLabel = task.dueDate
    ? new Date(`${task.dueDate}T${task.dueTime ?? "00:00"}`).toLocaleDateString("en-US", {
        month: "short", day: "numeric",
      })
    : null;

  const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;

  return (
    <div
      id={`task-item-${task.id}`}
      className={cn(
        "group flex items-start gap-3 px-4 py-3 rounded-xl border transition-all duration-150",
        isCompleted ? "opacity-55" : "hover:border-white/[0.14]",
        deleting && "opacity-30 pointer-events-none"
      )}
      style={{
        background: isCompleted ? "var(--surface)" : "var(--surface-raised)",
        borderColor: "var(--border)",
      }}
    >
      {/* Checkbox */}
      <button
        id={`task-toggle-${task.id}`}
        onClick={handleToggle}
        className="mt-0.5 shrink-0 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all duration-150"
        style={{
          borderColor: isCompleted ? "var(--brand-blue)" : "var(--border-strong)",
          background:  isCompleted ? "var(--brand-blue)" : "transparent",
        }}
        aria-label={isCompleted ? "Mark pending" : "Mark complete"}
      >
        {isCompleted && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            id={`task-edit-${task.id}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(false); }}
            className="w-full bg-transparent text-sm outline-none py-0.5"
            style={{
              color: "var(--text-primary)",
              borderBottom: "1px solid var(--brand-blue)",
            }}
            autoFocus
          />
        ) : (
          <div
            className={cn(
              "text-sm break-words cursor-text leading-snug",
              isCompleted && "line-through"
            )}
            style={{ color: isCompleted ? "var(--text-muted)" : "var(--text-primary)" }}
            onDoubleClick={() => { setDraft(task.title); setEditing(true); }}
          >
            {task.title}
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          {listIcon && (
            <span className="text-xs">{listIcon}</span>
          )}
          {dueLabel && (
            <span
              className="flex items-center gap-1 text-[11px]"
              style={{ color: "var(--text-muted)" }}
            >
              <Calendar className="w-3 h-3" />
              {dueLabel}
            </span>
          )}
          {task.priority && (
            <span
              className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md"
              style={{ color: priority.color, background: priority.bg }}
            >
              <Flag className="w-2.5 h-2.5" />
              {priority.label}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons — visible on hover */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
        <button
          id={`task-edit-btn-${task.id}`}
          onClick={() => { setDraft(task.title); setEditing(true); }}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--surface-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
          aria-label="Edit task"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          id={`task-delete-btn-${task.id}`}
          onClick={handleDelete}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
          aria-label="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export { TaskItem };
