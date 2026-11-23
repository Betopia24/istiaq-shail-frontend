"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import { CreateStep1Details } from "@/components/packs/create/CreateStep1Details";
import { CreateStep2Photos, MIN_PHOTOS } from "@/components/packs/create/CreateStep2Photos";
import { CreateStep3Review } from "@/components/packs/create/CreateStep3Review";
import { DetailsForm, emptyForm, formFromPack, toPropertyInput } from "@/components/packs/create/details";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { errorText } from "@/lib/auth/client";
import { usePack } from "@/hooks/usePack";
import { useCreatePackMutation, useUpdatePackMutation } from "@/redux/api/packs/packsApi";

function CreatePackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packId = searchParams.get("pack") ?? undefined;

  const pack = usePack(packId);
  const [createPack, { isLoading: creating }] = useCreatePackMutation();
  const [updatePack, { isLoading: updating }] = useUpdatePackMutation();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | null>(packId ? null : 1);
  const [formData, setFormData] = useState<DetailsForm>(emptyForm);
  const [formLoadedFor, setFormLoadedFor] = useState<string | undefined>(undefined);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Resuming a draft: fill the form once, and pick the step from what the pack already has.
  // (State is adjusted during render, the React-recommended way to derive state from fetched data.)
  if (packId && pack.data && formLoadedFor !== packId) {
    const data = pack.data;
    setFormLoadedFor(packId);
    setFormData(formFromPack(data));
    const photoCount = (data.photos ?? []).filter((p) => p.kind === "photo").length;
    const p = data.property ?? {};
    const detailsDone = Boolean(p.referenceTitle && p.address?.line1);
    if (data.status !== "draft" || photoCount >= MIN_PHOTOS) setCurrentStep(3);
    else if (detailsDone) setCurrentStep(2);
    else setCurrentStep(1);
  }

  // A pack that already finished goes straight to the editor.
  useEffect(() => {
    const status = pack.data?.status;
    if (status === "ready" || status === "live") router.replace(`/agent-dashboard/editor?pack=${packId}`);
  }, [pack.data?.status, packId, router]);

  /** Saves Step 1 (creating the draft the first time). Returns the pack id, or null on failure. */
  const saveDetails = async (): Promise<string | null> => {
    setFieldErrors({});
    const body = toPropertyInput(formData);
    if (!body.referenceTitle) {
      setFieldErrors({ referenceTitle: "Add a reference title" });
      return null;
    }
    try {
      if (packId) {
        await updatePack({ id: packId, body }).unwrap();
        return packId;
      }
      const created = await createPack(body).unwrap();
      const id = created.id as string;
      setFormLoadedFor(id);
      router.replace(`/agent-dashboard/create?pack=${id}`);
      return id;
    } catch (err) {
      const { status, fields } = apiErrorInfo(err);
      if (status === 422 && Object.keys(fields).length) setFieldErrors(fields);
      else toast.error(errorText(err));
      return null;
    }
  };

  const goToStep = async (step: 1 | 2 | 3) => {
    if (step === currentStep) return;
    if (currentStep === 1 && step > 1) {
      const id = await saveDetails();
      if (!id) return;
    } else if (!packId) {
      return; // later steps need the draft created by Step 1
    }
    setCurrentStep(step);
  };

  if (packId && pack.isError && !pack.data) {
    const notFound = apiErrorInfo(pack.error).status === 404;
    return (
      <ErrorState
        error={pack.error}
        onRetry={notFound ? () => router.replace("/agent-dashboard/create") : () => pack.refetch()}
      />
    );
  }

  if (currentStep === null || (packId && !pack.data && currentStep !== 1)) {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="h-8 w-64 rounded-lg bg-slate-100 animate-pulse" />
        <div className="h-12 max-w-2xl mx-auto rounded-2xl bg-slate-100 animate-pulse" />
        <div className="h-96 rounded-2xl bg-slate-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              onClick={() => goToStep(1)}
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
              onClick={() => goToStep(2)}
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
              onClick={() => goToStep(3)}
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
            fieldErrors={fieldErrors}
            saving={creating || updating}
            onContinue={() => goToStep(2)}
          />
        )}

        {currentStep === 2 && packId && pack.data && (
          <CreateStep2Photos
            packId={packId}
            pack={pack.data}
            onBack={() => goToStep(1)}
            onContinue={() => goToStep(3)}
          />
        )}

        {currentStep === 3 && packId && pack.data && (
          <CreateStep3Review
            packId={packId}
            pack={pack.data}
            onBack={() => goToStep(2)}
            onGoToStep={(step) => setCurrentStep(step)}
            onRefetch={() => pack.refetch()}
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
