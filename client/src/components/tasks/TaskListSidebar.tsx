import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Plus, CheckCircle2, CheckSquare, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskLists } from '@/services/task-list.service';
import { CreateListDialog } from '@/components/tasks/CreateListDialog';
import { Button } from '@/components/ui/button';

export function TaskListSidebar() {
  const [location] = useLocation();
  const { data: lists, isLoading } = useTaskLists();
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentListId = location.startsWith('/tasks/') && !location.startsWith('/tasks/completed')
    ? location.split('/')[2]
    : null;
  const isCompleted = location.startsWith('/tasks/completed');
  const isAll = location === '/tasks';

  return (
    <div className="w-full md:w-56 shrink-0 md:border-r md:border-gray-800 md:pr-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Lists</h2>
      </div>

      <nav className="space-y-1">
        <Link
          href="/tasks"
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
            isAll ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-400 hover:text-white hover:bg-gray-700/60',
          )}
        >
          <CheckSquare className="w-4 h-4" />
          All Tasks
        </Link>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
          </div>
        ) : (
          (lists ?? []).map((list) => (
            <Link
              key={list.id}
              href={`/tasks/${list.id}`}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                currentListId === list.id
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/60',
              )}
            >
              <span className="text-base leading-none">{list.icon || '📋'}</span>
              <span className="truncate">{list.name}</span>
            </Link>
          ))
        )}
      </nav>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <Link
          href="/tasks/completed"
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
            isCompleted ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white hover:bg-gray-700/60',
          )}
        >
          <CheckCircle2 className="w-4 h-4" />
          Completed
        </Link>
      </div>

      <div className="mt-4">
        <Button
          variant="ghost"
          onClick={() => setDialogOpen(true)}
          className="w-full justify-start gap-2.5 px-3 text-sm text-gray-400 hover:text-white hover:bg-gray-700/60 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Add Custom List
        </Button>
      </div>

      <CreateListDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
