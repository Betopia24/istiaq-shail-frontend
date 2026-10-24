"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Plus,
  Link2,
  ExternalLink,
  FileText,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

type FilterStatus = "all" | "ready" | "draft";
type SortOption = "newest" | "oldest" | "price-high" | "price-low";

interface SavedPack {
  id: string;
  title: string;
  address: string;
  price: number;
  displayPrice: string;
  status: "ready" | "draft";
  country: string;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  image: string | null;
  createdAt: string;
}

const INITIAL_PACKS: SavedPack[] = [
  {
    id: "pack-1",
    title: "Substantial 4-Bedroom Detached Family...",
    address: "14 Willow Crescent, London",
    price: 875000,
    displayPrice: "£875,000",
    status: "draft",
    country: "UK",
    beds: 4,
    baths: 3,
    sqft: 2450,
    propertyType: "Detached",
    image: null,
    createdAt: "2026-10-24T12:00:00Z",
  },
  {
    id: "pack-2",
    title: "Substantial 4-Bedroom Detached Family...",
    address: "14 Willow Crescent, London",
    price: 875000,
    displayPrice: "£875,000",
    status: "ready",
    country: "UK",
    beds: 4,
    baths: 3,
    sqft: 2450,
    propertyType: "Detached",
    image: "/landing/villa-dusk.jpg",
    createdAt: "2026-10-23T15:30:00Z",
  },
  {
    id: "pack-3",
    title: "Substantial 4-Bedroom Detached Family...",
    address: "14 Willow Crescent, London",
    price: 875000,
    displayPrice: "£875,000",
    status: "ready",
    country: "UK",
    beds: 4,
    baths: 3,
    sqft: 2450,
    propertyType: "Detached",
    image: "/landing/villa-dusk.jpg",
    createdAt: "2026-10-22T09:15:00Z",
  },
  {
    id: "pack-4",
    title: "16 Gorse Drive, Executive Family Home",
    address: "16 Gorse Drive, Chorlton, Manchester",
    price: 745000,
    displayPrice: "£745,000",
    status: "ready",
    country: "UK",
    beds: 4,
    baths: 2,
    sqft: 2150,
    propertyType: "Detached",
    image: "/landing/semi-detached-wilmslow.jpg",
    createdAt: "2026-10-21T14:20:00Z",
  },
  {
    id: "pack-5",
    title: "Modern Contemporary Townhouse",
    address: "8 Victoria Square, Manchester",
    price: 520000,
    displayPrice: "£520,000",
    status: "ready",
    country: "UK",
    beds: 3,
    baths: 2,
    sqft: 1850,
    propertyType: "Townhouse",
    image: "/landing/townhouse-dusk.jpg",
    createdAt: "2026-10-20T11:00:00Z",
  },
  {
    id: "pack-6",
    title: "Executive Country Residence & Gardens",
    address: "24 Meadow Lane, Wilmslow",
    price: 925000,
    displayPrice: "£925,000",
    status: "draft",
    country: "UK",
    beds: 5,
    baths: 4,
    sqft: 3100,
    propertyType: "Detached",
    image: null,
    createdAt: "2026-10-19T08:45:00Z",
  },
];

