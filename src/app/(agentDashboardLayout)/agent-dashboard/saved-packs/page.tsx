"use client";

import React, { useEffect, useState } from "react";
import { DangerModal } from "@/components/ui/DangerModal";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Search,
  ChevronDown,
  ExternalLink,
  FileText,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CreditCard,
  Share2,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { PackStatusBadge } from "@/components/packs/PackStatusBadge";
import { ShareDialog } from "@/components/packs/ShareDialog";
import { BuyPacksModal } from "@/components/packs/BuyPacksModal";
import { usePdfDownload } from "@/components/packs/usePdfDownload";
import { ApiImage } from "@/components/ui/ApiImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { CardGridSkeleton } from "@/components/ui/skeletons/CardGridSkeleton";
import {
  useDeletePackMutation,
  useGetDashboardSummaryQuery,
  useListPacksQuery,
} from "@/redux/api/packs/packsApi";
import { useAppSelector } from "@/redux/hook";
import { errorText } from "@/lib/auth/client";
import { formatMoney, formatNumber } from "@/lib/format";
import type { PackListQuery, PackSummary } from "@/types/models";

type FilterStatus = "all" | "ready" | "draft";
type SortOption = "newest" | "oldest" | "price-high" | "price-low";

const SORT_PARAM: Record<SortOption, NonNullable<PackListQuery["sort"]>> = {
  newest: "newest",
  oldest: "oldest",
  "price-high": "price_desc",
  "price-low": "price_asc",
};

const PAGE_SIZE = 9;

