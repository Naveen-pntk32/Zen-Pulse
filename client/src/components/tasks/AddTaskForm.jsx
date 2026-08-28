import { useState } from "react";
import { Plus, X, Calendar, Clock, Flag } from "lucide-react";
import { useCreateTask } from "@/services/task.service";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRIORITIES = [
  { value: "low",    label: "LOW",  color: "#71adff", bg: "rgba(113,173,255,0.15)", border: "rgba(113,173,255,0.4)" },
  { value: "medium", label: "MED",  color: "#daff01", bg: "rgba(218,255,1,0.15)",   border: "rgba(218,255,1,0.4)" },
  { value: "high",   label: "HIGH", color: "#ff6d6d", bg: "rgba(255,109,109,0.15)", border: "rgba(255,109,109,0.4)" },
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
        className="w-full flex items-center gap-2.5 px-4 py-3 rounded-[6px] border border-dashed border-border/80 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-greptile-green hover:border-greptile-green/50 hover:bg-greptile-green/5 transition-all cursor-pointer group"
      >
        <div className="w-5 h-5 rounded-[3px] bg-surface-raised border border-border flex items-center justify-center group-hover:border-greptile-green/40 group-hover:text-greptile-green">
          <Plus className="w-3.5 h-3.5" />
        </div>
        <span>+ Add New Task</span>
      </button>
    );
  }

  /* ── Expanded form ───────────────────────────────────────── */
  return (
    <div
      id="add-task-form"
      className="rounded-[6px] border border-greptile-green/60 bg-surface-elevated p-4 space-y-3 animate-slide-up shadow-[0_0_20px_rgba(40,233,159,0.1)]"
    >
      {/* Title input */}
      <input
        id="add-task-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title or instruction..."
        autoFocus
        className="w-full bg-surface border border-input-border rounded-[4px] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-greptile-green focus:ring-1 focus:ring-greptile-green/40 font-sans"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") reset();
        }}
      />

      {/* Date / time / priority row */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <div className="flex items-center gap-1 bg-surface px-2.5 py-1 rounded-[4px] border border-border">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            id="add-task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="text-xs bg-transparent text-foreground outline-none [color-scheme:dark] font-mono"
          />
        </div>

        <div className="flex items-center gap-1 bg-surface px-2.5 py-1 rounded-[4px] border border-border">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            id="add-task-due-time"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="text-xs bg-transparent text-foreground outline-none [color-scheme:dark] font-mono"
          />
        </div>

        {/* Priority pills */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mr-1">
            PRIORITY:
          </span>
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              id={`priority-${p.value}`}
              type="button"
              onClick={() => setPriority(p.value)}
              className={cn(
                "px-2 py-0.5 rounded-[3px] text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer",
                priority === p.value
                  ? "border ring-1 ring-offset-1 ring-offset-surface-elevated"
                  : "opacity-60 hover:opacity-100 border border-transparent"
              )}
              style={{
                color: priority === p.value ? p.color : "var(--text-muted)",
                backgroundColor: priority === p.value ? p.bg : "transparent",
                borderColor: priority === p.value ? p.border : "transparent",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
        <Button
          id="add-task-cancel"
          type="button"
          variant="outline"
          size="sm"
          onClick={reset}
        >
          Cancel
        </Button>
        <Button
          id="add-task-submit"
          type="button"
          variant="default"
          size="sm"
          onClick={handleSubmit}
          disabled={!title.trim() || createTask.isPending}
        >
          {createTask.isPending ? "Adding…" : "Add Task"}
        </Button>
      </div>
    </div>
  );
}

export { AddTaskForm };
