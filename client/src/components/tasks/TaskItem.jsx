import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Calendar, Flag, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateTask, useDeleteTask } from "@/services/task.service";

const PRIORITY_CONFIG = {
  low:    { color: "#71adff", label: "LOW",  bg: "rgba(113,173,255,0.12)", border: "rgba(113,173,255,0.3)" },
  medium: { color: "#daff01", label: "MED",  bg: "rgba(218,255,1,0.12)",   border: "rgba(218,255,1,0.3)" },
  high:   { color: "#ff6d6d", label: "HIGH", bg: "rgba(255,109,109,0.12)", border: "rgba(255,109,109,0.3)" },
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
        "group flex items-start gap-3 px-4 py-3 rounded-[6px] border transition-all duration-150 relative",
        isCompleted
          ? "bg-surface/60 border-border/40 opacity-60"
          : "bg-surface-raised border-border/80 hover:border-greptile-green/40 hover:bg-surface-elevated",
        deleting && "opacity-30 pointer-events-none"
      )}
    >
      {/* Checkbox */}
      <button
        id={`task-toggle-${task.id}`}
        onClick={handleToggle}
        className={cn(
          "mt-0.5 shrink-0 w-[18px] h-[18px] rounded-[3px] border flex items-center justify-center transition-all duration-150 cursor-pointer",
          isCompleted
            ? "border-greptile-green bg-greptile-green text-black shadow-[0_0_8px_rgba(40,233,159,0.4)]"
            : "border-border-strong hover:border-greptile-green bg-surface"
        )}
        aria-label={isCompleted ? "Mark pending" : "Mark complete"}
      >
        {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
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
            className="w-full bg-surface border border-greptile-green rounded-[3px] px-2 py-0.5 text-sm text-foreground outline-none font-sans"
            autoFocus
          />
        ) : (
          <div
            className={cn(
              "text-sm font-medium break-words cursor-text leading-snug font-sans",
              isCompleted && "line-through text-muted-foreground"
            )}
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
              className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-surface px-1.5 py-0.5 rounded-[2px] border border-border/60"
            >
              <Calendar className="w-2.5 h-2.5" />
              {dueLabel}
            </span>
          )}
          {task.priority && (
            <span
              className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest font-bold px-1.5 py-0.5 rounded-[2px] border"
              style={{
                color: priority.color,
                backgroundColor: priority.bg,
                borderColor: priority.border,
              }}
            >
              <Flag className="w-2.5 h-2.5" />
              {priority.label}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons — visible on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
        <button
          id={`task-edit-btn-${task.id}`}
          onClick={() => { setDraft(task.title); setEditing(true); }}
          className="p-1 rounded-[3px] text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
          aria-label="Edit task"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          id={`task-delete-btn-${task.id}`}
          onClick={handleDelete}
          className="p-1 rounded-[3px] text-muted-foreground hover:text-bloom hover:bg-bloom/10 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export { TaskItem };
