import { useState } from "react";
import { useLocation } from "wouter";
import { LIST_COLORS, LIST_ICONS } from "@/lib/defaults";
import { useCreateTaskList } from "@/services/task-list.service";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

function CreateListDialog({ open, onOpenChange }) {
  const [name,  setName]  = useState("");
  const [icon,  setIcon]  = useState("📋");
  const [color, setColor] = useState(LIST_COLORS[0]);
  const createList = useCreateTaskList();
  const [, navigate] = useLocation();

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const list = await createList.mutateAsync({
      name: name.trim(), icon, color, sortOrder: 100,
    });
    setName("");
    onOpenChange(false);
    navigate(`/tasks/${list.id}`);
  };

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}
    >
      {/* Modal */}
      <div
        id="create-list-dialog"
        className="w-full max-w-sm rounded-2xl p-6 animate-slide-up"
        style={{
          background:   "var(--surface-raised)",
          border:       "1px solid var(--border-strong)",
          boxShadow:    "var(--shadow-modal)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            Create Task List
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--surface-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: "var(--text-muted)" }}
            >
              Name
            </label>
            <input
              id="create-list-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Work, Reading, Fitness…"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-150"
              style={{
                background:   "var(--surface)",
                border:       "1px solid var(--input-border)",
                color:        "var(--text-primary)",
              }}
              onFocus={(e)  => (e.target.style.borderColor = "var(--brand-blue)")}
              onBlur={(e)   => (e.target.style.borderColor = "var(--input-border)")}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {/* Icon picker */}
          <div className="space-y-1.5">
            <label
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: "var(--text-muted)" }}
            >
              Icon
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LIST_ICONS.map((i) => (
                <button
                  key={i}
                  id={`icon-${i}`}
                  type="button"
                  onClick={() => setIcon(i)}
                  className="w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all duration-150"
                  style={{
                    border:     `1px solid ${icon === i ? "var(--brand-blue)" : "var(--border)"}`,
                    background: icon === i ? "rgba(71,114,250,0.12)" : "var(--surface)",
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="space-y-1.5">
            <label
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: "var(--text-muted)" }}
            >
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {LIST_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-all duration-150"
                  style={{
                    backgroundColor: c,
                    boxShadow: color === c
                      ? `0 0 0 2px var(--surface-raised), 0 0 0 4px ${c}`
                      : "none",
                    transform: color === c ? "scale(1.15)" : "scale(1)",
                  }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            id="create-list-cancel"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            Cancel
          </button>
          <button
            id="create-list-submit"
            onClick={handleSubmit}
            disabled={!name.trim() || createList.isPending}
            className="btn-pill btn-primary px-5 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createList.isPending ? "Creating…" : "Create List"}
          </button>
        </div>
      </div>
    </div>
  );
}

export { CreateListDialog };
