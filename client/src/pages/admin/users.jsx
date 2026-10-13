import { useState } from "react";
import { Users, Search, Shield, Ban, Eye, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const USERS_DATA = [
  { id: "usr_01", name: "Alex Rivera", email: "alex@company.com", role: "SuperAdmin", plan: "Pro Annual", status: "Active" },
  { id: "usr_02", name: "Sarah Chen", email: "sarah.chen@acme.corp", role: "Team Manager", plan: "Team (12 seats)", status: "Active" },
  { id: "usr_03", name: "Marcus Brody", email: "marcus@dev.io", role: "Builder", plan: "Pro Monthly", status: "Active" },
  { id: "usr_04", name: "Elena Rostova", email: "elena@startup.ai", role: "Builder", plan: "Free Local", status: "Suspended" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(USERS_DATA);

  const toggleStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u
      )
    );
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
              // USER DIRECTORY &amp; TENANTS
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mt-1">
              User &amp; Organization Governance
            </h1>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user email..."
              className="w-full pl-9 pr-3 py-1.5 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-[8px] border border-border bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border/60 bg-surface-raised text-muted-foreground uppercase">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Subscription</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-hover/50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{u.name}</div>
                      <div className="text-[11px] text-muted-foreground">{u.email}</div>
                    </td>
                    <td className="py-3 px-4 text-amber-300">{u.role}</td>
                    <td className="py-3 px-4 text-muted-foreground">{u.plan}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase ${
                          u.status === "Active"
                            ? "bg-greptile-green/15 text-greptile-green"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => alert(`Simulating impersonation session for ${u.email}...`)}
                        className="px-2 py-1 rounded-[3px] border border-border bg-surface hover:bg-surface-hover text-[10px] uppercase text-muted-foreground hover:text-foreground"
                      >
                        Impersonate
                      </button>
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`px-2 py-1 rounded-[3px] text-[10px] uppercase ${
                          u.status === "Active"
                            ? "border border-red-500/30 text-red-400 hover:bg-red-500/10"
                            : "border border-greptile-green/30 text-greptile-green hover:bg-greptile-green/10"
                        }`}
                      >
                        {u.status === "Active" ? "Suspend" : "Activate"}
                      </button>
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
