"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  ArrowRight,
  Plus,
  Pencil,
  Download,
  Check,
  X,
  CreditCard,
  Building2,
  Sparkles,
} from "lucide-react";

interface PropertyPack {
  id: string;
  address: string;
  specs: string;
  image: string;
  price: string;
  dateCreated: string;
  status: "Ready" | "Draft" | "Processing";
}

const initialPacksPage1: PropertyPack[] = [
  {
    id: "pack-1",
    address: "16 Gorse Drive, Manchester",
    specs: "4 Bed Detached Home • M21 8XQ",
    image: "/landing/villa-dusk.jpg",
    price: "£750,000",
    dateCreated: "05 Oct 2026",
    status: "Ready",
  },
  {
    id: "pack-2",
    address: "Flat 4, 82 Kensington High Street",
    specs: "2 Bed Luxury Apartment • W8 4SG",
    image: "/landing/townhouse-dusk.jpg",
    price: "£1,250,000",
    dateCreated: "03 Oct 2026",
    status: "Ready",
  },
  {
    id: "pack-3",
    address: "12 Meadow Croft, Wilmslow",
    specs: "5 Bed Semi-Detached • SK9 1AA",
    image: "/landing/semi-detached-wilmslow.jpg",
    price: "£895,000",
    dateCreated: "28 Sep 2026",
    status: "Ready",
  },
];

const initialPacksPage2: PropertyPack[] = [
  {
    id: "pack-4",
    address: "24 Parkside Avenue, Didsbury",
    specs: "3 Bed Edwardian Semi • M20 2TG",
    image: "/landing/townhouse-dusk.jpg",
    price: "£640,000",
    dateCreated: "24 Sep 2026",
    status: "Ready",
  },
  {
    id: "pack-5",
    address: "The Glasshouse, 9 Deansgate, Manchester",
    specs: "Penthouse Suite • M3 2EQ",
    image: "/landing/villa-dusk.jpg",
    price: "£1,450,000",
    dateCreated: "19 Sep 2026",
    status: "Ready",
  },
  {
    id: "pack-6",
    address: "Oaklands Cottage, Hale Barns",
    specs: "4 Bed Country Residence • WA15 0ST",
    image: "/landing/semi-detached-wilmslow.jpg",
    price: "£1,150,000",
    dateCreated: "14 Sep 2026",
    status: "Ready",
  },
];

