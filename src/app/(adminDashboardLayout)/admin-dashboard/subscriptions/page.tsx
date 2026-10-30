"use client";

import React, { useState } from "react";
import {
  Download,
  Receipt,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  X,
  CreditCard,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface BillingRecord {
  id: string;
  invoiceNumber: string;
  stripeId: string;
  agencyName: string;
  email: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  planTier: "Professional" | "Team Plan" | "Starter";
  planAmount: string;
  cycle: string;
  renewalInfo: string;
  isDeclined?: boolean;
  status: "PAID" | "PAST DUE";
}

const initialInvoices: BillingRecord[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-0012",
    stripeId: "in_1N4k...v2G",
    agencyName: "Prestige Estates UK",
    email: "admin@prestigeestates.co.uk",
    initials: "PE",
    avatarBg: "bg-[#06143E]",
    avatarText: "text-white",
    planTier: "Professional",
    planAmount: "£150/mo",
    cycle: "Monthly (£150/mo)",
    renewalInfo: "Renews 12 Nov 2026",
    status: "PAID",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-0105",
    stripeId: "in_1N4l...a3B",
    agencyName: "Didsbury Prime Group",
    email: "billing@didsburyprime.com",
    initials: "DP",
    avatarBg: "bg-slate-200",
    avatarText: "text-slate-800",
    planTier: "Team Plan",
    planAmount: "£350/mo",
    cycle: "Monthly (£350/mo)",
    renewalInfo: "Renews 10 Nov 2026",
    status: "PAID",
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2026-0092",
    stripeId: "in_1N4m...c9K",
    agencyName: "Harrison Residential",
    email: "accounts@harrison.co.uk",
    initials: "HR",
    avatarBg: "bg-slate-200",
    avatarText: "text-slate-800",
    planTier: "Starter",
    planAmount: "£75/mo",
    cycle: "Monthly (£75/mo)",
    renewalInfo: "Renews 05 Nov 2026",
    status: "PAID",
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-2026-0485",
    stripeId: "in_1N4Y...w32",
    agencyName: "Cheshire Elite Properties",
    email: "accounts@cheshireelite.co.uk",
    initials: "CE",
    avatarBg: "bg-rose-100",
    avatarText: "text-rose-700",
    planTier: "Professional",
    planAmount: "£150/mo",
    cycle: "Monthly (£150/mo)",
    renewalInfo: "Card Declined (3 retries left)",
    isDeclined: true,
    status: "PAST DUE",
  },
];

