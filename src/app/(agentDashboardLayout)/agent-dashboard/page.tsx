import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Download,
  Share2,
  FileText,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
} from "lucide-react";

export default function AgentDashboardPage() {
  const packs = [
    {
      id: "PACK #110",
      title: "The Kensington Residences",
      location: "Penthouse Suite B, London W5",
      price: "£3,550,000",
      roi: "6.4% ROI",
      epc: "EPC Rating: A",
      size: "2,426 Sq Ft",
      time: "Generated 12s ago",
      image: "/auth-left-image.svg",
      status: "Ready PDF",
    },
    {
      id: "PACK #109",
      title: "Mayfair Sovereign Terrace",
      location: "14 Grosvenor Gardens, London W1K",
      price: "£6,200,000",
      roi: "5.8% ROI",
      epc: "EPC Rating: B",
      size: "3,890 Sq Ft",
      time: "Generated 2h ago",
      image: "/auth-left-image.svg",
      status: "Ready PDF",
    },
    {
      id: "PACK #108",
      title: "Chelsea Harbour River Suite",
      location: "Harbour Approach, London SW10",
      price: "£1,850,000",
      roi: "7.1% ROI",
      epc: "EPC Rating: A",
      size: "1,450 Sq Ft",
      time: "Generated yesterday",
      image: "/auth-left-image.svg",
      status: "Ready PDF",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Vance Prestige Institutional Workstation
            </span>
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Welcome back, Eleanor
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            You have generated 18 property packs this month. 14 instructions won.
          </p>
        </div>

        <button className="h-11 px-5 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white text-sm font-semibold flex items-center gap-2 shadow-[0_4px_12px_rgba(9,33,103,0.2)] transition">
          <Sparkles className="w-4 h-4 text-[#E8A808]" />
          <span>New AI Marketing Pack</span>
        </button>
      </div>

      {/* Quick Generator Input Card */}
      <div className="bg-gradient-to-r from-[#06143E] to-[#0A2168] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#E8A808]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#E8A808]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Pack Generator</span>
          </div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
            Generate a full valuation marketing pack in 12 seconds
          </h2>
          <p className="text-sm text-slate-300">
            Paste a Rightmove/Zoopla link, EPC reference, or type an address below to auto-pull RICS comps and draft brochure copy.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Penthouse Suite B, Kensington High St, London W5"
                defaultValue="Penthouse Suite B, London W5"
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:border-[#E8A808] focus:bg-white/15 text-sm"
              />
            </div>
            <button className="h-12 px-6 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md">
              <Sparkles className="w-4 h-4" />
              <span>Generate Pack</span>
            </button>
          </div>
        </div>
      </div>

      {/* Property Packs Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading font-bold text-xl text-slate-900">
              Active Property Marketing Packs
            </h2>
            <p className="text-xs text-slate-500">
              Generated packs ready for PDF download, vendor presentation, and multi-portal distribution.
            </p>
          </div>
          <button className="text-sm font-semibold text-[#092167] hover:underline">
            View All Packs ({packs.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              {/* Card Header & Preview */}
              <div>
                <div className="p-5 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#092167] bg-[#092167]/10 px-2.5 py-1 rounded-md">
                      {pack.id}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-[#B58306] border border-amber-200/60">
                      {pack.status}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 leading-tight group-hover:text-[#092167] transition">
                    {pack.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{pack.location}</span>
                  </p>
                </div>

                {/* Price & Stats Bar */}
                <div className="px-5 py-3 bg-slate-50/70 border-y border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Valuation</span>
                    <span className="font-bold text-sm text-slate-900">{pack.price}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Target ROI</span>
                    <span className="font-semibold text-emerald-600">{pack.roi}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Footage</span>
                    <span className="font-medium text-slate-700">{pack.size}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-4 space-y-2.5">
                <div className="grid grid-cols-3 gap-2">
                  <button className="h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition">
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                  <button className="h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Social</span>
                  </button>
                  <button className="h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>RICS Verified</span>
                  </span>
                  <span>{pack.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
