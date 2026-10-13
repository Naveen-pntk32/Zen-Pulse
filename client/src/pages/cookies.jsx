import { Link } from "wouter";
import { Cookie, ArrowLeft, Shield, Sliders } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export default function CookiePolicyPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans">
        <div className="space-y-2 mb-10 pb-6 border-b border-border/40">
          <div className="flex items-center gap-2 text-xs font-mono text-greptile-green uppercase tracking-wider">
            <Cookie className="w-3.5 h-3.5" />
            <span>// DATA &amp; TRACKER DISCLOSURES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
            Cookie Policy
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: October 13, 2026 • Compliant with EU GDPR &amp; California CCPA
          </p>
        </div>

        {/* CTA to Interactive Cookie Settings */}
        <div className="mb-10 p-5 rounded-[8px] border border-greptile-green/30 bg-surface-raised flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Manage Your Cookie Preferences
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              You have the legal right to opt out of analytics and functional trackers at any time.
            </p>
          </div>
          <Link
            href="/cookie-settings"
            className="px-4 py-2 rounded-[4px] bg-greptile-green text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#34f5ab] transition-all flex items-center gap-2 shrink-0"
          >
            <Sliders className="w-3.5 h-3.5" /> Cookie Settings
          </Link>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">1. What Are Cookies?</h2>
            <p>
              Cookies are small text data fragments stored in your web browser by websites you visit. They are commonly used to remember your authentication state, maintain user preferences across page navigation, and capture anonymous telemetry regarding application stability.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">2. Categories of Trackers Utilized by Pace</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-[6px] border border-border bg-surface space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase text-foreground">
                  A. Strictly Necessary / Essential Storage (Cannot be Disabled)
                </h4>
                <p className="text-xs">
                  Required for core platform functionality. These tokens maintain cryptographic JWT session tokens (Supabase Authentication), verify CSRF protections, and store your dark mode aesthetic preference.
                </p>
              </div>

              <div className="p-4 rounded-[6px] border border-border bg-surface space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase text-foreground">
                  B. Performance &amp; Diagnostic Telemetry (Optional)
                </h4>
                <p className="text-xs">
                  Anonymous performance metrics used to diagnose client-side exceptions, timer drift, and API response latencies. No personal identifying information (PII) is ever attached.
                </p>
              </div>

              <div className="p-4 rounded-[6px] border border-border bg-surface space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase text-foreground">
                  C. Marketing &amp; Cross-Site Trackers (Zero / None)
                </h4>
                <p className="text-xs">
                  Pace does not use third-party advertising tracking pixels (e.g. Meta Pixel, TikTok Pixel, Google Ads). We do not monetize your browsing history.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">3. Browser-Level Cookie Management</h2>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you refuse strictly necessary session tokens, the authenticated Pace workspace will operate strictly in unauthenticated offline mode.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">4. Contact Privacy Governance</h2>
            <p>
              For questions regarding our tracker policies or GDPR Data Subject Access Requests (DSAR), contact our Data Protection Officer at <code className="text-greptile-green">privacy@pace.app</code>.
            </p>
          </section>
        </div>
      </div>
    </MarketingLayout>
  );
}
