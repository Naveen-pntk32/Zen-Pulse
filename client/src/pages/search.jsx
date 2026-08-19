import { useState } from "react";
import { Link } from "wouter";
import { Search as SearchIcon, Loader2, CheckSquare, BarChart3, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/services/search.service";
import { useTaskLists } from "@/services/task-list.service";
import { cn } from "@/lib/utils";
function SearchPage() {
  const [query, setQuery] = useState("");
  const { data, isFetching } = useSearch(query);
  const { data: lists } = useTaskLists();
  const listName = (listId) => {
    if (!listId) return "All Tasks";
    return lists?.find((l) => l.id === listId)?.name ?? "Tasks";
  };
  return <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Search</h1>
        <p className="text-gray-400 text-sm mt-1">Find tasks and habits across your workspace</p>
      </div>

      <div className="relative mb-8">
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search tasks and habits..."
    className="pl-10 h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-2xl text-base"
    autoFocus
  />
      </div>

      {isFetching ? <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        </div> : query.trim() === "" ? <div className="text-center text-gray-500 py-16 space-y-2">
          <Inbox className="w-12 h-12 mx-auto opacity-40" />
          <p>Start typing to search</p>
        </div> : (data?.tasks.length ?? 0) + (data?.habits.length ?? 0) === 0 ? <div className="text-center text-gray-500 py-16 space-y-2">
          <SearchIcon className="w-12 h-12 mx-auto opacity-40" />
          <p>No results for "{query}"</p>
        </div> : <div className="space-y-8">
          {data && data.habits.length > 0 && <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Habits ({data.habits.length})
              </h2>
              <div className="space-y-2">
                {data.habits.map((habit) => <Link
    key={habit.id}
    href="/habits"
    className="flex items-center gap-3 p-3 rounded-2xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors"
  >
                    <BarChart3 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-base">{habit.icon}</span>
                    <span className="text-sm text-gray-200 flex-1 truncate">{habit.name}</span>
                    <span className="text-xs text-gray-500">{habit.section}</span>
                  </Link>)}
              </div>
            </div>}

          {data && data.tasks.length > 0 && <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Tasks ({data.tasks.length})
              </h2>
              <div className="space-y-2">
                {data.tasks.map((task) => <Link
    key={task.id}
    href={task.taskListId ? `/tasks/${task.taskListId}` : "/tasks"}
    className="flex items-center gap-3 p-3 rounded-2xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors"
  >
                    <CheckSquare className={cn("w-4 h-4 shrink-0", task.status === "completed" ? "text-green-400" : "text-gray-400")} />
                    <span className={cn("text-sm flex-1 truncate", task.status === "completed" && "line-through text-gray-500")}>
                      {task.title}
                    </span>
                    <span className="text-xs text-gray-500">{listName(task.taskListId)}</span>
                  </Link>)}
              </div>
            </div>}
        </div>}
    </div>;
}
export {
  SearchPage as default
};
