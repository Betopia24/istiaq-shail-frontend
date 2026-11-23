"use client";

import React, { useState } from "react";
import { useGetAdminOverviewQuery } from "@/redux/api/admin/adminApi";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatsSkeleton } from "@/components/ui/skeletons/StatsSkeleton";
import { formatMoney, formatDateTime } from "@/lib/format";

const money = (pence: number | null | undefined, currency?: string) =>
  formatMoney(pence, currency?.toUpperCase() || "GBP");

function compactMoney(pence: number, currency?: string) {
  const pounds = pence / 100;
  const symbol = (currency ?? "GBP").toUpperCase() === "USD" ? "$" : "£";
  if (pounds >= 1000) return `${symbol}${(pounds / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${symbol}${Math.round(pounds)}`;
}

function weekLabel(week?: string) {
  if (!week) return "";
  const d = new Date(`${week}T00:00:00`);
  return Number.isNaN(d.getTime()) ? week : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function monthLabel(month?: string) {
  if (!month) return "";
  const d = new Date(/^\d{4}-\d{2}$/.test(month) ? `${month}-01T00:00:00` : month);
  return Number.isNaN(d.getTime()) ? month : d.toLocaleDateString("en-GB", { month: "short" });
}

export default function PlatformOverviewPage() {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const { data, isLoading, isError, error, refetch, isFetching } = useGetAdminOverviewQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <StatsSkeleton count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
          <div className="h-80 bg-white rounded-3xl border border-slate-200" />
          <div className="h-80 bg-white rounded-3xl border border-slate-200" />
        </div>
      </div>
    );
  }
  if (isError || !data) return <ErrorState error={error} onRetry={refetch} />;

  const currency = data.currency;
  const health = data.health ?? {};
  const series = data.mrrSeries ?? [];
  const maxMrr = Math.max(1, ...series.map((m) => m.mrrPence ?? 0));
  const mrrData = series.map((m, i) => ({
    month: monthLabel(m.month),
    value: m.mrrPence ?? 0,
    x: series.length > 1 ? 40 + (i * 450) / (series.length - 1) : 265,
    y: 170 - ((m.mrrPence ?? 0) / maxMrr) * 160,
  }));
  const linePath = mrrData.map((d, i) => `${i === 0 ? "M" : "L"} ${d.x} ${d.y}`).join(" ");
  const areaPath = mrrData.length
    ? `${linePath} L ${mrrData[mrrData.length - 1].x} 170 L ${mrrData[0].x} 170 Z`
    : "";
  const yTicks = [1, 0.75, 0.5, 0.25].map((f) => Math.round(maxMrr * f));

  const weekly = data.weeklyPacks ?? [];
  const maxWeek = Math.max(1, ...weekly.map((w) => w.packs ?? 0));
  const weeklyPacks = weekly.map((w, i) => ({
    week: weekLabel(w.week),
    count: w.packs ?? 0,
    height: Math.max(2, ((w.packs ?? 0) / maxWeek) * 100),
    color: i === weekly.length - 1 ? "bg-[#06143E]" : i === weekly.length - 2 ? "bg-blue-600" : i === weekly.length - 3 ? "bg-blue-300" : "bg-slate-200",
  }));

  const activeAgencies = data.activeAgencies ?? 0;
  const totalAgencies = data.totalAgencies ?? 0;
  const activePct = totalAgencies > 0 ? Math.round((activeAgencies / totalAgencies) * 100) : 0;
  const packs = data.packsGenerated ?? 0;
  const lastMonthPacks = data.packsGeneratedLastMonth ?? 0;
  const momPct = lastMonthPacks > 0 ? Math.round(((packs - lastMonthPacks) / lastMonthPacks) * 100) : null;
  const aiCostPerPack = packs > 0 && data.aiCostThisMonthPence != null ? Math.round(data.aiCostThisMonthPence / packs) : null;
  const margin = data.grossMarginPct;

  return (
    <div className="space-y-6">
      {/* Super Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/70">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 uppercase tracking-wider">
              Live data
            </span>
            <span className="text-xs text-slate-500">
              · Updated {formatDateTime(data.generatedAt)}
            </span>
          </div>
          <h1 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">
            Platform Performance &amp; Revenue Analytics
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2 shadow-2xs">
            <span className={`w-2 h-2 rounded-full ${health.workerOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
            <span className="font-medium text-slate-700">Worker:</span>
            <span className="font-mono text-slate-500 text-[11px]">{health.workerOnline ? "Online" : "Offline"}</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 px-3 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 cursor-pointer"
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* KPI Cards (4 in a row with Container Queries & Lift Effects) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: MRR */}
        <div className="@container cq-card bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Monthly Recurring Revenue
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                {money(data.mrrPence, currency)}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>ARR Run-rate</span>
            <span className="font-semibold text-slate-800">{money(data.arrPence, currency)}</span>
          </div>
        </div>

        {/* Card 2: Active Agencies */}
        <div className="@container cq-card bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Total Active Agencies
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                {activeAgencies}
              </span>
              <span className="text-slate-400 font-medium text-xs sm:text-sm">
                / {totalAgencies} Agencies
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#06143E] rounded-full" style={{ width: `${activePct}%` }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>{activePct}% active</span>
              <span>{data.activeSeats ?? 0} active seats</span>
            </div>
          </div>
        </div>

        {/* Card 3: Packs Generated */}
        <div className="@container cq-card bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Packs Generated (This Month)
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                {packs}
              </span>
              {momPct !== null && (
                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold border ${momPct >= 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" : "bg-rose-50 text-rose-700 border-rose-200/60"}`}>
                  {momPct >= 0 ? "▲ +" : "▼ "}{momPct}% MoM
                </span>
              )}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Last month</span>
            <span className="font-semibold text-slate-800">{lastMonthPacks}</span>
          </div>
        </div>

        {/* Card 4: Gross SaaS Margin */}
        <div className="@container cq-card bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Gross SaaS Margin
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-heading font-bold text-xl sm:text-2xl text-emerald-600 tracking-tight">
                {margin == null ? "–" : `${margin}%`}
              </span>
              {aiCostPerPack !== null && (
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                  {money(aiCostPerPack, currency)} AI COST/PACK
                </span>
              )}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Revenue this month</span>
            <span className="font-semibold text-slate-800">{money(data.revenueThisMonthPence, currency)}</span>
          </div>
        </div>
      </div>

      {/* Two Main Visual Cards with Container Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: MRR Revenue Growth */}
        <div className="@container cq-panel bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-4">
            <div>
              <h2 className="font-heading font-medium text-lg sm:text-xl text-slate-900">
                Billed revenue (last 6 months)
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Paid invoices per month
              </p>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative mt-6 pt-4">
            {/* Tooltip */}
            {hoveredMonth !== null && mrrData[hoveredMonth] && (
              <div
                className="absolute z-10 px-2.5 py-1 rounded-lg bg-[#06143E] text-white text-xs font-medium shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-9 transition-all"
                style={{
                  left: `${(mrrData[hoveredMonth].x / 530) * 100}%`,
                  top: `${(mrrData[hoveredMonth].y / 180) * 100}%`,
                }}
              >
                {mrrData[hoveredMonth].month}: {money(mrrData[hoveredMonth].value, currency)}
              </div>
            )}

            {mrrData.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-16">No billed revenue yet.</p>
            )}
            <div className={`w-full h-56 relative flex ${mrrData.length === 0 ? "hidden" : ""}`}>
              {/* Y-axis labels */}
              <div className="flex flex-col justify-between text-[11px] font-medium text-slate-400 pr-3 pb-6 shrink-0 text-right select-none">
                {yTicks.map((t) => (
                  <span key={t}>{compactMoney(t, currency)}</span>
                ))}
                <span>£0</span>
              </div>

              {/* Chart SVG */}
              <div className="relative flex-1 h-full pb-6">
                <svg
                  viewBox="0 0 530 180"
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="mrrGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#E8A808"
                        stopOpacity="0.32"
                      />
                      <stop
                        offset="65%"
                        stopColor="#E8A808"
                        stopOpacity="0.08"
                      />
                      <stop offset="100%" stopColor="#E8A808" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line
                    x1="0"
                    y1="10"
                    x2="530"
                    y2="10"
                    stroke="#F1F5F9"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="0"
                    y1="50"
                    x2="530"
                    y2="50"
                    stroke="#F1F5F9"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="0"
                    y1="90"
                    x2="530"
                    y2="90"
                    stroke="#F1F5F9"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="0"
                    y1="130"
                    x2="530"
                    y2="130"
                    stroke="#F1F5F9"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="0"
                    y1="170"
                    x2="530"
                    y2="170"
                    stroke="#F1F5F9"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />

                  {/* Area fill under curve */}
                  <path
                    d={areaPath}
                    fill="url(#mrrGradient)"
                  />

                  {/* Stroke curve */}
                  <path
                    d={linePath}
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
                        r={index === mrrData.length - 1 ? 5 : 4}
                        fill={index === mrrData.length - 1 ? "#06143E" : "#E8A808"}
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
                <div className="absolute -bottom-2 left-0 right-0 flex justify-between text-[11px] font-medium text-slate-500 px-3">
                  {mrrData.map((d) => (
                    <span key={d.month}>{d.month}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Weekly Packs Generated with Container Queries & Micro-interactions */}
        <div className="@container cq-panel bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="font-heading font-medium text-lg sm:text-xl text-slate-900">
                Weekly Packs Generated
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                AI brochure output volume across agencies
              </p>
            </div>
            {/* Badges container: wraps on mobile so the percentage badge never clips */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            </div>
          </div>

          {weeklyPacks.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-16">No packs generated yet.</p>
          )}
          {/* Bar Chart Container */}
          <div className={`mt-8 pt-4 ${weeklyPacks.length === 0 ? "hidden" : ""}`}>
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
                    <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-[#06143E] text-white text-xs font-medium shadow-lg pointer-events-none whitespace-nowrap z-10 animate-in fade-in zoom-in-95 duration-150">
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
            <div className="flex justify-between px-2 sm:px-8 text-[12px] font-medium text-slate-500 pt-3">
              {weeklyPacks.map((item) => (
                <div
                  key={item.week}
                  className="flex-1 text-center group-hover:text-slate-900 transition-colors"
                >
                  {item.week}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Infrastructure / System Status Strip */}
      <div className="bg-[#EDF4FB] rounded-2xl border border-slate-200/80 px-4 sm:px-6 py-4 sm:py-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 text-[11px] text-slate-500">
          <span className="font-medium text-slate-700">
            Production Infrastructure &amp; Latency
          </span>
          {health.lastWorkerHeartbeatAt && (
            <span className="text-[10px] font-medium text-slate-500">
              Last worker heartbeat {formatDateTime(health.lastWorkerHeartbeatAt)}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm pt-1">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
              AI Engine Latency:{" "}
              <strong className="text-emerald-700 font-medium font-mono">
                {health.aiLatencyMs == null ? "–" : `${health.aiLatencyMs}ms`}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-700 font-medium sm:justify-center">
            <span className={`w-2 h-2 rounded-full shrink-0 ${health.workerOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
            <span>
              PDF Rendering Worker:{" "}
              <strong className={`font-medium font-mono ${health.workerOnline ? "text-emerald-700" : "text-rose-700"}`}>
                {health.workerOnline ? "Online" : "Offline"}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-700 font-medium sm:justify-end">
            <span className={`w-2 h-2 rounded-full shrink-0 ${(health.failedWebhooks ?? 0) > 0 ? "bg-rose-500" : "bg-emerald-500"}`} />
            <span>
              Failed Webhooks:{" "}
              <strong className={`font-medium font-mono ${(health.failedWebhooks ?? 0) > 0 ? "text-rose-700" : "text-emerald-700"}`}>
                {health.failedWebhooks ?? 0}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
              PDF Success (24h):{" "}
              <strong className="text-emerald-700 font-medium font-mono">
                {health.pdfSuccessPct24h == null ? "–" : `${health.pdfSuccessPct24h}%`}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-700 font-medium sm:justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
              Queue Depth:{" "}
              <strong className="text-emerald-700 font-medium font-mono">
                {health.queueDepth ?? 0}
                {(health.queueDepth ?? 0) > 0 ? ` (oldest ${health.oldestQueuedSeconds ?? 0}s)` : ""}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-700 font-medium sm:justify-end">
            <span className={`w-2 h-2 rounded-full shrink-0 ${(health.failedJobs24h ?? 0) > 0 ? "bg-rose-500" : "bg-emerald-500"}`} />
            <span>
              Failed Jobs (24h):{" "}
              <strong className={`font-medium font-mono ${(health.failedJobs24h ?? 0) > 0 ? "text-rose-700" : "text-emerald-700"}`}>
                {health.failedJobs24h ?? 0}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
