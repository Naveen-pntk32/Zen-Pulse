import { HABIT_ICONS } from "@/lib/defaults";
import { cn } from "@/lib/utils";

function IconPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-8 gap-1.5">
      {HABIT_ICONS.map((icon) => (
        <button
          key={icon}
          type="button"
          onClick={() => onChange(icon)}
          className="w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-colors duration-150"
          style={{
            border:     `1px solid ${value === icon ? "var(--brand-blue)" : "var(--border)"}`,
            background: value === icon ? "rgba(71,114,250,0.12)" : "var(--surface)",
          }}
          onMouseEnter={(e) => {
            if (value !== icon) e.currentTarget.style.borderColor = "var(--border-strong)";
          }}
          onMouseLeave={(e) => {
            if (value !== icon) e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

export { IconPicker };
