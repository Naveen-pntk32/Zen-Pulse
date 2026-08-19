import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task, TaskPriority } from '@/types';
import { useUpdateTask, useDeleteTask } from '@/services/task.service';

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: 'text-sky-400',
  medium: 'text-amber-400',
  high: 'text-red-400',
};

export function TaskItem({
  task,
  listIcon,
}: {
  task: Task;
  listIcon?: string;
}) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const handleToggle = () => {
    updateTask.mutate({
      id: task.id,
      patch: {
        status: task.status === 'completed' ? 'pending' : 'completed',
        completedAt: task.status === 'completed' ? null : new Date().toISOString(),
      },
    });
  };

  const saveEdit = () => {
    if (draft.trim() && draft.trim() !== task.title) {
      updateTask.mutate({ id: task.id, patch: { title: draft.trim() } });
    }
    setEditing(false);
  };

  const dueLabel = task.dueDate
    ? new Date(`${task.dueDate}T${task.dueTime ?? '00:00'}`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div
      className={cn(
        'group p-3 rounded-2xl border transition-all',
        task.status === 'completed'
          ? 'bg-gray-800/40 border-gray-700/50 opacity-70'
          : 'bg-gray-800 border-gray-700 hover:border-gray-600',
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.status === 'completed'}
          onCheckedChange={handleToggle}
          className="mt-0.5 border-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
        />

        <div className="flex-1 min-w-0">
          {editing ? (
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
              className="bg-gray-900 border-gray-600 text-white h-8 py-1"
              autoFocus
            />
          ) : (
            <div
              className={cn(
                'font-medium text-sm break-words cursor-text',
                task.status === 'completed' && 'line-through text-gray-500',
              )}
              onDoubleClick={() => {
                setDraft(task.title);
                setEditing(true);
              }}
            >
              {task.title}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-400">
            {listIcon && <span>{listIcon}</span>}
            {dueLabel && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {dueLabel}
              </span>
            )}
            <span className={cn('font-medium uppercase text-[10px] tracking-wide', PRIORITY_STYLES[task.priority])}>
              {task.priority}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={() => {
              setDraft(task.title);
              setEditing(true);
            }}
            aria-label="Edit task"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-red-400/10"
            onClick={() => deleteTask.mutate(task.id)}
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
