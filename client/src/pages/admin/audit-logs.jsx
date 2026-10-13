import { useState } from "react";
import { FileText, Shield, Download, Search } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const AUDIT_LOGS = [
  { id: "log_01", actor: "alex@company.com", action: "UPDATE_RBAC_POLICY", resource: "Role: Team Lead", ip: "198.51.100.4", time: "2026-10-13 22:10:04 UTC" },
  { id: "log_02", actor: "system.edge_proxy", action: "TOKEN_ROTATION_SUCCESS", resource: "Auth Gateway", ip: "10.0.4.12", time: "2026-10-13 22:00:00 UTC" },
  { id: "log_03", actor: "alex@company.com", action: "USER_STATUS_CHANGE", resource: "elena@startup.ai -> Suspended", ip: "198.51.100.4", time: "2026-10-13 21:30:19 UTC" },
  { id: "log_04", actor: "stripe_webhook", action: "INVOICE_PAYMENT_SETTLED", resource: "Invoice #INV-PACE-882194", ip: "54.187.174.169", time: "2026-10-13 20:15:44 UTC" },
];

export default function AdminAuditLogsPage() {
  const [logs] = useState(AUDIT_LOGS);

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
              // IMMUTABLE COMPLIANCE TRAIL
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mt-1">
              Security &amp; Administrative Audit Logs
            </h1>
          </div>

          <button
            onClick={() => alert("Exporting cryptographic audit log bundle...")}
            className="px-3 py-1.5 rounded-[4px] border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Signed Log
          </button>
        </div>

        <div className="rounded-[8px] border border-border bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border/60 bg-surface-raised text-muted-foreground uppercase">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-surface-hover/50">
                    <td className="py-3 px-4 text-muted-foreground">{l.time}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">{l.actor}</td>
                    <td className="py-3 px-4 text-amber-300 font-bold">{l.action}</td>
                    <td className="py-3 px-4 text-muted-foreground">{l.resource}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{l.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
