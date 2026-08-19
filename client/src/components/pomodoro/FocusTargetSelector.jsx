import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHabits } from "@/services/habit.service";
import { useTasks } from "@/services/task.service";
import { Loader2 } from "lucide-react";
function FocusTargetSelector({
  value,
  onChange,
  disabled
}) {
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const loading = habitsLoading || tasksLoading;
  const selectedValue = value ? `${value.type}:${value.id}` : "none";
  return <Select
    value={selectedValue}
    onValueChange={(v) => {
      if (v === "none") {
        onChange(null);
        return;
      }
      const [type, id] = v.split(":");
      const name = type === "habit" ? habits?.find((h) => h.id === id)?.name : tasks?.find((t) => t.id === id)?.title;
      onChange({ type, id, name: name ?? "" });
    }}
    disabled={disabled}
  >
      <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-200" disabled={disabled}>
        <SelectValue placeholder="What are you focusing on?" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700 text-gray-200 max-h-72">
        {loading ? <div className="flex justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
          </div> : <>
            <SelectGroup>
              <SelectLabel className="text-gray-500">Habits</SelectLabel>
              {(habits ?? []).map((h) => <SelectItem key={`habit:${h.id}`} value={`habit:${h.id}`}>
                  {h.icon} {h.name}
                </SelectItem>)}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel className="text-gray-500">Tasks</SelectLabel>
              {(tasks ?? []).filter((t) => t.status === "pending").map((t) => <SelectItem key={`task:${t.id}`} value={`task:${t.id}`}>
                    {t.title}
                  </SelectItem>)}
            </SelectGroup>
            <SelectGroup>
              <SelectItem value="none">No target</SelectItem>
            </SelectGroup>
          </>}
      </SelectContent>
    </Select>;
}
export {
  FocusTargetSelector
};
