import { CheckCircle2, Clock } from 'lucide-react';
import { Task, TaskList } from '@/types';

export function CompletedTaskItem({
  task,
  list,
}: {
  task: Task;
  list?: TaskList | null;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/60 border border-gray-700/60">
      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-300 line-through truncate">{task.title}</div>
      </div>
      {list && (
        <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
          <span>{list.icon || '📋'}</span>
          {list.name}
        </span>
      )}
      {task.completedAt && (
        <span className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
          <Clock className="w-3 h-3" />
          {new Date(task.completedAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </span>
      )}
    </div>
  );
}