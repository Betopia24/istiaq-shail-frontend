"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AgentProfileTab } from "@/components/settings/AgentProfileTab";
import { SubscriptionBillingTab } from "@/components/settings/SubscriptionBillingTab";
import { TeamMembersTab } from "@/components/settings/TeamMembersTab";
import { RegionalComplianceTab } from "@/components/settings/RegionalComplianceTab";
import { useGetSubscriptionQuery } from "@/redux/api/billing/billingApi";

type ActiveTab = "profile" | "billing" | "team" | "compliance";

function SettingsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as ActiveTab | null;
  const { data: subscription } = useGetSubscriptionQuery();

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (tabParam && ["profile", "billing", "team", "compliance"].includes(tabParam)) {
      return tabParam;
    }
    return "profile";
  });

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">
            {activeTab === "profile" && "Agent Profile & Preferences"}
            {activeTab === "billing" && "Subscription & Billing"}
            {activeTab === "team" && "Team Members & Permissions"}
            {activeTab === "compliance" && "Regional Compliance & CPR Disclaimers"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {activeTab === "profile" &&
              "Manage your agent bio, and security credentials."}
            {activeTab === "billing" &&
              "Manage your agency plan, payment methods, pack credits, and Stripe VAT invoices."}
            {activeTab === "team" &&
              "Manage your agency's negotiators, valuers, and administrators with role-based permissions."}
            {activeTab === "compliance" &&
              "Configure redress schemes (TPO/PRS), Client Money Protection, HMRC AML registration, and CPR footers."}
          </p>
        </div>

        {/* Top Right Badges */}
        <div className="flex items-center gap-4 self-start sm:self-auto">
          {subscription && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#E8A808] animate-pulse" />
              <span>{subscription.creditsRemaining ?? 0} Packs Remaining</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation Bar */}
      <div className="border-b border-slate-200 flex items-center gap-2 sm:gap-6 overflow-x-auto select-none">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3.5 text-xs sm:text-sm font-heading transition-all border-b-2 cursor-pointer shrink-0 ${
            activeTab === "profile"
              ? "border-[#E8A808] text-[#092167] font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          Agent Profile
        </button>

        <button
          onClick={() => setActiveTab("billing")}
          className={`pb-3.5 text-xs sm:text-sm font-heading transition-all border-b-2 cursor-pointer shrink-0 ${
            activeTab === "billing"
              ? "border-[#E8A808] text-[#092167] font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          Subscription &amp; Billing
        </button>

        <button
          onClick={() => setActiveTab("team")}
          className={`pb-3.5 text-xs sm:text-sm font-heading transition-all border-b-2 cursor-pointer shrink-0 ${
            activeTab === "team"
              ? "border-[#E8A808] text-[#092167] font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          Team Members
        </button>

        <button
          onClick={() => setActiveTab("compliance")}
          className={`pb-3.5 text-xs sm:text-sm font-heading transition-all border-b-2 cursor-pointer shrink-0 ${
            activeTab === "compliance"
              ? "border-[#E8A808] text-[#092167] font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          Regional Compliance
        </button>
      </div>

      {/* Tab Views */}
      {activeTab === "profile" && <AgentProfileTab />}
      {activeTab === "billing" && <SubscriptionBillingTab />}
      {activeTab === "team" && <TeamMembersTab onOpenBilling={() => setActiveTab("billing")} />}
      {activeTab === "compliance" && <RegionalComplianceTab />}
    </div>
  );
}

export default function SettingsBillingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500">
          <div className="w-6 h-6 border-2 border-[#092167] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">Loading agency settings...</p>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