export default function SavedPacksPage() {
  const [packs, setPacks] = useState<SavedPack[]>(INITIAL_PACKS);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 3;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyLink = (packId: string) => {
    const url = `${window.location.origin}/agent-dashboard/editor?pack=${packId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(packId);
    showToast("Shareable link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const deletePack = (packId: string) => {
    setPacks((prev) => prev.filter((p) => p.id !== packId));
    showToast("Property pack removed.");
  };

  // Filtered and sorted list
  const filteredPacks = useMemo(() => {
    return packs
      .filter((pack) => {
        if (activeFilter === "ready") return pack.status === "ready";
        if (activeFilter === "draft") return pack.status === "draft";
        return true;
      })
      .filter((pack) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          pack.title.toLowerCase().includes(q) ||
          pack.address.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortOption === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortOption === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortOption === "price-high") {
          return b.price - a.price;
        }
        if (sortOption === "price-low") {
          return a.price - b.price;
        }
        return 0;
      });
  }, [packs, activeFilter, searchQuery, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredPacks.length / ITEMS_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const currentPacks = filteredPacks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const readyCount = packs.filter((p) => p.status === "ready").length;
  const draftCount = packs.filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#06143E] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#FFB800]" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TOP HEADER
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Saved Property Packs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Manage, edit, export and share all generated property assets
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Credits Badge */}
          <div className="h-10 px-4 rounded-xl border border-amber-200/80 bg-amber-50/60 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" />
            <span className="text-xs font-bold text-slate-800">
              14 Credits Left
            </span>
          </div>

          {/* New Property Pack Button */}
          <Link
            href="/agent-dashboard/create"
            className="h-10 px-5 rounded-xl bg-[#FFB800] hover:bg-[#E8A808] active:bg-[#D49800] text-[#06143E] font-heading font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
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
            className={`px-4 py-2 rounded-full font-heading text-xs transition cursor-pointer shrink-0 ${
              activeFilter === "all"
                ? "bg-[#06143E] text-white font-bold shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold"
            }`}
          >
            All ({packs.length})
          </button>

          <button
            onClick={() => {
              setActiveFilter("ready");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full font-heading text-xs transition cursor-pointer shrink-0 ${
              activeFilter === "ready"
                ? "bg-[#06143E] text-white font-bold shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold"
            }`}
          >
            Ready ({readyCount})
          </button>

          <button
            onClick={() => {
              setActiveFilter("draft");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full font-heading text-xs transition cursor-pointer shrink-0 ${
              activeFilter === "draft"
                ? "bg-[#06143E] text-white font-bold shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold"
            }`}
          >
            Drafts ({draftCount})
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
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="h-9 pl-3.5 pr-8 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:border-[#092167] transition appearance-none cursor-pointer"
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
      {currentPacks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <p className="font-heading font-bold text-slate-800 text-lg">
            No saved property packs found
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query or filter pills to see other saved packs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPacks.map((pack) => (
            <div
              key={pack.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
            >
              {/* Card Image / Visual Area */}
              <div className="relative aspect-[16/10] bg-slate-900 w-full overflow-hidden select-none">
                {pack.image ? (
                  <Image
                    src={pack.image}
                    alt={pack.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  /* Draft Placeholder Visual matching Figma Card 1 */
                  <div className="w-full h-full relative bg-[#1E293B] overflow-hidden flex flex-col justify-end">
                    {/* Architectural schematic grid background */}
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* Green ground lawn bar */}
                    <div className="w-full h-7 bg-[#1C4E2D] relative z-10 shrink-0" />
                  </div>
                )}

                {/* Top Left Badge: Status */}
                <div className="absolute top-3 left-3 z-20">
                  {pack.status === "ready" ? (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#10B981] text-white shadow-xs">
                      Ready
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FF9800] text-white shadow-xs">
                      Draft
                    </span>
                  )}
                </div>

                {/* Top Right Badge: Country / Region */}
                <div className="absolute top-3 right-3 z-20">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#06143E]/85 backdrop-blur-xs text-white">
                    {pack.country}
                  </span>
                </div>
              </div>

              {/* Card Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Property Title */}
                  <Link
                    href={`/agent-dashboard/editor?pack=${pack.id}`}
                    className="block font-heading font-bold text-base text-slate-900 tracking-tight hover:text-[#092167] transition line-clamp-1"
                    title={pack.title}
                  >
                    {pack.title}
                  </Link>

                  {/* Property Address */}
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {pack.address}
                  </p>

                  {/* Price */}
                  <p className="font-heading font-bold text-xl text-slate-900 mt-2.5">
                    {pack.displayPrice}
                  </p>

                  {/* Specs Pills */}
                  <div className="flex items-center flex-wrap gap-1.5 mt-3 select-none">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {pack.beds} Beds
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {pack.baths} Baths
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {pack.sqft} sq ft
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {pack.propertyType}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  {/* Edit Button */}
                  <Link
                    href={`/agent-dashboard/editor?pack=${pack.id}`}
                    className="h-9 px-5 rounded-lg bg-[#06143E] hover:bg-[#0A1F5C] active:bg-[#040D28] text-white font-heading font-bold text-xs flex items-center justify-center transition shadow-2xs"
                  >
                    Edit
                  </Link>

                  {/* Copy Link Button */}
                  <button
                    type="button"
                    onClick={() => copyLink(pack.id)}
                    className="h-9 w-9 rounded-lg border border-[#FFB800] bg-amber-50/20 hover:bg-amber-50 text-[#D49800] flex items-center justify-center transition cursor-pointer"
                    title="Copy share link"
                  >
                    {copiedId === pack.id ? (
                      <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                    ) : (
                      <Link2 className="w-4 h-4" />
                    )}
                  </button>

                  {/* External View Button */}
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `/agent-dashboard/editor?pack=${pack.id}`,
                        "_blank"
                      )
                    }
                    className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition cursor-pointer shadow-2xs"
                    title="Open live preview"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  {/* Download PDF Button */}
                  <button
                    type="button"
                    onClick={() =>
                      showToast(`Downloading Property Pack for ${pack.address}...`)
                    }
                    className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition cursor-pointer shadow-2xs"
                    title="Download brochure PDF"
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  {/* Delete Trash Button */}
                  <button
                    type="button"
                    onClick={() => deletePack(pack.id)}
                    className="ml-auto p-2 text-slate-400 hover:text-red-500 transition cursor-pointer"
                    title="Delete saved pack"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          BOTTOM FOOTER: COUNT & PAGINATION
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200/60 select-none">
        <p className="text-xs text-slate-500 font-medium">
          Showing {filteredPacks.length === 0 ? 0 : startIndex + 1} to{" "}
          {Math.min(startIndex + ITEMS_PER_PAGE, filteredPacks.length)} of{" "}
          {filteredPacks.length} saved packs
        </p>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-1.5 self-center sm:self-auto">
          {/* Previous Page */}
          <button
            type="button"
            disabled={validPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center text-xs transition cursor-pointer disabled:cursor-not-allowed shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Page 1 */}
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className={`w-8 h-8 rounded-lg font-heading text-xs transition cursor-pointer ${
              validPage === 1
                ? "bg-[#06143E] text-white font-bold shadow-xs"
                : "border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50"
            }`}
          >
            1
          </button>

          {/* Page 2 */}
          {totalPages >= 2 && (
            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              className={`w-8 h-8 rounded-lg font-heading text-xs transition cursor-pointer ${
                validPage === 2
                  ? "bg-[#06143E] text-white font-bold shadow-xs"
                  : "border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50"
              }`}
            >
              2
            </button>
          )}

          {/* Next Page */}
          <button
            type="button"
            disabled={validPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center text-xs transition cursor-pointer disabled:cursor-not-allowed shadow-2xs"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
