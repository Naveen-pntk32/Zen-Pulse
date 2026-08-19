import { CompletedTaskItem } from "@/components/tasks/CompletedTaskItem";
import { formatDayWithWeekday } from "@/lib/date";
function CompletedTaskGroup({
  date,
  tasks,
  lists
}) {
  return <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-gray-300">{formatDayWithWeekday(date)}</span>
        <span className="text-xs text-gray-500">({tasks.length})</span>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => <CompletedTaskItem
    key={task.id}
    task={task}
    list={task.taskListId ? lists.find((l) => l.id === task.taskListId) : null}
  />)}
      </div>
    </div>;
}
export {
  CompletedTaskGroup
};
