import { useState } from "react";
import { Activity, Download, Filter, CheckCircle2, Timer, Zap, Sparkles } from "lucide-react";

const INITIAL_LOGS = [
  { id: 1, type: "pomodoro", title: "Completed Pomodoro Session (25 mins)", meta: "Task: Implement Session Expired Interceptor", time: "Today at 22:15" },
  { id: 2, type: "task", title: "Task Marked Completed", meta: "Task: Build GDPR Cookie Preferences Manager", time: "Today at 21:40" },
  { id: 3, type: "habit", title: "Daily Habit Logged", meta: "Habit: Deep Engineering Work (Sprint 1)", time: "Today at 20:30" },
  { id: 4, type: "ai", title: "AI Subtask Decomposition Executed", meta: "Task: Master Page Architecture Scaffolding", time: "Today at 19:15" },
  { id: 5, type: "pomodoro", title: "Completed Flow Session (50 mins)", meta: "Task: Rebrand Greptile Wordmarks to pace.", time: "Today at 18:00" },
  { id: 6, type: "task", title: "New Task Created", meta: "Category: Security & Compliance Audit", time: "Today at 16:45" },
];

export default function ActivityPage() {
  const [logs] = useState(INITIAL_LOGS);

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pace_activity_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-greptile-green uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>// IMMUTABLE PRODUCTIVITY LOG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-1">
            Activity &amp; Audit Trail
          </h1>
        </div>

        <button
          onClick={exportJSON}
          className="px-3.5 py-2 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(40,233,159,0.25)]"
        >
          <Download className="w-3.5 h-3.5" /> Export Data (JSON)
        </button>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-4 rounded-[6px] border border-border bg-surface flex items-start justify-between gap-4 hover:border-border-strong transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-[4px] bg-surface-raised border border-border flex items-center justify-center shrink-0 mt-0.5">
                {log.type === "pomodoro" ? (
                  <Timer className="w-4 h-4 text-greptile-green" />
                ) : log.type === "ai" ? (
                  <Sparkles className="w-4 h-4 text-purple-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                )}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-foreground">
                  {log.title}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {log.meta}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono text-muted-foreground shrink-0">
              {log.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
