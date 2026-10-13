import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Users, CheckCircle2, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function AcceptInvitePage() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const handleAccept = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLocation("/pomodoro");
    }, 800);
  };

  return (
    <AuthLayout
      title="Team Invitation"
      subtitle="You've been invited to collaborate on Pace."
      backTo="/"
    >
      <div className="space-y-6 text-center font-sans">
        <div className="w-14 h-14 rounded-full bg-greptile-green/20 text-greptile-green flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(40,233,159,0.2)]">
          <Users className="w-7 h-7" />
        </div>

        <div className="p-4 rounded-[6px] border border-border bg-surface text-left space-y-2">
          <div className="text-[10px] font-mono uppercase text-greptile-green">
            // WORKSPACE INVITATION
          </div>
          <div className="text-sm font-semibold text-foreground">
            Acme Engineering Squad
          </div>
          <p className="text-xs text-muted-foreground">
            Invited by: <span className="text-foreground font-mono">sarah.chen@acme.corp</span> (Team Lead)
          </p>
          <p className="text-xs text-muted-foreground">
            Role: <span className="text-greptile-green font-mono">Core Contributor</span>
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAccept}
            disabled={loading}
            className="w-full py-3 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(40,233,159,0.3)] disabled:opacity-50"
          >
            {loading ? "Joining Workspace..." : (
              <>
                Accept &amp; Join Workspace <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <Link
            href="/pomodoro"
            className="inline-block text-xs font-mono text-muted-foreground hover:text-foreground"
          >
            Decline Invitation
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
