import { Link } from "wouter";
import { Zap, ArrowLeft, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen w-full bg-background bg-grid-pattern text-foreground flex flex-col antialiased selection:bg-greptile-green selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to ZenPulse
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[4px] bg-greptile-green flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-black fill-black" />
            </div>
            <span className="font-display font-bold text-sm">ZenPulse</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 sm:py-16">
        <div className="space-y-2 mb-10 pb-6 border-b border-border/40">
          <div className="flex items-center gap-2 text-xs font-mono text-greptile-green uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>// PRIVACY ARCHITECTURE &amp; DATA PROTECTION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: October 13, 2026 • Last Revised: October 2026
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm text-muted-foreground font-sans leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">1. Privacy Philosophy</h2>
            <p>
              At ZenPulse, your productivity records are private by default. We do not sell your personal information, run tracking advertising networks, or monetize your daily habits. Our business model relies on delivering pure developer leverage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">2. Information We Collect</h2>
            <p>When you use ZenPulse, we may collect the following categories of data:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Account Credentials:</strong> Email address and authentication tokens processed securely via Supabase Auth.</li>
              <li><strong>Productivity Logs:</strong> Tasks, lists, subtasks, habits, habit completions, focus timer intervals, and stopwatch duration records.</li>
              <li><strong>Client Settings:</strong> Focus session lengths, theme preferences, and sound effect toggles.</li>
              <li><strong>Technical Metadata:</strong> IP address and basic browser user-agent strictly for security rate limiting and error prevention.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">3. How We Store and Protect Your Data</h2>
            <p>
              All cloud data is hosted on encrypted PostgreSQL instances managed via Supabase. We enforce PostgreSQL Row-Level Security (RLS) policies at the database layer—meaning that even in the event of an application logic bug, records can only ever be queried by the authenticated user ID that created them.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">4. AI Features &amp; LLM Data Processing</h2>
            <p>
              When invoking AI Task Decomposition or Daily Focus Briefings, only the relevant task title and status are submitted to Google Gemini endpoints via SSL encryption. We do not use your task entries or private notes to train third-party foundation models.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">5. Local-First Storage &amp; Offline Cache</h2>
            <p>
              ZenPulse utilizes browser localStorage and indexed storage to deliver zero-latency responsiveness. Offline data remains strictly on your client device until you re-authenticate and sync with the PostgreSQL cloud backend.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">6. Your Rights (GDPR &amp; CCPA Compliance)</h2>
            <p>You have full autonomy over your records. You can:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Export your data:</strong> Download a full JSON dump of your tasks, habits, and sessions directly from the Settings and Profile tabs.</li>
              <li><strong>Delete your data:</strong> Permanently purge your profile and associated database records at any time.</li>
              <li><strong>Opt out of cloud synchronization:</strong> Use ZenPulse in local-only mode without creating an account.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">7. Contact Data Protection Officer</h2>
            <p>
              If you have any questions or data deletion requests, contact our security team at: <span className="font-mono text-greptile-green">privacy@zenpulse.app</span>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4 text-center text-xs font-mono text-muted-foreground">
        © {new Date().getFullYear()} ZenPulse. All rights reserved.
      </footer>
    </div>
  );
}
