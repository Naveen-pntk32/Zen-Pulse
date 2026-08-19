import { useState } from "react";
import { AddHabitForm } from "@/components/habits/AddHabitForm";
import { DailyCheckIn } from "@/components/habits/DailyCheckIn";
import { getLocalDateKey } from "@/lib/date";
function HabitTrackerPage() {
  const [date, setDate] = useState(getLocalDateKey());
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Habit Tracker</h1>
        <p className="text-gray-400 text-sm mt-1">
          Build consistent habits with daily check-ins and focus goals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        <div className="lg:sticky lg:top-6">
          <AddHabitForm />
        </div>
        <DailyCheckIn date={date} onChange={setDate} />
      </div>
    </div>;
}
export {
  HabitTrackerPage as default
};
