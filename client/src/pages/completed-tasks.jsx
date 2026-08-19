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
  if (filter === "all") return true;
  if (filter === "today") return key === getLocalDateKey();
  if (filter === "7") {
    const cutoff = getLocalDateKey(addDays(/* @__PURE__ */ new Date(), -6));
    return key >= cutoff;
  }
  if (filter === "30") {
    const cutoff = getLocalDateKey(addDays(/* @__PURE__ */ new Date(), -29));
    return key >= cutoff;
  }
  if (filter === "custom") {
    if (from && key < from) return false;
    if (to && key > to) return false;
    return true;
  }
  return true;
}
function CompletedTasksPage() {
  const { data: tasks, isLoading } = useTasks({ status: "completed" });
  const { data: lists } = useTaskLists();
  const [dateFilter, setDateFilter] = useState("all");
  const [listFilter, setListFilter] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const groups = useMemo(() => {
    const filtered = (tasks ?? []).filter((t) => {
      if (!inDateRange(t.completedAt, dateFilter, customFrom, customTo)) return false;
      if (listFilter !== "all" && t.taskListId !== listFilter) return false;
      return true;
    });
    const byDate = /* @__PURE__ */ new Map();
    for (const t of filtered) {
      const key = t.completedAt?.slice(0, 10) ?? "";
      if (!key) continue;
      const arr = byDate.get(key) ?? [];
      arr.push(t);
      byDate.set(key, arr);
    }
    return Array.from(byDate.entries()).sort((a, b) => parseLocalDateKey(b[0]).getTime() - parseLocalDateKey(a[0]).getTime());
  }, [tasks, dateFilter, listFilter, customFrom, customTo]);
  return <div className="flex flex-col md:flex-row gap-6">
      <TaskListSidebar />

      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            Completed Tasks
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            View and manage all your completed tasks
          </p>
        </div>

        <div className="mb-6">
          <CompletedFilters
    lists={lists ?? []}
    dateFilter={dateFilter}
    onDateFilter={setDateFilter}
    listFilter={listFilter}
    onListFilter={setListFilter}
    customFrom={customFrom}
    customTo={customTo}
    onCustomFrom={setCustomFrom}
    onCustomTo={setCustomTo}
  />
        </div>

        {isLoading ? <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div> : groups.length === 0 ? <div className="text-center text-gray-500 py-16">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-40" />
            <p>No completed tasks match your filters</p>
          </div> : <div className="space-y-6">
            {groups.map(([date, dateTasks]) => <CompletedTaskGroup key={date} date={date} tasks={dateTasks} lists={lists ?? []} />)}
          </div>}

        <div className="mt-8 text-sm text-gray-500">
          {(tasks ?? []).length} task{(tasks ?? []).length === 1 ? "" : "s"} completed total
        </div>
      </div>
    </div>;
}
export {
  CompletedTasksPage as default
};
