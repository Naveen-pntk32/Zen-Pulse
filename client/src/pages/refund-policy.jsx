import { Link } from "wouter";
import { DollarSign, Shield, ArrowLeft, Mail } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export default function RefundPolicyPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans">
        <div className="space-y-2 mb-10 pb-6 border-b border-border/40">
          <div className="flex items-center gap-2 text-xs font-mono text-greptile-green uppercase tracking-wider">
            <DollarSign className="w-3.5 h-3.5" />
            <span>// COMMERCE &amp; BILLING ASSURANCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
            Refund &amp; Guarantee Policy
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: October 13, 2026 • 14-Day Unconditional Money-Back Guarantee
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm text-muted-foreground leading-relaxed">
          <div className="p-6 rounded-[8px] border border-greptile-green/30 bg-surface-raised space-y-3">
            <h2 className="text-base font-display font-bold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-greptile-green" />
              Our 14-Day Satisfaction Guarantee
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              We stand behind Pace. If you purchase an individual <strong>Pace Pro</strong> subscription and find that it does not demonstrably improve your cognitive focus, we will issue a complete 100% refund within 14 calendar days of your initial transaction.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">1. Eligibility Criteria</h2>
            <p>
              Refunds apply to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>First-time purchases of monthly or annual <strong>Pace Pro</strong> plans requested within 14 days of transaction timestamp.</li>
              <li>Accidental renewal charges reported within 72 hours of renewal date, provided the service was not actively utilized during that billing cycle.</li>
              <li>Documented technical unavailability or prolonged service outages exceeding our 99.9% uptime SLA.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">2. Non-Refundable Items</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Team workspace plans with 10+ active member seats that have been actively utilized for more than 14 days.</li>
              <li>Custom enterprise engineering services and tailored Single Sign-On (SSO) implementation fees.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">3. How to Request a Refund</h2>
            <p>
              To claim a refund, email our billing team at <code className="text-greptile-green">billing@pace.app</code> with your account email address and transaction invoice ID. Our team processes all requests within 1 business day. Funds are returned to your original payment method via Stripe within 5 to 10 banking days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">4. Chargebacks and Payment Disputes</h2>
            <p>
              We encourage customers to contact us directly before opening a bank dispute. Bank chargebacks add unnecessary processing delays, whereas direct refunds are issued instantaneously by our support engineers.
            </p>
          </section>
        </div>
      </div>
    </MarketingLayout>
  );
}
