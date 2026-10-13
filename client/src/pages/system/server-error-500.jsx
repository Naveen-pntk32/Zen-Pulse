import { useState } from "react";
import { Link } from "wouter";
import { ServerCrash, RefreshCw, ArrowLeft, ExternalLink } from "lucide-react";

export default function ServerErrorPage() {
  const [incidentId] = useState(`ERR_PACE_500_${Math.random().toString(36).substring(2, 9).toUpperCase()}`);

  return (
    <div className="min-h-screen w-full bg-background bg-grid-pattern text-foreground flex flex-col items-center justify-center p-4 sm:p-6 antialiased selection:bg-red-500 selection:text-white">
      <div className="w-full max-w-md rounded-[8px] border border-red-500/30 bg-surface-raised p-6 sm:p-8 text-center space-y-6 shadow-2xl relative">
        <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <ServerCrash className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-mono text-red-400 font-bold uppercase tracking-widest">
            // HTTP 500: INTERNAL SYSTEM EXCEPTION
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Unexpected Server Failure
          </h1>
          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
            The Pace backend node encountered an unhandled exception while fulfilling this operation. Our automated telemetry has dispatched an alert to our engineering duty rota.
          </p>
        </div>

        <div className="p-3 rounded-[4px] border border-border bg-surface text-[10px] font-mono text-muted-foreground text-left space-y-1">
          <div>INCIDENT CODE: <span className="text-foreground font-bold">{incidentId}</span></div>
          <div>TIMESTAMP: {new Date().toISOString()}</div>
          <div>STATUS: DISPATCHED_TO_PAGERDUTY</div>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(40,233,159,0.25)]"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Request
          </button>

          <Link
            href="/pomodoro"
            className="w-full py-2 rounded-[4px] border border-border text-xs font-mono text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Safe Cockpit
          </Link>
        </div>
      </div>
    </div>
  );
}
