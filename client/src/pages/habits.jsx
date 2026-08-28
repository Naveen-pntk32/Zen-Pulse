import { useState } from "react";
import { AddHabitForm } from "@/components/habits/AddHabitForm";
import { DailyCheckIn } from "@/components/habits/DailyCheckIn";
import { getLocalDateKey } from "@/lib/date";
import { Activity } from "lucide-react";

function HabitTrackerPage() {
  const [date, setDate] = useState(getLocalDateKey());

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold flex items-center gap-2"
          style={{ color: "var(--text-primary)" }}
        >
          <Activity className="w-6 h-6" style={{ color: "#22c55e" }} />
          Habit Tracker
        </h1>
        <p className="text-sm mt-1.5" style={{ color: "var(--text-muted)" }}>
          Build consistent habits with daily check-ins and focus goals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
        <div className="lg:sticky lg:top-6">
          <AddHabitForm />
        </div>
        <DailyCheckIn date={date} onChange={setDate} />
      </div>
    </div>
  );
}

export { HabitTrackerPage as default };
