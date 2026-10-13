import { Link, useLocation } from "wouter";
import { ShieldAlert, Users, KeyRound, FileText, ArrowLeft, Activity, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin", label: "Telemetry & Overview", icon: Activity },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/roles", label: "Roles & RBAC", icon: KeyRound },
  { href: "/admin/audit-logs", label: "Security & Audit Logs", icon: FileText },
];

export function AdminLayout({ children }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen w-full bg-background bg-grid-pattern text-foreground flex flex-col antialiased selection:bg-amber-400 selection:text-black">
      {/* Top Restricted Access Admin Banner */}
      <div className="w-full bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs font-mono text-amber-300">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-bold">// RESTRICTED: PACE SUPERADMIN GOVERNANCE CONSOLE</span>
          <span className="hidden sm:inline text-amber-200/60">• Server-Side RBAC Enforced</span>
        </div>
        <Link
          href="/pomodoro"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] border border-amber-500/30 bg-amber-500/20 hover:bg-amber-500/30 text-[10px] uppercase tracking-wider text-amber-200 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Exit Admin Mode
        </Link>
      </div>

      {/* Admin Shell Frame */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        {/* Admin Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 rounded-[8px] border border-border bg-surface p-4 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/50">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              ADMIN CONTROL
            </span>
          </div>

          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const active = location === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-[4px] text-xs font-mono uppercase tracking-wider transition-all",
                    active
                      ? "bg-amber-500/15 text-amber-300 border-l-2 border-amber-400 font-bold"
                      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-border/50 text-[10px] font-mono text-muted-foreground/70 space-y-1">
            <div>ENVIRONMENT: PRODUCTION</div>
            <div>AUTH LEVEL: LEVEL 4 (SUPERADMIN)</div>
            <div>GATEWAY: EDGE PROXY</div>
          </div>
        </aside>

        {/* Admin Main Canvas */}
        <main className="flex-1 min-w-0 rounded-[8px] border border-border bg-surface/80 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
export default AdminLayout;
