"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  CreditCard,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Pack } from "@/types/models";
import { ApiImage } from "@/components/ui/ApiImage";
import { apiErrorInfo } from "@/components/ui/ErrorState";
import { errorText } from "@/lib/auth/client";
import { formatMoney } from "@/lib/format";
import { useGeneratePackMutation } from "@/redux/api/packs/packsApi";
import { useGetSubscriptionQuery } from "@/redux/api/billing/billingApi";
import { BuyPacksModal } from "@/components/packs/BuyPacksModal";
import { MAX_PHOTOS } from "./CreateStep2Photos";

interface CreateStep3ReviewProps {
  packId: string;
  pack: Pack;
  onBack: () => void;
  /** Send the user back to the step that fixes a missing item. */
  onGoToStep: (step: 1 | 2) => void;
  /** Re-read the pack (used after a 409 already_generating). */
  onRefetch: () => void;
}

const TENURE_LABELS: Record<string, string> = {
  freehold: "Freehold",
  leasehold: "Leasehold",
  share_of_freehold: "Share of Freehold",
  commonhold: "Commonhold",
};

export const CreateStep3Review: React.FC<CreateStep3ReviewProps> = ({
  packId,
  pack,
  onBack,
  onGoToStep,
  onRefetch,
}) => {
  const router = useRouter();
  const [generate, { isLoading: starting }] = useGeneratePackMutation();
  const subscription = useGetSubscriptionQuery();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [outOfCredits, setOutOfCredits] = useState(false);
  const [missing, setMissing] = useState<Record<string, string> | null>(null);
  const wasGenerating = useRef(false);

  const jobStatus = pack.job?.status;
  const generating =
    pack.status === "generating" || jobStatus === "queued" || jobStatus === "running";
  const failed = !generating && pack.status === "failed";

  // 404 from /billing/subscription means the agency has no plan, so no credits.
  const noSubscription = apiErrorInfo(subscription.error).status === 404;
  const credits = noSubscription ? 0 : subscription.data?.creditsRemaining;
  const showNoCredits = outOfCredits || credits === 0;

  useEffect(() => {
    if (generating) wasGenerating.current = true;
    if (pack.status === "ready" || pack.status === "live") {
      if (wasGenerating.current) toast.success("Property pack generated successfully!");
      router.replace(`/agent-dashboard/editor?pack=${packId}`);
    }
  }, [generating, pack.status, packId, router]);

  const startGenerate = async () => {
    setMissing(null);
    try {
      await generate(packId).unwrap();
      setOutOfCredits(false);
    } catch (err) {
      const { status, code, fields } = apiErrorInfo(err);
      if (status === 402) {
        setOutOfCredits(true);
        setShowBuyModal(true);
      } else if (status === 422 && code === "pack_incomplete") {
        setMissing(fields);
      } else if (status === 409) {
        if (code === "already_generated") router.replace(`/agent-dashboard/editor?pack=${packId}`);
        else onRefetch(); // already_generating: the polled pack shows the progress state
      } else {
        toast.error(errorText(err));
      }
    }
  };

  const property = pack.property ?? {};
  const isLet = property.transaction === "let";
  const price = isLet ? property.rentPcmPence : property.guidePricePence;
  const address = [property.address?.line1, property.address?.town, property.address?.postcode]
    .filter(Boolean)
    .join(", ");
  const gallery = (pack.photos ?? [])
    .filter((p) => p.kind === "photo")
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  const hasFloorPlan = (pack.photos ?? []).some((p) => p.kind === "floor_plan");
  const hasEpc = (pack.photos ?? []).some((p) => p.kind === "epc");
  const cover = gallery[0];

  const step = generating ? (jobStatus === "running" ? 2 : 1) : 3;

  return (
    <div className="space-y-6">
      <BuyPacksModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        onPurchased={() => {
          setShowBuyModal(false);
          setOutOfCredits(false);
          void startGenerate();
        }}
      />

      {/* GENERATING IN PROGRESS */}
      {generating && (
        <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 text-center space-y-6 shadow-2xl animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[#E8A808]/15 text-[#E8A808] flex items-center justify-center mx-auto shadow-md">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div>
            <h3 className="font-heading font-bold text-2xl text-white mb-2">
              Generating High-Res Property Pack...
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Our AI engine is compiling factual property copy, optimising imagery, and formatting your printable brochure PDF.
            </p>
          </div>

          <div className="max-w-md mx-auto text-left space-y-3 pt-2">
            {[
              { step: 1, label: "Validating property specifications & uploads" },
              { step: 2, label: "Drafting brochure copy & local area amenities" },
              { step: 3, label: "Finalising your pack" },
            ].map((st) => {
              const isDone = step > st.step;
              const isCurrent = step === st.step;

              return (
                <div
                  key={st.step}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                    isDone
                      ? "bg-emerald-950/40 border-emerald-700/50 text-emerald-300"
                      : isCurrent
                      ? "bg-[#092167] border-[#E8A808]/50 text-white shadow-xs"
                      : "bg-slate-800/40 border-slate-700/40 text-slate-500"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#E8A808] shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-600 text-[10px] flex items-center justify-center shrink-0">
                      {st.step}
                    </span>
                  )}
                  <span className="text-xs font-medium">{st.label}</span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500">
            You can leave this page: generation continues in the background and the pack will be waiting in your dashboard.
          </p>
        </div>
      )}

      {/* FAILED & REFUNDED */}
      {failed && (
        <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/90 border border-rose-200 text-rose-900 space-y-4 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-lg sm:text-xl text-rose-950">
                Brochure Generation Encountered an Error
              </h3>
              <p className="text-xs sm:text-sm text-rose-800 leading-relaxed">
                {pack.job?.error || "Something went wrong while generating this pack."}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-xs font-semibold text-emerald-800 mt-2 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Your pack credit has been automatically refunded to your agency balance.</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={startGenerate}
              disabled={starting}
              className="h-10 px-5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs transition inline-flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${starting ? "animate-spin" : ""}`} />
              <span>Retry Generation</span>
            </button>
          </div>
        </div>
      )}

      {/* INCOMPLETE PACK (422 pack_incomplete) */}
      {missing && (
        <div className="p-6 rounded-3xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-3 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#8C6605] shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-base text-amber-950">
                A few details are still missing
              </h3>
              <ul className="text-xs sm:text-sm text-amber-900 space-y-1 list-disc pl-4">
                {Object.entries(missing).map(([key, message]) => (
                  <li key={key}>{message}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 pt-1">
                {Object.keys(missing).some((k) => k !== "photos") && (
                  <button
                    type="button"
                    onClick={() => onGoToStep(1)}
                    className="h-9 px-4 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-100 cursor-pointer"
                  >
                    Fix property details
                  </button>
                )}
                {"photos" in missing && (
                  <button
                    type="button"
                    onClick={() => onGoToStep(2)}
                    className="h-9 px-4 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-100 cursor-pointer"
                  >
                    Add photos
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OUT OF CREDITS */}
      {showNoCredits && !generating && (
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-4 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#8C6605] flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-lg sm:text-xl text-amber-950">
                Out of Pack Credits
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                You currently have <strong>0 pack credits</strong> remaining on your subscription plan.
                Top up your allowance instantly with a one-off add-on pack bundle to generate this brochure.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowBuyModal(true)}
              className="h-10 px-6 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white font-semibold text-xs transition inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#E8A808]" />
              <span>Buy Packs Top-up</span>
            </button>
          </div>
        </div>
      )}

      {/* Normal Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        {/* Specifications Table */}
        <div className="lg:col-span-7">
          <div className="divide-y divide-slate-100 border-y border-slate-100 text-xs sm:text-sm">
            <div className="py-3 flex items-center justify-between gap-4">
              <span className="text-slate-500 font-medium">Reference Title</span>
              <span className="font-semibold text-slate-900 text-right">{property.referenceTitle || "Not set"}</span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <span className="text-slate-500 font-medium">Address & Postcode</span>
              <span className="font-semibold text-slate-900 text-right">{address || "Not set"}</span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <span className="text-slate-500 font-medium">{isLet ? "Monthly Rent" : "Guide Price"}</span>
              <span className="font-bold text-base text-[#092167]">
                {price != null ? formatMoney(price, "GBP") : "Not set"}
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <span className="text-slate-500 font-medium">Tenure</span>
              <span className="font-semibold text-slate-900">
                {property.tenure ? TENURE_LABELS[property.tenure] ?? property.tenure : "Not set"}
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <span className="text-slate-500 font-medium">EPC Rating</span>
              {property.epcRating ? (
                <span className="font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Band {property.epcRating}
                </span>
              ) : (
                <span className="font-semibold text-slate-900">Not set</span>
              )}
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <span className="text-slate-500 font-medium">Council Tax</span>
              <span className="font-semibold text-slate-900">
                {property.councilTaxBand ? `Band ${property.councilTaxBand}` : "Not set"}
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <span className="text-slate-500 font-medium">Photos Included</span>
              <span className="font-semibold text-slate-900">
                {gallery.length} of {MAX_PHOTOS} photos
              </span>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <span className="text-slate-500 font-medium">Floor Plan & EPC</span>
              <span className="font-semibold text-slate-900">
                {hasFloorPlan ? "Floor Plan ✓ " : "No Floor Plan "}•{" "}
                {hasEpc ? "EPC Chart ✓" : "No EPC Chart"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Cover Preview & Pack Cost */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
            <ApiImage
              src={cover?.url ?? cover?.thumbUrl}
              alt="Cover Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="inline-block px-2.5 py-1 rounded text-[10px] font-bold bg-slate-900/85 text-white tracking-wider uppercase backdrop-blur-xs">
                PRIMARY COVER PHOTO
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
              <p className="font-semibold text-xs text-slate-900">
                1 Pack Credit will be debited
              </p>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              This pack will be compiled into brochure copy and printable PDF immediately. You can make adjustments and regenerations anytime.
            </p>
            <p className="text-[11px] font-semibold text-slate-700">
              Credits remaining: {credits ?? (subscription.isLoading ? "..." : "unknown")}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={generating}
          className="h-10 px-5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs transition inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Photos</span>
        </button>

        {!generating && !failed && !showNoCredits && (
          <button
            type="button"
            onClick={startGenerate}
            disabled={starting}
            className="h-10 px-6 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-semibold text-xs shadow-sm transition inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {starting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 fill-current" />}
            <span>Generate Property Pack</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateStep3Review;
