import { Link } from "wouter";
import { Eye, CheckCircle2, ArrowLeft, Mail } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export default function AccessibilityPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans space-y-10">
        <div className="space-y-2 pb-6 border-b border-border/40">
          <div className="flex items-center gap-2 text-xs font-mono text-greptile-green uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5" />
            <span>// INCLUSIVE DESIGN &amp; ACCESSIBILITY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
            Accessibility Statement
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Conforming to W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">Our Accessibility Commitment</h2>
            <p>
              Pace is dedicated to ensuring digital accessibility for all builders, regardless of ability or assistive device. We continually refine our user interface and user experience to apply relevant accessibility standards and eliminate barriers for screen readers, keyboard-only navigation, and low-vision conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">Conformance Standards</h2>
            <p>
              Our design system and frontend engineering target compliance with <strong>WCAG 2.1 Level AA</strong> requirements. Key technical implementations include:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>High Contrast Ratios:</strong> Greptile green (#28e99f) and foreground typography achieve strict contrast thresholds (&gt; 4.5:1) against our deep background (#0b0a10).</li>
              <li><strong>Full Keyboard Operability:</strong> Every action—from starting Pomodoro intervals (Space/R) to creating and completing tasks—is navigable and actionable via standard keyboard navigation without keyboard traps.</li>
              <li><strong>Semantic HTML &amp; ARIA Landmarks:</strong> Screen readers benefit from semantic HTML5 elements (<code className="text-greptile-green">&lt;main&gt;</code>, <code className="text-greptile-green">&lt;nav&gt;</code>, <code className="text-greptile-green">&lt;aside&gt;</code>), explicit ARIA roles, and accessible names for all icon buttons.</li>
              <li><strong>Focus Rings:</strong> Explicit <code className="text-greptile-green">:focus-visible</code> indicators ensure active elements are clearly visible during tab navigation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">Feedback and Contact</h2>
            <p>
              If you experience any accessibility hurdles or require assistive documentation adjustments, please reach out directly to our accessibility coordinator at <code className="text-greptile-green">accessibility@pace.app</code>. We treat accessibility bug reports with critical priority.
            </p>
          </section>
        </div>
      </div>
    </MarketingLayout>
  );
}
