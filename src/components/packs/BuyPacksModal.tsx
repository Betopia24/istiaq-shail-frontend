"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  X,
  CreditCard,
  Check,
  CheckCircle2,
  Sparkles,
  Loader2,
  ShieldCheck,
  Lock,
} from "lucide-react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import billingApi from "@/redux/api/billing/billingApi";
import baseApi from "@/redux/api/baseApi";
import type { RootState } from "@/redux/store";
import { useAppDispatch } from "@/redux/hook";
import {
  useGetBundlesQuery,
  useGetCreditsQuery,
  useTopUpMutation,
} from "@/redux/api/billing/billingApi";
import { apiErrorInfo } from "@/components/ui/ErrorState";
import { errorText } from "@/lib/auth/client";
import { formatMoney } from "@/lib/format";

interface BuyPacksModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called once Stripe has confirmed the payment. Credits land a moment later (webhook); the balance is refreshed for you. */
  onPurchased?: () => void;
}

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = () => {
  if (!PUBLISHABLE_KEY) return null;
  stripePromise ??= loadStripe(PUBLISHABLE_KEY);
  return stripePromise;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Card form inside <Elements>. Card details go to Stripe only. */
function PaymentStep({
  amountPence,
  packs,
  onPaid,
  onBack,
}: {
  amountPence: number;
  packs: number;
  onPaid: () => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const pay = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    setMessage(null);
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (result.error) {
      setMessage(result.error.message ?? "The payment could not be completed.");
      setPaying(false);
      return;
    }
    const status = result.paymentIntent?.status;
    if (status === "succeeded" || status === "processing") {
      onPaid();
    } else {
      setMessage("The payment was not completed. Please try again.");
      setPaying(false);
    }
  };

  return (
    <form onSubmit={pay} className="space-y-4">
      <PaymentElement options={{ defaultValues: { billingDetails: { address: { country: "GB" } } } }} />
      {message && (
        <p role="alert" className="text-xs text-rose-600">
          {message}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          disabled={paying}
          className="h-11 sm:h-12 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 cursor-pointer disabled:opacity-60"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || !elements || paying}
          className="flex-1 h-11 sm:h-12 bg-[#092167] hover:bg-[#06143E] active:bg-[#040E2C] text-white font-sans font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {paying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#E8A808]" />
              <span>
                Processing {formatMoney(amountPence, "GBP", { decimals: true })}
                ...
              </span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-[#E8A808]" />
              <span>
                Pay {formatMoney(amountPence, "GBP", { decimals: true })} for{" "}
                {packs} {packs === 1 ? "Pack" : "Packs"}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

const BuyPacksModalInner: React.FC<BuyPacksModalProps> = ({
  isOpen,
  onClose,
  onPurchased,
}) => {
  const dispatch = useAppDispatch();
  const role = useSelector((state: RootState) => state.user?.user?.role);
  const isOwner = role === "owner";

  const bundlesQuery = useGetBundlesQuery(undefined, { skip: !isOpen });
  const creditsQuery = useGetCreditsQuery(undefined, { skip: !isOpen });
  const [topUp, topUpState] = useTopUpMutation();

  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [stage, setStage] = useState<"select" | "pay" | "done">("select");
  const [intent, setIntent] = useState<{
    clientSecret: string;
    amountPence: number;
    packs: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creditsArrived, setCreditsArrived] = useState(false);
  const balanceBefore = useRef<number | null>(null);

  const bundles = bundlesQuery.data ?? [];
  const credits = creditsQuery.data;
  // Default to the best-value bundle (the largest) once they have loaded.
  const selected =
    bundles.find((b) => b.code === selectedCode) ?? bundles[bundles.length - 1] ?? null;
  const stripeConfigured = !!PUBLISHABLE_KEY;
  const processing = topUpState.isLoading;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !processing) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, processing]);

  const elementsOptions = useMemo(
    () =>
      intent
        ? {
            clientSecret: intent.clientSecret,
            appearance: { theme: "stripe" as const },
          }
        : undefined,
    [intent],
  );

  const total = selected?.pricePence ?? null;

  const startPayment = async () => {
    if (!selected) return;
    setError(null);
    try {
      balanceBefore.current = credits?.total ?? null;
      const result = await topUp({ bundleCode: selected.code ?? "" }).unwrap();
      setIntent(result);
      setStage("pay");
    } catch (err) {
      const { status } = apiErrorInfo(err);
      if (status === 403) {
        setError("Only the agency owner can buy packs.");
      } else {
        setError(errorText(err));
      }
    }
  };

  // Stripe has confirmed. Credits are added by the webhook a moment later, so poll the balance for a short while.
  const handlePaid = async () => {
    setStage("done");
    toast.success(
      `Payment received for ${intent?.packs ?? selected?.packs ?? 0} pack${(intent?.packs ?? selected?.packs) === 1 ? "" : "s"}.`,
    );
    onPurchased?.();
    for (let attempt = 0; attempt < 10; attempt++) {
      await sleep(2000);
      try {
        const request = dispatch(
          billingApi.endpoints.getCredits.initiate(undefined, {
            forceRefetch: true,
          }),
        );
        const latest = await request
          .unwrap()
          .finally(() => request.unsubscribe());
        if (
          balanceBefore.current == null ||
          (latest.total ?? 0) > balanceBefore.current
        ) {
          setCreditsArrived(true);
          break;
        }
      } catch {
        // keep trying; the next attempt or the next page load will show the balance
      }
    }
    dispatch(baseApi.util.invalidateTags(["Subscription", "Pack"]));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="buy-packs-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06143E]/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/90 space-y-6 relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#092167] text-[#E8A808] flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="buy-packs-title"
                className="font-heading font-semibold text-lg sm:text-xl text-slate-900"
              >
                Buy Property Packs
              </h2>
              <p className="text-xs text-slate-500">
                Pay as you go. Packs you buy never expire.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isOwner ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            Only the agency owner can buy packs. Ask your owner to top up the
            balance.
          </div>
        ) : bundlesQuery.isLoading || creditsQuery.isLoading ? (
          <div className="py-10 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading pack options...</span>
          </div>
        ) : bundlesQuery.isError || creditsQuery.isError || !credits || !selected ? (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2"
          >
            <p>{errorText(bundlesQuery.error ?? creditsQuery.error)}</p>
            <button
              type="button"
              onClick={() => {
                bundlesQuery.refetch();
                creditsQuery.refetch();
              }}
              className="h-8 px-3 rounded-lg bg-white border border-rose-200 text-rose-700 font-medium hover:bg-rose-100 cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : !stripeConfigured ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            Card payments are not available right now. Please contact support.
          </div>
        ) : stage === "done" ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <div className="space-y-1">
              <p className="font-heading font-semibold text-slate-900">
                Payment received
              </p>
              <p className="text-xs text-slate-500">
                {creditsArrived
                  ? `${intent?.packs ?? selected.packs ?? 0} pack${(intent?.packs ?? selected.packs) === 1 ? " has" : "s have"} been added to your balance.`
                  : "Your packs are being added to your balance. This usually takes a few seconds."}
              </p>
              <p className="text-xs font-medium text-slate-700">
                {credits.total ?? 0} {credits.total === 1 ? "pack" : "packs"} available
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Current Balance Overview */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Packs available:</span>
                <span className="font-semibold text-slate-900">
                  {credits.total ?? 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Monthly allowance (resets each month):</span>
                <span className="font-semibold text-slate-900">
                  {credits.allowance ?? 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pay-as-you-go (never expire):</span>
                <span className="font-semibold text-slate-900">
                  {credits.payg ?? 0}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                Your monthly allowance is used first, then pay-as-you-go packs.
              </p>
            </div>

            {stage === "select" ? (
              <>
                {/* Bundles Options */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Choose how many packs
                  </label>
                  <div className="space-y-2.5">
                    {bundles.map((bundle) => {
                      const isSelected = selected.code === bundle.code;
                      const full = (bundles[0]?.pricePence ?? 0) * (bundle.packs ?? 1);
                      const saving = bundle.pricePence != null && full > bundle.pricePence ? full - bundle.pricePence : 0;
                      return (
                        <div
                          key={bundle.code}
                          onClick={() => setSelectedCode(bundle.code ?? null)}
                          className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer select-none ${
                            isSelected
                              ? "border-[#092167] bg-blue-50/40 shadow-xs"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "border-[#092167] bg-[#092167] text-white"
                                  : "border-slate-300"
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 stroke-[3]" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-heading font-bold text-sm text-slate-900">
                                  {bundle.packs} {bundle.packs === 1 ? "Pack" : "Packs"}
                                </span>
                                {saving > 0 && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#8C6605] uppercase tracking-wider">
                                    Save {formatMoney(saving, "GBP", { decimals: true })}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">
                                {formatMoney(bundle.pricePerPackPence, "GBP", {
                                  decimals: true,
                                })}{" "}
                                per pack
                              </p>
                            </div>
                          </div>
                          <span className="font-heading font-extrabold text-base sm:text-lg text-[#092167]">
                            {formatMoney(bundle.pricePence, "GBP", { decimals: true })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex justify-between font-bold text-sm text-slate-900">
                    <span>Total Due Now</span>
                    <span className="text-base text-[#092167]">
                      {formatMoney(total, "GBP", { decimals: true })}
                    </span>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="text-xs text-rose-600">
                    {error}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={processing || total == null}
                    onClick={startPayment}
                    className="w-full h-11 sm:h-12 bg-[#092167] hover:bg-[#06143E] active:bg-[#040E2C] text-white font-sans font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#E8A808]" />
                        <span>Preparing payment...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#E8A808]" />
                        <span>
                          Continue to Payment •{" "}
                          {formatMoney(total, "GBP", { decimals: true })}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              intent &&
              elementsOptions && (
                <Elements stripe={getStripe()} options={elementsOptions}>
                  <PaymentStep
                    amountPence={intent.amountPence}
                    packs={intent.packs}
                    onPaid={handlePaid}
                    onBack={() => setStage("select")}
                  />
                </Elements>
              )
            )}

            <div className="text-center">
              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Secure payment by Stripe. Card details never touch our
                  servers.
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/** Mounted only while open, so every opening starts from the plan picker. */
export const BuyPacksModal: React.FC<BuyPacksModalProps> = (props) =>
  props.isOpen ? <BuyPacksModalInner {...props} /> : null;

export default BuyPacksModal;
