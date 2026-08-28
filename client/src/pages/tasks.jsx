import { Loader2, CheckCircle2, Inbox, CheckSquare, Plus } from "lucide-react";
import { TaskListSidebar } from "@/components/tasks/TaskListSidebar";
import { TaskItem } from "@/components/tasks/TaskItem";
import { AddTaskForm } from "@/components/tasks/AddTaskForm";
import { useTasks } from "@/services/task.service";
import { useTaskLists } from "@/services/task-list.service";

function TasksPage({ params }) {
  const listId      = params?.listId;
  const isAll       = !listId;

  const { data: lists }                    = useTaskLists();
  const { data: tasks, isLoading }         = useTasks(isAll ? undefined : { listId });

  const currentList  = isAll ? null : (lists ?? []).find((l) => l.id === listId);
  const pending      = (tasks ?? []).filter((t) => t.status === "pending");
  const completed    = (tasks ?? []).filter((t) => t.status === "completed");

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 max-w-6xl mx-auto animate-fade-in">
      {/* ── Secondary nav: task lists ─────────────────────── */}
      <TaskListSidebar />

      {/* ── Main content ─────────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Page header */}
        <div className="mb-6 pb-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2.5 text-foreground">
              {isAll ? (
                <>
                  <CheckSquare className="w-5 h-5 text-greptile-green" />
                  All Tasks
                </>
              ) : (
                <>
                  <span className="text-xl leading-none">{currentList?.icon || "📋"}</span>
                  {currentList?.name ?? "Tasks"}
                </>
              )}
            </h1>

            {/* Monospace Task Stats Counter */}
            <div className="flex items-center gap-2">
              <span className="badge-tech badge-tech-green">
                {completed.length} DONE
              </span>
              <span className="badge-tech">
                {pending.length} PENDING
              </span>
            </div>
          </div>

          <p className="text-xs font-sans text-muted-foreground mt-1">
            {isAll
              ? "Global task registry across all categories and workflows."
              : `Categorized tasks in ${currentList?.name ?? "this"} list.`}
          </p>
        </div>

        {/* Add task form */}
        <div className="mb-5">
          <AddTaskForm listId={listId ?? null} />
        </div>

        {/* Task list */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-greptile-green" />
          </div>
        ) : (tasks ?? []).length === 0 ? (
          <div className="text-center py-16 px-4 rounded-[6px] border border-dashed border-border/60 bg-surface/30 space-y-3">
            <Inbox className="w-10 h-10 mx-auto text-muted-foreground/40" />
            <p className="text-sm font-bold font-display text-foreground">
              No tasks in this list
            </p>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Add a new task above to begin tracking
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Pending tasks */}
            {pending.map((task) => (
              <TaskItem key={task.id} task={task} listIcon={currentList?.icon} />
            ))}

            {/* Completed tasks (collapsed/separate section) */}
            {completed.length > 0 && (
              <div className="pt-6">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/30 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                  <span>// COMPLETED TASKS ({completed.length})</span>
                  <span className="text-greptile-green">RESOLVED</span>
                </div>
                <div className="space-y-2">
                  {completed.map((task) => (
                    <TaskItem key={task.id} task={task} listIcon={currentList?.icon} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { TasksPage as default };
