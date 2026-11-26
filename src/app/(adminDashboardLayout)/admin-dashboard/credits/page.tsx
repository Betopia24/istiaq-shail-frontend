"use client";

import React, { useEffect, useState } from "react";
import { Coins, Minus, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useAdjustAgencyCreditsMutation,
  useGetAdminAgenciesQuery,
  useGetAdminAgencyCreditsQuery,
  useSetAgencyAllowanceMutation,
} from "@/redux/api/admin/adminApi";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/skeletons/TableSkeleton";
import { errorText } from "@/lib/auth/client";
import { formatDateTime, formatNumber } from "@/lib/format";
import type { AdminAgency } from "@/types/models";

const PAGE_SIZE = 20;

const REASON_LABEL: Record<string, string> = {
  plan_grant: "Plan allowance",
  generation_use: "Pack generated",
  regeneration_use: "Pack regenerated",
  top_up: "Pay-as-you-go purchase",
  refund: "Refund (failed job)",
  admin_grant: "Added by admin",
  admin_deduction: "Removed by admin",
  expiry: "Expired",
};

const POOL_LABEL = { allowance: "Monthly allowance", payg: "Pay-as-you-go" } as const;

/** Manage one agency: balances, add or remove packs, the agency's own monthly allowance, and the ledger behind it. */
function AgencyCreditsPanel({ agency, onClose }: { agency: AdminAgency; onClose: () => void }) {
  const { data, isLoading, isError, error, refetch } = useGetAdminAgencyCreditsQuery(agency.id!);
  const [adjust, adjustState] = useAdjustAgencyCreditsMutation();
  const [setAllowance, allowanceState] = useSetAgencyAllowanceMutation();

  const [pool, setPool] = useState<"allowance" | "payg">("payg");
  const [direction, setDirection] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [allowanceInput, setAllowanceInput] = useState("");
  const [applyNow, setApplyNow] = useState(true);

  const view = data ?? agency;
  const credits = view.credits;

  const submitAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(amount);
    if (!Number.isInteger(n) || n <= 0) return toast.error("Enter a whole number of packs above 0");
    if (note.trim().length < 3) return toast.error("Add a short note: it is saved in the ledger and the audit log");
    try {
      await adjust({ id: agency.id!, pool, amount: direction === "add" ? n : -n, note: note.trim() }).unwrap();
      toast.success(`${direction === "add" ? "Added" : "Removed"} ${n} pack${n === 1 ? "" : "s"}`);
      setAmount("");
      setNote("");
    } catch (err) {
      toast.error(
        apiErrorInfo(err).status === 402
          ? `That pool holds fewer than ${n} packs, so they can't be removed.`
          : errorText(err),
      );
    }
  };

  const submitAllowance = async (clear: boolean) => {
    const n = clear ? null : Number(allowanceInput);
    if (!clear && (!Number.isInteger(n) || (n as number) < 0)) return toast.error("Enter a whole number of packs a month");
    try {
      await setAllowance({ id: agency.id!, allowance: n, applyNow: !clear && applyNow }).unwrap();
      toast.success(clear ? "Back to the plan's own allowance" : "Monthly allowance saved");
      setAllowanceInput("");
    } catch (err) {
      toast.error(errorText(err));
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={`Credits for ${agency.name}`} className="fixed inset-0 z-50 flex justify-end bg-[#06143E]/50 backdrop-blur-xs">
      <div className="w-full max-w-xl h-full bg-white shadow-2xl overflow-y-auto p-6 sm:p-7 space-y-6">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="min-w-0">
            <h2 className="font-heading font-semibold text-xl text-slate-900 truncate">{agency.name}</h2>
            <p className="text-xs text-slate-500 truncate">
              {agency.owner?.email ?? "No owner"} · {agency.plan ? `${agency.plan.name} plan` : "No plan (pay as you go)"}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isError && <ErrorState error={error} onRetry={refetch} />}

        <div className="grid grid-cols-3 gap-3">
          {[
            ["Total", credits?.total ?? 0],
            ["Monthly allowance", credits?.allowance ?? 0],
            ["Pay-as-you-go", credits?.payg ?? 0],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
              <p className="font-heading font-bold text-2xl text-slate-900 mt-1">{formatNumber(value as number)}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 -mt-3">
          Packs are spent from the monthly allowance first, then pay-as-you-go. The monthly allowance resets (no rollover) at each renewal; pay-as-you-go packs never expire.
        </p>

        {/* Add or remove */}
        <form onSubmit={submitAdjust} className="rounded-2xl border border-slate-200 p-4 space-y-3">
          <h3 className="font-heading font-semibold text-sm text-slate-900">Add or remove packs</h3>
          <div className="grid grid-cols-2 gap-2">
            {(["add", "remove"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDirection(d)}
                className={`h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border cursor-pointer ${
                  direction === d ? (d === "add" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-rose-600 border-rose-600 text-white") : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                {d === "add" ? <Plus className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                {d === "add" ? "Add" : "Remove"}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select value={pool} onChange={(e) => setPool(e.target.value as "allowance" | "payg")} aria-label="Pool" className="h-10 px-2 text-xs border border-slate-200 rounded-lg bg-white">
              <option value="payg">Pay-as-you-go (never expire)</option>
              <option value="allowance">Monthly allowance (resets)</option>
            </select>
            <input type="number" min={1} step={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Number of packs" aria-label="Number of packs" className="h-10 px-3 text-xs border border-slate-200 rounded-lg" />
          </div>
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} placeholder="Why? (saved in the ledger and audit log)" aria-label="Note" className="w-full h-10 px-3 text-xs border border-slate-200 rounded-lg" />
          <button type="submit" disabled={adjustState.isLoading} className="w-full h-10 rounded-lg bg-[#06143E] hover:bg-[#092167] text-white text-xs font-semibold disabled:opacity-60 cursor-pointer">
            {adjustState.isLoading ? "Saving..." : direction === "add" ? "Add packs" : "Remove packs"}
          </button>
        </form>

        {/* Own monthly allowance */}
        <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
          <h3 className="font-heading font-semibold text-sm text-slate-900">Monthly allowance for this agency</h3>
          {agency.plan ? (
            <>
              <p className="text-xs text-slate-600">
                Now: <strong>{formatNumber(view.monthlyAllowance ?? 0)}</strong> packs a month
                {view.allowanceOverride != null ? " (set for this agency)" : ` (the ${agency.plan.name} plan's)`}. Used from the next renewal; a raise can also be added today.
              </p>
              <div className="flex gap-2">
                <input type="number" min={0} step={1} value={allowanceInput} onChange={(e) => setAllowanceInput(e.target.value)} placeholder="Packs a month" aria-label="Packs a month" className="flex-1 h-10 px-3 text-xs border border-slate-200 rounded-lg" />
                <button type="button" disabled={allowanceState.isLoading || !allowanceInput} onClick={() => submitAllowance(false)} className="h-10 px-4 rounded-lg bg-[#06143E] hover:bg-[#092167] text-white text-xs font-semibold disabled:opacity-60 cursor-pointer">
                  Save
                </button>
              </div>
              <label className="flex items-center gap-2 text-[11px] text-slate-600">
                <input type="checkbox" checked={applyNow} onChange={(e) => setApplyNow(e.target.checked)} /> If it is a raise, add the difference to their balance now
              </label>
              {view.allowanceOverride != null && (
                <button type="button" disabled={allowanceState.isLoading} onClick={() => submitAllowance(true)} className="text-[11px] font-semibold text-slate-600 underline hover:no-underline cursor-pointer">
                  Go back to the plan&apos;s own allowance
                </button>
              )}
            </>
          ) : (
            <p className="text-xs text-slate-500">This agency has no subscription, so it has no monthly allowance. It can still hold pay-as-you-go packs.</p>
          )}
        </div>

        {/* Ledger */}
        <div className="space-y-2">
          <h3 className="font-heading font-semibold text-sm text-slate-900">Recent activity</h3>
          {isLoading ? (
            <TableSkeleton rows={4} columns={3} />
          ) : (data?.ledger ?? []).length === 0 ? (
            <p className="text-xs text-slate-500">No credit activity yet.</p>
          ) : (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3 py-2">When</th>
                    <th className="px-3 py-2">What</th>
                    <th className="px-3 py-2 text-right">Packs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data?.ledger ?? []).map((row) => (
                    <tr key={row.id}>
                      <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{formatDateTime(row.createdAt)}</td>
                      <td className="px-3 py-2">
                        <span className="font-medium text-slate-800">{REASON_LABEL[row.reason ?? ""] ?? row.reason}</span>
                        <span className="text-slate-500"> · {POOL_LABEL[(row.pool ?? "allowance") as "allowance" | "payg"]}</span>
                        {(row.note || row.by) && (
                          <span className="block text-[11px] text-slate-500">
                            {row.note}
                            {row.by ? ` (${row.by})` : ""}
                          </span>
                        )}
                      </td>
                      <td className={`px-3 py-2 text-right font-semibold ${(row.delta ?? 0) < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                        {(row.delta ?? 0) > 0 ? "+" : ""}
                        {row.delta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminCreditsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminAgency | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isError, error, refetch, isFetching } = useGetAdminAgenciesQuery({ q: searchQuery || undefined, page, limit: PAGE_SIZE });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">Credits &amp; Packs</h1>
          <p className="text-xs text-slate-500 mt-1">Each agency&apos;s monthly allowance and pay-as-you-go packs, tracked separately. Every change is saved with a note in the audit log.</p>
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search agency or owner email..."
          className="h-10 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] w-full sm:w-72"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={6} columns={6} className="border-0 rounded-none" />
        ) : isError ? (
          <div className="p-6">
            <ErrorState error={error} onRetry={refetch} />
          </div>
        ) : items.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={Coins} title={searchQuery ? "No agencies match your search" : "No agencies yet"} description={searchQuery ? "Try a different name or email." : "Agencies appear here once they sign up."} />
          </div>
        ) : (
          <div className={`overflow-x-auto ${isFetching ? "opacity-70" : ""}`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <th className="px-6 py-4">Agency</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4 text-right">Monthly allowance</th>
                  <th className="px-6 py-4 text-right">Pay-as-you-go</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {items.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{a.name}</p>
                      <p className="text-xs text-slate-500">{a.owner?.email ?? "–"}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {a.plan ? (
                        <>
                          {a.plan.name}
                          <span className="block text-xs text-slate-500">
                            {formatNumber(a.monthlyAllowance ?? 0)} a month{a.allowanceOverride != null ? " (custom)" : ""}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-500">Pay as you go</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-800">{formatNumber(a.credits?.allowance ?? 0)}</td>
                    <td className="px-6 py-4 text-right text-slate-800">{formatNumber(a.credits?.payg ?? 0)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">{formatNumber(a.credits?.total ?? 0)}</td>
                    <td className="px-6 py-4 text-right">
                      <button type="button" onClick={() => setSelected(a)} className="h-8 px-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 text-xs text-slate-600">
            <span>
              Page {page} of {pageCount} · {total} agencies
            </span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="h-8 px-3 rounded-lg border border-slate-200 disabled:opacity-50 cursor-pointer">
                Previous
              </button>
              <button type="button" disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)} className="h-8 px-3 rounded-lg border border-slate-200 disabled:opacity-50 cursor-pointer">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && <AgencyCreditsPanel agency={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
