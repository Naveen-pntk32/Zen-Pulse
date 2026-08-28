import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Plus, CheckCircle2, CheckSquare, Loader2, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskLists } from "@/services/task-list.service";
import { CreateListDialog } from "@/components/tasks/CreateListDialog";

function NavLink({ href, icon: Icon, label, active, id }) {
  return (
    <Link
      href={href}
      id={id}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
        active ? "nav-active" : "text-zp-secondary hover:bg-zp-surface hover:text-zp-primary"
      )}
    >
      <Icon
        className="w-[15px] h-[15px] shrink-0"
        style={{ color: active ? "var(--brand-blue)" : undefined }}
      />
      <span className="truncate">{label}</span>
      {active && (
        <span
          className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: "var(--brand-blue)" }}
        />
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
      className="w-full md:w-52 shrink-0 md:pr-4"
      style={{ borderRight: "none" }}
    >
      {/* Section label */}
      <p
        className="px-3 text-[10px] font-semibold uppercase tracking-widest mb-2"
        style={{ color: "var(--text-muted)" }}
      >
        Task Lists
      </p>

      <nav className="space-y-0.5">
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
              className="w-4 h-4 animate-spin"
              style={{ color: "var(--text-muted)" }}
            />
          </div>
        ) : (
          (lists ?? []).map((list) => (
            <Link
              key={list.id}
              href={`/tasks/${list.id}`}
              id={`nav-list-${list.id}`}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
                currentListId === list.id
                  ? "nav-active"
                  : "text-zp-secondary hover:bg-zp-surface hover:text-zp-primary"
              )}
            >
              <span className="text-sm leading-none shrink-0">{list.icon || "📋"}</span>
              <span className="truncate flex-1">{list.name}</span>
              {currentListId === list.id && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: "var(--brand-blue)" }}
                />
              )}
            </Link>
          ))
        )}
      </nav>

      {/* Divider */}
      <div className="my-3 mx-3 h-px" style={{ background: "var(--border)" }} />

      {/* Completed link */}
      <NavLink
        href="/tasks/completed"
        id="nav-completed-tasks"
        icon={CheckCircle2}
        label="Completed"
        active={isCompleted}
      />

      {/* Add list button */}
      <button
        id="add-list-btn"
        onClick={() => setDialogOpen(true)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium mt-1 transition-all duration-150"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--brand-blue)"; e.currentTarget.style.background = "rgba(71,114,250,0.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
      >
        <Plus className="w-[15px] h-[15px]" />
        Add List
      </button>

      <CreateListDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

export { TaskListSidebar };
