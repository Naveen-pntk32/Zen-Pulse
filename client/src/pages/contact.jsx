import { useState } from "react";
import { Mail, Send, CheckCircle2, MessageSquare, Clock, ShieldCheck, MapPin } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "sales",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <MarketingLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16 font-sans">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] border border-greptile-green/30 bg-greptile-green/10 text-greptile-green font-mono text-xs uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>// INBOUND COMMUNICATIONS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground tracking-tight">
            Connect with the Pace team.
          </h1>
          <p className="text-base text-muted-foreground">
            Whether you&apos;re exploring custom enterprise workspaces, reporting a security finding, or needing technical assistance, our engineers respond directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-[8px] border border-border bg-surface p-6 space-y-6">
              <h3 className="text-lg font-display font-bold text-foreground">
                Direct Channels
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-greptile-green shrink-0 mt-0.5" />
                  <div>
                    <p className="text-muted-foreground uppercase text-[10px]">Enterprise &amp; Sales</p>
                    <p className="text-foreground font-semibold mt-0.5">sales@pace.app</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-greptile-green shrink-0 mt-0.5" />
                  <div>
                    <p className="text-muted-foreground uppercase text-[10px]">Security Inquiries</p>
                    <p className="text-foreground font-semibold mt-0.5">security@pace.app</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-greptile-green shrink-0 mt-0.5" />
                  <div>
                    <p className="text-muted-foreground uppercase text-[10px]">Response SLA</p>
                    <p className="text-foreground font-semibold mt-0.5">&lt; 4 Hours (Business Days)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-greptile-green shrink-0 mt-0.5" />
                  <div>
                    <p className="text-muted-foreground uppercase text-[10px]">Headquarters</p>
                    <p className="text-foreground font-semibold mt-0.5">San Francisco, CA &amp; Distributed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-[8px] border border-border/80 bg-surface-raised text-xs text-muted-foreground space-y-2">
              <p className="font-mono text-foreground font-semibold">
                // ENTERPRISE GUARANTEE
              </p>
              <p className="leading-relaxed">
                Organizations with 25+ seats qualify for custom Single Sign-On (Okta / Google Workspace), localized data tenancy, and dedicated implementation engineers.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-[10px] border border-border bg-surface-raised p-6 sm:p-8 shadow-xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
                  <div className="w-12 h-12 rounded-full bg-greptile-green/20 text-greptile-green flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground">
                    Message Transmitted
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Thank you, {form.name}. Your inquiry has been routed to our systems. An engineer will follow up at {form.email} within 4 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", topic: "sales", message: "" });
                    }}
                    className="px-4 py-2 rounded-[4px] border border-border text-xs font-mono text-muted-foreground hover:text-foreground"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-xl font-display font-bold text-foreground">
                      Transmit Inquiry
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      All fields required for accurate routing.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-muted-foreground">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Alex Rivera"
                        className="w-full px-3 py-2.5 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-muted-foreground">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full px-3 py-2.5 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-muted-foreground">
                      Inquiry Category
                    </label>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
                    >
                      <option value="sales">Enterprise Team Licensing &amp; Workspaces</option>
                      <option value="support">Technical Support &amp; Integration</option>
                      <option value="security">Security &amp; Vulnerability Disclosure</option>
                      <option value="partnership">Partnership &amp; API Integration</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-muted-foreground">
                      Message / Project Scope
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Detail your requirements, team size, or technical inquiry..."
                      className="w-full px-3 py-2.5 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(40,233,159,0.3)] disabled:opacity-50"
                  >
                    {loading ? "Transmitting..." : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Transmit Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
