"use client";

import React, { useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Lock, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { OnboardingStepProgress } from "@/components/onboarding/OnboardingStepProgress";
import { Badge } from "@/components/ui/Badge";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { useGetPlansQuery, useStartCheckoutMutation, type CheckoutResult } from "@/redux/api/billing/billingApi";
import { errorText } from "@/lib/auth/client";
import { formatMoney } from "@/lib/format";
import type { Address } from "@/types/models";
import toast from "react-hot-toast";

const inputClass =
  "w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15";

/** Stripe's card form. Rendered inside <Elements>, so the hooks have a client secret to work with. */
function StripePayForm({ amountLabel, billing }: { amountLabel: string; billing: Address }) {
  const stripe = useStripe();
  const elements = useElements();
  const submitting = useRef(false);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || submitting.current) return;
    submitting.current = true;
    setProcessing(true);
    setErrorMessage(null);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/onboarding/success` },
    });
    // confirmPayment only returns when it failed; on success the browser has been redirected.
    if (error) {
      setErrorMessage(error.message ?? "The payment could not be completed.");
      toast.error(error.message ?? "The payment could not be completed.");
      submitting.current = false;
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-5">
      <div aria-live="assertive" className="min-h-[10px]">
        {errorMessage && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-0.5">Payment not completed</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}
      </div>

      <PaymentElement
        options={{
          // We already collected the billing address; start Stripe's form from it instead of a guess from the visitor's IP.
          defaultValues: { billingDetails: { address: { country: billing.country ?? "GB", postal_code: billing.postcode ?? "" } } },
        }}
      />

      <div className="pt-2">
        <button
          type="submit"
          disabled={!stripe || !elements || processing}
          className="w-full h-12 sm:h-13 bg-[#0A2168] hover:bg-[#06143E] active:bg-[#040E2C] text-white font-sans font-semibold text-sm sm:text-base rounded-xl shadow-[0_4px_16px_rgba(10,33,104,0.3)] hover:shadow-[0_6px_22px_rgba(10,33,104,0.4)] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#E8A808]" />
              <span>Authorising {amountLabel} with Stripe...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-[#E8A808]" />
              <span>Complete Subscription • {amountLabel}</span>
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
  );
}

function PaymentFormContent() {
  const searchParams = useSearchParams();
  const planCode = searchParams.get("plan") || "";
  const paymentError = searchParams.get("error");

  const { data: plans, isLoading: plansLoading, isError: plansError, error: plansErr, refetch } = useGetPlansQuery();
  const [startCheckout, { isLoading: startingCheckout }] = useStartCheckoutMutation();
  const startedRef = useRef(false);

  const [country, setCountry] = useState("GB");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [checkout, setCheckout] = useState<CheckoutResult | null>(null);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  const plan = checkout?.plan ?? plans?.find((p) => p.code === planCode);
  const currency = plan?.currency?.toUpperCase();
  const amountLabel = formatMoney(plan?.pricePence, currency, { decimals: true });
  const interval = plan?.interval === "year" ? "year" : "month";

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (startedRef.current || checkout || !plan?.code) return;
    startedRef.current = true;
    setFormError(null);
    setFieldErrors({});
    const billingAddress: Address = { line1: addressLine1, town: city, postcode, country };
    try {
      const result = await startCheckout({ planCode: plan.code, billingAddress }).unwrap();
      if (!result.publishableKey) {
        startedRef.current = false;
        setFormError("Card payments are not available right now. Please try again later.");
        return;
      }
      setStripePromise(loadStripe(result.publishableKey));
      setCheckout(result);
    } catch (err) {
      startedRef.current = false;
      const info = apiErrorInfo(err);
      setFieldErrors(info.fields);
      setFormError(errorText(err));
      toast.error(errorText(err));
    }
  };

  const unknownPlan = !plansLoading && !plansError && !plan;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <OnboardingStepProgress currentStep={3} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Plan Summary */}
        <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-200/90">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-heading font-bold text-lg text-[#06143E]">Subscription Summary</h2>
              {!checkout && (
                <Link href="/onboarding/plan" className="text-xs font-semibold text-[#092167] hover:underline">
                  Change tier
                </Link>
              )}
            </div>

            {plansLoading ? (
              <div className="py-4 space-y-3 animate-pulse">
                <div className="h-6 w-40 bg-slate-200 rounded" />
                <div className="h-4 w-56 bg-slate-100 rounded" />
                <div className="h-4 w-48 bg-slate-100 rounded" />
              </div>
            ) : plansError ? (
              <ErrorState error={plansErr} onRetry={refetch} className="my-4" />
            ) : unknownPlan ? (
              <p className="py-4 text-sm text-slate-600">
                That plan does not exist. <Link href="/onboarding/plan" className="font-semibold text-[#092167] hover:underline">Choose a plan</Link>.
              </p>
            ) : plan ? (
              <>
                <div className="py-4 border-b border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-heading font-bold text-xl text-[#06143E]">{plan.name} Plan</span>
                    <Badge variant={plan.isPopular ? "brand" : "navy"} size="sm">
                      {interval === "year" ? "Annual" : "Monthly"}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
                      <span>
                        <strong>{plan.packAllowance}</strong> AI property packs / {interval}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
                      <span>
                        <strong>{plan.seatLimit}</strong> team member seats included
                      </span>
                    </div>
                  </div>
                </div>

                <div className="py-4 space-y-2.5 text-xs sm:text-sm border-b border-slate-100">
                  <div className="flex items-center justify-between text-sm sm:text-base font-heading font-bold text-[#06143E]">
                    <span>Total Due Today</span>
                    <span className="text-xl text-[#092167]">{amountLabel}</span>
                  </div>
                </div>

                <p className="mt-4 text-[11px] text-slate-400 leading-normal">
                  {amountLabel} billed {interval === "year" ? "annually" : "monthly"} (renews every {interval}). Cancel anytime from Settings &gt; Billing.
                </p>
              </>
            ) : null}
          </div>

          <div className="bg-[#091D4E] text-white rounded-3xl p-6 shadow-md border border-[#1E3B87] space-y-3">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-semibold text-xs sm:text-sm">Secure card payment</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Card details are entered into Stripe and never reach our servers.
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
                {checkout
                  ? "Enter your card details to activate your institutional agency workstation."
                  : "Confirm your billing address, then enter your card details."}
              </p>
            </div>

            {paymentError && !checkout && (
              <div role="alert" className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm mb-4">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            )}

            {checkout && stripePromise ? (
              <Elements stripe={stripePromise} options={{ clientSecret: checkout.clientSecret }}>
                <StripePayForm amountLabel={amountLabel} billing={{ line1: addressLine1, town: city, postcode, country }} />
              </Elements>
            ) : (
              <form onSubmit={handleContinue} className="space-y-5">
                <div aria-live="assertive" className="min-h-[10px]">
                  {formError && (
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm animate-in fade-in">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">Billing Address</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Country</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15"
                      >
                        <option value="GB">United Kingdom</option>
                        <option value="IE">Ireland</option>
                        <option value="JE">Jersey</option>
                        <option value="GG">Guernsey</option>
                        <option value="IM">Isle of Man</option>
                      </select>
                      {fieldErrors.country && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.country}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Address Line 1</label>
                      <input
                        type="text"
                        required
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="e.g. 45 Kensington High St"
                        className={inputClass}
                      />
                      {fieldErrors.line1 && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.line1}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Town / City</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="London"
                          className={inputClass}
                        />
                        {fieldErrors.town && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.town}</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Postcode</label>
                        <input
                          type="text"
                          required
                          value={postcode}
                          onChange={(e) => setPostcode(e.target.value)}
                          placeholder="W8 5SE"
                          className={`${inputClass} uppercase`}
                        />
                        {fieldErrors.postcode && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.postcode}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={startingCheckout || !plan?.code}
                    className="w-full h-12 sm:h-13 bg-[#0A2168] hover:bg-[#06143E] active:bg-[#040E2C] text-white font-sans font-semibold text-sm sm:text-base rounded-xl shadow-[0_4px_16px_rgba(10,33,104,0.3)] hover:shadow-[0_6px_22px_rgba(10,33,104,0.4)] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {startingCheckout ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-[#E8A808]" />
                        <span>Preparing secure payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#E8A808]" />
                        <span>Continue to card details</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
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
