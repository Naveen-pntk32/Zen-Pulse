import { CheckCircle2, Clock } from "lucide-react";

function CompletedTaskItem({ task, list }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl border"
      style={{
        background:   "var(--surface)",
        borderColor:  "var(--border)",
      }}
    >
      {/* Filled circle indicator */}
      <div
        className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
        style={{ background: "rgba(74,222,128,0.2)" }}
      >
        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#4ade80" }} />
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <div
          className="text-sm truncate line-through"
          style={{ color: "var(--text-muted)" }}
        >
          {task.title}
        </div>
      </div>

      {/* List badge */}
      {list && (
        <span
          className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md shrink-0"
          style={{
            color:      "var(--text-secondary)",
            background: "var(--surface-raised)",
          }}
        >
          <span>{list.icon || "📋"}</span>
          {list.name}
        </span>
      )}

      {/* Time */}
      {task.completedAt && (
        <span
          className="flex items-center gap-1 text-xs shrink-0"
          style={{ color: "var(--text-muted)" }}
        >
          <Clock className="w-3 h-3" />
          {new Date(task.completedAt).toLocaleTimeString("en-US", {
            hour: "numeric", minute: "2-digit", hour12: true,
          })}
        </span>
      )}
    </div>
  );
}

export { CompletedTaskItem };