export default function SavedPacksPage() {
  const role = useAppSelector((state) => state.user.user?.role);
  const canBuy = role === "owner";

  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [packToDelete, setPackToDelete] = useState<PackSummary | null>(null);
  const [sharePackId, setSharePackId] = useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const summary = useGetDashboardSummaryQuery();
  const list = useListPacksQuery({
    status: activeFilter === "all" ? undefined : activeFilter,
    q: debouncedQuery || undefined,
    sort: SORT_PARAM[sortOption],
    page: currentPage,
    pageSize: PAGE_SIZE,
  });
  const [deletePack, deleteState] = useDeletePackMutation();
  const { download, busyId } = usePdfDownload();

  const items = list.data?.items ?? [];
  const total = list.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const confirmDeletePack = async () => {
    if (!packToDelete?.id) return;
    try {
      await deletePack(packToDelete.id).unwrap();
      toast.success("Property pack permanently deleted.");
      if (items.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
      setPackToDelete(null);
    } catch (err) {
      toast.error(errorText(err));
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((n) => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1);

  return (
    <div className="space-y-6">
      {/* =========================================================================
          TOP HEADER
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/70">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">
            Saved Property Packs
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Manage, edit, export and share all generated property assets
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Credits Badge */}
          {summary.data && (
            <div className="h-9 px-3 rounded-lg border border-[#FDE68A] bg-[#FEF3C7] flex items-center gap-2 text-xs font-semibold text-[#8C6605]">
              <span className="w-2 h-2 rounded-full bg-[#E8A808] animate-pulse" />
              <span>{formatNumber(summary.data.creditsRemaining)} {summary.data.creditsRemaining === 1 ? "Pack" : "Packs"} Available</span>
            </div>
          )}

          {/* Buy Packs Top-Up Button */}
          <button
            type="button"
            onClick={() => setShowBuyModal(true)}
            disabled={!canBuy}
            title={canBuy ? undefined : "Only the agency owner can buy packs"}
            className="h-9 px-3 rounded-lg border border-[#06143E] bg-[#06143E] hover:bg-[#0B1E48] text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#E8A808]" />
            <span>Buy Packs</span>
          </button>

          {/* New Property Pack Button */}
          <Link
            href="/agent-dashboard/create"
            className="h-9 px-3.5 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#D49800] text-[#06143E] font-heading font-semibold text-xs transition flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Property Pack</span>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          FILTER TABS & SEARCH / SORT
      ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
          <button
            onClick={() => {
              setActiveFilter("all");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-heading text-xs transition cursor-pointer shrink-0 ${
              activeFilter === "all"
                ? "bg-[#06143E] text-white font-medium shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
            }`}
          >
            All{summary.data ? ` (${summary.data.totalPacks})` : ""}
          </button>

          <button
            onClick={() => {
              setActiveFilter("ready");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-heading text-xs transition cursor-pointer shrink-0 ${
              activeFilter === "ready"
                ? "bg-[#06143E] text-white font-medium shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
            }`}
          >
            Ready{summary.data ? ` (${summary.data.readyPacks})` : ""}
          </button>

          <button
            onClick={() => {
              setActiveFilter("draft");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-heading text-xs transition cursor-pointer shrink-0 ${
              activeFilter === "draft"
                ? "bg-[#06143E] text-white font-medium shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
            }`}
          >
            Drafts{summary.data ? ` (${summary.data.draftPacks})` : ""}
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search property or location..."
              className="w-full sm:w-64 h-9 pl-8.5 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value as SortOption);
                setCurrentPage(1);
              }}
              className="h-9 pl-3.5 pr-8 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:border-[#092167] transition appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          PROPERTY CARDS GRID (3 Columns)
      ========================================================================= */}
      {list.isLoading ? (
        <CardGridSkeleton count={6} />
      ) : list.isError ? (
        <ErrorState error={list.error} onRetry={() => list.refetch()} />
      ) : items.length === 0 ? (
        debouncedQuery || activeFilter !== "all" ? (
          <EmptyState
            icon={Search}
            title="No saved property packs found"
            description="Try adjusting your search query or filter pills to see other saved packs."
          />
        ) : (
          <EmptyState
            icon={FolderOpen}
            title="No saved property packs yet"
            description="Packs you create will be saved here so you can edit, export and share them."
            primaryAction={{ label: "New Property Pack", href: "/agent-dashboard/create", icon: Sparkles }}
          />
        )
      ) : (
        <div className="@container">
          <div className="grid grid-cols-1 @sm:grid-cols-2 @xl:grid-cols-3 @4xl:grid-cols-4 gap-6">
            {items.map((pack) => {
              const id = pack.id ?? "";
              const title = pack.title || pack.address || "Untitled property";
              return (
                <div
                  key={id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
                >
                  {/* Card Image / Visual Area */}
                  <div className="relative aspect-[16/10] bg-slate-900 w-full overflow-hidden select-none">
                    <ApiImage
                      src={pack.coverUrl}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallback={
                        <div className="w-full h-full relative bg-[#1E293B] overflow-hidden flex flex-col justify-end">
                          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px]" />
                          <div className="w-full h-7 bg-[#1C4E2D] relative z-10 shrink-0" />
                        </div>
                      }
                    />

                    {/* Top Left Badge: Status */}
                    <div className="absolute top-3 left-3 z-20">
                      <PackStatusBadge status={pack.status ?? "draft"} size="sm" />
                    </div>

                    {/* Top Right Badge: Market */}
                    {pack.market && (
                      <div className="absolute top-3 right-3 z-20">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#06143E]/85 backdrop-blur-xs text-white">
                          {pack.market}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <Link
                        href={`/agent-dashboard/editor?pack=${id}`}
                        className="block font-heading font-medium text-base text-slate-900 tracking-tight hover:text-[#092167] transition line-clamp-1"
                        title={title}
                      >
                        {title}
                      </Link>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{pack.address}</p>

                      <p className="font-heading font-medium text-xl text-slate-900 mt-2.5">
                        {formatMoney(pack.pricePence, pack.market === "US" ? "USD" : "GBP")}
                      </p>

                      {/* Specs Pills */}
                      <div className="flex items-center flex-wrap gap-1.5 mt-3 select-none">
                        {pack.bedrooms != null && (
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                            {pack.bedrooms} Beds
                          </span>
                        )}
                        {pack.bathrooms != null && (
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                            {pack.bathrooms} Baths
                          </span>
                        )}
                        {pack.sizeSqFt != null && (
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                            {formatNumber(pack.sizeSqFt)} sq ft
                          </span>
                        )}
                        {pack.propertyType && (
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                            {pack.propertyType}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Action Buttons Footer */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        href={`/agent-dashboard/editor?pack=${id}`}
                        className="h-9 px-5 rounded-lg bg-[#06143E] hover:bg-[#0A1F5C] active:bg-[#040D28] text-white font-heading font-medium text-xs flex items-center justify-center transition shadow-2xs"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => setSharePackId(id)}
                        className="h-9 w-9 rounded-lg border border-[#FFB800] bg-amber-50/20 hover:bg-amber-50 text-[#D49800] flex items-center justify-center transition cursor-pointer"
                        title="Share property pack"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      {/* Public buyer page, once the pack has been shared */}
                      {pack.shareToken && (
                        <Link
                          href={`/property/${pack.shareToken}`}
                          target="_blank"
                          className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition cursor-pointer shadow-2xs"
                          title="Open live public buyer page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}

                      {/* Printable PDF brochure */}
                      <button
                        type="button"
                        onClick={() => download(id)}
                        disabled={busyId !== null}
                        className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition cursor-pointer shadow-2xs disabled:opacity-60"
                        title="Download PDF brochure"
                      >
                        {busyId === id ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPackToDelete(pack)}
                        className="ml-auto p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                        title="Delete saved pack"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          BOTTOM FOOTER: COUNT & PAGINATION
      ========================================================================= */}
      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200/60 select-none">
          <p className="text-xs text-slate-500 font-medium">
            Showing {startIndex + 1} to {Math.min(startIndex + PAGE_SIZE, total)} of {total} saved packs
          </p>

          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center text-xs transition cursor-pointer disabled:cursor-not-allowed shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {pageNumbers.map((n, idx) => (
              <React.Fragment key={n}>
                {idx > 0 && n - pageNumbers[idx - 1] > 1 && <span className="text-slate-400 text-xs">…</span>}
                <button
                  type="button"
                  onClick={() => setCurrentPage(n)}
                  className={`w-8 h-8 rounded-lg font-heading text-xs transition cursor-pointer ${
                    currentPage === n
                      ? "bg-[#06143E] text-white font-medium shadow-xs"
                      : "border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50"
                  }`}
                >
                  {n}
                </button>
              </React.Fragment>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center text-xs transition cursor-pointer disabled:cursor-not-allowed shadow-2xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Share Dialog */}
      {sharePackId && <ShareDialog isOpen onClose={() => setSharePackId(null)} packId={sharePackId} />}

      {/* Buy Packs Modal */}
      <BuyPacksModal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} />

      {/* Delete Confirmation Modal */}
      <DangerModal
        isOpen={!!packToDelete}
        onClose={() => setPackToDelete(null)}
        onConfirm={confirmDeletePack}
        isLoading={deleteState.isLoading}
        title="Delete Property Pack"
        description="Are you sure you want to permanently delete this property pack? All generated marketing copy, public brochure links, and analytics will be removed."
        itemName={packToDelete?.title || packToDelete?.address}
        confirmText="Delete Pack"
      />
    </div>
  );
}
