import { useState } from "react";
import { KeyRound, Shield, Check, X } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const PERMISSION_MATRIX = [
  { action: "Read / Write Personal Tasks", public: false, free: true, pro: true, admin: true },
  { action: "Run Local Pomodoro Timer", public: true, free: true, pro: true, admin: true },
  { action: "Supabase Cloud Database Sync", public: false, free: false, pro: true, admin: true },
  { action: "Trigger AI Task Decomposition", public: false, free: false, pro: true, admin: true },
  { action: "Manage Team Workspaces & Seats", public: false, free: false, pro: false, admin: true },
  { action: "Inspect User Accounts & Impersonate", public: false, free: false, pro: false, admin: true },
  { action: "Export System Audit Logs", public: false, free: false, pro: false, admin: true },
];

export default function AdminRolesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        <div className="pb-4 border-b border-border/50">
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
            // AUTHORIZATION POLICIES
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mt-1">
            Role-Based Access Control (RBAC) Matrix
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cryptographic capability mappings enforced by server middleware and PostgreSQL RLS.
          </p>
        </div>

        <div className="rounded-[8px] border border-border bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border/60 bg-surface-raised text-muted-foreground uppercase">
                  <th className="py-3 px-4">Action / Scope</th>
                  <th className="py-3 px-4">Public</th>
                  <th className="py-3 px-4">Free User</th>
                  <th className="py-3 px-4">Pro User</th>
                  <th className="py-3 px-4 text-amber-300">SuperAdmin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {PERMISSION_MATRIX.map((row) => (
                  <tr key={row.action} className="hover:bg-surface-hover/50">
                    <td className="py-3 px-4 text-foreground font-semibold">{row.action}</td>
                    <td className="py-3 px-4">
                      {row.public ? <Check className="w-4 h-4 text-greptile-green" /> : <X className="w-4 h-4 text-muted-foreground/40" />}
                    </td>
                    <td className="py-3 px-4">
                      {row.free ? <Check className="w-4 h-4 text-greptile-green" /> : <X className="w-4 h-4 text-muted-foreground/40" />}
                    </td>
                    <td className="py-3 px-4">
                      {row.pro ? <Check className="w-4 h-4 text-greptile-green" /> : <X className="w-4 h-4 text-muted-foreground/40" />}
                    </td>
                    <td className="py-3 px-4">
                      {row.admin ? <Check className="w-4 h-4 text-amber-400" /> : <X className="w-4 h-4 text-muted-foreground/40" />}
                    </td>
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
