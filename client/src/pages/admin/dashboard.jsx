import { Activity, Users, Server, Database, TrendingUp, AlertTriangle } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

export default function AdminDashboardPage() {
  const telemetry = [
    { label: "Active Builders (DAU)", value: "1,420", change: "+14.2%", icon: Users },
    { label: "Focus Hours Logged", value: "8,940 hrs", change: "+22.5%", icon: Activity },
    { label: "Server Response Latency", value: "3.8 ms", change: "Optimal", icon: Server },
    { label: "PostgreSQL Database Cache Hit", value: "99.4%", change: "Healthy", icon: Database },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 font-sans">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
            // TELEMETRY CLUSTER 01
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mt-1">
            Platform Operations &amp; Performance
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time telemetry streams from edge gateways, Supabase PostgreSQL, and AI inference nodes.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {telemetry.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.label}
                className="p-5 rounded-[6px] border border-border bg-surface space-y-2"
              >
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-mono uppercase">{t.label}</span>
                  <Icon className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-display font-bold text-foreground">
                  {t.value}
                </div>
                <div className="text-[11px] font-mono text-greptile-green">
                  {t.change}
                </div>
              </div>
            );
          })}
        </div>

        {/* System Node Telemetry Table */}
        <div className="rounded-[8px] border border-border bg-surface p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <h3 className="text-sm font-semibold text-foreground">
              Microservice Health &amp; Gateway Latency
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-greptile-green/15 text-greptile-green">
              ALL SERVICES NOMINAL
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground uppercase">
                  <th className="py-2.5 px-3">Service Node</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Latency</th>
                  <th className="py-2.5 px-3">Error Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <tr className="hover:bg-surface-hover/50">
                  <td className="py-3 px-3 text-foreground font-semibold">PostgreSQL (Supabase EU)</td>
                  <td className="py-3 px-3 text-greptile-green">ONLINE</td>
                  <td className="py-3 px-3 text-muted-foreground">4ms</td>
                  <td className="py-3 px-3 text-muted-foreground">0.00%</td>
                </tr>
                <tr className="hover:bg-surface-hover/50">
                  <td className="py-3 px-3 text-foreground font-semibold">Gemini AI Inference Proxy</td>
                  <td className="py-3 px-3 text-greptile-green">ONLINE</td>
                  <td className="py-3 px-3 text-muted-foreground">240ms</td>
                  <td className="py-3 px-3 text-muted-foreground">0.02%</td>
                </tr>
                <tr className="hover:bg-surface-hover/50">
                  <td className="py-3 px-3 text-foreground font-semibold">Vercel Global Edge CDN</td>
                  <td className="py-3 px-3 text-greptile-green">ONLINE</td>
                  <td className="py-3 px-3 text-muted-foreground">12ms</td>
                  <td className="py-3 px-3 text-muted-foreground">0.00%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
