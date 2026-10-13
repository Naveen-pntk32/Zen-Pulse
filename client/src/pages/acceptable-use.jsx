import { Link } from "wouter";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export default function AcceptableUsePage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans">
        <div className="space-y-2 mb-10 pb-6 border-b border-border/40">
          <div className="flex items-center gap-2 text-xs font-mono text-greptile-green uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>// PLATFORM INTEGRITY RULES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
            Acceptable Use Policy (AUP)
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: October 13, 2026 • Code of Conduct &amp; Network Protection
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">1. Purpose and Scope</h2>
            <p>
              This Acceptable Use Policy defines the rules governing access to Pace APIs, web endpoints, database synchronization channels, and AI intelligence systems. Violation of this policy may lead to immediate suspension or termination of your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">2. Prohibited Conduct</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Deploy unauthorized scrapers, spiders, or automated bots to harvest content or reverse-engineer API schemas.</li>
              <li>Perform denial-of-service (DoS/DDoS) attacks, port scanning, or malicious vulnerability testing outside of our authorized bug bounty program.</li>
              <li>Abuse AI task decomposition endpoints through bulk script generation or rate-limit evasion techniques.</li>
              <li>Store or distribute malware, trojans, ransomware, or illicit cryptographic material.</li>
              <li>Impersonate any person, brand, or entity, or falsely claim affiliation with Pace.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">3. API Rate Limits &amp; Infrastructure Fair Use</h2>
            <p>
              Pace enforces adaptive token bucket rate limiting on all public API endpoints. Users who intentionally bypass headers or employ distributed proxy rotations to overload services will face immediate IP and account bans.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">4. Reporting Violations</h2>
            <p>
              If you detect abuse or unauthorized activities originating from a Pace user or integration, submit a report to <code className="text-greptile-green">abuse@pace.app</code>.
            </p>
          </section>
        </div>
      </div>
    </MarketingLayout>
  );
}
