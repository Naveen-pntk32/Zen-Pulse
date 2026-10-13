import { useState, useEffect } from "react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";

export function OfflineDetector() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [justRestored, setJustRestored] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setJustRestored(true);
      const timer = setTimeout(() => setJustRestored(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustRestored(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !justRestored) return null;

  if (justRestored) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-2.5 rounded-[6px] border border-greptile-green/40 bg-surface-raised/95 backdrop-blur-md shadow-[0_0_20px_rgba(40,233,159,0.25)] text-xs font-mono text-greptile-green animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
        <Wifi className="w-4 h-4 text-greptile-green" />
        <div>
          <span className="font-bold">// NETWORK RESTORED</span>
          <span className="text-muted-foreground ml-2">Synced with cloud.</span>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 flex items-center justify-between gap-4 p-4 rounded-[6px] border border-amber-500/40 bg-[#14120a]/95 backdrop-blur-md shadow-2xl text-xs font-mono text-amber-300 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className="flex items-start gap-3">
        <WifiOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold tracking-wider">// OFFLINE DETECTED</p>
          <p className="text-[11px] text-amber-200/80 mt-0.5 font-sans">
            Working in offline local mode. Changes will sync once your internet connection is restored.
          </p>
        </div>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-2.5 py-1.5 rounded-[4px] border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-[10px] font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1.5 shrink-0 transition-colors"
      >
        <RefreshCw className="w-3 h-3" /> Retry
      </button>
    </div>
  );
}
export default OfflineDetector;
