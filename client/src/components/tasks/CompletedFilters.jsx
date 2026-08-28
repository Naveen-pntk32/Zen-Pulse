const DATE_OPTIONS = [
  { value: "all",    label: "All Dates"     },
  { value: "today",  label: "Today"          },
  { value: "7",      label: "Last 7 Days"    },
  { value: "30",     label: "Last 30 Days"   },
  { value: "custom", label: "Custom Range"   },
];

function FilterSelect({ id, value, onChange, options, placeholder }) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm rounded-lg px-3 py-2 outline-none transition-colors duration-150 cursor-pointer"
      style={{
        background:   "var(--surface-raised)",
        border:       "1px solid var(--border)",
        color:        "var(--text-primary)",
      }}
      onFocus={(e)  => (e.target.style.borderColor = "var(--brand-blue)")}
      onBlur={(e)   => (e.target.style.borderColor = "var(--border)")}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: "var(--surface-raised)" }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function DateInput({ id, value, onChange }) {
  return (
    <input
      id={id}
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm rounded-lg px-3 py-2 outline-none [color-scheme:dark] transition-colors duration-150"
      style={{
        background:   "var(--surface-raised)",
        border:       "1px solid var(--border)",
        color:        "var(--text-primary)",
      }}
      onFocus={(e)  => (e.target.style.borderColor = "var(--brand-blue)")}
      onBlur={(e)   => (e.target.style.borderColor = "var(--border)")}
    />
  );
}

function CompletedFilters({
  lists,
  dateFilter,   onDateFilter,
  listFilter,   onListFilter,
  customFrom,   onCustomFrom,
  customTo,     onCustomTo,
}) {
  const listOptions = [
    { value: "all", label: "All Lists" },
    ...(lists ?? []).map((l) => ({ value: l.id, label: `${l.icon || "📋"} ${l.name}` })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Date filter */}
      <FilterSelect
        id="completed-date-filter"
        value={dateFilter}
        onChange={onDateFilter}
        options={DATE_OPTIONS}
      />

      {/* Custom date range */}
      {dateFilter === "custom" && (
        <>
          <DateInput id="completed-from-date" value={customFrom} onChange={onCustomFrom} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>to</span>
          <DateInput id="completed-to-date"   value={customTo}   onChange={onCustomTo} />
        </>
      )}

      {/* List filter */}
      <FilterSelect
        id="completed-list-filter"
        value={listFilter}
        onChange={onListFilter}
        options={listOptions}
      />
    </div>
  );
}

export { CompletedFilters };
