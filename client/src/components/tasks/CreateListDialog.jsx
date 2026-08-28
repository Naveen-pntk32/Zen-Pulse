import { useState } from "react";
import { useLocation } from "wouter";
import { LIST_COLORS, LIST_ICONS } from "@/lib/defaults";
import { useCreateTaskList } from "@/services/task-list.service";
import { cn } from "@/lib/utils";
import { X, Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}
    >
      <div
        id="create-list-dialog"
        className="w-full max-w-sm rounded-[8px] p-6 bg-surface-elevated border border-border shadow-2xl animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-4">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-greptile-green" />
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-foreground">
              New Task List
            </h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-[3px] text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label
              className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold"
            >
              List Name
            </label>
            <input
              id="create-list-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Engineering, Research, Health..."
              autoFocus
              className="w-full px-3 py-2 rounded-[4px] text-xs font-sans bg-surface border border-input-border text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-greptile-green focus:ring-1 focus:ring-greptile-green/40 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {/* Icon picker */}
          <div className="space-y-1.5">
            <label
              className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold"
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
                  className={cn(
                    "w-8 h-8 rounded-[4px] text-sm flex items-center justify-center transition-all cursor-pointer",
                    icon === i
                      ? "bg-greptile-green/20 border border-greptile-green shadow-[0_0_8px_rgba(40,233,159,0.3)]"
                      : "bg-surface border border-border hover:border-border-strong hover:bg-surface-hover"
                  )}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="space-y-1.5">
            <label
              className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold"
            >
              Theme Color
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {LIST_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-6 h-6 rounded-[3px] transition-all cursor-pointer",
                    color === c
                      ? "ring-2 ring-greptile-green ring-offset-2 ring-offset-surface-elevated scale-110"
                      : "opacity-80 hover:opacity-100"
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-border/40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSubmit}
            disabled={!name.trim() || createList.isPending}
          >
            {createList.isPending ? "Creating…" : "Create List"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { CreateListDialog };
