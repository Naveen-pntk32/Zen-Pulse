import { Link } from "wouter";
import { FileText, ArrowLeft, Shield } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export default function DPAPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans space-y-10">
        <div className="space-y-2 pb-6 border-b border-border/40">
          <div className="flex items-center gap-2 text-xs font-mono text-greptile-green uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>// B2B COMPLIANCE CONTRACT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
            Data Processing Agreement (DPA)
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Governing Customer Personal Data Processing under EU GDPR Article 28 &amp; UK Data Protection Act
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">1. Introduction &amp; Roles</h2>
            <p>
              This Data Processing Agreement (&quot;DPA&quot;) supplements the Pace Terms of Service. It applies to enterprise and team customers (&quot;Customer&quot;, acting as Data Controller) whose utilization of Pace (&quot;Processor&quot;) involves the processing of Personal Data subject to applicable European and international Data Protection Laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">2. Scope of Processing</h2>
            <p>
              Pace processes personal data solely to provide, support, and secure the productivity SaaS application in accordance with documented Controller instructions. Data processed includes user account identities (email, display name), task metadata, project titles, focus telemetry, and habit completion records.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">3. Technical and Organizational Measures (TOMs)</h2>
            <p>Pace maintains rigorous safeguards:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>End-to-end transport layer security (TLS 1.3) and AES-256 database column/volume encryption.</li>
              <li>Role-based access controls (RBAC) restricting employee production access with mandatory hardware 2FA.</li>
              <li>Continuous vulnerability scanning and annual external penetration testing.</li>
              <li>Automated multi-region failover and immutable audit trail logging.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">4. Sub-processors</h2>
            <p>
              Customer grants general written authorization for Pace to engage trusted sub-processors:
            </p>
            <div className="p-4 rounded-[6px] border border-border bg-surface text-xs font-mono space-y-2">
              <div>• <strong>Supabase Inc.</strong> — Managed PostgreSQL Database &amp; Authentication (US / EU Data Centers)</div>
              <div>• <strong>Vercel Inc.</strong> — Global Edge Compute &amp; Static Asset Hosting</div>
              <div>• <strong>Stripe Inc.</strong> — PCI-DSS Level 1 Payment Gateway &amp; Invoicing</div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">5. Data Subject Rights &amp; Deletion</h2>
            <p>
              Upon termination of your Pace subscription, you may request permanent deletion of all tenant data. We delete or anonymize all associated customer data within 30 days of confirmed workspace termination, unless retention is mandated by law.
            </p>
          </section>
        </div>
      </div>
    </MarketingLayout>
  );
}
