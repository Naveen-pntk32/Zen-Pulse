import { HABIT_ICONS } from "@/lib/defaults";
import { cn } from "@/lib/utils";
function IconPicker({ value, onChange }) {
  return <div className="grid grid-cols-8 gap-1.5">
      {HABIT_ICONS.map((icon) => <button
    key={icon}
    type="button"
    onClick={() => onChange(icon)}
    className={cn(
      "w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-colors",
      value === icon ? "border-indigo-400 bg-indigo-500/20" : "border-gray-700 hover:border-gray-500"
    )}
  >
          {icon}
        </button>)}
    </div>;
}
export {
  IconPicker
};
