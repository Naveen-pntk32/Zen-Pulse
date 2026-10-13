import { Link } from "wouter";
import { Zap, ArrowRight, Shield, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function MarketingLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full bg-background bg-grid-pattern text-foreground flex flex-col antialiased selection:bg-greptile-green selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-border/50 bg-background/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-[4px] bg-greptile-green flex items-center justify-center shadow-[0_0_12px_rgba(40,233,159,0.3)] group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-black fill-black" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base tracking-tight text-foreground">
                pace.
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase bg-greptile-green/15 text-greptile-green px-1.5 py-0.5 rounded-[2px] leading-none">
                v2.0
              </span>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono text-muted-foreground">
            <Link href="/features" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/changelog" className="hover:text-foreground transition-colors">
              Changelog
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/faq" className="hover:text-foreground transition-colors">
              FAQ
            </Link>
            <Link href="/help" className="hover:text-foreground transition-colors">
              Docs
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/pomodoro"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(40,233,159,0.25)]"
              >
                Launch Console <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(40,233,159,0.25)]"
                >
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Master Marketing & Compliance Footer */}
      <footer className="mt-auto border-t border-border/50 bg-surface/40 py-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[4px] bg-greptile-green flex items-center justify-center">
                <Zap className="w-4 h-4 text-black fill-black" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-foreground">
                pace.
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Make room for focused work. High-velocity engineering cockpit combining cognitive Pomodoro rhythms, AI task decomposition, and local-first cloud state.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs font-mono text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-greptile-green" />
              <span>Status: Systems Operational</span>
              <span>•</span>
              <span>SOC-2 Ready</span>
            </div>
          </div>

          {/* Product Suite */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Product
            </h4>
            <ul className="space-y-2 text-xs font-mono text-muted-foreground">
              <li><Link href="/pomodoro" className="hover:text-foreground">Pomodoro Timer</Link></li>
              <li><Link href="/tasks" className="hover:text-foreground">Task Management</Link></li>
              <li><Link href="/habits" className="hover:text-foreground">Habit Tracking</Link></li>
              <li><Link href="/features" className="hover:text-foreground">Feature Matrix</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground">Pricing &amp; Plans</Link></li>
              <li><Link href="/changelog" className="hover:text-foreground">Changelog &amp; Releases</Link></li>
            </ul>
          </div>

          {/* Legal & Compliance Suite (15 Essentials) */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Legal &amp; Trust
            </h4>
            <ul className="space-y-2 text-xs font-mono text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-foreground">Cookie Policy</Link></li>
              <li><Link href="/cookie-settings" className="hover:text-foreground text-greptile-green">Cookie Preferences</Link></li>
              <li><Link href="/refund-policy" className="hover:text-foreground">Refund Policy</Link></li>
              <li><Link href="/cancellation-policy" className="hover:text-foreground">Cancellation Terms</Link></li>
              <li><Link href="/acceptable-use" className="hover:text-foreground">Acceptable Use</Link></li>
              <li><Link href="/security" className="hover:text-foreground">Security Practices</Link></li>
              <li><Link href="/security/report" className="hover:text-foreground">Vulnerability Report</Link></li>
              <li><Link href="/accessibility" className="hover:text-foreground">Accessibility (WCAG)</Link></li>
              <li><Link href="/dpa" className="hover:text-foreground">Data Processing (DPA)</Link></li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
              Resources
            </h4>
            <ul className="space-y-2 text-xs font-mono text-muted-foreground">
              <li><Link href="/help" className="hover:text-foreground">Documentation</Link></li>
              <li><Link href="/support" className="hover:text-foreground">Customer Support</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Sales &amp; Enterprise</Link></li>
              <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
              <li><Link href="/about" className="hover:text-foreground">About the Team</Link></li>
              <li>
                <a
                  href="https://github.com/Naveen-pntk32/Zen-Pulse"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground inline-flex items-center gap-1"
                >
                  GitHub Repository <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div>© {new Date().getFullYear()} Pace Inc. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>Built with local-first precision.</span>
            <span>Made room for focused work.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default MarketingLayout;
