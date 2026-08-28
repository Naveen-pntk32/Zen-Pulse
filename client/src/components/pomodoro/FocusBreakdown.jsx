import { Trophy } from "lucide-react";
import { useHabits } from "@/services/habit.service";
import { useTasks } from "@/services/task.service";
import { formatHours } from "@/lib/date";

function FocusBreakdown({ items }) {
  const { data: habits } = useHabits();
  const { data: tasks }  = useTasks();

  const maxSeconds = items[0]?.seconds ?? 1;

  if (items.length === 0) {
    return (
      <div
        className="text-xs font-mono uppercase tracking-wider text-center py-6 rounded-[4px] border border-dashed border-border/60 bg-surface/30 text-muted-foreground"
      >
        // NO FOCUS SESSIONS RECORDED IN THIS PERIOD
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const icon =
          item.icon ||
          (item.type === "habit"
            ? habits?.find((h) => h.name === item.targetName)?.icon || "😊"
            : tasks?.find((t) => t.title === item.targetName)?.title
            ? "📋"
            : "🎯");

        const width = Math.max(6, (item.seconds / maxSeconds) * 100);

        return (
          <div key={`${item.type}:${item.targetName}`} className="space-y-1.5 p-2.5 rounded-[4px] bg-surface/50 border border-border/40">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm leading-none shrink-0">{icon}</span>
                <span className="font-sans font-medium text-foreground truncate">
                  {item.targetName}
                </span>
                {index === 0 && (
                  <span className="badge-tech badge-tech-neon text-[9px] px-1 py-0">
                    TOP
                  </span>
                )}
              </div>
              <span className="font-mono text-xs text-greptile-green shrink-0 ml-2 font-bold">
                {formatHours(item.seconds)}
              </span>
            </div>
            
            <div
              className="h-1 rounded-full overflow-hidden bg-surface-elevated border border-border/40"
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${width}%`,
                  backgroundColor: index === 0 ? "var(--greptile-green)" : "var(--sky)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { FocusBreakdown };
