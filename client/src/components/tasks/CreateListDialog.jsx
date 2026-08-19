import { useState } from "react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LIST_COLORS, LIST_ICONS } from "@/lib/defaults";
import { useCreateTaskList } from "@/services/task-list.service";
function CreateListDialog({
  open,
  onOpenChange
}) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("\u{1F4CB}");
  const [color, setColor] = useState(LIST_COLORS[0]);
  const createList = useCreateTaskList();
  const [, navigate] = useLocation();
  const handleSubmit = async () => {
    if (!name.trim()) return;
    const list = await createList.mutateAsync({
      name: name.trim(),
      icon,
      color,
      sortOrder: 100
    });
    setName("");
    onOpenChange(false);
    navigate(`/tasks/${list.id}`);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-100 max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task List</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new list to organize your tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Name</Label>
            <Input
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="e.g. Reading, Fitness..."
    className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
    autoFocus
  />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Icon</Label>
            <div className="flex flex-wrap gap-2">
              {LIST_ICONS.map((i) => <button
    key={i}
    type="button"
    onClick={() => setIcon(i)}
    className={cn(
      "w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-colors",
      icon === i ? "border-indigo-400 bg-indigo-500/20" : "border-gray-700 hover:border-gray-500"
    )}
  >
                  {i}
                </button>)}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Color</Label>
            <div className="flex flex-wrap gap-2">
              {LIST_COLORS.map((c) => <button
    key={c}
    type="button"
    onClick={() => setColor(c)}
    className={cn(
      "w-8 h-8 rounded-full border-2 transition-transform",
      color === c ? "scale-110 border-white" : "border-transparent"
    )}
    style={{ backgroundColor: c }}
  />)}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-300">
            Cancel
          </Button>
          <Button
    onClick={handleSubmit}
    disabled={!name.trim() || createList.isPending}
    className="bg-indigo-500 hover:bg-indigo-600 text-white"
  >
            Save List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}
export {
  CreateListDialog
};
