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
import { Pencil, Archive, Trash2, Timer, Hourglass, Edit3 } from "lucide-react";
import { HABIT_SECTIONS, TIME_GOAL_OPTIONS } from "@/lib/defaults";
import { useDeleteHabit, useUpdateHabit } from "@/services/habit.service";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-surface-elevated border-border text-foreground">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-greptile-green" />
            <DialogTitle>Edit Habit</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
              Habit Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
              Section
            </Label>
            <Select value={section} onValueChange={(v) => setSection(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HABIT_SECTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
              Goal Type
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={goalType === "time" ? "default" : "outline"}
                size="sm"
                onClick={() => setGoalType("time")}
              >
                Focus Time
              </Button>
              <Button
                type="button"
                variant={goalType === "simple" ? "default" : "outline"}
                size="sm"
                onClick={() => setGoalType("simple")}
              >
                Simple
              </Button>
            </div>

            {goalType === "time" && (
              <div className="pt-2">
                <Select value={String(goalSeconds)} onValueChange={(v) => setGoalSeconds(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_GOAL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.seconds} value={String(opt.seconds)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="default" size="sm" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="min-w-[190px]">
          <ContextMenuLabel>// HABIT ACTIONS</ContextMenuLabel>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Timer className="w-3.5 h-3.5 mr-2 text-greptile-green" />
              Launch Focus
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onSelect={() => startFocus("pomodoro")}>
                🍅 Start Pomodoro
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => startFocus("stopwatch")}>
                <Hourglass className="w-3.5 h-3.5 mr-2 text-sky" />
                Start Stopwatch
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSeparator />
          
          <ContextMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
            Edit Habit
          </ContextMenuItem>
          <ContextMenuItem onSelect={handleArchive}>
            <Archive className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
            {habit.archived ? "Unarchive" : "Archive"}
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem onSelect={handleDelete} className="text-bloom focus:text-bloom focus:bg-bloom/10">
            <Trash2 className="w-3.5 h-3.5 mr-2 text-bloom" />
            Delete Habit
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {editOpen && <EditHabitDialog habit={habit} open={editOpen} onOpenChange={setEditOpen} />}
    </>
  );
}

export {
  HabitContextMenu
};
