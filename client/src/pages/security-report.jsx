import { Link } from "wouter";
import { Bug, ShieldCheck, Mail, KeyRound, AlertTriangle } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export default function SecurityReportPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans space-y-10">
        <div className="space-y-2 pb-6 border-b border-border/40">
          <div className="flex items-center gap-2 text-xs font-mono text-greptile-green uppercase tracking-wider">
            <Bug className="w-3.5 h-3.5" />
            <span>// ETHICAL DISCLOSURE &amp; BUG BOUNTY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
            Responsible Vulnerability Disclosure
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Coordinated Disclosure Policy • Safe Harbor for Ethical Researchers
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm text-muted-foreground leading-relaxed">
          <div className="p-6 rounded-[8px] border border-greptile-green/30 bg-surface-raised space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-greptile-green" /> Safe Harbor Commitment
            </h3>
            <p className="text-xs">
              Pace promises not to pursue legal action against ethical security researchers who discover and report vulnerabilities in good faith in accordance with the ground rules below.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">1. Ground Rules for Testing</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Do not compromise the privacy of real user accounts or exfiltrate private task data.</li>
              <li>Do not degrade platform availability (strictly avoid volumetric DoS/DDoS tests).</li>
              <li>Give our engineering team reasonable time (at least 30 calendar days) to resolve vulnerabilities before public disclosure.</li>
              <li>Only test against non-production test accounts you have registered yourself.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">2. In-Scope Targets</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Web Application: <code className="text-greptile-green">*.pace.app</code> and associated REST API endpoints (<code className="text-greptile-green">/api/*</code>).</li>
              <li>Authentication &amp; Session Handlers (JWT validation, token replay, privilege escalation).</li>
              <li>Cross-Tenant Row-Level Security bypasses.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">3. How to Submit a Finding</h2>
            <p>
              Send an encrypted email report to <code className="text-greptile-green">security@pace.app</code> containing:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Vulnerability type (e.g. Broken Object Level Authorization, IDOR, SSRF).</li>
              <li>Step-by-step reproduction instructions or curl command snippets.</li>
              <li>Proof-of-concept payload demonstrating risk impact.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">4. Response Timelines</h2>
            <p>
              Our internal security response team adheres to strict SLAs:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono pt-2">
              <div className="p-4 rounded-[6px] border border-border bg-surface">
                <p className="text-muted-foreground uppercase text-[10px]">Triage Response</p>
                <p className="text-foreground font-bold mt-1">&lt; 24 Hours</p>
              </div>
              <div className="p-4 rounded-[6px] border border-border bg-surface">
                <p className="text-muted-foreground uppercase text-[10px]">Severity Assessment</p>
                <p className="text-foreground font-bold mt-1">&lt; 48 Hours</p>
              </div>
              <div className="p-4 rounded-[6px] border border-border bg-surface">
                <p className="text-muted-foreground uppercase text-[10px]">Patch Deployment</p>
                <p className="text-foreground font-bold mt-1">&lt; 7 Calendar Days</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MarketingLayout>
  );
}
