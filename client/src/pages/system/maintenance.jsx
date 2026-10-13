import { Link } from "wouter";
import { Wrench, Clock, RefreshCw, ExternalLink } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen w-full bg-background bg-grid-pattern text-foreground flex flex-col items-center justify-center p-4 sm:p-6 antialiased selection:bg-amber-400 selection:text-black">
      <div className="w-full max-w-md rounded-[8px] border border-amber-500/30 bg-surface-raised p-6 sm:p-8 text-center space-y-6 shadow-2xl relative">
        <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <Wrench className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-widest">
            // STATUS: PLANNED MAINTENANCE WINDOW
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Systems Upgrading
          </h1>
          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
            Pace is undergoing scheduled database schema migration and security patch deployment to improve deep work throughput.
          </p>
        </div>

        <div className="p-3 rounded-[4px] border border-border bg-surface text-[10px] font-mono text-muted-foreground text-left space-y-1">
          <div>ESTIMATED DURATION: ~30 MINUTES</div>
          <div>EXPECTED COMPLETION: 23:30 UTC</div>
          <div>LOCAL CLIENT CACHE: SAFE &amp; PRESERVED</div>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(40,233,159,0.25)]"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Check System Status
          </button>
        </div>
      </div>
    </div>
  );
}
