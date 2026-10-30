"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Activity,
  Server,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function PlatformOverviewPage() {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

  // 6 months MRR data
  const mrrData = [
    { month: "May", value: 12200, label: "£12.2k", x: 40, y: 155 },
    { month: "Jun", value: 14800, label: "£14.8k", x: 130, y: 140 },
    { month: "Jul", value: 16500, label: "£16.5k", x: 220, y: 125 },
    { month: "Aug", value: 19400, label: "£19.4k", x: 310, y: 95 },
    { month: "Sep", value: 22100, label: "£22.1k", x: 400, y: 65 },
    { month: "Oct '26", value: 24650, label: "£24,650", x: 490, y: 35 },
  ];

  // Weekly packs data
  const weeklyPacks = [
    { week: "W1", count: 420, height: 48, color: "bg-slate-200" },
    { week: "W2", count: 540, height: 62, color: "bg-slate-200" },
    { week: "W3", count: 670, height: 76, color: "bg-blue-300" },
    { week: "W4", count: 760, height: 86, color: "bg-blue-600" },
    { week: "Current", count: 820, height: 98, color: "bg-[#06143E]" },
  ];

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Super Admin Top Header with Demo / Live Telemetry Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
              DEMO DATA MODE ACTIVE
            </span>
            <span className="text-xs text-slate-500">
              · All metrics use sample agency data until live webhooks are connected
            </span>
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Platform Performance &amp; Revenue Analytics
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold text-slate-700">Telemetry Status:</span>
            <span className="font-mono text-slate-500 text-[11px]">Demo Sandbox</span>
          </div>
        </div>
      </div>

      {/* KPI Cards (4 in a row with Container Queries & Lift Effects) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: MRR */}
        <div className="@container cq-card bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Monthly Recurring Revenue
            </span>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
              Demo data
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-heading font-semibold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              £24,650
            </span>
            <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              ▲ +12.4%
            </span>
          </div>
        </div>

        {/* Card 2: Active Agencies */}
        <div className="@container cq-card bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Active Agencies
            </span>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
              Demo data
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-semibold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              142
            </span>
            <span className="text-slate-400 font-medium text-sm sm:text-base">
              / 200 Agencies
            </span>
          </div>
        </div>

        {/* Card 3: Packs Generated */}
        <div className="@container cq-card bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Packs Generated (Oct)
            </span>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
              Demo data
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-heading font-semibold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              820
            </span>
            <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              ▲ +18% MoM
            </span>
          </div>
        </div>

        {/* Card 4: Gross SaaS Margin */}
        <div className="@container cq-card bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Gross SaaS Margin
            </span>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
              Demo data
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-heading font-semibold text-2xl sm:text-3xl text-emerald-600 tracking-tight">
              88.2%
            </span>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
              £0.42 API/PACK
            </span>
          </div>
        </div>
      </div>

      {/* Two Main Visual Cards with Container Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: MRR Revenue Growth */}
        <div className="@container cq-panel bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-4">
            <div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                MRR Revenue Growth (Last 6 Months)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Stripe verified recurring subscription trajectory
              </p>
            </div>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
              Demo data
            </span>
          </div>

          {/* SVG Line Chart */}
          <div className="relative mt-6 pt-4">
            {/* Tooltip */}
            {hoveredMonth !== null && (
              <div
                className="absolute z-10 px-2.5 py-1 rounded-lg bg-[#06143E] text-white text-xs font-bold shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-9 transition-all"
                style={{
                  left: `${(mrrData[hoveredMonth].x / 530) * 100}%`,
                  top: `${(mrrData[hoveredMonth].y / 180) * 100}%`,
                }}
              >
                {mrrData[hoveredMonth].month}: £{mrrData[hoveredMonth].value.toLocaleString()}
              </div>
            )}

            <div className="w-full h-56 relative flex">
              {/* Y-axis labels */}
              <div className="flex flex-col justify-between text-[11px] font-medium text-slate-400 pr-3 pb-6 shrink-0 text-right select-none">
                <span>£25k</span>
                <span>£20k</span>
                <span>£15k</span>
                <span>£10k</span>
                <span>£5k</span>
              </div>

              {/* Chart SVG */}
              <div className="relative flex-1 h-full pb-6">
                <svg
                  viewBox="0 0 530 180"
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E8A808" stopOpacity="0.32" />
                      <stop offset="65%" stopColor="#E8A808" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#E8A808" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="0" y1="10" x2="530" y2="10" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="530" y2="50" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="90" x2="530" y2="90" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="130" x2="530" y2="130" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="170" x2="530" y2="170" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Area fill under curve */}
                  <path
                    d="M 40 155 Q 110 145 130 140 T 220 125 T 310 95 T 400 65 T 490 35 L 490 170 L 40 170 Z"
                    fill="url(#mrrGradient)"
                  />

                  {/* Stroke curve */}
                  <path
                    d="M 40 155 Q 110 145 130 140 T 220 125 T 310 95 T 400 65 T 490 35"
                    fill="none"
                    stroke="#E8A808"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Data points */}
                  {mrrData.map((d, index) => (
                    <g key={d.month}>
                      <circle
                        cx={d.x}
                        cy={d.y}
                        r={index === 5 ? 5 : 4}
                        fill={index === 5 ? "#06143E" : "#E8A808"}
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        className="cursor-pointer hover:r-6 transition-all"
                        onMouseEnter={() => setHoveredMonth(index)}
                        onMouseLeave={() => setHoveredMonth(null)}
                      />
                    </g>
                  ))}
                </svg>

                {/* X-axis labels */}
                <div className="absolute -bottom-2 left-0 right-0 flex justify-between text-[11px] font-semibold text-slate-500 px-3">
                  {mrrData.map((d) => (
                    <span key={d.month}>{d.month}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Weekly Packs Generated with Container Queries & Micro-interactions */}
        <div className="@container cq-panel bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                Weekly Packs Generated
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                AI brochure output volume across agencies
              </p>
            </div>
            {/* Badges container: wraps on mobile so the percentage badge never clips */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                Demo data
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 whitespace-nowrap shadow-2xs">
                ▲ +24% highest week
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="mt-8 pt-4">
            <div className="flex items-end justify-between gap-3 sm:gap-6 h-52 px-2 sm:px-8 border-b border-slate-200 pb-2">
              {weeklyPacks.map((item, index) => (
                <div
                  key={item.week}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative"
                  onMouseEnter={() => setHoveredWeek(index)}
                  onMouseLeave={() => setHoveredWeek(null)}
                >
                  {/* Tooltip */}
                  {hoveredWeek === index && (
                    <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-[#06143E] text-white text-xs font-bold shadow-lg pointer-events-none whitespace-nowrap z-10 animate-in fade-in zoom-in-95 duration-150">
                      {item.count} packs
                    </div>
                  )}

                  {/* Bar */}
                  <div className="w-full max-w-[58px] bg-slate-100 rounded-t-xl h-44 flex items-end overflow-hidden p-0.5">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-300 group-hover:scale-y-[1.03] group-hover:brightness-110 origin-bottom ${item.color}`}
                      style={{ height: `${item.height}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between px-2 sm:px-8 text-[12px] font-semibold text-slate-500 pt-3">
              {weeklyPacks.map((item) => (
                <div key={item.week} className="flex-1 text-center group-hover:text-slate-900 transition-colors">
                  {item.week}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Infrastructure / System Status Strip with Explicit Demo Telemetry Label */}
      <div className="bg-[#EDF4FB] rounded-2xl border border-slate-200/80 px-4 sm:px-6 py-4 sm:py-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">Production Infrastructure &amp; Latency</span>
          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
            Demo data telemetry
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm pt-1">
          {/* Item 1 */}
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>
              Claude 3.5 Sonnet Latency:{" "}
              <strong className="text-emerald-700 font-bold font-mono">
                420ms (Optimal)
              </strong>
            </span>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-2 text-slate-700 font-medium sm:justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
              PDF Rendering Worker:{" "}
              <strong className="text-emerald-700 font-bold font-mono">
                99.98% Uptime
              </strong>
            </span>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-2 text-slate-700 font-medium sm:justify-end">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
              Failed Webhooks (24h):{" "}
              <strong className="text-emerald-700 font-bold font-mono">0</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
