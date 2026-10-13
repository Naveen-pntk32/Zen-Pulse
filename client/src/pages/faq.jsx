import { useState } from "react";
import { Link } from "wouter";
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare, ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

const FAQ_SECTIONS = [
  {
    category: "01. Getting Started & Focus Console",
    items: [
      {
        q: "What makes Pace different from conventional task managers?",
        a: "Conventional task managers treat tasks like infinite spreadsheets, resulting in cognitive overwhelm. Pace is built around the Pomodoro rhythm engine, ambient sound synthesizers, and AI task decomposition. It helps you focus on executing one task at a time rather than endlessly rearranging backlog lists.",
      },
      {
        q: "Can I use Pace completely offline?",
        a: "Yes! In Local Mode, Pace operates entirely within your browser using indexed local storage. You can run timers, complete tasks, track habits, and log focus sessions without an active internet connection. When you connect, your progress seamlessly persists.",
      },
      {
        q: "Does Pace have soundscapes or audio generators?",
        a: "Yes. Pace includes an integrated audio synthesis engine capable of generating Brownian noise, binaural beats, pink noise, and focus rain in real time without buffering external audio streams.",
      },
    ],
  },
  {
    category: "02. Synchronization & Data Privacy",
    items: [
      {
        q: "Where is my data stored?",
        a: "When signed in with Supabase Authentication, your encrypted data is stored in enterprise-grade PostgreSQL with Row-Level Security (RLS) policies. Only your authenticated user ID has cryptographic clearance to read or write your tasks.",
      },
      {
        q: "Do you sell my productivity telemetry or habit data?",
        a: "Never. Pace has zero advertising trackers and does not sell, broker, or monetize user data. Our business model is strictly subscription-based SaaS.",
      },
      {
        q: "Can I export my data if I decide to leave?",
        a: "Yes. In compliance with GDPR Right to Data Portability, you can export your entire task history, completed focus sessions, and habit streaks as JSON or CSV from your settings dashboard at any time.",
      },
    ],
  },
  {
    category: "03. AI Deep-Work Intelligence",
    items: [
      {
        q: "How does the AI task decomposition work?",
        a: "When you have a daunting or ambiguous task (e.g., 'Refactor authentication system'), Pace AI analyzes the project scope and splits it into 3 to 6 atomic, 15-minute executable subtasks with estimated cognitive load scores and clear definitions of done.",
      },
      {
        q: "Does the AI train on my proprietary tasks or company data?",
        a: "No. Our enterprise AI gateways (Gemini Pro and OpenAI) operate under zero-retention API contracts. Your task titles and descriptions are processed ephemerally and never used for foundation model training.",
      },
    ],
  },
  {
    category: "04. Billing, Invoices & Cancellation",
    items: [
      {
        q: "How does the 14-day refund guarantee work?",
        a: "If you upgrade to Pace Pro or Team and find that it doesn't dramatically improve your daily output, contact us at legal@pace.app or billing@pace.app within 14 days of purchase. We issue a prompt, 100% refund with no questions asked.",
      },
      {
        q: "How do I cancel my subscription?",
        a: "You can cancel with two clicks directly in Settings > Billing. Your account will remain on the Pro tier until the end of the paid period, after which it smoothly reverts to the Free local tier. We never punish you or lock your data.",
      },
      {
        q: "Can I get a VAT/GST invoice with my company's tax ID?",
        a: "Yes. Our checkout system automatically generates compliant tax invoices with your business name, address, and VAT/GST registration numbers.",
      },
    ],
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState({});

  const toggle = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filtered = FAQ_SECTIONS.map((sec) => ({
    ...sec,
    items: sec.items.filter(
      (it) =>
        it.q.toLowerCase().includes(search.toLowerCase()) ||
        it.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((sec) => sec.items.length > 0);

  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16 font-sans">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] border border-greptile-green/30 bg-greptile-green/10 text-greptile-green font-mono text-xs uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>// KNOWLEDGE BASE &amp; FAQ</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about the Pace cockpit, privacy models, synchronization, and billing.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-4 relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions (e.g. refund, offline, AI)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-[6px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-10">
          {filtered.map((sec, catIdx) => (
            <div key={sec.category} className="space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-widest text-greptile-green font-semibold">
                {sec.category}
              </h2>
              <div className="space-y-2">
                {sec.items.map((item, itemIdx) => {
                  const isOpen = !!openItems[`${catIdx}-${itemIdx}`];
                  return (
                    <div
                      key={item.q}
                      className="rounded-[6px] border border-border bg-surface transition-colors overflow-hidden"
                    >
                      <button
                        onClick={() => toggle(catIdx, itemIdx)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-surface-hover/50 transition-colors"
                      >
                        <span className="text-sm font-semibold text-foreground">
                          {item.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-greptile-green shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/40 font-sans">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-xs font-mono text-muted-foreground space-y-2">
              <p>// ZERO QUESTIONS MATCHING SEARCH CRITERIA</p>
              <button
                onClick={() => setSearch("")}
                className="text-greptile-green underline"
              >
                Clear search filter
              </button>
            </div>
          )}
        </div>

        {/* Helpdesk banner */}
        <div className="p-6 rounded-[8px] border border-border bg-surface-raised flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-display font-bold text-foreground">
              Still have questions?
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Our engineering team is always on standby to assist you.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider shrink-0 transition-all"
          >
            Contact Support <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
