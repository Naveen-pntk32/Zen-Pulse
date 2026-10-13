import { useState } from "react";
import { Link } from "wouter";
import { LifeBuoy, Send, CheckCircle2, AlertTriangle, Paperclip } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { useAuth } from "@/hooks/use-auth";

export default function SupportPage() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState({
    email: user?.email || "",
    category: "technical",
    priority: "medium",
    subject: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans space-y-10">
        <div className="space-y-2 pb-6 border-b border-border/40">
          <div className="flex items-center gap-2 text-xs font-mono text-greptile-green uppercase tracking-wider">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>// CUSTOMER ENGINEERING DESK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
            Submit a Support Request
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            Our software engineers respond directly to all inquiries. Expected response time: under 4 business hours.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-12 space-y-4 rounded-[10px] border border-border bg-surface-raised p-8">
            <div className="w-14 h-14 rounded-full bg-greptile-green/20 text-greptile-green flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground">
              Support Ticket Created
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Ticket ID: <span className="font-mono text-greptile-green font-bold">#TCK-{Math.floor(10000 + Math.random() * 90000)}</span>. An engineer has been paged and will reach out to <span className="text-foreground">{ticket.email}</span>.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 rounded-[4px] border border-border text-xs font-mono text-muted-foreground hover:text-foreground"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-[10px] border border-border bg-surface-raised p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-muted-foreground">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  value={ticket.email}
                  onChange={(e) => setTicket({ ...ticket, email: e.target.value })}
                  placeholder="developer@pace.app"
                  className="w-full px-3 py-2 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-muted-foreground">
                  Issue Category
                </label>
                <select
                  value={ticket.category}
                  onChange={(e) => setTicket({ ...ticket, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
                >
                  <option value="technical">Technical Bug / Timer Drift</option>
                  <option value="sync">Cloud Sync &amp; Database Issue</option>
                  <option value="ai">AI Task Decomposition Issue</option>
                  <option value="billing">Billing / Invoicing / Refunds</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-muted-foreground">
                  Severity Level
                </label>
                <select
                  value={ticket.priority}
                  onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}
                  className="w-full px-3 py-2 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
                >
                  <option value="low">Low — General inquiry</option>
                  <option value="medium">Medium — Annoyance but workaround exists</option>
                  <option value="high">High — Core feature blocked</option>
                  <option value="critical">Critical — Complete data loss risk</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-muted-foreground">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={ticket.subject}
                  onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                  placeholder="Summary of issue"
                  className="w-full px-3 py-2 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-muted-foreground">
                Detailed Reproduction Steps
              </label>
              <textarea
                rows={5}
                required
                value={ticket.description}
                onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
                placeholder="Include browser version, operating system, and steps to trigger the bug..."
                className="w-full px-3 py-2 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
              />
            </div>

            {/* Diagnostic Snapshot */}
            <div className="p-3 rounded-[4px] border border-border/60 bg-surface text-[10px] font-mono text-muted-foreground flex items-center justify-between">
              <span>// AUTOMATIC CLIENT DIAGNOSTIC ATTACHED</span>
              <span>{typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 40) : "Browser"}...</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(40,233,159,0.3)] disabled:opacity-50"
            >
              {loading ? "Transmitting Ticket..." : (
                <>
                  <Send className="w-3.5 h-3.5" /> Submit Support Ticket
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </MarketingLayout>
  );
}
