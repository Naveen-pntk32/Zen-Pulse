import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Plus, CheckCircle2, CheckSquare, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskLists } from "@/services/task-list.service";
import { CreateListDialog } from "@/components/tasks/CreateListDialog";

function NavLink({ href, icon: Icon, label, active, id }) {
  return (
    <Link
      href={href}
      id={id}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-150 cursor-pointer",
        active
          ? "bg-greptile-green/15 text-greptile-green border-l-2 border-greptile-green"
          : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
      )}
    >
      <Icon
        className={cn(
          "w-3.5 h-3.5 shrink-0",
          active ? "text-greptile-green" : "text-muted-foreground"
        )}
      />
      <span className="truncate flex-1">{label}</span>
      {active && (
        <span className="w-1.5 h-1.5 rounded-full bg-greptile-green shadow-[0_0_6px_#28e99f]" />
      )}
    </Link>
  );
}

function TaskListSidebar() {
  const [location] = useLocation();
  const { data: lists, isLoading } = useTaskLists();
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentListId =
    location.startsWith("/tasks/") && !location.startsWith("/tasks/completed")
      ? location.split("/")[2]
      : null;
  const isCompleted = location.startsWith("/tasks/completed");
  const isAll       = location === "/tasks";

  return (
    <div
      id="task-list-sidebar"
      className="w-full md:w-56 shrink-0 md:pr-4 md:border-r border-border/40"
    >
      {/* Section label */}
      <div className="flex items-center justify-between px-3 mb-2">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
          // TASK LISTS
        </p>
        <button
          onClick={() => setDialogOpen(true)}
          className="p-1 rounded-[3px] text-muted-foreground hover:text-greptile-green hover:bg-greptile-green/10 transition-colors"
          title="Create New List"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <nav className="space-y-1">
        {/* All Tasks */}
        <NavLink
          href="/tasks"
          id="nav-all-tasks"
          icon={CheckSquare}
          label="All Tasks"
          active={isAll}
        />

        {/* User lists */}
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2
              className="w-4 h-4 animate-spin text-greptile-green"
            />
          </div>
        ) : (
          (lists ?? []).map((list) => {
            const active = currentListId === list.id;
            return (
              <Link
                key={list.id}
                href={`/tasks/${list.id}`}
                id={`nav-list-${list.id}`}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-150 cursor-pointer",
                  active
                    ? "bg-greptile-green/15 text-greptile-green border-l-2 border-greptile-green"
                    : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                )}
              >
                <span className="text-xs leading-none shrink-0">{list.icon || "📋"}</span>
                <span className="truncate flex-1 font-sans capitalize normal-case text-xs font-medium text-inherit">
                  {list.name}
                </span>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-greptile-green shadow-[0_0_6px_#28e99f]" />
                )}
              </Link>
            );
          })
        )}
      </nav>

      {/* Divider */}
      <div className="my-3 mx-2 h-px bg-border/40" />

      {/* Completed link */}
      <NavLink
        href="/tasks/completed"
        id="nav-completed-tasks"
        icon={CheckCircle2}
        label="Completed Tasks"
        active={isCompleted}
      />

      {/* Add list button */}
      <button
        id="add-list-btn"
        onClick={() => setDialogOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-[4px] border border-dashed border-border/60 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-greptile-green hover:border-greptile-green/50 hover:bg-greptile-green/5 transition-all mt-3"
      >
        <Plus className="w-3.5 h-3.5 text-greptile-green" />
        <span>+ Add List</span>
      </button>

      <CreateListDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

export { TaskListSidebar };
