"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const packs = currentPage === 1 ? initialPacksPage1 : initialPacksPage2;

  const handleDownloadPdf = (address: string) => {
    setDownloadToast(`Generating PDF Report for ${address}...`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3500);
  };

  return (
    <div className="mx-auto space-y-6 pb-12">
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#06143E] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs sm:text-sm font-medium">{downloadToast}</p>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: AGENT OVERVIEW HEADER
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Agent Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your property marketing collateral & PDF reports
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Yellow Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#8C6605] text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#E8A808] shrink-0" />
            <span>14 Packs Remaining</span>
          </div>

          {/* Buy Packs Button */}
          <button
            onClick={() => setShowBuyModal(true)}
            className="h-9 px-4 rounded-lg bg-[#071330] hover:bg-[#0B1E48] active:bg-[#040C1E] text-white text-xs font-semibold flex items-center justify-center transition shadow-sm cursor-pointer"
          >
            + Buy Packs
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: MARKET A NEW PROPERTY LISTING BANNER
      ========================================================================= */}
      <div className="bg-[#07153B] rounded-2xl p-6 sm:p-7 md:p-8 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-md border border-[#162758]/50 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-2">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight">
            Market a New Property Listing
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Transform property specs into compliant listing copy and high-res print brochures in seconds.
          </p>
        </div>

        <Link
          href="/agent-dashboard/create"
          className="relative z-10 h-11 px-6 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-sm shadow-[0_2px_12px_rgba(232,168,8,0.35)] transition flex items-center justify-center gap-2 shrink-0 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Property Pack</span>
        </Link>
      </div>

      {/* =========================================================================
          SECTION 3: STATS CARDS (3 COLUMNS)
      ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Packs Created */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Total Packs Created
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D]">
              +6 this month
            </span>
          </div>
          <div className="mt-4">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              42
            </span>
          </div>
        </div>

        {/* Card 2: Plan Pack Allocation */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Plan Pack Allocation
            </span>
            <span className="text-xs text-slate-400 font-medium">
              72% used
            </span>
          </div>
          <div className="mt-3 space-y-2.5">
            <div className="flex items-baseline">
              <span className="font-heading font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                36
              </span>
              <span className="text-sm font-normal text-slate-400 ml-1.5">
                / 50
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#07153B] rounded-full transition-all duration-500"
                style={{ width: "72%" }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Active Market Listings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Active Market Listings
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
              <FileText className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              12
            </span>
            <div className="flex items-center text-xs">
              <span className="font-semibold text-slate-800">Live</span>
              <span className="text-emerald-500 text-[10px] mx-1.5">●</span>
              <span className="text-slate-400 font-normal">6 Drafts</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: RECENT PROPERTY MARKETING PACKS TABLE
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-5">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
              Recent Property Marketing Packs
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Access and download your newly compiled agency listing materials
            </p>
          </div>
          <Link
            href="/agent-dashboard/packs"
            className="text-xs font-semibold text-slate-900 hover:text-[#092167] flex items-center gap-1.5 transition self-start sm:self-auto group"
          >
            <span>View All (18)</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-left min-w-[680px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5 sm:px-2 w-[42%]">Property Address</th>
                <th className="py-3 px-3 w-[18%]">Listing Price</th>
                <th className="py-3 px-3 w-[16%]">Date Created</th>
                <th className="py-3 px-3 w-[12%]">Status</th>
                <th className="py-3 px-5 sm:px-2 w-[12%] text-right sm:text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {packs.map((pack) => (
                <tr
                  key={pack.id}
                  className="hover:bg-slate-50/60 transition group"
                >
                  {/* Property Address + Thumbnail */}
                  <td className="py-4 px-5 sm:px-2">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-100 shadow-2xs">
                        <Image
                          src={pack.image}
                          alt={pack.address}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-900 truncate group-hover:text-[#092167] transition">
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
                    <span className="font-semibold text-sm text-slate-900">
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
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#DCFCE7] text-[#15803D]">
                      {pack.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 sm:px-2 text-right sm:text-left">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadPdf(pack.address)}
                        className="h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-semibold transition cursor-pointer shadow-2xs"
                      >
                        PDF Report
                      </button>
                      <Link
                        href="/agent-dashboard/editor"
                        title="Edit property details in Live Editor"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer inline-flex items-center justify-center"
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
              className={`w-7 h-7 rounded-md font-semibold text-xs flex items-center justify-center transition cursor-pointer ${
                currentPage === 1
                  ? "bg-[#071330] text-white shadow-2xs"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded-md font-semibold text-xs flex items-center justify-center transition cursor-pointer ${
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
                <h3 className="font-heading font-bold text-lg text-slate-900">
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
                <label className="block font-semibold text-slate-700 mb-1">
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
                  <label className="block font-semibold text-slate-700 mb-1">
                    Listing Price (£)
                  </label>
                  <input
                    type="text"
                    placeholder="£750,000"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#092167] text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
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
                <label className="block font-semibold text-slate-700 mb-1">
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
                  className="h-10 px-4 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] font-bold cursor-pointer transition shadow-sm"
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
                <h3 className="font-heading font-bold text-lg text-slate-900">
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

            <p className="text-xs text-slate-500">
              Top up your balance with additional AI property marketing pack credits.
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border-2 border-[#092167] bg-blue-50/30 flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-bold text-sm text-slate-900">10 Packs Bundle</p>
                  <p className="text-xs text-slate-500">£15 per pack</p>
                </div>
                <span className="font-heading font-bold text-base text-[#092167]">£150</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-bold text-sm text-slate-900">25 Packs Bundle</p>
                  <p className="text-xs text-slate-500">£12 per pack (Save 20%)</p>
                </div>
                <span className="font-heading font-bold text-base text-slate-900">£300</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBuyModal(false)}
                className="h-10 px-4 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
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
                className="h-10 px-5 rounded-lg bg-[#071330] hover:bg-[#0B1E48] text-white text-xs font-semibold cursor-pointer transition shadow-sm"
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
