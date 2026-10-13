import { useState } from "react";
import { useLocation, Redirect } from "wouter";
import { Loader2, Zap } from "lucide-react";
import { Sidebar, MobileSidebar, MobileHeader } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

/* Routes that are accessible without authentication */
const PUBLIC_ROUTES = ["/", "/profile", "/terms", "/privacy"];

/* Standalone pages rendered with their own layout (Marketing, Auth, Admin, System) */
const STANDALONE_PREFIXES = [
  "/features",
  "/pricing",
  "/about",
  "/contact",
  "/faq",
  "/changelog",
  "/privacy",
  "/terms",
  "/cookies",
  "/cookie-settings",
  "/refund-policy",
  "/cancellation-policy",
  "/acceptable-use",
  "/security",
  "/accessibility",
  "/dpa",
  "/help",
  "/support",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/verify-otp",
  "/invite",
  "/onboarding",
  "/upgrade",
  "/downgrade",
  "/billing/cancel",
  "/checkout",
  "/admin",
  "/403",
  "/500",
  "/maintenance",
];

function LoadingScreen() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background bg-grid-pattern relative"
      style={{ color: "var(--text-primary)" }}
    >
      <div className="absolute inset-0 bg-radial-glow-center pointer-events-none" />
      <div className="flex flex-col items-center gap-4 animate-fade-in relative z-10 p-8 rounded-[8px] border border-border bg-surface-raised/80 backdrop-blur-md">
        <div className="w-12 h-12 rounded-[6px] flex items-center justify-center bg-greptile-green shadow-[0_0_20px_rgba(40,233,159,0.3)]">
          <Zap className="w-6 h-6 text-black fill-black" />
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-greptile-green" />
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            // INITIALIZING PACE...
          </p>
        </div>
      </div>
    </div>
  );
}

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const [location] = useLocation();

  const isStandalone =
    location === "/" ||
    STANDALONE_PREFIXES.some(
      (prefix) => location === prefix || location.startsWith(`${prefix}/`)
    );

  /* Standalone public and dedicated layouts render directly */
  if (isStandalone) {
    return <>{children}</>;
  }

  /* Show loading screen while auth state resolves for workspace routes */
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
      id="app-root"
      className="min-h-screen w-full bg-background bg-grid-pattern relative text-foreground flex flex-col antialiased selection:bg-greptile-green selection:text-black overflow-x-hidden"
    >
      {/* Top ambient radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-radial-glow pointer-events-none -z-10" />

      {/* Main shell */}
      <div className="flex-1 w-full max-w-[1680px] mx-auto flex flex-col p-2 sm:p-4 md:p-6 lg:p-8">
        <div
          id="app-container"
          className="flex-1 flex flex-col md:flex-row w-full rounded-[8px] border border-border/80 bg-surface/90 backdrop-blur-xl shadow-2xl overflow-hidden relative"
        >
          {/* Subtle Technical Corner Crosses */}
          <div className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-greptile-green pointer-events-none select-none z-20">
            +
          </div>
          <div className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-greptile-green pointer-events-none select-none z-20">
            +
          </div>
          <div className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-greptile-green pointer-events-none select-none z-20">
            +
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-greptile-green pointer-events-none select-none z-20">
            +
          </div>

          {/* Desktop sidebar */}
          <Sidebar />

          {/* Mobile overlay sidebar */}
          <MobileSidebar
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
          />

          {/* Main content area */}
          <div className="flex-1 min-w-0 flex flex-col relative bg-surface-raised/30 overflow-hidden">
            {/* Mobile top header */}
            <MobileHeader onMenuOpen={() => setMobileOpen(true)} />

            {/* Top Technical Status / Breadcrumb Bar */}
            <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-border/40 bg-surface/50 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-greptile-green animate-pulse" />
                <span className="text-foreground/80 font-bold">pace.</span>
                <span>/</span>
                <span className="text-greptile-green">
                  {location === "/" ? "POMODORO" : location.replace("/", "").toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="badge-tech badge-tech-green">
                  {user ? "SYNC: SUPABASE" : "MODE: LOCAL"}
                </span>
                <span>v2.0 // GREPTILE ENGINE</span>
              </div>
            </div>

            {/* Page content scroll container */}
            <main
              id="main-content"
              className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8"
            >
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Layout };
