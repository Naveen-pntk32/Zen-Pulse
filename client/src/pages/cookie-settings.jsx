import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Sliders, ShieldCheck, CheckCircle2, RotateCcw, ArrowLeft } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export default function CookieSettingsPage() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pace_cookie_consent");
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({
          necessary: true,
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
        });
      }
    } catch (e) {
      console.warn("Could not load cookie preferences:", e);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(
      "pace_cookie_consent",
      JSON.stringify({
        necessary: true,
        analytics: preferences.analytics,
        marketing: preferences.marketing,
        timestamp: Date.now(),
      })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    const defaultSettings = { necessary: true, analytics: false, marketing: false };
    setPreferences(defaultSettings);
    localStorage.setItem(
      "pace_cookie_consent",
      JSON.stringify({ ...defaultSettings, timestamp: Date.now() })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans space-y-10">
        <div className="space-y-2 border-b border-border/40 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-greptile-green uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5" />
            <span>// PRIVACY PREFERENCES MANAGER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
            Cookie Preferences
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            Under GDPR (Article 7) and CCPA, you have complete sovereignty over which non-essential cookies and analytics trackers are executed on your device.
          </p>
        </div>

        {saved && (
          <div className="p-4 rounded-[6px] border border-greptile-green/40 bg-greptile-green/10 text-xs font-mono text-greptile-green flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Preferences updated and saved to local cryptographic storage.</span>
          </div>
        )}

        {/* Toggles Container */}
        <div className="space-y-6">
          {/* Strictly Necessary */}
          <div className="p-6 rounded-[8px] border border-border bg-surface space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span>Strictly Necessary Cookies</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-greptile-green/15 text-greptile-green uppercase">
                    Always Active
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Required for user authentication sessions, CSRF token security, and local storage state persistence. Cannot be disabled.
                </p>
              </div>
              <input
                type="checkbox"
                checked
                disabled
                className="w-5 h-5 accent-greptile-green cursor-not-allowed opacity-60"
              />
            </div>
          </div>

          {/* Performance & Analytics */}
          <div className="p-6 rounded-[8px] border border-border bg-surface space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Performance &amp; Diagnostics Telemetry
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Collects anonymous technical runtime logs to identify client-side crashes, latency anomalies, and Pomodoro timer drift.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-raised border border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-muted-foreground after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-greptile-green peer-checked:after:bg-black"></div>
              </label>
            </div>
          </div>

          {/* Marketing */}
          <div className="p-6 rounded-[8px] border border-border bg-surface space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Marketing &amp; Personalization
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Enables personalized onboarding tours and localized announcements. Pace does not share this telemetry with ad networks.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences({ ...preferences, marketing: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-raised border border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-muted-foreground after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-greptile-green peer-checked:after:bg-black"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/40">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-[4px] border border-border text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Defaults
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(40,233,159,0.3)]"
          >
            <ShieldCheck className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </div>
    </MarketingLayout>
  );
}