export default function AgentDashboardPage() {
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showCreditDetails, setShowCreditDetails] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const packs = currentPage === 1 ? initialPacksPage1 : initialPacksPage2;

  const handleDownloadPdf = (address: string) => {
    setDownloadToast(`Generating PDF Report for ${address}...`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {downloadToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 bg-[#06143E] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs sm:text-sm font-medium">{downloadToast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          SECTION 1: AGENT OVERVIEW HEADER
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">
            Agent Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your property marketing collateral &amp; PDF reports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {/* Clarified Available Credits Pill with Animated Popover Breakdown */}
          <div className="relative">
            <button
              onClick={() => setShowCreditDetails(!showCreditDetails)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#8C6605] text-xs font-medium shadow-2xs hover:bg-[#FDE68A]/60 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              title="Click to view credits relationship breakdown"
            >
              <span className="w-2 h-2 rounded-full bg-[#E8A808] shrink-0 animate-pulse" />
              <span>78 Packs Available</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#E8A808]/25 text-[#715003] font-medium">
                64 Monthly + 14 Add-on
              </span>
            </button>

            {/* Credit Relationship Dropdown Tooltip with Motion */}
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
                    <span className="font-heading font-medium text-slate-900">
                      Available Credits Explained
                    </span>
                    <button
                      onClick={() => setShowCreditDetails(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2 py-2.5 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">
                        Monthly Plan (36/100 used):
                      </span>
                      <strong className="text-slate-900 font-medium">
                        64 remaining
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">
                        Purchased Add-On Packs:
                      </span>
                      <strong className="text-[#8C6605] font-medium">
                        +14 packs
                      </strong>
                    </div>
                    <div className="pt-1.5 border-t border-slate-100 flex justify-between items-center font-medium text-slate-900 text-xs">
                      <span>Total Ready to Generate:</span>
                      <span className="text-[#092167] font-medium text-sm">
                        78 packs
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Monthly plan resets on 1 Nov 2026. The 14 purchased add-on
                    packs never expire.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Buy Packs Button with Micro-Interaction */}
          <button
            onClick={() => setShowBuyModal(true)}
            className="h-10 px-5 rounded-xl bg-[#071330] hover:bg-[#0B1E48] active:bg-[#040C1E] active:scale-[0.98] text-white text-xs font-medium flex items-center justify-center transition-all shadow-sm cursor-pointer"
          >
            + Buy Packs
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: MARKET A NEW PROPERTY LISTING BANNER
      ========================================================================= */}
      <div className="@container cq-panel bg-[#07153B] rounded-3xl p-7 sm:p-9 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-md border border-[#162758]/50 relative overflow-hidden interactive-lift">
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-2">
          <h2 className="font-heading font-medium text-xl sm:text-2xl text-white tracking-tight">
            Market a New Property Listing
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Turn your property details into listing copy and marketing content
            in seconds.
          </p>
        </div>

        <Link
          href="/agent-dashboard/create"
          className="relative z-10 h-12 px-7 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-medium text-sm shadow-[0_2px_12px_rgba(232,168,8,0.35)] hover:shadow-[0_4px_18px_rgba(232,168,8,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Property Pack</span>
        </Link>
      </div>

      {/* =========================================================================
          SECTION 3: STATS CARDS (3 COLUMNS WITH CONTAINER QUERIES)
      ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Packs Created */}
        <div className="@container cq-card bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Total Packs Created
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#DCFCE7] text-[#15803D]">
              +6 this month
            </span>
          </div>
          <div className="mt-5">
            <span className="font-heading font-medium text-2xl sm:text-3xl text-slate-900 tracking-tight">
              42
            </span>
          </div>
        </div>

        {/* Card 2: Plan Pack Allocation & Available Credits Breakdown */}
        <div className="@container cq-card bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Plan &amp; Credits Allocation
            </span>
            <span className="text-[11px] text-[#8C6605] bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-0.5 rounded-full font-medium">
              36% Plan Quota Used
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-heading font-medium text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  78
                </span>
                <span className="text-xs font-medium text-slate-500 ml-1.5">
                  total packs ready to use
                </span>
              </div>
              <span className="text-xs font-mono font-medium text-slate-400">
                36 / 100 used
              </span>
            </div>

            {/* Progress Bar showing 36 / 100 used */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#06143E] rounded-full transition-all duration-500"
                style={{ width: "36%" }}
              />
            </div>

            {/* Breakdown with Container Query Adaptive Layout */}
            <div className="pt-2.5 border-t border-slate-100 flex flex-col @sm:flex-row @sm:items-center justify-between gap-2 text-[11px] text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#06143E]" />
                <span>
                  <strong>64</strong> monthly left (from 100)
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E8A808]" />
                <span>
                  <strong>14</strong> purchased add-ons
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Market Listings */}
        <div className="@container cq-card bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Active Market Listings
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
              <FileText className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-heading font-medium text-2xl sm:text-3xl text-slate-900 tracking-tight">
              12
            </span>
            <div className="flex items-center text-xs">
              <span className="font-medium text-slate-800">Live</span>
              <span className="text-emerald-500 text-[10px] mx-1.5">●</span>
              <span className="text-slate-400 font-normal">6 Drafts</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: RECENT PROPERTY MARKETING PACKS TABLE (CONTAINER QUERY & MICRO-INTERACTIONS)
      ========================================================================= */}
      <div className="@container cq-panel bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-6">
        {/* Card Header */}
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
            href="/agent-dashboard/packs"
            className="text-xs font-medium text-slate-900 hover:text-[#092167] flex items-center gap-1.5 transition-all hover:translate-x-0.5 self-start sm:self-auto group"
          >
            <span>View All (18)</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#E8A808]" />
          </Link>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full text-left min-w-[680px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6 sm:px-3 w-[42%]">
                  Property Address
                </th>
                <th className="py-3.5 px-3 w-[18%]">Listing Price</th>
                <th className="py-3.5 px-3 w-[16%]">Date Created</th>
                <th className="py-3.5 px-3 w-[12%]">Status</th>
                <th className="py-3.5 px-6 sm:px-3 w-[12%] text-right sm:text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {packs.map((pack) => (
                <tr
                  key={pack.id}
                  className="hover:bg-slate-50/80 transition-all duration-200 group"
                >
                  {/* Property Address + Thumbnail */}
                  <td className="py-4 px-6 sm:px-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-2xs group-hover:shadow-sm transition-shadow">
                        <Image
                          src={pack.image}
                          alt={pack.address}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-slate-900 truncate group-hover:text-[#092167] transition-colors">
                          {pack.address}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {pack.specs}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Listing Price */}
                  <td className="py-4 px-3">
                    <span className="font-medium text-sm text-slate-900">
                      {pack.price}
                    </span>
                  </td>

                  {/* Date Created */}
                  <td className="py-4 px-3">
                    <span className="text-xs text-slate-600">
                      {pack.dateCreated}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#DCFCE7] text-[#15803D]">
                      {pack.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 sm:px-3 text-right sm:text-left">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadPdf(pack.address)}
                        className="h-8 px-3.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 hover:scale-105 active:scale-95 text-slate-800 text-xs font-medium transition-all cursor-pointer shadow-2xs"
                      >
                        PDF Report
                      </button>
                      <Link
                        href="/agent-dashboard/editor"
                        title="Edit property details in Live Editor"
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg hover:scale-110 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>Showing 3 of 18 property listings</p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 rounded-lg font-medium text-xs flex items-center justify-center transition cursor-pointer ${
                currentPage === 1
                  ? "bg-[#071330] text-white shadow-2xs"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded-lg font-medium text-xs flex items-center justify-center transition cursor-pointer ${
                currentPage === 2
                  ? "bg-[#071330] text-white shadow-2xs"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              2
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: CREATE PROPERTY PACK
      ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E8A808]/15 text-[#E8A808] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#8C6605]" />
                </div>
                <h3 className="font-heading font-medium text-lg text-slate-900">
                  Create Property Marketing Pack
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowCreateModal(false);
                setDownloadToast("Property Pack generation started!");
                setTimeout(() => setDownloadToast(null), 3000);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Property Address or Postcode
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 16 Gorse Drive, Manchester, M21 8XQ"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#092167] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Listing Price (£)
                  </label>
                  <input
                    type="text"
                    placeholder="£750,000"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#092167] text-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Property Type
                  </label>
                  <select className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#092167] text-sm bg-white">
                    <option>Detached Home</option>
                    <option>Semi-Detached</option>
                    <option>Terraced</option>
                    <option>Luxury Apartment</option>
                    <option>Penthouse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Key Specs & Features
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. 4 bedrooms, 3 bathrooms, large south-facing garden, double garage..."
                  className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#092167] text-sm"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="h-10 px-4 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] font-medium cursor-pointer transition shadow-sm"
                >
                  Generate Pack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BUY PACKS
      ========================================================================= */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#071330] text-white flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-[#E8A808]" />
                </div>
                <h3 className="font-heading font-medium text-lg text-slate-900">
                  Buy Property Packs
                </h3>
              </div>
              <button
                onClick={() => setShowBuyModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between font-medium">
                <span>Current Monthly Remaining:</span>
                <span className="font-medium text-slate-800">
                  64 packs (36/100 used)
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Current Purchased Add-ons:</span>
                <span className="font-medium text-[#8C6605]">
                  14 packs remaining
                </span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                Purchased add-on credits never expire and roll over each billing
                cycle.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border-2 border-[#092167] bg-blue-50/30 flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-sm text-slate-900">
                    10 Packs Bundle
                  </p>
                  <p className="text-xs text-slate-500">£15 per pack</p>
                </div>
                <span className="font-heading font-medium text-base text-[#092167]">
                  £150
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-sm text-slate-900">
                    25 Packs Bundle
                  </p>
                  <p className="text-xs text-slate-500">
                    £12 per pack (Save 20%)
                  </p>
                </div>
                <span className="font-heading font-medium text-base text-slate-900">
                  £300
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBuyModal(false)}
                className="h-10 px-4 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBuyModal(false);
                  setDownloadToast("10 Packs added to your allocation!");
                  setTimeout(() => setDownloadToast(null), 3000);
                }}
                className="h-10 px-5 rounded-lg bg-[#071330] hover:bg-[#0B1E48] text-white text-xs font-medium cursor-pointer transition shadow-sm"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
