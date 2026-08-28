import { CheckCircle2, Clock } from "lucide-react";

function CompletedTaskItem({ task, list }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-[6px] border border-border/60 bg-surface/50 hover:bg-surface-raised transition-colors"
    >
      {/* Filled circle indicator */}
      <div
        className="w-4 h-4 rounded-[3px] shrink-0 flex items-center justify-center bg-greptile-green/20 text-greptile-green"
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <div
          className="text-xs font-sans truncate line-through text-muted-foreground"
        >
          {task.title}
        </div>
      </div>

      {/* List badge */}
      {list && (
        <span
          className="badge-tech text-[10px] py-0 px-2 shrink-0 bg-surface"
        >
          <span>{list.icon || "📋"}</span>
          <span>{list.name}</span>
        </span>
      )}

      {/* Time */}
      {task.completedAt && (
        <span
          className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground/80 shrink-0"
        >
          <Clock className="w-2.5 h-2.5" />
          {new Date(task.completedAt).toLocaleTimeString("en-US", {
            hour: "numeric", minute: "2-digit", hour12: true,
          })}
        </span>
      )}
    </div>
  );
}

export { CompletedTaskItem };
