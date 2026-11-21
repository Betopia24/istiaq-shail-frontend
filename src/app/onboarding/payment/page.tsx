"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { OnboardingStepProgress } from "@/components/onboarding/OnboardingStepProgress";
import { PaymentSuccessModal } from "@/components/onboarding/PaymentSuccessModal";
import { calculateOrderSummary } from "@/mocks/onboarding";
import { BillingCycle } from "@/types/onboarding";
import { Badge } from "@/components/ui/Badge";
import toast from "react-hot-toast";

type DemoMode = "success" | "3ds" | "declined";

function PaymentFormContent() {
  const searchParams = useSearchParams();

  const planIdParam = searchParams.get("plan") || "professional";
  const billingParam = (searchParams.get("billing") as BillingCycle) || "monthly";
  const emailParam = searchParams.get("email") || "eleanor@vanceprestige.com";

  const orderSummary = calculateOrderSummary(planIdParam, billingParam);
  const { plan, subtotal, vatAmount, totalDueToday, renewalDescription } =
    orderSummary;

  // Form State
  const [email, setEmail] = useState(emailParam);
  const [cardholderName, setCardholderName] = useState("Eleanor Vance");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("12 / 28");
  const [cvc, setCvc] = useState("892");
  const [addressLine1, setAddressLine1] = useState("45 High Street");
  const [city, setCity] = useState("London");
  const [postcode, setPostcode] = useState("W8 5SE");
  const [country, setCountry] = useState("United Kingdom");

  // State machine: idle | processing | authenticating_3ds | declined | success
  const [status, setStatus] = useState<
    "idle" | "processing" | "authenticating_3ds" | "declined" | "success"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState<DemoMode>("success");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatus("processing");

    if (demoMode === "declined") {
      setTimeout(() => {
        setStatus("declined");
        setErrorMessage(
          "Your card was declined by your bank (Insufficient Funds or Fraud Prevention Rule). Please try a different card or check your billing address.",
        );
        toast.error("Payment card declined");
      }, 1200);
      return;
    }

    if (demoMode === "3ds") {
      setTimeout(() => {
        setStatus("authenticating_3ds");
        // 3D Secure completes after 2 seconds
        setTimeout(() => {
          setStatus("success");
          setShowSuccessModal(true);
          toast.success("Bank 3-D Secure authentication successful!");
        }, 2200);
      }, 1000);
      return;
    }

    // Default success
    setTimeout(() => {
      setStatus("success");
      setShowSuccessModal(true);
      toast.success("Subscription activated successfully!");
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 3-Step Progress Bar */}
      <OnboardingStepProgress currentStep={3} />

      {/* 3-D Secure Modal Overlay */}
      {status === "authenticating_3ds" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="3ds-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06143E]/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl text-center border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#092167] mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 animate-pulse text-[#092167]" />
            </div>
            <h3
              id="3ds-title"
              className="font-heading font-bold text-xl sm:text-2xl text-[#06143E] mb-2"
            >
              Bank Authentication (3-D Secure)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              Verifying Strong Customer Authentication (SCA) with your card issuer. Please do not close or refresh this window.
            </p>
            <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <Loader2 className="w-4 h-4 animate-spin text-[#E8A808]" />
              <span>Contacting Barclays / Visa Secure Directory...</span>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        plan={plan}
        billingCycle={billingParam}
        totalPaid={totalDueToday}
        email={email}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Plan Summary */}
        <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-200/90">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-heading font-bold text-lg text-[#06143E]">
                Subscription Summary
              </h2>
              <Link
                href={`/onboarding/plan?plan=${plan.id}&billing=${billingParam}`}
                className="text-xs font-semibold text-[#092167] hover:underline"
              >
                Change tier
              </Link>
            </div>

            {/* Selected Plan Details */}
            <div className="py-4 border-b border-slate-100">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-heading font-bold text-xl text-[#06143E]">
                  {plan.name} Plan
                </span>
                <Badge variant={plan.isPopular ? "brand" : "navy"} size="sm">
                  {billingParam === "annual" ? "Annual" : "Monthly"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">{plan.tagline}</p>

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
                  <span>
                    <strong>{plan.packsPerMonth}</strong> AI property packs / month
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
                  <span>
                    <strong>{plan.seats}</strong> team member seats included
                  </span>
                </div>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="py-4 space-y-2.5 text-xs sm:text-sm border-b border-slate-100">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>UK VAT (20%)</span>
                <span>£{vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base font-heading font-bold text-[#06143E] pt-2 border-t border-slate-100">
                <span>Total Due Today</span>
                <span className="text-xl text-[#092167]">£{totalDueToday.toFixed(2)}</span>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-slate-400 leading-normal">
              {renewalDescription}. Cancel anytime from Settings &gt; Billing.
            </p>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-[#091D4E] text-white rounded-3xl p-6 shadow-md border border-[#1E3B87] space-y-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#E8A808] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-semibold text-xs sm:text-sm">
                  14-Day Money-Back Guarantee
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  If Property Pack AI does not speed up your property marketing, email us within 14 days for a full refund.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 pt-3 border-t border-white/10">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-semibold text-xs sm:text-sm">
                  PCI-DSS Level 1 Security
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Bank-grade encryption. Card numbers are tokenized and never stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Form */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-200/90">
            <div className="mb-6 pb-4 border-b border-slate-100">
              <h1 className="font-heading font-bold text-2xl sm:text-[28px] text-[#06143E] tracking-tight mb-1">
                Payment & Billing Details
              </h1>
              <p className="font-sans text-xs sm:text-sm text-slate-500">
                Complete your card details to activate your institutional agency workstation.
              </p>
            </div>

            {/* Error Banner */}
            <div aria-live="assertive" className="min-h-[10px] mb-4">
              {errorMessage && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold mb-0.5">Card Declined</strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Receipt */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Billing Email Receipt
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15"
                />
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15"
                />
              </div>

              {/* Labeled Stripe Elements Container */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#092167]" />
                    <span className="text-xs font-bold text-slate-700 tracking-tight">
                      Card Details
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                    Stripe Elements Placeholder
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white font-mono text-sm text-slate-900 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white font-mono text-sm text-slate-900 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="123"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white font-mono text-sm text-slate-900 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
                  Billing Address
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15"
                    >
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Ireland">Ireland</option>
                      <option value="Channel Islands">Channel Islands</option>
                      <option value="Isle of Man">Isle of Man</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="e.g. 45 Kensington High St"
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">
                        Town / City
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="London"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">
                        Postcode
                      </label>
                      <input
                        type="text"
                        required
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        placeholder="W8 5SE"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm uppercase text-slate-900 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Mode Selector (To review 3DS and Declined states effortlessly) */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
                <span className="font-bold block mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  Reviewer Demo Scenario Switch:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setDemoMode("success")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      demoMode === "success"
                        ? "bg-[#092167] text-white"
                        : "bg-white text-slate-700 border border-amber-300"
                    }`}
                  >
                    1. Success (Instant)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoMode("3ds")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      demoMode === "3ds"
                        ? "bg-[#092167] text-white"
                        : "bg-white text-slate-700 border border-amber-300"
                    }`}
                  >
                    2. 3-D Secure Challenge
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoMode("declined")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      demoMode === "declined"
                        ? "bg-rose-700 text-white"
                        : "bg-white text-slate-700 border border-amber-300"
                    }`}
                  >
                    3. Card Declined
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === "processing" || status === "authenticating_3ds"}
                  className="w-full h-12 sm:h-13 bg-[#0A2168] hover:bg-[#06143E] active:bg-[#040E2C] text-white font-sans font-semibold text-sm sm:text-base rounded-xl shadow-[0_4px_16px_rgba(10,33,104,0.3)] hover:shadow-[0_6px_22px_rgba(10,33,104,0.4)] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {status === "processing" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-[#E8A808]" />
                      <span>Authorising £{totalDueToday.toFixed(2)} with Stripe...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#E8A808]" />
                      <span>
                        Complete Subscription • £{totalDueToday.toFixed(2)}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-[11px] text-slate-400">
                  By clicking Complete Subscription you authorise recurring charges to your payment method until cancelled.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto bg-white rounded-3xl p-12 text-center text-slate-500 shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#092167] mx-auto mb-4" />
          <p className="text-sm">Loading secure payment portal...</p>
        </div>
      }
    >
      <PaymentFormContent />
    </Suspense>
  );
}
