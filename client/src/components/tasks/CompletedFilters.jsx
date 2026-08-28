import { cn } from "@/lib/utils";

const DATE_OPTIONS = [
  { value: "all",    label: "ALL TIME"     },
  { value: "today",  label: "TODAY"        },
  { value: "7",      label: "LAST 7D"      },
  { value: "30",     label: "LAST 30D"     },
  { value: "custom", label: "CUSTOM RANGE" },
];

function CompletedFilters({
  lists,
  dateFilter,   onDateFilter,
  listFilter,   onListFilter,
  customFrom,   onCustomFrom,
  customTo,     onCustomTo,
}) {
  const listOptions = [
    { value: "all", label: "ALL LISTS" },
    ...(lists ?? []).map((l) => ({ value: l.id, label: `${l.icon || "📋"} ${l.name.toUpperCase()}` })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 rounded-[6px] border border-border/60 bg-surface/40">
      {/* Date filter buttons */}
      <div className="flex flex-wrap items-center gap-1">
        {DATE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onDateFilter(opt.value)}
            className={cn(
              "px-2.5 py-1 rounded-[3px] text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer",
              dateFilter === opt.value
                ? "bg-greptile-green text-black shadow-[0_0_8px_rgba(40,233,159,0.3)]"
                : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-border-strong"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Custom date range */}
      {dateFilter === "custom" && (
        <div className="flex items-center gap-1.5 ml-2">
          <input
            id="completed-from-date"
            type="date"
            value={customFrom}
            onChange={(e) => onCustomFrom(e.target.value)}
            className="text-[11px] font-mono rounded-[3px] px-2 py-1 bg-surface border border-input-border text-foreground [color-scheme:dark] outline-none focus:border-greptile-green"
          />
          <span className="text-[10px] font-mono text-muted-foreground uppercase">TO</span>
          <input
            id="completed-to-date"
            type="date"
            value={customTo}
            onChange={(e) => onCustomTo(e.target.value)}
            className="text-[11px] font-mono rounded-[3px] px-2 py-1 bg-surface border border-input-border text-foreground [color-scheme:dark] outline-none focus:border-greptile-green"
          />
        </div>
      )}

      {/* List filter */}
      <div className="ml-auto">
        <select
          id="completed-list-filter"
          value={listFilter}
          onChange={(e) => onListFilter(e.target.value)}
          className="text-[11px] font-mono uppercase tracking-wider rounded-[3px] px-2.5 py-1 bg-surface border border-input-border text-foreground outline-none focus:border-greptile-green cursor-pointer"
        >
          {listOptions.map((o) => (
            <option key={o.value} value={o.value} className="bg-surface-elevated text-foreground">
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export { CompletedFilters };
