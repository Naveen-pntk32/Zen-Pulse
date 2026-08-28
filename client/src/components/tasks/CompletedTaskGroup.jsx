import { CompletedTaskItem } from "@/components/tasks/CompletedTaskItem";
import { formatDayWithWeekday } from "@/lib/date";

function CompletedTaskGroup({ date, tasks, lists }) {
  return (
    <div className="space-y-2">
      {/* Date heading */}
      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-border/40" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
            {formatDayWithWeekday(date)}
          </span>
          <span className="badge-tech badge-tech-green text-[10px] px-1.5 py-0">
            {tasks.length}
          </span>
        </div>
        <div className="h-px flex-1 bg-border/40" />
      </div>

      <div className="space-y-1.5">
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
