import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Cookie, ShieldCheck, X } from "lucide-react";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("pace_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      "pace_cookie_consent",
      JSON.stringify({ necessary: true, analytics: true, marketing: true, timestamp: Date.now() })
    );
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem(
      "pace_cookie_consent",
      JSON.stringify({ necessary: true, analytics: false, marketing: false, timestamp: Date.now() })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Consent Banner"
      className="fixed bottom-0 inset-x-0 z-40 p-4 bg-surface-raised/95 border-t border-border/80 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3 text-xs font-sans text-muted-foreground leading-relaxed">
          <Cookie className="w-5 h-5 text-greptile-green shrink-0 mt-0.5" />
          <div>
            <p className="font-mono text-foreground font-semibold flex items-center gap-2">
              <span>// PRIVACY &amp; COOKIE GOVERNANCE</span>
              <span className="text-[10px] text-greptile-green px-1.5 py-0.5 rounded bg-greptile-green/10 border border-greptile-green/20">
                GDPR &amp; CCPA
              </span>
            </p>
            <p className="mt-1">
              Pace uses essential cookies for cryptographic session tokens and anonymous telemetry to optimize cognitive focus rhythms. We never monetize or sell personal telemetry. Read our{" "}
              <Link href="/cookies" className="text-greptile-green hover:underline">
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-greptile-green hover:underline">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
          <Link
            href="/cookie-settings"
            onClick={() => setVisible(false)}
            className="px-3 py-2 rounded-[4px] border border-border bg-surface text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            Customize
          </Link>
          <button
            onClick={handleRejectNonEssential}
            className="px-3 py-2 rounded-[4px] border border-border bg-surface text-xs font-mono uppercase tracking-wider text-foreground hover:border-border-strong transition-colors"
          >
            Reject Non-Essential
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-4 py-2 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(40,233,159,0.25)] flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
export default CookieConsentBanner;
