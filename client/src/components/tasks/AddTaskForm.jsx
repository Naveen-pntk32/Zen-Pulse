import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useCreateTask } from "@/services/task.service";
import { cn } from "@/lib/utils";
const PRIORITIES = [
  { value: "low", label: "Low", active: "bg-sky-500/20 text-sky-400" },
  { value: "medium", label: "Medium", active: "bg-amber-500/20 text-amber-400" },
  { value: "high", label: "High", active: "bg-red-500/20 text-red-400" }
];
function AddTaskForm({ listId }) {
  const createTask = useCreateTask();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState("medium");
  const handleSubmit = async () => {
    if (!title.trim()) return;
    await createTask.mutateAsync({
      title: title.trim(),
      taskListId: listId,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      priority
    });
    setTitle("");
    setDueDate("");
    setDueTime("");
    setPriority("medium");
    setOpen(false);
  };
  if (!open) {
    return <Button
      variant="ghost"
      onClick={() => setOpen(true)}
      className="w-full justify-start gap-2 px-4 py-3 rounded-2xl border border-dashed border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
    >
        <Plus className="w-4 h-4" />
        Add Task
      </Button>;
  }
  return <div className="p-4 bg-gray-800 rounded-2xl border border-gray-700 space-y-3">
      <Input
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="What do you need to do?"
    className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
    autoFocus
    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
  />
      <div className="flex flex-wrap items-center gap-2">
        <Input
    type="date"
    value={dueDate}
    onChange={(e) => setDueDate(e.target.value)}
    className="w-auto bg-gray-900 border-gray-700 text-white text-sm [color-scheme:dark]"
  />
        <Input
    type="time"
    value={dueTime}
    onChange={(e) => setDueTime(e.target.value)}
    className="w-auto bg-gray-900 border-gray-700 text-white text-sm [color-scheme:dark]"
  />
        <div className="flex items-center gap-1">
          {PRIORITIES.map((p) => <button
    key={p.value}
    type="button"
    onClick={() => setPriority(p.value)}
    className={cn(
      "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
      priority === p.value ? p.active : "text-gray-500 hover:text-gray-300"
    )}
  >
              {p.label}
            </button>)}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="text-gray-400">
          Cancel
        </Button>
        <Button
    size="sm"
    onClick={handleSubmit}
    disabled={!title.trim() || createTask.isPending}
    className="bg-indigo-500 hover:bg-indigo-600 text-white"
  >
          Add Task
        </Button>
      </div>
    </div>;
}
export {
  AddTaskForm
};
