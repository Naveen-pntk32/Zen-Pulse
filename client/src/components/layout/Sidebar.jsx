import { Link, useLocation } from "wouter";
import {
  User,
  CheckSquare,
  Timer,
  Activity,
  Search,
  Settings,
  Sun,
  Moon,
  LogOut,
  LogIn,
  Menu,
  X,
  Zap,
  Bell,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useSettings, useUpdateSettings } from "@/services/settings.service";
import { applyTheme } from "@/contexts/theme";

const NAV_ITEMS = [
  { href: "/pomodoro",      label: "Pomodoro",      code: "01", icon: Timer },
  { href: "/tasks",         label: "Tasks",         code: "02", icon: CheckSquare },
  { href: "/habits",        label: "Habit Tracker", code: "03", icon: Activity },
  { href: "/search",        label: "Search",        code: "04", icon: Search },
  { href: "/notifications", label: "Alerts",        code: "05", icon: Bell },
  { href: "/activity",      label: "Activity",      code: "06", icon: History },
  { href: "/profile",       label: "Profile",       code: "07", icon: User },
  { href: "/settings",      label: "Settings",      code: "08", icon: Settings },
];

/* ------------------------------------------------------------------ */
/* Shared sidebar content (used by both desktop & mobile)              */
/* ------------------------------------------------------------------ */
function SidebarContent({ onNavigate }) {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();

  const isActive = (href) => {
    if (href === "/tasks") {
      return location === "/tasks" || location.startsWith("/tasks/");
    }
    return location === href || location.startsWith(`${href}/`);
  };

  const toggleTheme = () => {
    const next = settings?.theme === "light" ? "dark" : "light";
    applyTheme(next);
    updateSettings.mutate({ theme: next });
  };

  const isLight = settings?.theme === "light";

  return (
    <div className="flex flex-col h-full bg-sidebar select-none font-sans">
      {/* ── Brand / Logo ─────────────────────────────────────── */}
      <Link
        href="/pomodoro"
        onClick={onNavigate}
        className="flex items-center gap-3 px-5 py-5 group border-b border-border/40 transition-colors"
        id="sidebar-logo-link"
      >
        <div className="w-8 h-8 rounded-[4px] bg-greptile-green flex items-center justify-center shadow-[0_0_12px_rgba(40,233,159,0.3)] transition-transform group-hover:scale-105">
          <Zap className="w-4 h-4 text-black fill-black" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-bold font-display tracking-tight text-foreground leading-none">
              pace.
            </h1>
            <span className="text-[9px] font-mono uppercase bg-greptile-green/15 text-greptile-green px-1 py-0.2 rounded-[2px] leading-none">
              v2
            </span>
          </div>
          <p className="text-[10px] font-mono mt-0.5 text-muted-foreground uppercase tracking-wider">
            Make room for focused work.
          </p>
        </div>
      </Link>

      {/* ── Nav items ───────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1" role="navigation">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
          // NAVIGATION
        </div>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              id={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[4px] text-xs font-mono uppercase tracking-wider font-semibold",
                "transition-all duration-150 cursor-pointer relative group",
                active
                  ? "bg-greptile-green/15 text-greptile-green border-l-2 border-greptile-green font-bold"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              )}
            >
              <span className={cn(
                "text-[10px] font-mono opacity-50 shrink-0",
                active && "text-greptile-green opacity-100"
              )}>
                {item.code}
              </span>
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                  active ? "text-greptile-green" : "text-muted-foreground"
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>

              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-greptile-green shadow-[0_0_6px_#28e99f]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer / User State ─────────────────────────────── */}
      <div className="px-3 py-4 border-t border-border/40 space-y-2 bg-surface/30">
        {/* User Card */}
        {user ? (
          <div className="px-3 py-2 rounded-[4px] border border-border/60 bg-surface flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-[3px] bg-greptile-green text-black font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                {(user.email ?? "U").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-mono text-foreground truncate leading-tight">
                  {user.email}
                </p>
                <p className="text-[9px] font-mono text-greptile-green uppercase tracking-wider">
                  Authenticated
                </p>
              </div>
            </div>
            <button
              id="sidebar-logout-btn"
              onClick={() => signOut()}
              className="p-1 rounded-[3px] text-muted-foreground hover:text-bloom hover:bg-bloom/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/profile"
            onClick={onNavigate}
            id="sidebar-signin-link"
            className="flex w-full items-center justify-center gap-2 px-3 py-2 rounded-[4px] border border-border bg-surface text-xs font-mono uppercase tracking-wider font-semibold text-muted-foreground hover:text-greptile-green hover:border-greptile-green/50 transition-all"
          >
            <LogIn className="w-3.5 h-3.5 text-greptile-green" />
            <span>Sign In</span>
          </Link>
        )}

        {/* Theme Toggle */}
        <button
          id="sidebar-theme-toggle"
          onClick={toggleTheme}
          className="flex w-full items-center justify-between px-3 py-1.5 rounded-[4px] text-xs font-mono uppercase tracking-wider text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-2">
            {isLight ? <Sun className="w-3.5 h-3.5 text-neon" /> : <Moon className="w-3.5 h-3.5 text-lavender" />}
            {isLight ? "Theme: Light" : "Theme: Dark"}
          </span>
          <span className="text-[10px] opacity-60">TOGGLE</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop sidebar                                                     */
/* ------------------------------------------------------------------ */
function Sidebar() {
  return (
    <aside
      id="sidebar-desktop"
      className="hidden md:flex w-[240px] shrink-0 flex-col h-full border-r border-border/60 bg-sidebar"
    >
      <SidebarContent />
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile overlay sidebar                                              */
/* ------------------------------------------------------------------ */
function MobileSidebar({ open, onClose }) {
  return (
    <div className={cn("md:hidden", open ? "block" : "hidden")}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden
      />
      {/* Drawer */}
      <aside
        id="sidebar-mobile"
        className="fixed inset-y-0 left-0 w-72 z-50 flex flex-col bg-sidebar border-r border-border shadow-2xl animate-in slide-in-from-left duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-[4px] border border-border text-muted-foreground hover:text-foreground hover:bg-surface-hover"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile top header                                                   */
/* ------------------------------------------------------------------ */
function MobileHeader({ onMenuOpen }) {
  return (
    <header
      id="mobile-header"
      className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-surface/90 backdrop-blur-md border-b border-border"
    >
      <button
        onClick={onMenuOpen}
        className="p-1.5 rounded-[4px] border border-border text-muted-foreground hover:text-foreground hover:bg-surface-hover"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-[3px] bg-greptile-green flex items-center justify-center shadow-[0_0_8px_rgba(40,233,159,0.3)]">
          <Zap className="w-3.5 h-3.5 text-black fill-black" />
        </div>
        <span className="text-sm font-bold font-display tracking-tight text-foreground">
          pace.
        </span>
      </div>

      <div className="w-8" />
    </header>
  );
}

export { MobileHeader, MobileSidebar, Sidebar, SidebarContent };
