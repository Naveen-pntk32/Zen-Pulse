import { useHabits } from "@/services/habit.service";
import { useTasks } from "@/services/task.service";
import { Loader2, Target, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

function FocusTargetSelector({ value, onChange, disabled }) {
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  const loading = habitsLoading || tasksLoading;
  const selectedValue = value ? `${value.type}:${value.id}` : "none";

  if (loading) {
    return (
      <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-[4px] border border-border bg-surface text-xs font-mono text-muted-foreground">
        <span>// LOADING TARGETS...</span>
        <Loader2 className="w-3.5 h-3.5 animate-spin text-greptile-green" />
      </div>
    );
  }

  return (
    <div className="relative inline-block w-full">
      {/* Custom Technical UI Pill */}
      <div 
        className={cn(
          "flex items-center justify-between px-4 py-2.5 rounded-[4px] border transition-all cursor-pointer",
          value
            ? "border-greptile-green/50 bg-greptile-green/5 shadow-[0_0_12px_rgba(40,233,159,0.1)]"
            : "border-border bg-surface hover:border-border-strong"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn(
            "w-6 h-6 rounded-[3px] flex items-center justify-center shrink-0",
            value ? "bg-greptile-green text-black" : "bg-surface-raised border border-border text-muted-foreground"
          )}>
            <Target className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left min-w-0">
            <span className="text-xs font-bold font-sans text-foreground truncate leading-tight">
              {value ? value.name : "Select focus target (optional)"}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider leading-tight">
              {value ? (value.type === "habit" ? "TARGET: HABIT" : "TARGET: TASK") : "LINK SESSION TO HABIT/TASK"}
            </span>
          </div>
        </div>

        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
      </div>

      {/* Invisible Native Select for easy cross-device interaction */}
      <select
        value={selectedValue}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "none") {
            onChange(null);
            return;
          }
          const [type, id] = v.split(":");
          const name =
            type === "habit"
              ? habits?.find((h) => h.id === id)?.name
              : tasks?.find((t) => t.id === id)?.title;
          onChange({ type, id, name: name ?? "" });
        }}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      >
        <option value="none">-- General Focus (No specific target) --</option>
        
        {habits && habits.length > 0 && (
          <optgroup label="Habits">
            {habits.map((h) => (
              <option key={`habit:${h.id}`} value={`habit:${h.id}`}>
                {h.icon} {h.name}
              </option>
            ))}
          </optgroup>
        )}

        {tasks && tasks.filter((t) => t.status === "pending").length > 0 && (
          <optgroup label="Tasks">
            {tasks
              .filter((t) => t.status === "pending")
              .map((t) => (
                <option key={`task:${t.id}`} value={`task:${t.id}`}>
                  📋 {t.title}
                </option>
              ))}
          </optgroup>
        )}
      </select>
    </div>
  );
}

export { FocusTargetSelector };
