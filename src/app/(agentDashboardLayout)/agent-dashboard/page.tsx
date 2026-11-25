"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Plus, Pencil, Download, Loader2, X, Sparkles, Share2 } from "lucide-react";
import { PackStatusBadge } from "@/components/packs/PackStatusBadge";
import { BuyPacksModal } from "@/components/packs/BuyPacksModal";
import { ShareDialog } from "@/components/packs/ShareDialog";
import { usePdfDownload } from "@/components/packs/usePdfDownload";
import { ApiImage } from "@/components/ui/ApiImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { StatsSkeleton } from "@/components/ui/skeletons/StatsSkeleton";
import { TableSkeleton } from "@/components/ui/skeletons/TableSkeleton";
import { useGetDashboardSummaryQuery } from "@/redux/api/packs/packsApi";
import { useGetSubscriptionQuery } from "@/redux/api/billing/billingApi";
import { useAppSelector } from "@/redux/hook";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";
import type { PackSummary } from "@/types/models";

const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

function packSpecs(pack: PackSummary) {
  return [
    pack.bedrooms != null ? `${pack.bedrooms} Bed` : null,
    pack.propertyType ?? null,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function AgentDashboardPage() {
  const role = useAppSelector((state) => state.user.user?.role);
  const summary = useGetDashboardSummaryQuery();
  const subscription = useGetSubscriptionQuery();
  const { download, busyId } = usePdfDownload();

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [sharePackId, setSharePackId] = useState<string | null>(null);
  const [showCreditDetails, setShowCreditDetails] = useState(false);

  const data = summary.data;
  const periodEnd = subscription.data?.periodEnd;
  const noSubscription = apiErrorInfo(subscription.error).code === "no_subscription";
  const canBuy = role === "owner";

  return (
    <div className="space-y-6">
      {/* =========================================================================
          SECTION 1: AGENT OVERVIEW HEADER
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/70">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">
            Agent Overview
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Manage your property marketing collateral &amp; PDF reports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Available Credits Pill with Popover Breakdown */}
          {data && (
            <div className="relative">
              <button
                onClick={() => setShowCreditDetails(!showCreditDetails)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#8C6605] text-xs font-semibold shadow-2xs hover:bg-[#FDE68A]/60 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                title="Click to view credits breakdown"
              >
                <span className="w-2 h-2 rounded-full bg-[#E8A808] shrink-0 animate-pulse" />
                <span>{formatNumber(data.creditsRemaining)} {data.creditsRemaining === 1 ? "Pack" : "Packs"} Available</span>
                {data.planAllocation > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E8A808]/25 text-[#715003] font-semibold">
                    {data.packsUsedThisPeriod} / {data.planAllocation} used
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showCreditDetails && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-2 w-72 z-30 p-4 bg-white rounded-2xl shadow-xl border border-slate-200 text-xs text-slate-700"
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <span className="font-heading font-medium text-slate-900">Available Credits Explained</span>
                      <button
                        onClick={() => setShowCreditDetails(false)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-2 py-2.5 text-[11px]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Plan packs used this period:</span>
                        <strong className="text-slate-900 font-medium">
                          {data.packsUsedThisPeriod} / {data.planAllocation}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Monthly allowance left (resets):</span>
                        <strong className="text-slate-900 font-medium">{data.allowanceCredits ?? 0}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Pay-as-you-go packs (never expire):</span>
                        <strong className="text-slate-900 font-medium">{data.paygCredits ?? 0}</strong>
                      </div>
                      <div className="pt-1.5 border-t border-slate-100 flex justify-between items-center font-medium text-slate-900 text-xs">
                        <span>Total Ready to Generate:</span>
                        <span className="text-[#092167] font-medium text-sm">{data.creditsRemaining} {data.creditsRemaining === 1 ? "pack" : "packs"}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {periodEnd
                        ? `Your monthly allowance renews on ${formatDate(periodEnd, "long")}; unused monthly packs do not roll over. The allowance is used first, then pay-as-you-go packs.`
                        : noSubscription
                          ? "You have no monthly plan. Pay-as-you-go packs never expire, or choose a plan in Settings & Billing."
                          : "The monthly allowance is used first, then pay-as-you-go packs."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Buy Packs Button with Concise Sizing */}
          <button
            onClick={() => setShowBuyModal(true)}
            disabled={!canBuy}
            title={canBuy ? undefined : "Only the agency owner can buy packs"}
            className="h-9 px-3.5 rounded-lg bg-[#06143E] hover:bg-[#0B1E48] active:bg-[#040C1E] active:scale-[0.98] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buy Packs</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: MARKET A NEW PROPERTY LISTING BANNER
      ========================================================================= */}
      <div className="@container cq-panel bg-[#07153B] rounded-3xl p-6 sm:p-7 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-md border border-[#162758]/50 relative overflow-hidden interactive-lift">
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-1.5">
          <h2 className="font-heading font-semibold text-lg sm:text-xl text-white tracking-tight">
            Market a New Property Listing
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Turn your property details into listing copy and marketing content
            in seconds.
          </p>
        </div>

        <Link
          href="/agent-dashboard/create"
          className="relative z-10 h-10 px-4.5 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#D49800] text-[#06143E] font-heading font-semibold text-xs sm:text-sm shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 stroke-[2.2]" />
          <span>Create Property Pack</span>
        </Link>
      </div>

      {summary.isLoading ? (
        <>
          <StatsSkeleton count={3} />
          <TableSkeleton rows={4} columns={5} />
        </>
      ) : summary.isError || !data ? (
        <ErrorState error={summary.error} onRetry={() => summary.refetch()} />
      ) : (
        <>
      {/* =========================================================================
          SECTION 3: STATS CARDS
      ========================================================================= */}
      <div className="@container">
        <div className="grid grid-cols-1 @sm:grid-cols-2 @xl:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Total Packs Created */}
          <div className="@container cq-card bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Total Packs Created</span>
            </div>

            <div className="mt-3.5 space-y-2.5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                    {data.totalPacks}
                  </span>
                  <span className="text-xs text-slate-500 ml-1.5">packs</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  {pct(data.livePacks, data.totalPacks)}% published
                </span>
              </div>

              {/* Multi-segment status bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${pct(data.livePacks, data.totalPacks)}%` }}
                  title={`${data.livePacks} Published`}
                />
                <div
                  className="h-full bg-blue-400 transition-all duration-500"
                  style={{ width: `${pct(data.readyPacks, data.totalPacks)}%` }}
                  title={`${data.readyPacks} Ready`}
                />
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${pct(data.draftPacks, data.totalPacks)}%` }}
                  title={`${data.draftPacks} Drafts`}
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px] text-slate-600">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span><strong>{data.livePacks}</strong> published live</span>
                </span>
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                  <span><strong>{data.readyPacks}</strong> ready</span>
                </span>
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <span><strong>{data.draftPacks}</strong> in draft</span>
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Plan Pack Allocation & Available Credits */}
          <div className="@container cq-card bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Plan &amp; Credits Allocation</span>
              {data.planAllocation > 0 && (
                <span className="text-[10px] sm:text-[11px] text-[#8C6605] bg-[#FEF3C7] border border-[#FDE68A] px-2 py-0.5 rounded-full font-semibold">
                  {pct(data.packsUsedThisPeriod, data.planAllocation)}% Quota Used
                </span>
              )}
            </div>

            <div className="mt-3.5 space-y-2.5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                    {data.creditsRemaining}
                  </span>
                  <span className="text-xs text-slate-500 ml-1.5">packs available</span>
                </div>
                {data.planAllocation > 0 && (
                  <span className="text-[11px] font-mono font-medium text-slate-500">
                    {data.packsUsedThisPeriod} / {data.planAllocation} used
                  </span>
                )}
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#06143E] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, pct(data.packsUsedThisPeriod, data.planAllocation))}%` }}
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px] text-slate-600">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#06143E] shrink-0" />
                  <span><strong>{data.packsUsedThisPeriod}</strong> used this period</span>
                </span>
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#E8A808] shrink-0" />
                  <span><strong>{data.planAllocation}</strong> plan allowance</span>
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Active Market Listings */}
          <div className="@container cq-card bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Active Market Listings</span>
            </div>

            <div className="mt-3.5 space-y-2.5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                    {data.livePacks}
                  </span>
                  <span className="text-xs text-slate-500 ml-1.5">live campaigns</span>
                </div>
                <div className="flex items-center text-[11px] font-medium text-slate-600">
                  <span className="text-emerald-600">● {data.livePacks} Live</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="text-slate-500">{data.draftPacks} Drafts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: RECENT PROPERTY MARKETING PACKS TABLE
      ========================================================================= */}
      <div className="@container cq-panel bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-medium text-base sm:text-lg text-slate-900">
              Recent Property Marketing Packs
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Access and download your newly compiled agency listing materials
            </p>
          </div>
          <Link
            href="/agent-dashboard/saved-packs"
            className="text-xs font-semibold text-slate-900 hover:text-[#092167] flex items-center gap-1.5 transition-all hover:translate-x-0.5 self-start sm:self-auto group"
          >
            <span>View All ({data.totalPacks})</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#E8A808]" />
          </Link>
        </div>

        {data.recent.length === 0 ? (
          <EmptyState
            title="No property packs yet"
            description="Create your first property pack to see it here."
            primaryAction={{ label: "Create Property Pack", href: "/agent-dashboard/create", icon: Sparkles }}
            className="border-0 shadow-none"
          />
        ) : (
          <>
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full text-left min-w-[680px]">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wider bg-slate-50/80 border-b border-slate-200">
                    <th className="py-3.5 px-6 sm:px-3 w-[42%]">Property Address</th>
                    <th className="py-3.5 px-3 w-[18%]">Listing Price</th>
                    <th className="py-3.5 px-3 w-[16%]">Date Created</th>
                    <th className="py-3.5 px-3 w-[12%]">Status</th>
                    <th className="py-3.5 px-6 sm:px-3 w-[12%] text-right sm:text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recent.map((pack) => {
                    const id = pack.id ?? "";
                    const address = pack.address || pack.title || "Untitled property";
                    return (
                      <tr key={id} className="hover:bg-slate-50/80 transition-all duration-200 group">
                        <td className="py-4 px-6 sm:px-3">
                          <div className="flex items-center gap-3.5">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-2xs group-hover:shadow-sm transition-shadow bg-slate-100">
                              <ApiImage
                                src={pack.coverUrl}
                                alt={address}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/agent-dashboard/editor?pack=${id}`}
                                className="block font-medium text-sm text-slate-900 truncate group-hover:text-[#092167] transition-colors"
                              >
                                {address}
                              </Link>
                              <p className="text-xs text-slate-500 truncate mt-0.5">{packSpecs(pack)}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-3">
                          <span className="font-medium text-sm text-slate-900">
                            {formatMoney(pack.pricePence, pack.market === "US" ? "USD" : "GBP")}
                          </span>
                        </td>

                        <td className="py-4 px-3">
                          <span className="text-xs text-slate-600">{formatDate(pack.createdAt)}</span>
                        </td>

                        <td className="py-4 px-3">
                          <PackStatusBadge status={pack.status ?? "draft"} size="sm" />
                        </td>

                        <td className="py-4 px-6 sm:px-3 text-right sm:text-left">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => download(id)}
                              disabled={busyId !== null}
                              className="h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-60"
                            >
                              {busyId === id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                              ) : (
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                              )}
                              <span>PDF Report</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSharePackId(id)}
                              title="Share digital brochure"
                              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg hover:scale-110 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center"
                            >
                              <Share2 className="w-3.5 h-3.5 text-[#092167]" />
                            </button>
                            <Link
                              href={`/agent-dashboard/editor?pack=${id}`}
                              title="Edit property details in Live Editor"
                              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg hover:scale-110 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
              <p>
                Showing {data.recent.length} of {data.totalPacks} property listings
              </p>
            </div>
          </>
        )}
      </div>
        </>
      )}

      {/* BUY PACKS MODAL */}
      <BuyPacksModal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} />

      {/* SHARE DIGITAL BROCHURE DIALOG */}
      {sharePackId && <ShareDialog isOpen onClose={() => setSharePackId(null)} packId={sharePackId} />}
    </div>
  );
}
