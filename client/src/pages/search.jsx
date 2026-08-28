import { useState } from "react";
import { Link } from "wouter";
import { Search as SearchIcon, Loader2, CheckSquare, Activity, Inbox, ArrowRight } from "lucide-react";
import { useSearch } from "@/services/search.service";
import { useTaskLists } from "@/services/task-list.service";
import { cn } from "@/lib/utils";

function SearchPage() {
  const [query, setQuery] = useState("");
  const { data, isFetching } = useSearch(query);
  const { data: lists } = useTaskLists();

  const listName = (listId) => {
    if (!listId) return "ALL TASKS";
    return (lists?.find((l) => l.id === listId)?.name ?? "TASKS").toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2.5 text-foreground">
            <SearchIcon className="w-5 h-5 text-greptile-green" />
            Global Search Engine
          </h1>
          <span className="badge-tech badge-tech-green">
            INDEX READY
          </span>
        </div>
        <p className="text-xs font-sans text-muted-foreground mt-1">
          Query across tasks, habit routines, and focus history with instant filtering.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative group">
        <SearchIcon
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-greptile-green"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search task registry or habit routines..."
          className="w-full pl-11 pr-4 h-12 rounded-[6px] text-sm font-sans bg-surface-raised border border-input-border text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-greptile-green focus:ring-1 focus:ring-greptile-green/40 shadow-md transition-all"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono uppercase bg-surface px-1.5 py-0.5 rounded-[2px] border border-border text-muted-foreground hover:text-foreground"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Results */}
      {isFetching ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-greptile-green" />
        </div>
      ) : query.trim() === "" ? (
        <div className="text-center py-20 rounded-[6px] border border-dashed border-border/60 bg-surface/20 space-y-3">
          <Inbox className="w-10 h-10 mx-auto text-muted-foreground/30" />
          <p className="text-sm font-bold font-display text-foreground">
            Awaiting query input
          </p>
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Type keyword above to filter tasks and habits
          </p>
        </div>
      ) : (data?.tasks.length ?? 0) + (data?.habits.length ?? 0) === 0 ? (
        <div className="text-center py-20 rounded-[6px] border border-dashed border-border/60 bg-surface/20 space-y-3">
          <SearchIcon className="w-10 h-10 mx-auto text-muted-foreground/30" />
          <p className="text-sm font-bold font-display text-foreground">
            No matching entities found for "{query}"
          </p>
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Verify spelling or try broader search terms
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {data && data.habits.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-border/30">
                <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-greptile-green" />
                  MATCHED HABITS
                </h2>
                <span className="badge-tech badge-tech-green text-[9px] py-0">
                  {data.habits.length} FOUND
                </span>
              </div>

              <div className="space-y-2">
                {data.habits.map((habit) => (
                  <Link
                    key={habit.id}
                    href="/habits"
                    className="flex items-center gap-3 p-3 rounded-[6px] border border-border/80 bg-surface-raised hover:border-greptile-green/40 hover:bg-surface-elevated transition-all group"
                  >
                    <span className="text-base leading-none">{habit.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium font-sans text-foreground truncate">
                        {habit.name}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase mt-0.5">
                        ROUTINE: {habit.section}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-greptile-green transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {data && data.tasks.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-border/30">
                <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-sky" />
                  MATCHED TASKS
                </h2>
                <span className="badge-tech badge-tech-sky text-[9px] py-0">
                  {data.tasks.length} FOUND
                </span>
              </div>

              <div className="space-y-2">
                {data.tasks.map((task) => (
                  <Link
                    key={task.id}
                    href={task.taskListId ? `/tasks/${task.taskListId}` : "/tasks"}
                    className="flex items-center gap-3 p-3 rounded-[6px] border border-border/80 bg-surface-raised hover:border-greptile-green/40 hover:bg-surface-elevated transition-all group"
                  >
                    <CheckSquare
                      className={cn(
                        "w-4 h-4 shrink-0",
                        task.status === "completed" ? "text-greptile-green" : "text-muted-foreground"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "text-xs font-medium font-sans text-foreground truncate",
                          task.status === "completed" && "line-through text-muted-foreground"
                        )}
                      >
                        {task.title}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase mt-0.5">
                        LIST: {listName(task.taskListId)}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-greptile-green transition-transform group-hover:translate-x-0.5" />
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
