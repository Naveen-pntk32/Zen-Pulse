import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Plus } from "lucide-react";
import { IconPicker } from "@/components/habits/IconPicker";
import { goalOptionLabel, HABIT_SECTIONS, TIME_GOAL_OPTIONS } from "@/lib/defaults";
import { useCreateHabit } from "@/services/habit.service";
import { getLocalDateKey } from "@/lib/date";
const schema = z.object({
  name: z.string().min(1, "Habit name is required"),
  icon: z.string(),
  frequency: z.enum(["daily", "weekly", "custom"]),
  goalType: z.enum(["simple", "time"]),
  dailyGoalSeconds: z.number().min(0),
  startDate: z.string(),
  goalDays: z.string(),
  section: z.enum(["morning", "afternoon", "night", "others"]),
  reminder: z.string(),
  autoPopup: z.boolean()
});
function AddHabitForm() {
  const createHabit = useCreateHabit();
  const [goalType, setGoalType] = useState("time");
  const [goalSeconds, setGoalSeconds] = useState(10800);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      icon: "\u{1F60A}",
      frequency: "daily",
      goalType: "time",
      dailyGoalSeconds: 10800,
      startDate: getLocalDateKey(),
      goalDays: "forever",
      section: "morning",
      reminder: "",
      autoPopup: false
    }
  });
  const icon = watch("icon");
  const section = watch("section");
  const frequency = watch("frequency");
  const autoPopup = watch("autoPopup");
  const onSubmit = async (values) => {
    const goalDaysValue = values.goalDays === "forever" ? null : Number(values.goalDays);
    await createHabit.mutateAsync({
      name: values.name.trim(),
      icon: values.icon,
      frequency: values.frequency,
      goalType: values.goalType,
      dailyGoalSeconds: values.goalType === "time" ? goalSeconds : 0,
      startDate: values.startDate,
      goalDays: goalDaysValue,
      section: values.section,
      reminder: values.reminder || null,
      autoPopup: values.autoPopup
    });
    reset();
    setGoalType("time");
    setGoalSeconds(10800);
  };
  return <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 rounded-3xl border border-gray-700 p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Plus className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-semibold">Add Habit</h2>
      </div>

      {
    /* Name */
  }
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Habit Name</Label>
        <div className="flex items-center gap-3">
          <div className="text-2xl w-9 h-9 flex items-center justify-center bg-gray-900 rounded-lg border border-gray-700">
            {icon}
          </div>
          <Input
    {...register("name")}
    placeholder="e.g. Vanakam DSA"
    className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
  />
        </div>
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
      </div>

      {
    /* Icon */
  }
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Icon</Label>
        <IconPicker
    value={icon}
    onChange={(i) => {
      setValue("icon", i, { shouldValidate: true });
    }}
  />
      </div>

      {
    /* Frequency + Section */
  }
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-sm text-gray-300">Frequency</Label>
          <Select
    value={frequency}
    onValueChange={(v) => setValue("frequency", v, { shouldValidate: true })}
  >
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-gray-300">Section</Label>
          <Select value={section} onValueChange={(v) => setValue("section", v, { shouldValidate: true })}>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              {HABIT_SECTIONS.map((s) => <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {
    /* Goal */
  }
      <div className="space-y-3">
        <Label className="text-sm text-gray-300">Goal</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
    type="button"
    variant={goalType === "time" ? "default" : "ghost"}
    onClick={() => {
      setGoalType("time");
      setValue("goalType", "time", { shouldValidate: true });
    }}
    className={goalType === "time" ? "bg-indigo-500 hover:bg-indigo-600 text-white" : "text-gray-400"}
  >
            Focus time goal
          </Button>
          <Button
    type="button"
    variant={goalType === "simple" ? "default" : "ghost"}
    onClick={() => {
      setGoalType("simple");
      setValue("goalType", "simple", { shouldValidate: true });
    }}
    className={goalType === "simple" ? "bg-indigo-500 hover:bg-indigo-600 text-white" : "text-gray-400"}
  >
            Achieve it all
          </Button>
        </div>

        {goalType === "time" && <Select value={String(goalSeconds)} onValueChange={(v) => setGoalSeconds(Number(v))}>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              {TIME_GOAL_OPTIONS.map((opt) => <SelectItem key={opt.seconds} value={String(opt.seconds)}>
                  {opt.label}
                </SelectItem>)}
            </SelectContent>
          </Select>}
        {goalType === "simple" && <p className="text-xs text-gray-500">
            No time target — check in manually whenever you complete it.
          </p>}
      </div>

      {
    /* Start date + goal days */
  }
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-sm text-gray-300">Start Date</Label>
          <Input
    type="date"
    {...register("startDate")}
    className="bg-gray-900 border-gray-700 text-white text-sm [color-scheme:dark]"
  />
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-gray-300">Goal Days</Label>
          <Select value={watch("goalDays")} onValueChange={(v) => setValue("goalDays", v)}>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="forever">Forever</SelectItem>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="21">21 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {
    /* Reminder */
  }
      <div className="space-y-2">
        <Label className="text-sm text-gray-300 flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5" /> Reminder (optional)
        </Label>
        <Input
    type="time"
    {...register("reminder")}
    className="w-32 bg-gray-900 border-gray-700 text-white text-sm [color-scheme:dark]"
  />
      </div>

      {
    /* Auto popup */
  }
      <label className="flex items-center gap-2.5 text-sm text-gray-300 cursor-pointer">
        <Checkbox
    checked={autoPopup}
    onCheckedChange={(c) => setValue("autoPopup", !!c)}
    className="border-gray-600 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
  />
        Auto pop-up of habit log
      </label>

      {
    /* Actions */
  }
      <div className="flex justify-end gap-2 pt-2">
        <Button
    type="button"
    variant="ghost"
    onClick={() => reset()}
    className="text-gray-400"
  >
          Cancel
        </Button>
        <Button
    type="submit"
    disabled={createHabit.isPending}
    className="bg-indigo-500 hover:bg-indigo-600 text-white"
  >
          Save Habit
        </Button>
      </div>
    </form>;
}
function goalDisplay(goalType, dailyGoalSeconds) {
  if (goalType === "simple") return "Achieve it all";
  return `${goalOptionLabel(dailyGoalSeconds)} goal`;
}
export {
  AddHabitForm,
  goalDisplay
};
