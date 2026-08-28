import { useState } from "react";
import { Activity } from "lucide-react";
import { DailyCheckIn } from "@/components/habits/DailyCheckIn";
import { AddHabitForm } from "@/components/habits/AddHabitForm";
import { getLocalDateKey } from "@/lib/date";

function HabitsPage() {
  const [date, setDate] = useState(getLocalDateKey());

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2.5 text-foreground">
            <Activity className="w-5 h-5 text-greptile-green" />
            Habit Routine Tracker
          </h1>
          <span className="badge-tech badge-tech-green">
            PROTOCOL SYNC
          </span>
        </div>
        <p className="text-xs font-sans text-muted-foreground mt-1">
          Daily ritual monitoring calibrated with automatic focus session validation.
        </p>
      </div>

      {/* Main 2-Column Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Daily Check-In & Habit Sections (7 cols) */}
        <div className="lg:col-span-7">
          <DailyCheckIn date={date} onChange={setDate} />
        </div>

        {/* Right Column: Add Habit Form (5 cols) */}
        <div className="lg:col-span-5 sticky top-6">
          <AddHabitForm />
        </div>
      </div>
    </div>
  );
}

export { HabitsPage as default };
