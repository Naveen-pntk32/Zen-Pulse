import { useMemo, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { TaskListSidebar } from "@/components/tasks/TaskListSidebar";
import { CompletedFilters } from "@/components/tasks/CompletedFilters";
import { CompletedTaskGroup } from "@/components/tasks/CompletedTaskGroup";
import { useTasks } from "@/services/task.service";
import { useTaskLists } from "@/services/task-list.service";
import { getLocalDateKey, addDays, parseLocalDateKey } from "@/lib/date";

function inDateRange(completedAt, filter, from, to) {
  if (!completedAt) return false;
  const key = completedAt.slice(0, 10);
  if (filter === "all")    return true;
  if (filter === "today")  return key === getLocalDateKey();
  if (filter === "7")      return key >= getLocalDateKey(addDays(new Date(), -6));
  if (filter === "30")     return key >= getLocalDateKey(addDays(new Date(), -29));
  if (filter === "custom") {
    if (from && key < from) return false;
    if (to   && key > to)   return false;
    return true;
  }
  return true;
}

function CompletedTasksPage() {
  const { data: tasks, isLoading } = useTasks({ status: "completed" });
  const { data: lists }            = useTaskLists();

  const [dateFilter, setDateFilter] = useState("all");
  const [listFilter, setListFilter] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");

  const groups = useMemo(() => {
    const filtered = (tasks ?? []).filter((t) => {
      if (!inDateRange(t.completedAt, dateFilter, customFrom, customTo)) return false;
      if (listFilter !== "all" && t.taskListId !== listFilter) return false;
      return true;
    });

    const byDate = new Map();
    for (const t of filtered) {
      const key = t.completedAt?.slice(0, 10) ?? "";
      if (!key) continue;
      const arr = byDate.get(key) ?? [];
      arr.push(t);
      byDate.set(key, arr);
    }
    return Array.from(byDate.entries()).sort(
      (a, b) => parseLocalDateKey(b[0]).getTime() - parseLocalDateKey(a[0]).getTime()
    );
  }, [tasks, dateFilter, listFilter, customFrom, customTo]);

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 max-w-6xl mx-auto animate-fade-in">
      {/* Secondary nav */}
      <TaskListSidebar />

      {/* Main content */}
      <div className="flex-1 min-w-0">

        {/* Header */}
        <div className="mb-6 pb-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2.5 text-foreground">
              <CheckCircle2 className="w-5 h-5 text-greptile-green" />
              Completed Archive
            </h1>
            <span className="badge-tech badge-tech-green">
              {(tasks ?? []).length} RESOLVED
            </span>
          </div>
          <p className="text-xs font-sans text-muted-foreground mt-1">
            Historical log of all resolved tasks grouped by completion date.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <CompletedFilters
            lists={lists ?? []}
            dateFilter={dateFilter}   onDateFilter={setDateFilter}
            listFilter={listFilter}   onListFilter={setListFilter}
            customFrom={customFrom}   onCustomFrom={setCustomFrom}
            customTo={customTo}       onCustomTo={setCustomTo}
          />
        </div>

        {/* Task groups */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-greptile-green" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-[6px] border border-dashed border-border/60 bg-surface/30 space-y-3">
            <CheckCircle2 className="w-10 h-10 mx-auto text-muted-foreground/30" />
            <p className="text-sm font-bold font-display text-foreground">
              No completed tasks match your filters
            </p>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Try adjusting the date range or list filter
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map(([date, dateTasks]) => (
              <CompletedTaskGroup
                key={date}
                date={date}
                tasks={dateTasks}
                lists={lists ?? []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { CompletedTasksPage as default };
