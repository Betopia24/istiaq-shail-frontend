"use client";

import React, { useEffect, useState } from "react";
import { Download, Receipt, RotateCw, X, Sparkles, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { useGetAdminSubscriptionsQuery, useRetrySubscriptionMutation } from "@/redux/api/admin/adminApi";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/skeletons/TableSkeleton";
import { errorText } from "@/lib/auth/client";
import { formatDate, formatMoney, initials } from "@/lib/format";
import type { AdminSubscription } from "@/types/models";

const PAGE_SIZE = 20;

const STATE_LABEL: Record<string, string> = {
  active: "ACTIVE",
  past_due: "PAST DUE",
  incomplete: "INCOMPLETE",
  canceled: "CANCELED",
  unpaid: "UNPAID",
};

function planPrice(sub: AdminSubscription) {
  const plan = sub.plan;
  if (!plan) return "–";
  return `${formatMoney(plan.pricePence, plan.currency?.toUpperCase())}/${plan.interval === "year" ? "yr" : "mo"}`;
}

export default function SubscriptionsAndBillingPage() {
  const [stateFilter, setStateFilter] = useState<string>("");
  const [planFilter, setPlanFilter] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedReceipt, setSelectedReceipt] = useState<AdminSubscription | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [exportFrom, setExportFrom] = useState("");
  const [exportTo, setExportTo] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isError, error, refetch, isFetching } = useGetAdminSubscriptionsQuery({
    state: stateFilter || undefined,
    plan: planFilter || undefined,
    q: searchQuery || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const [retrySubscription] = useRetrySubscriptionMutation();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const counts = data?.counts ?? {};
  const countsByPlan = data?.countsByPlan ?? {};
  const allCount = Object.values(counts).reduce((a, b) => a + b, 0);
  const filtered = !!stateFilter || !!planFilter || !!searchQuery;

  const exportParams = new URLSearchParams();
  if (exportFrom) exportParams.set("from", exportFrom);
  if (exportTo) exportParams.set("to", exportTo);
  const exportHref = `/api/backend/admin/billing/export${exportParams.size ? `?${exportParams.toString()}` : ""}`;

  const pick = (kind: "all" | "state" | "plan", value = "") => {
    setStateFilter(kind === "state" ? value : "");
    setPlanFilter(kind === "plan" ? value : "");
    setPage(1);
  };

  const handleRetryStripe = async (sub: AdminSubscription) => {
    if (!sub.id || retryingId) return;
    setRetryingId(sub.id);
    try {
      await retrySubscription(sub.id).unwrap();
      toast.success(`Stripe payment retry succeeded for ${sub.agency?.name ?? "the agency"}`);
    } catch (err) {
      const { code } = apiErrorInfo(err);
      toast.error(code === "nothing_to_retry" ? "There is no open invoice to retry for this subscription." : errorText(err));
    } finally {
      setRetryingId(null);
    }
  };

  const pillClass = (active: boolean) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
      active ? "bg-[#06143E] text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
    }`;

  return (
    <div className="space-y-6">
      {/* Header with Title and Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/70">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">
            Subscription History &amp; Stripe Billing Logs
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <input
            type="date"
            aria-label="Export from date"
            value={exportFrom}
            onChange={(e) => setExportFrom(e.target.value)}
            className="h-10 px-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
          />
          <input
            type="date"
            aria-label="Export to date"
            value={exportTo}
            onChange={(e) => setExportTo(e.target.value)}
            className="h-10 px-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
          />
          <a
            href={exportHref}
            className="h-10 px-4 rounded-lg bg-[#06143E] hover:bg-[#092167] text-white text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Billing CSV ↓</span>
          </a>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button onClick={() => pick("all")} className={pillClass(!stateFilter && !planFilter)}>
          All ({allCount})
        </button>

        {Object.entries(countsByPlan).map(([code, count]) => (
          <button key={code} onClick={() => pick("plan", code)} className={pillClass(planFilter === code)}>
            <span className="w-2 h-2 rounded-full bg-[#E8A808]" />
            <span className="capitalize">
              {code} ({count})
            </span>
          </button>
        ))}

        {Object.entries(counts)
          .filter(([, count]) => count > 0)
          .map(([state, count]) => {
            const danger = state === "past_due" || state === "unpaid";
            const active = stateFilter === state;
            return (
              <button
                key={state}
                onClick={() => pick("state", state)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
                  active
                    ? danger
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-[#06143E] text-white shadow-sm"
                    : danger
                      ? "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50/50"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${danger ? "bg-rose-500" : "bg-slate-400"}`} />
                <span>
                  {(STATE_LABEL[state] ?? state).replace(/^./, (c) => c)} ({count})
                </span>
              </button>
            );
          })}

        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search agency or owner..."
          className="h-9 ml-auto px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] w-full sm:w-64"
        />
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={6} columns={6} className="border-0 rounded-none" />
        ) : isError ? (
          <div className="p-6">
            <ErrorState error={error} onRetry={refetch} />
          </div>
        ) : items.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={CreditCard}
              title={filtered ? "No subscriptions match your filters" : "No subscriptions yet"}
              description={filtered ? "Try a different filter or search term." : "Subscriptions appear here once agencies start paying."}
            />
          </div>
        ) : (
          <div className={`overflow-x-auto ${isFetching ? "opacity-70" : ""}`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <th className="px-6 py-4">Invoice &amp; Stripe ID</th>
                  <th className="px-6 py-4">Agency / Subscriber</th>
                  <th className="px-6 py-4">Plan Tier (Current)</th>
                  <th className="px-6 py-4">Cycle / Renewal</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {items.map((sub) => {
                  const bad = sub.state === "past_due" || sub.state === "unpaid";
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`font-mono font-medium text-sm ${bad ? "text-rose-600" : "text-slate-900"}`}>
                          {sub.latestInvoice?.number ?? "–"}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {sub.latestInvoice?.stripeInvoiceId ?? sub.stripeSubscriptionId ?? ""}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${bad ? "bg-rose-100 text-rose-700" : "bg-slate-200 text-slate-800"} font-medium text-xs flex items-center justify-center shrink-0 border border-slate-200/60`}
                          >
                            {initials(sub.agency?.name)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 leading-tight">{sub.agency?.name ?? "–"}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{sub.owner?.email ?? ""}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {sub.plan?.code === "professional" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#06143E] text-white">
                            <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
                            <span>{sub.plan.name}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {sub.plan?.name ?? "–"}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {sub.plan?.interval === "year" ? "Annual" : "Monthly"} ({planPrice(sub)})
                        </div>
                        <div className={`text-xs mt-0.5 ${bad ? "text-rose-600 font-medium" : "text-slate-400"}`}>
                          {sub.state === "past_due" || sub.state === "unpaid"
                            ? "Card declined"
                            : sub.cancelAtPeriodEnd
                              ? `Cancels ${formatDate(sub.currentPeriodEnd)}`
                              : sub.currentPeriodEnd
                                ? `Renews ${formatDate(sub.currentPeriodEnd)}`
                                : "–"}
                          {sub.card?.last4 ? ` · ${sub.card.brand ?? "Card"} •••• ${sub.card.last4}` : ""}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {sub.state === "active" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                            ACTIVE
                          </span>
                        ) : bad ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/50">
                            {STATE_LABEL[sub.state ?? ""] ?? sub.state}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            {STATE_LABEL[sub.state ?? ""] ?? sub.state}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {sub.latestInvoice && (
                            <button
                              onClick={() => setSelectedReceipt(sub)}
                              className="h-8 px-3 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white transition cursor-pointer"
                            >
                              View Receipt
                            </button>
                          )}
                          {sub.canRetry && (
                            <button
                              onClick={() => handleRetryStripe(sub)}
                              disabled={retryingId === sub.id}
                              className="h-8 px-3.5 rounded-lg bg-[#06143E] hover:bg-[#092167] text-xs font-medium text-white transition flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                            >
                              {retryingId === sub.id ? (
                                <>
                                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Retrying...</span>
                                </>
                              ) : (
                                <span>Retry Stripe</span>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {data && items.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong>{items.length}</strong> of <strong>{total}</strong> subscriptions
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

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              aria-label="Close"
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#06143E] text-[#E8A808] flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-medium text-lg text-slate-900">Stripe Payment Receipt</h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedReceipt.latestInvoice?.number ?? "–"} • {selectedReceipt.latestInvoice?.stripeInvoiceId ?? ""}
                </p>
              </div>
            </div>

            <div className="space-y-4 my-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Customer:</span>
                <span className="font-medium text-slate-900">{selectedReceipt.agency?.name}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-800">{selectedReceipt.owner?.email ?? "–"}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Plan Tier:</span>
                <span className="font-medium text-slate-900">{selectedReceipt.plan?.name} Subscription</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Invoice status:</span>
                <span className="font-medium text-slate-900 capitalize">
                  {selectedReceipt.latestInvoice?.state}
                  {selectedReceipt.latestInvoice?.paidAt ? ` on ${formatDate(selectedReceipt.latestInvoice.paidAt)}` : ""}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-900 font-medium">Amount:</span>
                <span className="font-heading font-medium text-lg text-emerald-600">
                  {formatMoney(selectedReceipt.latestInvoice?.amountPence, selectedReceipt.latestInvoice?.currency?.toUpperCase(), { decimals: true })}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Close
              </button>
              {selectedReceipt.latestInvoice?.pdfUrl ? (
                <a
                  href={selectedReceipt.latestInvoice.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#06143E] hover:bg-[#092167] text-white text-sm font-medium flex items-center gap-2 shadow-sm transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
              ) : (
                <span className="px-4 py-2 rounded-lg bg-slate-100 text-slate-400 text-sm font-medium">No PDF available</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
