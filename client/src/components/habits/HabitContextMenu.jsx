import { useState } from "react";
import { useLocation } from "wouter";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Archive, Trash2, Timer, Hourglass } from "lucide-react";
import { HABIT_SECTIONS, TIME_GOAL_OPTIONS } from "@/lib/defaults";
import { useDeleteHabit, useUpdateHabit } from "@/services/habit.service";
import { goalDisplay } from "@/components/habits/AddHabitForm";
function EditHabitDialog({ habit, open, onOpenChange }) {
  const updateHabit = useUpdateHabit();
  const [name, setName] = useState(habit.name);
  const [section, setSection] = useState(habit.section);
  const [goalSeconds, setGoalSeconds] = useState(habit.dailyGoalSeconds || 10800);
  const [goalType, setGoalType] = useState(habit.goalType === "simple" ? "simple" : "time");
  const handleSave = async () => {
    if (!name.trim()) return;
    await updateHabit.mutateAsync({
      id: habit.id,
      patch: {
        name: name.trim(),
        section,
        goalType,
        dailyGoalSeconds: goalType === "time" ? goalSeconds : 0
      }
    });
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-100 max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Name</Label>
            <Input
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="bg-gray-900 border-gray-700 text-white"
  />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Section</Label>
            <Select value={section} onValueChange={(v) => setSection(v)}>
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {HABIT_SECTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Goal</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
    type="button"
    variant="ghost"
    onClick={() => setGoalType("time")}
    className={goalType === "time" ? "bg-indigo-500 text-white hover:bg-indigo-600" : "text-gray-400"}
  >
                Focus time
              </Button>
              <Button
    type="button"
    variant="ghost"
    onClick={() => setGoalType("simple")}
    className={goalType === "simple" ? "bg-indigo-500 text-white hover:bg-indigo-600" : "text-gray-400"}
  >
                Achieve it all
              </Button>
            </div>
            {goalType === "time" && <Select value={String(goalSeconds)} onValueChange={(v) => setGoalSeconds(Number(v))}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {TIME_GOAL_OPTIONS.map((opt) => <SelectItem key={opt.seconds} value={String(opt.seconds)}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-300">Cancel</Button>
          <Button onClick={handleSave} className="bg-indigo-500 hover:bg-indigo-600 text-white">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}
function HabitContextMenu({ habit, children }) {
  const [, navigate] = useLocation();
  const deleteHabit = useDeleteHabit();
  const updateHabit = useUpdateHabit();
  const [editOpen, setEditOpen] = useState(false);
  const startFocus = (mode) => {
    navigate(`/pomodoro?target=habit&id=${habit.id}&mode=${mode}`);
  };
  const handleArchive = () => {
    updateHabit.mutate({ id: habit.id, patch: { archived: !habit.archived } });
  };
  const handleDelete = () => {
    if (confirm(`Delete habit "${habit.name}"? This cannot be undone.`)) {
      deleteHabit.mutate(habit.id);
    }
  };
  return <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="bg-gray-800 border-gray-700 text-gray-200 min-w-[180px]">
          <ContextMenuLabel className="text-gray-400">Start Focus</ContextMenuLabel>
          <ContextMenuSub>
            <ContextMenuSubTrigger className="focus:bg-gray-700 data-[state=open]:bg-gray-700">
              <Timer className="w-4 h-4 mr-2 text-indigo-400" />
              Start Focus
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="bg-gray-800 border-gray-700 text-gray-200">
              <ContextMenuItem onSelect={() => startFocus("pomodoro")} className="focus:bg-gray-700">
                🍅 Start Pomodoro
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => startFocus("stopwatch")} className="focus:bg-gray-700">
                <Hourglass className="w-4 h-4 mr-2 text-sky-400" />
                Start Stopwatch
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator className="bg-gray-700" />
          <ContextMenuItem onSelect={() => setEditOpen(true)} className="focus:bg-gray-700">
            <Pencil className="w-4 h-4 mr-2 text-gray-400" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem onSelect={handleArchive} className="focus:bg-gray-700">
            <Archive className="w-4 h-4 mr-2 text-gray-400" />
            {habit.archived ? "Unarchive" : "Archive"}
          </ContextMenuItem>
          <ContextMenuSeparator className="bg-gray-700" />
          <ContextMenuItem onSelect={handleDelete} className="focus:bg-gray-700 text-red-400 focus:text-red-400">
            <Trash2 className="w-4 h-4 mr-2 text-red-400" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {editOpen && <EditHabitDialog habit={habit} open={editOpen} onOpenChange={setEditOpen} />}
    </>;
}
export {
  HabitContextMenu,
  goalDisplay
};
