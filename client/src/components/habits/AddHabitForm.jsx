import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bell, Plus, Check } from "lucide-react";
import { IconPicker } from "@/components/habits/IconPicker";
import { goalOptionLabel, HABIT_SECTIONS, TIME_GOAL_OPTIONS } from "@/lib/defaults";
import { useCreateHabit } from "@/services/habit.service";
import { getLocalDateKey } from "@/lib/date";
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
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl p-6 space-y-6"
      style={{
        background:  "var(--surface-raised)",
        border:      "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "var(--brand-blue)" }}
        >
          <Plus className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Add Habit
        </h2>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-muted)" }}
        >
          Habit Name
        </label>
        <div className="flex items-center gap-3">
          <div
            className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl"
            style={{
              background: "var(--surface)",
              border:     "1px solid var(--border)",
            }}
          >
            {icon}
          </div>
          <input
            {...register("name")}
            placeholder="e.g. Read 10 pages"
            className="flex-1 px-3.5 py-2.5 rounded-xl text-sm outline-none transition-colors duration-150"
            style={{
              background: "var(--surface)",
              border:     "1px solid var(--input-border)",
              color:      "var(--text-primary)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--brand-blue)")}
            onBlur={(e)  => (e.target.style.borderColor = "var(--input-border)")}
          />
        </div>
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
      </div>

      {/* Icon Picker */}
      <div className="space-y-2">
        <label
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-muted)" }}
        >
          Icon
        </label>
        <IconPicker
          value={icon}
          onChange={(i) => setValue("icon", i, { shouldValidate: true })}
        />
      </div>

      {/* Frequency + Section */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--text-muted)" }}
          >
            Frequency
          </label>
          <select
            value={frequency}
            onChange={(e) => setValue("frequency", e.target.value, { shouldValidate: true })}
            className="w-full text-sm rounded-xl px-3.5 py-2.5 outline-none transition-colors duration-150 cursor-pointer"
            style={{
              background: "var(--surface)",
              border:     "1px solid var(--input-border)",
              color:      "var(--text-primary)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--brand-blue)")}
            onBlur={(e)  => (e.target.style.borderColor = "var(--input-border)")}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div className="space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--text-muted)" }}
          >
            Section
          </label>
          <select
            value={section}
            onChange={(e) => setValue("section", e.target.value, { shouldValidate: true })}
            className="w-full text-sm rounded-xl px-3.5 py-2.5 outline-none transition-colors duration-150 cursor-pointer"
            style={{
              background: "var(--surface)",
              border:     "1px solid var(--input-border)",
              color:      "var(--text-primary)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--brand-blue)")}
            onBlur={(e)  => (e.target.style.borderColor = "var(--input-border)")}
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
      <div className="space-y-3">
        <label
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-muted)" }}
        >
          Goal
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{ background: "var(--surface)" }}>
          <button
            type="button"
            onClick={() => {
              setGoalType("time");
              setValue("goalType", "time", { shouldValidate: true });
            }}
            className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150"
            style={{
              background: goalType === "time" ? "var(--surface-raised)" : "transparent",
              color:      goalType === "time" ? "var(--text-primary)"   : "var(--text-secondary)",
              boxShadow:  goalType === "time" ? "var(--shadow-card)"    : "none",
            }}
          >
            Focus Time
          </button>
          <button
            type="button"
            onClick={() => {
              setGoalType("simple");
              setValue("goalType", "simple", { shouldValidate: true });
            }}
            className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150"
            style={{
              background: goalType === "simple" ? "var(--surface-raised)" : "transparent",
              color:      goalType === "simple" ? "var(--text-primary)"   : "var(--text-secondary)",
              boxShadow:  goalType === "simple" ? "var(--shadow-card)"    : "none",
            }}
          >
            Achieve All
          </button>
        </div>

        {goalType === "time" && (
          <select
            value={String(goalSeconds)}
            onChange={(e) => setGoalSeconds(Number(e.target.value))}
            className="w-full text-sm rounded-xl px-3.5 py-2.5 outline-none transition-colors duration-150 cursor-pointer"
            style={{
              background: "var(--surface)",
              border:     "1px solid var(--input-border)",
              color:      "var(--text-primary)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--brand-blue)")}
            onBlur={(e)  => (e.target.style.borderColor = "var(--input-border)")}
          >
            {TIME_GOAL_OPTIONS.map((opt) => (
              <option key={opt.seconds} value={String(opt.seconds)}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        {goalType === "simple" && (
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            No time target — check in manually whenever you complete it.
          </p>
        )}
      </div>

      {/* Start Date + Goal Days */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--text-muted)" }}
          >
            Start Date
          </label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full text-sm rounded-xl px-3.5 py-2.5 outline-none transition-colors duration-150 [color-scheme:dark]"
            style={{
              background: "var(--surface)",
              border:     "1px solid var(--input-border)",
              color:      "var(--text-primary)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--brand-blue)")}
            onBlur={(e)  => (e.target.style.borderColor = "var(--input-border)")}
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--text-muted)" }}
          >
            Goal Days
          </label>
          <select
            value={goalDays}
            onChange={(e) => setValue("goalDays", e.target.value)}
            className="w-full text-sm rounded-xl px-3.5 py-2.5 outline-none transition-colors duration-150 cursor-pointer"
            style={{
              background: "var(--surface)",
              border:     "1px solid var(--input-border)",
              color:      "var(--text-primary)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--brand-blue)")}
            onBlur={(e)  => (e.target.style.borderColor = "var(--input-border)")}
          >
            <option value="forever">Forever</option>
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="21">21 days</option>
            <option value="30">30 days</option>
          </select>
        </div>
      </div>

      {/* Reminder */}
      <div className="space-y-2">
        <label
          className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5"
          style={{ color: "var(--text-muted)" }}
        >
          <Bell className="w-3.5 h-3.5" /> Reminder (Optional)
        </label>
        <input
          type="time"
          {...register("reminder")}
          className="w-32 text-sm rounded-xl px-3.5 py-2.5 outline-none transition-colors duration-150 [color-scheme:dark]"
          style={{
            background: "var(--surface)",
            border:     "1px solid var(--input-border)",
            color:      "var(--text-primary)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--brand-blue)")}
          onBlur={(e)  => (e.target.style.borderColor = "var(--input-border)")}
        />
      </div>

      {/* Auto Popup */}
      <label className="flex items-center gap-3 cursor-pointer group mt-2 w-max">
        <button
          type="button"
          onClick={() => setValue("autoPopup", !autoPopup)}
          className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150"
          style={{
            borderColor: autoPopup ? "var(--brand-blue)" : "var(--border-strong)",
            background:  autoPopup ? "var(--brand-blue)" : "transparent",
          }}
        >
          {autoPopup && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
        </button>
        <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
          Auto pop-up habit log when focusing
        </span>
      </label>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 mt-4"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--surface-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createHabit.isPending}
          className="btn-pill btn-primary px-5 py-2 text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createHabit.isPending ? "Saving…" : "Save Habit"}
        </button>
      </div>
    </form>
  );
}

function goalDisplay(goalType, dailyGoalSeconds) {
  if (goalType === "simple") return "Achieve it all";
  return `${goalOptionLabel(dailyGoalSeconds)} goal`;
}

export { AddHabitForm, goalDisplay };
