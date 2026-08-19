import { Trophy } from "lucide-react";
import { useHabits } from "@/services/habit.service";
import { useTasks } from "@/services/task.service";
import { formatHours } from "@/lib/date";
function FocusBreakdown({ items }) {
  const { data: habits } = useHabits();
  const { data: tasks } = useTasks();
  const maxSeconds = items[0]?.seconds ?? 1;
  if (items.length === 0) {
    return <div className="text-sm text-gray-500 text-center py-6">
        No focus recorded in this period
      </div>;
  }
  return <div className="space-y-3">
      {items.map((item, index) => {
    const icon = item.icon || (item.type === "habit" ? habits?.find((h) => h.name === item.targetName)?.icon || "\u{1F60A}" : tasks?.find((t) => t.title === item.targetName)?.title ? "\u{1F4CB}" : "\u{1F3AF}");
    const width = Math.max(6, item.seconds / maxSeconds * 100);
    return <div key={`${item.type}:${item.targetName}`} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span>{icon}</span>
                <span className="text-gray-200 truncate">{item.targetName}</span>
                {index === 0 && <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              </div>
              <span className="font-mono text-xs text-gray-400 shrink-0 ml-2">
                {formatHours(item.seconds)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
              <div
      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
      style={{ width: `${width}%` }}
    />
            </div>
          </div>;
  })}
    </div>;
}
export {
  FocusBreakdown
};
