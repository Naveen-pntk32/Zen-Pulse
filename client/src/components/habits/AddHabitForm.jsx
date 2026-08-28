import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bell, Plus, Check, Sparkles } from "lucide-react";
import { IconPicker } from "@/components/habits/IconPicker";
import { goalOptionLabel, HABIT_SECTIONS, TIME_GOAL_OPTIONS } from "@/lib/defaults";
import { useCreateHabit } from "@/services/habit.service";
import { getLocalDateKey } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  autoPopup: z.boolean(),
});

function AddHabitForm({ onSuccess, onCancel }) {
  const createHabit = useCreateHabit();
  const [goalType, setGoalType] = useState("time");
  const [goalSeconds, setGoalSeconds] = useState(10800);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      icon: "😊",
      frequency: "daily",
      goalType: "time",
      dailyGoalSeconds: 10800,
      startDate: getLocalDateKey(),
      goalDays: "forever",
      section: "morning",
      reminder: "",
      autoPopup: false,
    },
  });

  const icon      = watch("icon");
  const section   = watch("section");
  const frequency = watch("frequency");
  const autoPopup = watch("autoPopup");
  const goalDays  = watch("goalDays");

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
      autoPopup: values.autoPopup,
    });
    reset();
    setGoalType("time");
    setGoalSeconds(10800);
    if (onSuccess) onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[8px] p-6 space-y-5 bg-surface-raised border border-border shadow-xl min-w-[340px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-greptile-green" />
          <h2 className="text-sm font-bold font-display uppercase tracking-wider text-foreground">
            Create Habit Routine
          </h2>
        </div>
        <span className="badge-tech badge-tech-green text-[9px] py-0">
          STREAK ENGINE
        </span>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
          Habit Name
        </label>
        <div className="flex items-center gap-2.5">
          <div className="text-xl w-9 h-9 flex items-center justify-center rounded-[4px] bg-surface border border-border shrink-0">
            {icon}
          </div>
          <input
            {...register("name")}
            placeholder="e.g. Read 20 pages, Code review..."
            className="flex-1 px-3 py-2 rounded-[4px] text-xs font-sans bg-surface border border-input-border text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-greptile-green focus:ring-1 focus:ring-greptile-green/40 transition-colors"
          />
        </div>
        {errors.name && <p className="text-[11px] font-mono text-bloom">{errors.name.message}</p>}
      </div>

      {/* Icon Picker */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
          Select Icon
        </label>
        <IconPicker
          value={icon}
          onChange={(i) => setValue("icon", i, { shouldValidate: true })}
        />
      </div>

      {/* Frequency + Section */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
            Frequency
          </label>
          <select
            value={frequency}
            onChange={(e) => setValue("frequency", e.target.value, { shouldValidate: true })}
            className="w-full text-xs font-mono uppercase tracking-wider rounded-[4px] px-2.5 py-1.5 bg-surface border border-input-border text-foreground outline-none focus:border-greptile-green cursor-pointer"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
            Day Routine Section
          </label>
          <select
            value={section}
            onChange={(e) => setValue("section", e.target.value, { shouldValidate: true })}
            className="w-full text-xs font-mono uppercase tracking-wider rounded-[4px] px-2.5 py-1.5 bg-surface border border-input-border text-foreground outline-none focus:border-greptile-green cursor-pointer"
          >
            {HABIT_SECTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Goal */}
      <div className="space-y-2 pt-1">
        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
          Goal Target Configuration
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-[4px] bg-surface border border-border">
          <button
            type="button"
            onClick={() => {
              setGoalType("time");
              setValue("goalType", "time", { shouldValidate: true });
            }}
            className={cn(
              "px-3 py-1 rounded-[3px] text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer",
              goalType === "time"
                ? "bg-greptile-green text-black shadow-[0_0_8px_rgba(40,233,159,0.3)]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Focus Time Goal
          </button>
          <button
            type="button"
            onClick={() => {
              setGoalType("simple");
              setValue("goalType", "simple", { shouldValidate: true });
            }}
            className={cn(
              "px-3 py-1 rounded-[3px] text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer",
              goalType === "simple"
                ? "bg-greptile-green text-black shadow-[0_0_8px_rgba(40,233,159,0.3)]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Simple Check
          </button>
        </div>

        {goalType === "time" && (
          <select
            value={String(goalSeconds)}
            onChange={(e) => setGoalSeconds(Number(e.target.value))}
            className="w-full text-xs font-mono uppercase tracking-wider rounded-[4px] px-2.5 py-1.5 bg-surface border border-input-border text-foreground outline-none focus:border-greptile-green cursor-pointer mt-1"
          >
            {TIME_GOAL_OPTIONS.map((opt) => (
              <option key={opt.seconds} value={String(opt.seconds)}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Start Date + Goal Days */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
            Start Date
          </label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full text-xs font-mono rounded-[4px] px-2.5 py-1.5 bg-surface border border-input-border text-foreground outline-none focus:border-greptile-green [color-scheme:dark]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
            Commitment Span
          </label>
          <select
            value={goalDays}
            onChange={(e) => setValue("goalDays", e.target.value)}
            className="w-full text-xs font-mono uppercase tracking-wider rounded-[4px] px-2.5 py-1.5 bg-surface border border-input-border text-foreground outline-none focus:border-greptile-green cursor-pointer"
          >
            <option value="forever">Indefinite (Forever)</option>
            <option value="7">7 Days Sprint</option>
            <option value="14">14 Days Sprint</option>
            <option value="21">21 Days Sprint</option>
            <option value="30">30 Days Challenge</option>
          </select>
        </div>
      </div>

      {/* Auto Popup */}
      <div className="pt-2">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <button
            type="button"
            onClick={() => setValue("autoPopup", !autoPopup)}
            className={cn(
              "w-4 h-4 rounded-[3px] border flex items-center justify-center transition-all",
              autoPopup
                ? "bg-greptile-green border-greptile-green text-black"
                : "bg-surface border-border-strong"
            )}
          >
            {autoPopup && <Check className="w-3 h-3 stroke-[3]" />}
          </button>
          <span className="text-xs font-sans text-foreground">
            Auto pop-up habit log when starting focus
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            reset();
            if (onCancel) onCancel();
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="default"
          size="sm"
          disabled={createHabit.isPending}
        >
          {createHabit.isPending ? "Creating…" : "Save Habit"}
        </Button>
      </div>
    </form>
  );
}

function goalDisplay(goalType, dailyGoalSeconds) {
  if (goalType === "simple") return "Achieve it all";
  return `${goalOptionLabel(dailyGoalSeconds)} goal`;
}

export { AddHabitForm, goalDisplay };