export default function SubscriptionsAndBillingPage() {
  const [invoices, setInvoices] = useState<BillingRecord[]>(initialInvoices);
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Professional" | "Team Plan" | "Starter Plan" | "Past Due"
  >("All");
  const [selectedReceipt, setSelectedReceipt] = useState<BillingRecord | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRetryStripe = (id: string, agency: string) => {
    setRetryingId(id);
    setTimeout(() => {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id
            ? {
                ...inv,
                status: "PAID",
                isDeclined: false,
                renewalInfo: "Renews 25 Nov 2026 (Manual Retry Succeeded)",
              }
            : inv
        )
      );
      setRetryingId(null);
      showToast(`Stripe payment retry succeeded for ${agency}!`);
    }, 1200);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["Invoice Number", "Stripe ID", "Agency", "Email", "Plan Tier", "Amount", "Status"],
        ...invoices.map((i) => [
          i.invoiceNumber,
          i.stripeId,
          i.agencyName,
          i.email,
          i.planTier,
          i.planAmount,
          i.status,
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `property_pack_stripe_billing_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Stripe billing CSV exported successfully");
  };

  const filteredInvoices = invoices.filter((item) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Professional") return item.planTier === "Professional";
    if (activeFilter === "Team Plan") return item.planTier === "Team Plan";
    if (activeFilter === "Starter Plan") return item.planTier === "Starter";
    if (activeFilter === "Past Due") return item.status === "PAST DUE";
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#06143E] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#E8A808]/40 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#E8A808]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header with Title and Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
              Demo data
            </span>
            <span className="text-xs text-slate-400">· Stripe Mock Invoices &amp; Webhook Events</span>
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Subscription History &amp; Stripe Billing Logs
          </h1>
        </div>

        <button
          onClick={handleExportCSV}
          className="h-10 px-4 rounded-lg bg-[#06143E] hover:bg-[#092167] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Billing CSV ↓</span>
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => setActiveFilter("All")}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
            activeFilter === "All"
              ? "bg-[#06143E] text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
          }`}
        >
          All (142)
        </button>

        <button
          onClick={() => setActiveFilter("Professional")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
            activeFilter === "Professional"
              ? "bg-[#06143E] text-white shadow-sm"
              : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#E8A808]" />
          <span>Professional (84)</span>
        </button>

        <button
          onClick={() => setActiveFilter("Team Plan")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
            activeFilter === "Team Plan"
              ? "bg-[#06143E] text-white shadow-sm"
              : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Team Plan (36)</span>
        </button>

        <button
          onClick={() => setActiveFilter("Starter Plan")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
            activeFilter === "Starter Plan"
              ? "bg-[#06143E] text-white shadow-sm"
              : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>Starter Plan (22)</span>
        </button>

        <button
          onClick={() => setActiveFilter("Past Due")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
            activeFilter === "Past Due"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50/50"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Past Due (3)</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Invoice &amp; Stripe ID</th>
                <th className="px-6 py-4">Agency / Subscriber</th>
                <th className="px-6 py-4">Plan Tier (Current)</th>
                <th className="px-6 py-4">Cycle / Renewal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No billing records found in this category.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Invoice & Stripe ID */}
                    <td className="px-6 py-4">
                      <div
                        className={`font-mono font-bold text-sm ${
                          inv.status === "PAST DUE" ? "text-rose-600" : "text-slate-900"
                        }`}
                      >
                        {inv.invoiceNumber}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {inv.stripeId}
                      </div>
                    </td>

                    {/* Agency / Subscriber */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${inv.avatarBg} ${inv.avatarText} font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200/60`}
                        >
                          {inv.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 leading-tight">
                            {inv.agencyName}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {inv.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Plan Tier */}
                    <td className="px-6 py-4">
                      {inv.planTier === "Professional" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#06143E] text-white">
                          <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
                          <span>Professional</span>
                        </span>
                      )}
                      {inv.planTier === "Team Plan" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                          Team Plan
                        </span>
                      )}
                      {inv.planTier === "Starter" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          Starter
                        </span>
                      )}
                    </td>

                    {/* Cycle / Renewal */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {inv.cycle}
                      </div>
                      <div
                        className={`text-xs mt-0.5 ${
                          inv.isDeclined ? "text-rose-600 font-semibold" : "text-slate-400"
                        }`}
                      >
                        {inv.renewalInfo}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {inv.status === "PAID" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                          PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/50">
                          PAST DUE
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {inv.status === "PAID" ? (
                        <button
                          onClick={() => setSelectedReceipt(inv)}
                          className="h-8 px-3 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white transition cursor-pointer"
                        >
                          View Receipt
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRetryStripe(inv.id, inv.agencyName)}
                          disabled={retryingId === inv.id}
                          className="h-8 px-3.5 rounded-lg bg-[#06143E] hover:bg-[#092167] text-xs font-semibold text-white transition flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          {retryingId === inv.id ? (
                            <>
                              <RotateCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Retrying...</span>
                            </>
                          ) : (
                            <span>Retry Stripe</span>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#06143E] text-[#E8A808] flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Stripe Payment Receipt
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedReceipt.invoiceNumber} • {selectedReceipt.stripeId}
                </p>
              </div>
            </div>

            <div className="space-y-4 my-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold text-slate-900">
                  {selectedReceipt.agencyName}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-800">
                  {selectedReceipt.email}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Plan Tier:</span>
                <span className="font-semibold text-slate-900">
                  {selectedReceipt.planTier} Subscription
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Billing Cycle:</span>
                <span className="font-semibold text-slate-900">
                  {selectedReceipt.cycle}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-900 font-bold">Total Paid:</span>
                <span className="font-heading font-semibold text-lg text-emerald-600">
                  {selectedReceipt.planAmount.replace("/mo", "")}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast("Invoice PDF download initiated");
                  setSelectedReceipt(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#06143E] hover:bg-[#092167] text-white text-sm font-semibold flex items-center gap-2 shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
