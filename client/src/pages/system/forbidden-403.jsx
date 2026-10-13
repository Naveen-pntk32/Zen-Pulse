import { Link } from "wouter";
import { ShieldX, ArrowLeft, LogIn, KeyRound } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen w-full bg-background bg-grid-pattern text-foreground flex flex-col items-center justify-center p-4 sm:p-6 antialiased selection:bg-red-500 selection:text-white">
      <div className="w-full max-w-md rounded-[8px] border border-red-500/30 bg-surface-raised p-6 sm:p-8 text-center space-y-6 shadow-2xl relative">
        <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <ShieldX className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-mono text-red-400 font-bold uppercase tracking-widest">
            // HTTP ERROR 403: ACCESS FORBIDDEN
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Insufficient Permissions
          </h1>
          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
            Your authenticated identity does not possess the required RBAC clearance level to inspect this resource or administrative console.
          </p>
        </div>

        <div className="p-3 rounded-[4px] border border-border bg-surface text-[10px] font-mono text-muted-foreground text-left space-y-1">
          <div>REQUIRED POLICY: PACE_SUPERADMIN_EXECUTE</div>
          <div>ASSERTION: FAILED // ROUTE_GUARD_INTERCEPT</div>
        </div>

        <div className="space-y-2.5 pt-2">
          <Link
            href="/pomodoro"
            className="w-full py-2.5 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(40,233,159,0.25)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Safe Cockpit
          </Link>

          <Link
            href="/profile"
            className="w-full py-2 rounded-[4px] border border-border text-xs font-mono text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" /> Switch Authentication Account
          </Link>
        </div>
      </div>
    </div>
  );
}
