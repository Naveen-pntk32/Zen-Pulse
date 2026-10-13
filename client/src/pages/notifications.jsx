import { useState } from "react";
import { Bell, CheckCheck, Trash2, Zap, Clock, ShieldCheck, Sparkles } from "lucide-react";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Inaugural Focus Milestone Achieved",
    desc: "You completed 4 continuous Pomodoro intervals today. Velocity score increased by +12%.",
    time: "10m ago",
    category: "milestone",
    read: false,
    icon: Zap,
  },
  {
    id: 2,
    title: "AI Daily Deep-Work Briefing Ready",
    desc: "Your cognitive schedule has prioritized 2 high-leverage engineering deliverables for today.",
    time: "2h ago",
    category: "ai",
    read: false,
    icon: Sparkles,
  },
  {
    id: 3,
    title: "Supabase Realtime Sync Verified",
    desc: "All local offline tasks successfully reconciled with multi-device cloud storage.",
    time: "Yesterday",
    category: "system",
    read: true,
    icon: ShieldCheck,
  },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setItems(items.map((i) => ({ ...i, read: true })));
  };

  const clearAll = () => {
    setItems([]);
  };

  const filtered = items.filter((i) => (filter === "all" ? true : i.category === filter));

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-greptile-green uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5" />
            <span>// TELEMETRY &amp; NOTIFICATION HUB</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-1">
            Notification Center
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="px-3 py-1.5 rounded-[4px] border border-border bg-surface text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
          </button>
          <button
            onClick={clearAll}
            className="px-3 py-1.5 rounded-[4px] border border-border bg-surface text-xs font-mono text-muted-foreground hover:text-red-400 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: "all", label: "All Alerts" },
          { id: "milestone", label: "Milestones" },
          { id: "ai", label: "AI Insights" },
          { id: "system", label: "System Sync" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-[4px] font-mono text-xs uppercase tracking-wider transition-all ${
              filter === tab.id
                ? "bg-greptile-green/15 text-greptile-green border-b-2 border-greptile-green font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`p-4 rounded-[6px] border transition-all flex items-start gap-4 ${
                item.read
                  ? "border-border/60 bg-surface/50 opacity-80"
                  : "border-greptile-green/40 bg-surface shadow-sm"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-[4px] flex items-center justify-center shrink-0 ${
                  item.read ? "bg-surface-raised text-muted-foreground" : "bg-greptile-green/20 text-greptile-green"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-foreground truncate">
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {!item.read && (
                <span className="w-2 h-2 rounded-full bg-greptile-green shrink-0 mt-1.5 shadow-[0_0_6px_#28e99f]" />
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-[8px] border border-border bg-surface text-xs font-mono text-muted-foreground space-y-2">
            <p>// ALL NOTIFICATIONS CLEARED</p>
            <p className="text-[11px] font-sans">You are fully caught up with all focus alerts and system milestones.</p>
          </div>
        )}
      </div>
    </div>
  );
}
