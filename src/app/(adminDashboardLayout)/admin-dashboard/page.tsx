import React from "react";
import Link from "next/link";
import {
  Users,
  Layers,
  Clock,
  TrendingUp,
  Shield,
  FileCheck,
  Search,
  MoreVertical,
  Plus,
} from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Registered Agencies", value: "148", change: "+12% this month", icon: Users, color: "text-blue-600 bg-blue-50" },
    { title: "Total Packs Generated", value: "4,280", change: "+24% vs last month", icon: Layers, color: "text-[#E8A808] bg-amber-50" },
    { title: "Avg Generation Speed", value: "11.4s", change: "Multimodal v2.4", icon: Clock, color: "text-emerald-600 bg-emerald-50" },
    { title: "Platform Health", value: "99.98%", change: "All systems nominal", icon: Shield, color: "text-purple-600 bg-purple-50" },
  ];

  const recentPacks = [
    { id: "PACK #110", property: "The Kensington Residences", agency: "Vance Prestige", agent: "Eleanor Vance", date: "Just now", status: "Ready PDF", price: "£3,550,000" },
    { id: "PACK #109", property: "Mayfair Sovereign Terrace", agency: "Knight Frank London", agent: "James Sterling", date: "12m ago", status: "Ready PDF", price: "£6,200,000" },
    { id: "PACK #108", property: "Chelsea Harbour Loft", agency: "Foxtons Prime", agent: "Sarah Jenkins", date: "38m ago", status: "Generating", price: "£1,850,000" },
    { id: "PACK #107", property: "Belgravia Garden Square", agency: "Savills Central", agent: "David Cole", date: "2h ago", status: "Ready PDF", price: "£4,750,000" },
    { id: "PACK #106", property: "Richmond Riverside Villa", agency: "Hamptons Premier", agent: "Liam Brooks", date: "4h ago", status: "Ready PDF", price: "£2,950,000" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Institutional Admin Console
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time overview of AI pack generations, agency licenses, and infrastructure throughput.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-10 px-4 rounded-lg bg-[#092167] hover:bg-[#06143E] text-white text-sm font-medium flex items-center gap-2 shadow-sm transition">
            <Plus className="w-4 h-4" />
            <span>Invite New Agency</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {s.title}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 mb-1">
                {s.value}
              </div>
              <p className="text-xs font-medium text-slate-500">{s.change}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Generations Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-bold text-lg text-slate-900">
              Live Property Marketing Packs
            </h2>
            <p className="text-xs text-slate-500">
              Recently generated valuation packs across all authorized agency workstations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filter: All Agencies</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3.5">Pack ID</th>
                <th className="px-6 py-3.5">Property Subject</th>
                <th className="px-6 py-3.5">Agency / Agent</th>
                <th className="px-6 py-3.5">Valuation</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {recentPacks.map((pack) => (
                <tr key={pack.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-[#092167]">
                    {pack.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {pack.property}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{pack.agency}</div>
                    <div className="text-xs text-slate-400">{pack.agent}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {pack.price}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        pack.status === "Ready PDF"
                          ? "bg-amber-50 text-[#B58306] border border-amber-200/60"
                          : "bg-blue-50 text-blue-700 animate-pulse"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {pack.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {pack.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
