"use client";

import React, { useEffect, useState } from "react";
import { Search, ChevronDown, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useGetAdminUsersQuery, useSetUserStatusMutation } from "@/redux/api/admin/adminApi";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/skeletons/TableSkeleton";
import { errorText } from "@/lib/auth/client";
import { formatDateTime, initials } from "@/lib/format";
import type { AdminUser } from "@/types/models";

const PAGE_SIZE = 20;

const ROLE_LABEL: Record<string, string> = {
  owner: "Agency Owner",
  administrator: "Administrator",
  valuer: "Valuer",
  negotiator: "Negotiator",
  super_admin: "Super Admin",
};

export default function AgenciesAndUsersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [agentToSuspend, setAgentToSuspend] = useState<AdminUser | null>(null);
  const [reason, setReason] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isError, error, refetch, isFetching } = useGetAdminUsersQuery({
    q: searchQuery || undefined,
    role: roleFilter !== "All" && roleFilter !== "Suspended" ? roleFilter : undefined,
    status: roleFilter === "Suspended" ? "suspended" : undefined,
    page,
    limit: PAGE_SIZE,
  });
  const [setUserStatus] = useSetUserStatusMutation();

  const agents = data?.items ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = !!searchQuery || roleFilter !== "All";

  const changeStatus = async (user: AdminUser, status: "active" | "suspended", why?: string) => {
    if (!user.id) return;
    setBusyId(user.id);
    try {
      await setUserStatus({ id: user.id, status, reason: why || undefined }).unwrap();
      toast.success(status === "suspended" ? `Access suspended for ${user.fullName}` : `Access restored for ${user.fullName}`);
      return true;
    } catch (err) {
      toast.error(errorText(err));
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const confirmSuspendAgent = async () => {
    if (!agentToSuspend) return;
    const ok = await changeStatus(agentToSuspend, "suspended", reason.trim());
    if (ok) {
      setAgentToSuspend(null);
      setReason("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">
            Agency Teams &amp; User Access Control
          </h1>
        </div>
      </div>

      {/* Destructive Action Modal */}
      {agentToSuspend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setAgentToSuspend(null)} aria-hidden="true" />
          <div role="dialog" aria-modal="true" aria-labelledby="suspend-title" className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h2 id="suspend-title" className="font-heading font-semibold text-lg text-slate-900">Suspend Agency Account</h2>
            <p className="text-sm text-slate-600">
              Are you sure you want to suspend this user account? They will be signed out and unable to sign in until reactivated.
            </p>
            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              {agentToSuspend.fullName} - {agentToSuspend.agency?.name ?? "No agency"} ({agentToSuspend.email})
            </p>
            <div>
              <label htmlFor="suspend-reason" className="block text-xs font-semibold text-slate-600 mb-1.5">Reason (optional)</label>
              <textarea
                id="suspend-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setAgentToSuspend(null)} className="h-10 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSuspendAgent}
                disabled={busyId === agentToSuspend.id}
                className="h-10 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold disabled:opacity-60 cursor-pointer"
              >
                {busyId === agentToSuspend.id ? "Suspending..." : "Suspend Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Filter & Search Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name, email, or agency..."
              className="w-full h-10 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition"
            />
          </div>

          {/* Role Filter Dropdown */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none h-10 pl-4 pr-10 text-xs sm:text-sm font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#092167] transition cursor-pointer"
            >
              <option value="All">Filter Role: All Agents</option>
              <option value="owner">Agency Owner</option>
              <option value="administrator">Administrator</option>
              <option value="valuer">Valuer</option>
              <option value="negotiator">Negotiator</option>
              <option value="Suspended">Suspended</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Agents Table */}
        {isLoading ? (
          <TableSkeleton rows={6} columns={6} className="border-0 rounded-none" />
        ) : isError ? (
          <div className="p-6">
            <ErrorState error={error} onRetry={refetch} />
          </div>
        ) : agents.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Users}
              title={filtered ? "No users match your filters" : "No users yet"}
              description={filtered ? "Try a different search term or role filter." : "Users appear here as agencies sign up."}
            />
          </div>
        ) : (
          <div className={`overflow-x-auto ${isFetching ? "opacity-70" : ""}`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Agency Affiliation</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Packs Created</th>
                  <th className="px-6 py-4">Last Login</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-center shrink-0 border border-slate-200">
                          {initials(agent.fullName)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 leading-tight">{agent.fullName}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{agent.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">{agent.agency?.name ?? "–"}</td>

                    <td className="px-6 py-4">
                      {agent.role === "owner" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                          Agency Owner
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {agent.role ? ROLE_LABEL[agent.role] ?? agent.role : "–"}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">{agent.packsCount ?? 0} Packs</td>

                    <td className="px-6 py-4 text-slate-600 text-xs">{agent.lastLoginAt ? formatDateTime(agent.lastLoginAt) : "Never"}</td>

                    <td className="px-6 py-4">
                      {agent.status === "active" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                          ACTIVE
                        </span>
                      ) : agent.status === "suspended" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/50">
                          SUSPENDED
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          UNVERIFIED
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {agent.platformRole === "super_admin" ? (
                        <span className="text-xs text-slate-400">–</span>
                      ) : agent.status === "suspended" ? (
                        <button
                          disabled={busyId === agent.id}
                          onClick={() => changeStatus(agent, "active")}
                          className="text-xs font-medium text-amber-600 hover:text-amber-800 hover:underline transition disabled:opacity-50 cursor-pointer"
                        >
                          Reactivate
                        </button>
                      ) : (
                        <button
                          disabled={busyId === agent.id}
                          onClick={() => {
                            setReason("");
                            setAgentToSuspend(agent);
                          }}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline transition disabled:opacity-50 cursor-pointer"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer pagination info */}
        {data && agents.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong>{agents.length}</strong> of <strong>{total}</strong> users
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 px-3 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
              >
                Previous
              </button>
              <span>
                Page {page} of {pageCount}
              </span>
              <button
                type="button"
                disabled={page >= pageCount}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 px-3 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
