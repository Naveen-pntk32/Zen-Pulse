import { CompletedTaskItem } from "@/components/tasks/CompletedTaskItem";
import { formatDayWithWeekday } from "@/lib/date";

function CompletedTaskGroup({ date, tasks, lists }) {
  return (
    <div>
      {/* Date heading */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span
          className="text-xs font-semibold px-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {formatDayWithWeekday(date)}
        </span>
        <span
          className="text-xs px-1.5 py-0.5 rounded-full font-medium"
          style={{
            color:      "var(--text-muted)",
            background: "var(--surface-raised)",
          }}
        >
          {tasks.length}
        </span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <CompletedTaskItem
            key={task.id}
            task={task}
            list={task.taskListId ? lists.find((l) => l.id === task.taskListId) : null}
          />
        ))}
      </div>
    </div>
  );
}

export { CompletedTaskGroup };
