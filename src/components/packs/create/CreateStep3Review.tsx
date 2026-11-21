"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  CreditCard,
  Loader2,
} from "lucide-react";
import { PropertySpecs } from "@/types/packs";
import { UploadedPhoto } from "./CreateStep2Photos";
import { MAX_PHOTOS } from "./CreateStep2Photos";
import toast from "react-hot-toast";

type ReviewState = "idle" | "generating" | "failed" | "nocredits";

interface CreateStep3ReviewProps {
  formData: PropertySpecs;
  photos: UploadedPhoto[];
  floorPlan: string | null;
  epcFile: string | null;
  initialDemoState?: string | null;
  onBack: () => void;
  onOpenBuyModal: () => void;
}

export const CreateStep3Review: React.FC<CreateStep3ReviewProps> = ({
  formData,
  photos,
  floorPlan,
  epcFile,
  initialDemoState,
  onBack,
  onOpenBuyModal,
}) => {
  const router = useRouter();

  const [state, setState] = useState<ReviewState>(() => {
    if (
      initialDemoState &&
      ["generating", "failed", "nocredits"].includes(initialDemoState)
    ) {
      return initialDemoState as ReviewState;
    }
    return "idle";
  });
  const [generationStep, setGenerationStep] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state === "generating") {
      interval = setInterval(() => {
        setGenerationStep((prev) => {
          if (prev >= 4) {
            clearInterval(interval);
            setTimeout(() => {
              toast.success("Property pack generated successfully!");
              router.push("/agent-dashboard/editor");
            }, 600);
            return 4;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state, router]);

  const handleStartGenerate = () => {
    setState("generating");
    setGenerationStep(1);
  };

  const handleRetry = () => {
    setState("generating");
    setGenerationStep(1);
    toast.success("Retrying brochure generation...");
  };

  return (
    <div className="space-y-6">
      {/* Demo Switcher for Reviewing S06 States */}
      <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          Reviewer S06 Demo Scenario:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setState("idle")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
              state === "idle"
                ? "bg-[#092167] text-white"
                : "bg-white text-slate-700 border border-amber-300"
            }`}
          >
            Normal (Ready)
          </button>
          <button
            type="button"
            onClick={() => {
              setState("generating");
              setGenerationStep(1);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
              state === "generating"
                ? "bg-[#092167] text-white"
                : "bg-white text-slate-700 border border-amber-300"
            }`}
          >
            Generating Progress
          </button>
          <button
            type="button"
            onClick={() => setState("failed")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
              state === "failed"
                ? "bg-rose-700 text-white"
                : "bg-white text-slate-700 border border-amber-300"
            }`}
          >
            Failed & Refunded
          </button>
          <button
            type="button"
            onClick={() => setState("nocredits")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
              state === "nocredits"
                ? "bg-amber-800 text-white"
                : "bg-white text-slate-700 border border-amber-300"
            }`}
          >
            Out of Credits
          </button>
        </div>
      </div>

      {/* S06 STATE 1: GENERATING IN PROGRESS */}
      {state === "generating" && (
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

          {/* 4-Step Pipeline Indicator */}
          <div className="max-w-md mx-auto text-left space-y-3 pt-2">
            {[
              { step: 1, label: "Validating property specifications & uploads" },
              { step: 2, label: "Drafting brochure copy & local area amenities" },
              { step: 3, label: "Compiling print-ready PDF & buyer presentation" },
              { step: 4, label: "Activating digital share link & QR codes" },
            ].map((st) => {
              const isDone = generationStep > st.step;
              const isCurrent = generationStep === st.step;

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
            Estimated time remaining: ~8 seconds. Please keep this browser window open.
          </p>
        </div>
      )}

      {/* S06 STATE 2: FAILED & REFUNDED */}
      {state === "failed" && (
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
                An unexpected rendering timeout occurred while compiling the high-resolution PDF.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-xs font-semibold text-emerald-800 mt-2 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1 pack credit has been automatically refunded to your agency balance.</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleRetry}
              className="h-10 px-5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs transition inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Generation (Free)</span>
            </button>
            <button
              type="button"
              onClick={() => toast.success("Support ticket opened #8291")}
              className="h-10 px-4 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-rose-800 font-medium text-xs transition cursor-pointer"
            >
              Contact Agent Support
            </button>
          </div>
        </div>
      )}

      {/* S06 STATE 3: OUT OF CREDITS */}
      {state === "nocredits" && (
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
              onClick={onOpenBuyModal}
              className="h-10 px-6 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white font-semibold text-xs transition inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#E8A808]" />
              <span>Buy Packs Top-up</span>
            </button>
            <span className="text-xs text-amber-700">Add-ons never expire</span>
          </div>
        </div>
      )}

      {/* Normal Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        {/* Specifications Table */}
        <div className="lg:col-span-7">
          <div className="divide-y divide-slate-100 border-y border-slate-100 text-xs sm:text-sm">
            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Listing Title</span>
              <span className="font-semibold text-slate-900">{formData.title}</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Address & Postcode</span>
              <span className="font-semibold text-slate-900">
                {formData.address}, {formData.postcode}
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Guide Price</span>
              <span className="font-bold text-base text-[#092167]">{formData.price}</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Tenure</span>
              <span className="font-semibold text-slate-900">{formData.tenure}</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">EPC Rating</span>
              <span className="font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Band {formData.epcRating}
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Council Tax</span>
              <span className="font-semibold text-slate-900">Band {formData.councilTaxBand}</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Photos Included</span>
              <span className="font-semibold text-slate-900">
                {photos.length} of {MAX_PHOTOS} photos
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Floor Plan & EPC</span>
              <span className="font-semibold text-slate-900">
                {floorPlan ? "Floor Plan ✓ " : "No Floor Plan "}•{" "}
                {epcFile ? "EPC Chart ✓" : "No EPC Chart"}
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Consumer Compliance</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>UK Trading Standards (CPR) Verified</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Cover Preview & Pack Cost */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
            <Image
              src={photos[0]?.src || "/landing/villa-dusk.jpg"}
              alt="Cover Preview"
              fill
              className="object-cover"
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
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={state === "generating"}
          className="h-10 px-5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs transition inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Photos</span>
        </button>

        {state !== "generating" && state !== "nocredits" && (
          <button
            type="button"
            onClick={handleStartGenerate}
            className="h-10 px-6 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-semibold text-xs shadow-sm transition inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Generate Property Pack</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateStep3Review;
