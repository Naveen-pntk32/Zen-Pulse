import { useState } from "react";
import { Link } from "wouter";
import { Search as SearchIcon, Loader2, CheckSquare, BarChart3, Inbox } from "lucide-react";
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

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <SearchIcon className="w-6 h-6" style={{ color: "var(--brand-blue)" }} />
          Search
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Find tasks and habits across your workspace
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-8 group">
        <SearchIcon
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks and habits..."
          className="w-full pl-12 pr-4 h-14 rounded-2xl text-[15px] font-medium outline-none transition-all duration-200"
          style={{
            background: "var(--surface)",
            border:     "1px solid var(--border)",
            color:      "var(--text-primary)",
            boxShadow:  "var(--shadow-card)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--brand-blue)";
            e.target.previousSibling.style.color = "var(--brand-blue)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
            e.target.previousSibling.style.color = "var(--text-muted)";
          }}
          autoFocus
        />
      </div>

      {/* Results */}
      {isFetching ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--brand-blue)" }} />
        </div>
      ) : query.trim() === "" ? (
        <div className="text-center py-20 space-y-3">
          <Inbox className="w-12 h-12 mx-auto opacity-30" style={{ color: "var(--text-primary)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Start typing to search
          </p>
        </div>
      ) : (data?.tasks.length ?? 0) + (data?.habits.length ?? 0) === 0 ? (
        <div className="text-center py-20 space-y-3">
          <SearchIcon className="w-12 h-12 mx-auto opacity-30" style={{ color: "var(--text-primary)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            No results for "{query}"
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {data && data.habits.length > 0 && (
            <div>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2"
                style={{ color: "var(--text-muted)" }}
              >
                Habits
                <span className="px-1.5 py-0.5 rounded-md" style={{ background: "var(--surface)", color: "var(--text-secondary)" }}>
                  {data.habits.length}
                </span>
              </h2>
              <div className="space-y-2">
                {data.habits.map((habit) => (
                  <Link
                    key={habit.id}
                    href="/habits"
                    className="flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-150"
                    style={{
                      background: "var(--surface)",
                      border:     "1px solid var(--border)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "var(--surface-hover)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface)"; }}
                  >
                    <BarChart3 className="w-4 h-4 shrink-0" style={{ color: "var(--brand-blue)" }} />
                    <span className="text-lg leading-none">{habit.icon}</span>
                    <span className="text-[15px] font-medium flex-1 truncate" style={{ color: "var(--text-primary)" }}>
                      {habit.name}
                    </span>
                    <span className="text-xs uppercase tracking-wider font-semibold px-2 py-1 rounded-lg" style={{ background: "var(--surface-raised)", color: "var(--text-muted)" }}>
                      {habit.section}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {data && data.tasks.length > 0 && (
            <div>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2"
                style={{ color: "var(--text-muted)" }}
              >
                Tasks
                <span className="px-1.5 py-0.5 rounded-md" style={{ background: "var(--surface)", color: "var(--text-secondary)" }}>
                  {data.tasks.length}
                </span>
              </h2>
              <div className="space-y-2">
                {data.tasks.map((task) => (
                  <Link
                    key={task.id}
                    href={task.taskListId ? `/tasks/${task.taskListId}` : "/tasks"}
                    className="flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-150"
                    style={{
                      background: "var(--surface)",
                      border:     "1px solid var(--border)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "var(--surface-hover)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface)"; }}
                  >
                    <CheckSquare
                      className="w-4 h-4 shrink-0"
                      style={{ color: task.status === "completed" ? "#4ade80" : "var(--text-muted)" }}
                    />
                    <span
                      className={cn("text-[15px] font-medium flex-1 truncate", task.status === "completed" && "line-through opacity-50")}
                      style={{ color: "var(--text-primary)" }}
                    >
                      {task.title}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ background: "var(--surface-raised)", color: "var(--text-muted)" }}>
                      {listName(task.taskListId)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { SearchPage as default };
