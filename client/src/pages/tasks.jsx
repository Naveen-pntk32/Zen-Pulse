import { Loader2, CheckCircle2, Inbox, CheckSquare } from "lucide-react";
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
    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
      {/* ── Secondary nav: task lists ─────────────────────── */}
      <TaskListSidebar />

      {/* ── Main content ─────────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Page header */}
        <div className="mb-6">
          <h1
            className="text-xl font-bold flex items-center gap-2 mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {isAll ? (
              <>
                <CheckSquare className="w-5 h-5" style={{ color: "var(--brand-blue)" }} />
                All Tasks
              </>
            ) : (
              <>
                <span className="text-xl leading-none">{currentList?.icon || "📋"}</span>
                {currentList?.name ?? "Tasks"}
              </>
            )}
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {isAll
              ? "All your tasks across every list"
              : `Tasks in the ${currentList?.name ?? "this"} list`}
          </p>

          {/* Pending / completed summary */}
          {!isAll && (tasks ?? []).length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#4ade80" }} />
                {completed.length} completed
              </span>
              <span className="text-xs" style={{ color: "var(--border-strong)" }}>·</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {pending.length} pending
              </span>
            </div>
          )}
        </div>

        {/* Task list */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2
              className="w-5 h-5 animate-spin"
              style={{ color: "var(--brand-blue)" }}
            />
          </div>
        ) : (tasks ?? []).length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Inbox
              className="w-12 h-12 mx-auto opacity-20"
              style={{ color: "var(--text-primary)" }}
            />
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              No tasks yet
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Add a task below to get started
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Pending tasks */}
            {pending.map((task) => (
              <TaskItem key={task.id} task={task} listIcon={currentList?.icon} />
            ))}

            {/* Completed tasks (collapsed section) */}
            {completed.length > 0 && (
              <div className="pt-4">
                <div
                  className="text-[10px] font-semibold uppercase tracking-widest mb-2 px-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Completed ({completed.length})
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

        {/* Add task form */}
        <div className="mt-4">
          <AddTaskForm listId={listId ?? null} />
        </div>
      </div>
    </div>
  );
}

export { TasksPage as default };
