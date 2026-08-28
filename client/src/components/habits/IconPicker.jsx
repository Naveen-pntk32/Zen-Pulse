import { HABIT_ICONS } from "@/lib/defaults";
import { cn } from "@/lib/utils";

function IconPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 p-2 rounded-[4px] bg-surface border border-border">
      {HABIT_ICONS.map((icon) => (
        <button
          key={icon}
          type="button"
          onClick={() => onChange(icon)}
          className={cn(
            "w-8 h-8 rounded-[3px] text-sm flex items-center justify-center transition-all cursor-pointer",
            value === icon
              ? "bg-greptile-green/20 border border-greptile-green shadow-[0_0_8px_rgba(40,233,159,0.3)]"
              : "bg-surface-raised border border-border/40 hover:border-border-strong hover:bg-surface-hover"
          )}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

export { IconPicker };
