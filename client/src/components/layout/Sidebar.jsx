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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useSettings, useUpdateSettings } from "@/services/settings.service";
import { applyTheme } from "@/contexts/theme";

const NAV_ITEMS = [
  { href: "/profile",  label: "Profile",       icon: User },
  { href: "/tasks",    label: "Tasks",          icon: CheckSquare },
  { href: "/pomodoro", label: "Pomodoro",       icon: Timer },
  { href: "/habits",   label: "Habit Tracker",  icon: Activity },
  { href: "/search",   label: "Search",         icon: Search },
  { href: "/settings", label: "Settings",       icon: Settings },
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
    <div className="flex flex-col h-full">

      {/* ── Brand / Logo ─────────────────────────────────────── */}
      <Link
        href="/tasks"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-5 py-5 group select-none"
        id="sidebar-logo-link"
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
             style={{ background: "var(--brand-blue)" }}>
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-[15px] font-semibold leading-none"
              style={{ color: "var(--text-primary)" }}>
            ZenPulse
          </h1>
          <p className="text-[10px] mt-0.5 font-medium"
             style={{ color: "var(--text-muted)" }}>
            Focus · Track · Grow
          </p>
        </div>
      </Link>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="mx-4 h-px mb-2" style={{ background: "var(--border)" }} />

      {/* ── Nav items ───────────────────────────────────────── */}
      <nav className="flex-1 px-3 space-y-0.5" role="navigation">
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
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium",
                "transition-all duration-150 cursor-pointer select-none",
                active
                  ? "nav-active"
                  : "text-zp-secondary hover:bg-zp-surface hover:text-zp-primary"
              )}
            >
              <Icon
                className="w-[17px] h-[17px] shrink-0"
                style={{ color: active ? "var(--brand-blue)" : undefined }}
              />
              <span>{item.label}</span>

              {/* active pill indicator */}
              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--brand-blue)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="px-3 pb-4 pt-2 space-y-0.5">
        <div className="h-px mb-2 mx-1" style={{ background: "var(--border)" }} />

        {/* Theme toggle */}
        <button
          id="sidebar-theme-toggle"
          onClick={toggleTheme}
          className={cn(
            "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg",
            "text-[13.5px] font-medium text-zp-secondary",
            "hover:bg-zp-surface hover:text-zp-primary transition-all duration-150"
          )}
        >
          {isLight
            ? <Sun  className="w-[17px] h-[17px] shrink-0" />
            : <Moon className="w-[17px] h-[17px] shrink-0" />}
          {isLight ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Auth button */}
        {user ? (
          <button
            id="sidebar-logout-btn"
            onClick={() => signOut()}
            className={cn(
              "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg",
              "text-[13.5px] font-medium text-zp-secondary",
              "hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
            )}
          >
            <LogOut className="w-[17px] h-[17px] shrink-0" />
            Logout
          </button>
        ) : (
          <Link
            href="/profile"
            onClick={onNavigate}
            id="sidebar-signin-link"
            className={cn(
              "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg",
              "text-[13.5px] font-medium text-zp-secondary",
              "hover:bg-zp-surface hover:text-zp-primary transition-all duration-150"
            )}
          >
            <LogIn className="w-[17px] h-[17px] shrink-0" />
            Sign In
          </Link>
        )}

        {/* User email badge */}
        {user && (
          <div className="mt-3 px-3 py-2.5 rounded-lg" style={{ background: "var(--surface)" }}>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ background: "var(--brand-blue)" }}
              >
                {(user.email ?? "U").slice(0, 2).toUpperCase()}
              </div>
              <span
                className="text-[11px] truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {user.email}
              </span>
            </div>
          </div>
        )}
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
      className="hidden md:flex w-60 shrink-0 flex-col h-screen sticky top-0"
      style={{
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
      }}
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
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.65)" }}
        onClick={onClose}
        aria-hidden
      />
      {/* Drawer */}
      <aside
        id="sidebar-mobile"
        className="fixed inset-y-0 left-0 w-64 z-50 flex flex-col"
        style={{
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.4)",
          animation: "slideInLeft 0.2s ease",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-zp-raised"
          style={{ color: "var(--text-muted)" }}
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
      className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 glass"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <button
        onClick={onMenuOpen}
        className="p-2 rounded-lg transition-colors hover:bg-zp-surface"
        style={{ color: "var(--text-secondary)" }}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: "var(--brand-blue)" }}
        >
          <Zap className="w-3 h-3 text-white" />
        </div>
        <span className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
          ZenPulse
        </span>
      </div>

      <div className="w-9" />
    </header>
  );
}

export { MobileHeader, MobileSidebar, Sidebar, SidebarContent };
