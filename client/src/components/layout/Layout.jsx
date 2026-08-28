import { useState } from "react";
import { useLocation, Redirect } from "wouter";
import { Loader2, Zap } from "lucide-react";
import { Sidebar, MobileSidebar, MobileHeader } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

/* Routes that are accessible without authentication */
const PUBLIC_ROUTES = ["/profile"];

function LoadingScreen() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: "var(--background)" }}
    >
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--brand-blue)" }}
        >
          <Zap className="w-6 h-6 text-white" />
        </div>
        <Loader2
          className="w-5 h-5 animate-spin"
          style={{ color: "var(--brand-blue)" }}
        />
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Loading ZenPulse…
        </p>
      </div>
    </div>
  );
}

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const [location] = useLocation();

  /* Show loading screen while auth state resolves */
  if (loading) return <LoadingScreen />;

  /* Redirect unauthenticated users away from protected routes */
  const isPublic = PUBLIC_ROUTES.some(
    (route) => location === route || location.startsWith(`${route}/`)
  );

  if (!user && !isPublic) {
    return <Redirect to="/profile" />;
  }

  return (
    <div
      id="app-shell"
      className="flex min-h-screen"
      style={{ background: "var(--background)", color: "var(--text-primary)" }}
    >
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile overlay sidebar */}
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top header */}
        <MobileHeader onMenuOpen={() => setMobileOpen(true)} />

        {/* Page content */}
        <main
          id="main-content"
          className={cn("flex-1 p-4 md:p-8", "max-w-7xl w-full mx-auto")}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export { Layout };
