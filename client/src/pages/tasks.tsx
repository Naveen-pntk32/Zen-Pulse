import { Loader2, CheckCircle2, Inbox } from 'lucide-react';
import { TaskListSidebar } from '@/components/tasks/TaskListSidebar';
import { TaskItem } from '@/components/tasks/TaskItem';
import { AddTaskForm } from '@/components/tasks/AddTaskForm';
import { useTasks } from '@/services/task.service';
import { useTaskLists } from '@/services/task-list.service';

export default function TasksPage({ params }: { params?: { listId?: string } }) {
  const listId = params?.listId;
  const isAll = !listId;

  const { data: lists } = useTaskLists();
  const { data: tasks, isLoading } = useTasks(isAll ? undefined : { listId });

  const currentList = isAll ? null : (lists ?? []).find((l) => l.id === listId);
  const pending = (tasks ?? []).filter((t) => t.status === 'pending');
  const completed = (tasks ?? []).filter((t) => t.status === 'completed');

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <TaskListSidebar />

      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {isAll ? (
              'All Tasks'
            ) : (
              <>
                <span>{currentList?.icon || '📋'}</span>
                {currentList?.name ?? 'Tasks'}
              </>
            )}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {isAll
              ? 'All your tasks across every list'
              : `Tasks in the ${currentList?.name ?? 'this'} list`}
          </p>
          {!isAll && (
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              {completed.length} completed · {pending.length} pending
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : (tasks ?? []).length === 0 ? (
          <div className="text-center text-gray-500 py-16 space-y-2">
            <Inbox className="w-12 h-12 mx-auto opacity-40" />
            <p>No tasks here yet</p>
            <p className="text-sm">Add a task to get started</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {pending.map((task) => (
              <TaskItem key={task.id} task={task} listIcon={currentList?.icon} />
            ))}
            {completed.length > 0 && (
              <div className="pt-3">
                <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                  Completed ({completed.length})
                </div>
                {completed.map((task) => (
                  <TaskItem key={task.id} task={task} listIcon={currentList?.icon} />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-4">
          <AddTaskForm listId={listId ?? null} />
        </div>
      </div>
    </div>
  );
}
