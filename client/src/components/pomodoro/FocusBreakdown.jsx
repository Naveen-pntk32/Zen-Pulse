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
        className="text-sm text-center py-6 rounded-xl"
        style={{ color: "var(--text-muted)", background: "var(--surface)" }}
      >
        No focus recorded in this period
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
          <div key={`${item.type}:${item.targetName}`} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-lg leading-none">{icon}</span>
                <span
                  className="font-medium truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.targetName}
                </span>
                {index === 0 && (
                  <Trophy
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: "var(--brand-amber)" }}
                  />
                )}
              </div>
              <span
                className="font-mono text-xs shrink-0 ml-2 font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {formatHours(item.seconds)}
              </span>
            </div>
            
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "var(--surface)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${width}%`,
                  background: index === 0 ? "var(--brand-blue)" : "var(--text-muted)",
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
