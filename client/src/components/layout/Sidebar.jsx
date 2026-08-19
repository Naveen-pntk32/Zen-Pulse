import { Link, useLocation } from "wouter";
import {
  User,
  CheckSquare,
  Timer,
  BarChart3,
  Search,
  Settings,
  Moon,
  Sun,
  LogOut,
  LogIn,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useSettings, useUpdateSettings } from "@/services/settings.service";
import { applyTheme } from "@/contexts/theme";
const NAV_ITEMS = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/pomodoro", label: "Pomodoro", icon: Timer },
  { href: "/habits", label: "Habit Tracker", icon: BarChart3 },
  { href: "/search", label: "Search", icon: Search },
  { href: "/settings", label: "Settings", icon: Settings }
];
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
  return <div className="flex flex-col h-full">
      {
    /* Logo */
  }
      <Link href="/pomodoro" onClick={onNavigate} className="px-5 py-5 block">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          ZenPulse
        </h1>
        <p className="text-[11px] text-gray-500 mt-0.5">Focus. Track. Grow.</p>
      </Link>

      {
    /* Nav */
  }
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    return <Link
      key={item.href}
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
        active ? "bg-indigo-500/20 text-indigo-300" : "text-gray-400 hover:text-white hover:bg-gray-700/60"
      )}
    >
              <Icon className="w-[18px] h-[18px]" />
              {item.label}
            </Link>;
  })}

              </nav>

      {
    /* Footer */
  }
      <div className="px-3 py-4 border-t border-gray-700/60 space-y-1">
        <button
    onClick={toggleTheme}
    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700/60 transition-colors"
  >
          {settings?.theme === "light" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          Dark Mode
        </button>
        {user ? <button
    onClick={() => signOut()}
    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
  >
            <LogOut className="w-[18px] h-[18px]" />
            Logout
          </button> : <Link
    href="/profile"
    onClick={onNavigate}
    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700/60 transition-colors"
  >
            <LogIn className="w-[18px] h-[18px]" />
            Sign In
          </Link>}
      </div>
    </div>;
}
function Sidebar() {
  return <aside className="hidden md:flex w-64 shrink-0 bg-gray-900 border-r border-gray-800">
      <SidebarContent />
    </aside>;
}
function MobileSidebar({ open, onClose }) {
  return <div className={cn("md:hidden", open ? "block" : "hidden")}>
      <div
    className="fixed inset-0 bg-black/70 z-40"
    onClick={onClose}
    aria-hidden
  />
      <aside className="fixed inset-y-0 left-0 w-72 z-50 bg-gray-900 border-r border-gray-800 shadow-2xl animate-in slide-in-from-left-5 duration-200">
        <button
    onClick={onClose}
    className="absolute top-4 right-4 text-gray-400 hover:text-white"
    aria-label="Close menu"
  >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>;
}
function MobileHeader({ onMenuOpen }) {
  return <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-gray-900/95 backdrop-blur border-b border-gray-800">
      <button
    onClick={onMenuOpen}
    className="p-2 rounded-lg text-gray-300 hover:bg-gray-800"
    aria-label="Open menu"
  >
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
        ZenPulse
      </h1>
      <div className="w-9" />
    </header>;
}
export {
  MobileHeader,
  MobileSidebar,
  Sidebar,
  SidebarContent
};
