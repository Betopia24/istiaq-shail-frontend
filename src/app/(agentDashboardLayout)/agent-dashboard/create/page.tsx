"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { PropertySpecs } from "@/types/packs";
import { CreateStep1Details } from "@/components/packs/create/CreateStep1Details";
import { CreateStep2Photos, UploadedPhoto } from "@/components/packs/create/CreateStep2Photos";
import { CreateStep3Review } from "@/components/packs/create/CreateStep3Review";
import { BuyPacksModal } from "@/components/packs/BuyPacksModal";

function CreatePackContent() {
  const searchParams = useSearchParams();
  const demoStateParam = searchParams.get("state"); // ?state=generating|failed|nocredits

  // Stepper state (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(demoStateParam ? 3 : 1);
  const [showBuyModal, setShowBuyModal] = useState(false);

  // Form State (Step 1)
  const [formData, setFormData] = useState<PropertySpecs>({
    title: "16 Gorse Drive Executive Detached",
    address: "16 Gorse Drive, Chorlton, Manchester",
    postcode: "M21 8XQ",
    price: "£750,000",
    propertyType: "Detached Home",
    tenure: "Freehold",
    epcRating: "B",
    councilTaxBand: "E",
    bedrooms: "4 Bedrooms",
    bathrooms: "3 Bathrooms",
    size: "2,150 sq ft",
    parking: "Private driveway with space for 2 cars & double garage",
    bulletFeatures: [
      "South-facing mature rear garden",
      "Bespoke fitted kitchen (2024)",
      "Underfloor heating throughout ground floor",
      "5 mins walk to Metrolink station",
    ],
    highlights:
      "South-facing mature rear garden, bespoke kitchen fitted 2024, open-plan living space, underfloor heating, 5 mins walk to Chorlton Metrolink station.",
  });

  // Photos State (Step 2)
  const [photos, setPhotos] = useState<UploadedPhoto[]>([
    {
      id: "photo-1",
      src: "/landing/villa-dusk.jpg",
      label: "COVER",
      isCover: true,
    },
    {
      id: "photo-2",
      src: "/landing/townhouse-dusk.jpg",
      label: "LIVING",
    },
    {
      id: "photo-3",
      src: "/landing/semi-detached-wilmslow.jpg",
      label: "GARDEN",
    },
  ]);

  const [floorPlan, setFloorPlan] = useState<string | null>(null);
  const [epcFile, setEpcFile] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Buy Packs Modal for S07 / S06 out-of-credits */}
      <BuyPacksModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
      />

      {/* Top Page Header */}
      <div>
        <h1 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">
          Create Property Pack
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Generate AI property brochures, valuation presentations &amp; buyer packs in seconds
        </p>
      </div>

      {/* Modern Stepper Tabs */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs select-none">
          <div className="grid grid-cols-3 gap-1.5">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                currentStep === 1
                  ? "bg-[#06143E] text-white shadow-xs font-semibold"
                  : currentStep > 1
                  ? "bg-white text-slate-800 hover:bg-slate-50 font-semibold border border-slate-200/60 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                  currentStep === 1
                    ? "bg-[#E8A808] text-[#06143E]"
                    : currentStep > 1
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {currentStep > 1 ? <Check className="w-3 h-3 stroke-[2.5]" /> : "1"}
              </span>
              <span className="text-xs tracking-tight truncate">
                <span className="hidden sm:inline">Step 1: </span>Details
              </span>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                currentStep === 2
                  ? "bg-[#06143E] text-white shadow-xs font-semibold"
                  : currentStep > 2
                  ? "bg-white text-slate-800 hover:bg-slate-50 font-semibold border border-slate-200/60 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                  currentStep === 2
                    ? "bg-[#E8A808] text-[#06143E]"
                    : currentStep > 2
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {currentStep > 2 ? <Check className="w-3 h-3 stroke-[2.5]" /> : "2"}
              </span>
              <span className="text-xs tracking-tight truncate">
                <span className="hidden sm:inline">Step 2: </span>Uploads
              </span>
            </button>

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                currentStep === 3
                  ? "bg-[#06143E] text-white shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                  currentStep === 3
                    ? "bg-[#E8A808] text-[#06143E]"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                3
              </span>
              <span className="text-xs tracking-tight truncate">
                <span className="hidden sm:inline">Step 3: </span>Review & Launch
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-7 transition-all">
        {currentStep === 1 && (
          <CreateStep1Details
            formData={formData}
            setFormData={setFormData}
            onContinue={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <CreateStep2Photos
            photos={photos}
            setPhotos={setPhotos}
            floorPlan={floorPlan}
            setFloorPlan={setFloorPlan}
            epcFile={epcFile}
            setEpcFile={setEpcFile}
            onBack={() => setCurrentStep(1)}
            onContinue={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <CreateStep3Review
            formData={formData}
            photos={photos}
            floorPlan={floorPlan}
            epcFile={epcFile}
            initialDemoState={demoStateParam}
            onBack={() => setCurrentStep(2)}
            onOpenBuyModal={() => setShowBuyModal(true)}
          />
        )}
      </div>
    </div>
  );
}

export default function CreatePackPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#092167] mx-auto mb-4" />
          <p className="text-sm">Loading property pack creator...</p>
        </div>
      }
    >
      <CreatePackContent />
    </Suspense>
  );
}
