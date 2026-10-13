import { Link } from "wouter";
import { Shield, Lock, Server, Database, CheckCircle2, FileCode, ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export default function SecurityPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans space-y-12">
        <div className="space-y-2 pb-6 border-b border-border/40">
          <div className="flex items-center gap-2 text-xs font-mono text-greptile-green uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>// ENTERPRISE DEFENSE IN DEPTH</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
            Security Architecture &amp; Practices
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Last Verified: October 2026 • Cryptographic Rigor &amp; Tenant Isolation
          </p>
        </div>

        {/* Security Overview Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-[8px] border border-border bg-surface space-y-3">
            <Shield className="w-6 h-6 text-greptile-green" />
            <h3 className="text-base font-display font-bold text-foreground">
              Encryption at Rest &amp; Transit
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All communications are encrypted using modern TLS 1.3 with HSTS enforcement. Data at rest in PostgreSQL is safeguarded with AES-256 block encryption.
            </p>
          </div>

          <div className="p-6 rounded-[8px] border border-border bg-surface space-y-3">
            <Database className="w-6 h-6 text-greptile-green" />
            <h3 className="text-base font-display font-bold text-foreground">
              Row-Level Security (RLS)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every table query enforces PostgreSQL RLS policies at the database kernel level. Users can never access or leak neighboring tenant records, even if application logic is bypassed.
            </p>
          </div>

          <div className="p-6 rounded-[8px] border border-border bg-surface space-y-3">
            <Server className="w-6 h-6 text-greptile-green" />
            <h3 className="text-base font-display font-bold text-foreground">
              Infrastructure &amp; Hosting
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hosted across ISO 27001, SOC 2 Type II, and PCI DSS certified data centers (Supabase / AWS / Vercel Edge Network) with automated multi-zone failovers.
            </p>
          </div>

          <div className="p-6 rounded-[8px] border border-border bg-surface space-y-3">
            <FileCode className="w-6 h-6 text-greptile-green" />
            <h3 className="text-base font-display font-bold text-foreground">
              Dual Zod Schema Validation
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All user payloads undergo rigorous runtime schema parsing both in the React client and on the Express server before reaching database handlers.
            </p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">Authentication &amp; Session Lifecycle</h2>
            <p>
              Pace implements token-based authentication via Supabase JWTs with short-lived access lifecycles and cryptographic signature verification. Passwords are never stored in plaintext and are hashed using bcrypt/Argon2 with high work factors.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">Continuous Automated Backups</h2>
            <p>
              Databases receive continuous Point-in-Time Recovery (PITR) write-ahead log backups with 7-day retention windows and daily off-site encrypted snapshots.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">Vulnerability Disclosure</h2>
            <p>
              We welcome collaboration with ethical security researchers. Please review our{" "}
              <Link href="/security/report" className="text-greptile-green hover:underline">
                Responsible Vulnerability Disclosure Program
              </Link>{" "}
              or contact <code className="text-greptile-green">security@pace.app</code>.
            </p>
          </section>
        </div>
      </div>
    </MarketingLayout>
  );
}
