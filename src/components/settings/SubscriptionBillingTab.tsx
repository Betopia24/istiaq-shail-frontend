"use client";

import React, { useState } from "react";
import { Download, AlertTriangle, ArrowUpRight, Plus, Receipt, CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { BuyPacksModal } from "@/components/packs/BuyPacksModal";
import { CancelDowngradeModal } from "@/components/billing/CancelDowngradeModal";
import { UpdateCardDialog } from "@/components/billing/UpdateCardDialog";
import { PastDueBanner } from "@/components/billing/PastDueBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { TableSkeleton } from "@/components/ui/skeletons/TableSkeleton";
import { errorText } from "@/lib/auth/client";
import { formatDate, formatMoney } from "@/lib/format";
import { useAppSelector } from "@/redux/hook";
import {
  useGetInvoicesQuery,
  useGetPlansQuery,
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
} from "@/redux/api/billing/billingApi";

const STATE_LABEL: Record<string, string> = {
  incomplete: "INCOMPLETE",
  active: "ACTIVE",
  past_due: "PAST DUE",
  canceled: "CANCELLED",
  unpaid: "UNPAID",
};

const INPUT =
  "w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-[#092167]";

export const SubscriptionBillingTab: React.FC = () => {
  const role = useAppSelector((s) => s.user.user?.role);
  const isOwner = role === "owner";

  const [isBuyPacksOpen, setIsBuyPacksOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isUpdateCardOpen, setIsUpdateCardOpen] = useState(false);
  const [isPlanPickerOpen, setIsPlanPickerOpen] = useState(false);
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [billingForm, setBillingForm] = useState({
    billingEntity: "",
    vatId: "",
    line1: "",
    line2: "",
    town: "",
    postcode: "",
    country: "",
  });
  const [billingErrors, setBillingErrors] = useState<Record<string, string>>({});

  const sub = useGetSubscriptionQuery(undefined, { skip: !isOwner });
  const invoices = useGetInvoicesQuery(undefined, { skip: !isOwner || !sub.data });
  const plans = useGetPlansQuery(undefined, { skip: !isPlanPickerOpen });
  const [updateSubscription, { isLoading: isSaving }] = useUpdateSubscriptionMutation();

  if (!isOwner) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center shadow-2xs">
        <p className="text-sm font-medium text-slate-800">Billing is managed by the account owner</p>
        <p className="text-xs text-slate-500 mt-1">Ask your agency owner if you need a plan change or an invoice.</p>
      </div>
    );
  }

  if (sub.isLoading) return <TableSkeleton rows={4} columns={3} />;

  if (sub.error) {
    if (apiErrorInfo(sub.error).code === "no_subscription") {
      return (
        <EmptyState
          icon={CreditCard}
          title="No plan yet"
          description="Choose a plan to start generating property packs for your agency."
          primaryAction={{ label: "Choose a Plan", href: "/onboarding/plan" }}
        />
      );
    }
    return <ErrorState error={sub.error} onRetry={() => sub.refetch()} />;
  }

  const data = sub.data;
  if (!data) return null;

  const plan = data.plan;
  const currency = plan?.currency ?? "GBP";
  const credits = data.creditsRemaining ?? 0;
  const allowance = data.packsAllowance ?? plan?.packAllowance ?? 0;
  const pct = allowance > 0 ? Math.min(100, Math.round((credits / allowance) * 100)) : 0;
  const isPastDue = data.state === "past_due" || data.state === "unpaid";
  const pendingPlanCode = (data as { pendingPlanCode?: string | null }).pendingPlanCode;
  const addr = data.billingAddress;
  const addressText = [addr?.line1, addr?.line2, addr?.town, addr?.postcode, addr?.country].filter(Boolean).join(", ");

  const startEditBilling = () => {
    setBillingForm({
      billingEntity: data.billingEntity ?? "",
      vatId: data.vatId ?? "",
      line1: addr?.line1 ?? "",
      line2: addr?.line2 ?? "",
      town: addr?.town ?? "",
      postcode: addr?.postcode ?? "",
      country: addr?.country ?? "",
    });
    setBillingErrors({});
    setIsEditingBilling(true);
  };

  const saveBilling = async (e: React.FormEvent) => {
    e.preventDefault();
    setBillingErrors({});
    try {
      await updateSubscription({
        billingEntity: billingForm.billingEntity,
        vatId: billingForm.vatId,
        billingAddress: {
          line1: billingForm.line1,
          line2: billingForm.line2,
          town: billingForm.town,
          postcode: billingForm.postcode,
          country: billingForm.country,
        },
      }).unwrap();
      toast.success("Billing details saved");
      setIsEditingBilling(false);
    } catch (err) {
      const info = apiErrorInfo(err);
      if (info.status === 422) setBillingErrors(info.fields);
      toast.error(errorText(err));
    }
  };

  const changePlan = async (planCode: string) => {
    try {
      await updateSubscription({ planCode }).unwrap();
      toast.success("Plan change requested");
      setIsPlanPickerOpen(false);
    } catch (err) {
      toast.error(errorText(err));
    }
  };

  const fieldError = (k: string) =>
    billingErrors[k] ? <p className="text-[11px] text-rose-600 mt-1">{billingErrors[k]}</p> : null;

  return (
    <div className="space-y-6">
      {/* S13: Past-Due Banner */}
      {isPastDue && !bannerDismissed && (
        <PastDueBanner onDismiss={() => setBannerDismissed(true)} className="mb-6" />
      )}

      {/* Modals */}
      <BuyPacksModal
        isOpen={isBuyPacksOpen}
        onClose={() => setIsBuyPacksOpen(false)}
        onPurchased={() => sub.refetch()}
      />

      <CancelDowngradeModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        planName={plan?.name}
        periodEnd={data.periodEnd}
      />

      <UpdateCardDialog isOpen={isUpdateCardOpen} onClose={() => setIsUpdateCardOpen(false)} />

      {/* Main Billing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column: Active Subscription & Payment Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Active Subscription */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 space-y-6 shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-medium text-lg text-slate-900">
                  Active Subscription
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {plan?.name ? `Your agency is on the ${plan.name} plan, billed via Stripe.` : "Billed via Stripe."}
                </p>
              </div>

            </div>

            {/* Plan Container */}
            <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h4 className="font-heading font-medium text-base text-slate-900">
                    {plan?.name ?? "Plan"}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      data.state === "active"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-rose-100 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {STATE_LABEL[data.state ?? ""] ?? (data.state ?? "").toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {formatMoney(plan?.pricePence, currency)} / {plan?.interval ?? "month"}
                  {data.periodEnd &&
                    ` · ${data.cancelAtPeriodEnd ? "Ends on" : "Renews on"} ${formatDate(data.periodEnd)}`}
                </p>
                {pendingPlanCode && (
                  <p className="text-[11px] text-amber-700 font-medium">
                    Plan change to &quot;{pendingPlanCode}&quot; pending
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsBuyPacksOpen(true)}
                  className="h-9 px-4 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] font-heading font-medium text-xs shadow-2xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Top-up</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlanPickerOpen((v) => !v)}
                  className="h-9 px-3.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-medium text-xs transition cursor-pointer"
                >
                  Change Plan
                </button>
              </div>
            </div>

            {isPlanPickerOpen && (
              <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Choose a plan</p>
                {plans.isLoading && <p className="text-xs text-slate-500">Loading plans...</p>}
                {plans.error && <ErrorState error={plans.error} onRetry={() => plans.refetch()} />}
                {plans.data?.map((p) => {
                  const isCurrent = p.code === plan?.code;
                  return (
                    <div
                      key={p.code}
                      className="p-3 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{p.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {formatMoney(p.pricePence, p.currency ?? currency)} / {p.interval} · {p.packAllowance} packs ·{" "}
                          {p.seatLimit} seats
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={isCurrent || isSaving || !p.code}
                        onClick={() => p.code && changePlan(p.code)}
                        className="h-8 px-3 rounded-lg bg-[#092167] hover:bg-[#06143E] text-white text-xs font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      >
                        {isCurrent ? "Current" : "Switch"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pack Credits Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-600">Monthly Pack Allowance</span>
                <span className="text-slate-900 font-medium">
                  {credits} / {allowance} Packs
                  Remaining
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-[#E8A808] rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                  }}
                />
              </div>
            </div>

            {/* Low Credits Warning Banner */}
            {credits <= 15 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 flex items-center justify-between gap-2.5 text-xs text-amber-900 font-medium">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Low credits alert: You have {credits}{" "}
                    packs remaining this billing cycle.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBuyPacksOpen(true)}
                  className="text-xs font-semibold text-[#8C6605] underline hover:no-underline cursor-pointer shrink-0"
                >
                  Buy Top-up
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Payment Method & Tax Info */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 space-y-6 shadow-2xs">
            <div>
              <h3 className="font-heading font-medium text-lg text-slate-900">
                Payment Method &amp; Tax Info
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Primary card used for recurring automated billing and invoicing.
              </p>
            </div>

            {/* Credit Card Box */}
            <div className="rounded-xl border border-slate-200 p-4 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-7 rounded bg-[#06143E] text-white flex items-center justify-center font-medium text-[10px] tracking-wider shrink-0 uppercase">
                  {(data.cardBrand ?? "CARD").slice(0, 4)}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-900">
                    {data.cardLast4
                      ? `${data.cardBrand ?? "Card"} ending in ${data.cardLast4}`
                      : "No card on file"}
                  </p>
                  <p className="text-[11px] text-slate-500">Default Payment Method (Stripe)</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsUpdateCardOpen(true)}
                className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs transition cursor-pointer shadow-2xs"
              >
                Edit
              </button>
            </div>

            {/* Billing Entity & Registered Address */}
            <div className="pt-2 border-t border-slate-100 space-y-4 text-xs">
              {isEditingBilling ? (
                <form onSubmit={saveBilling} className="space-y-3">
                  <div>
                    <input
                      className={INPUT}
                      placeholder="Billing entity / company"
                      value={billingForm.billingEntity}
                      onChange={(e) => setBillingForm({ ...billingForm, billingEntity: e.target.value })}
                    />
                    {fieldError("billingEntity")}
                  </div>
                  <div>
                    <input
                      className={INPUT}
                      placeholder="VAT ID"
                      value={billingForm.vatId}
                      onChange={(e) => setBillingForm({ ...billingForm, vatId: e.target.value })}
                    />
                    {fieldError("vatId")}
                  </div>
                  {(["line1", "line2", "town", "postcode", "country"] as const).map((k) => (
                    <div key={k}>
                      <input
                        className={INPUT}
                        placeholder={{ line1: "Address line 1", line2: "Address line 2", town: "Town / city", postcode: "Postcode", country: "Country" }[k]}
                        value={billingForm[k]}
                        onChange={(e) => setBillingForm({ ...billingForm, [k]: e.target.value })}
                      />
                      {fieldError(`billingAddress.${k}`)}
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="h-9 px-4 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] font-medium text-xs cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                    >
                      {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Save Billing Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingBilling(false)}
                      className="h-9 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                      BILLING ENTITY &amp; COMPANY
                    </span>
                    <p className="font-medium text-slate-900 mt-1">{data.billingEntity || "Not set"}</p>
                    {data.vatId && <p className="text-slate-500 text-[11px]">VAT ID: {data.vatId}</p>}
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                      REGISTERED BILLING ADDRESS
                    </span>
                    <p className="text-slate-700 mt-1 leading-relaxed">{addressText || "Not set"}</p>
                  </div>
                </>
              )}

              {!isEditingBilling && (
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={startEditBilling}
                    className="h-9 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 font-medium text-xs transition cursor-pointer"
                  >
                    Update Billing Address
                  </button>

                  {!data.cancelAtPeriodEnd && (
                    <button
                      type="button"
                      onClick={() => setIsCancelOpen(true)}
                      className="text-xs text-rose-600 hover:text-rose-700 underline font-medium cursor-pointer"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Stripe Billing History & VAT Support */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Stripe Billing History */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
            <div>
              <h3 className="font-heading font-medium text-sm text-slate-900">
                Stripe Billing History
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Download official monthly VAT invoices &amp; receipts.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {invoices.isLoading && <TableSkeleton rows={3} columns={2} className="border-0 p-0" />}
              {invoices.error && <ErrorState error={invoices.error} onRetry={() => invoices.refetch()} />}
              {invoices.data && invoices.data.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-4 flex items-center justify-center gap-2">
                  <Receipt className="w-4 h-4" />
                  <span>No invoices yet</span>
                </p>
              )}
              {invoices.data?.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">{inv.description || inv.number}</p>
                    <p className="text-[11px] text-slate-500">
                      {formatDate(inv.date)} · {formatMoney(inv.amountPence, inv.currency ?? currency)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      {inv.state}
                    </span>
                    {inv.pdfUrl && (
                      <a
                        href={inv.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-7 px-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
                      >
                        <span>PDF</span>
                        <Download className="w-3 h-3 text-slate-500" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Need Custom VAT Receipts? */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-3 shadow-2xs">
            <h4 className="font-heading font-medium text-sm text-slate-900">
              Need Multi-Branch VAT Split?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              All Stripe receipts include full UK VAT (20%) breakdown. If your
              firm requires split cost centres across multiple regional branch
              offices, our billing team can assist.
            </p>
            <div className="pt-1">
              <a
                href="mailto:billing@propertypack.ai"
                className="text-xs font-medium text-[#092167] hover:text-[#E8A808] transition inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Contact Billing Team</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBillingTab;
