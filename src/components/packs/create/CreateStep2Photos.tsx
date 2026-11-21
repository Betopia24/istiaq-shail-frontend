"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Plus,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Compass,
  Zap,
} from "lucide-react";

export const MAX_PHOTOS = 10;
export const MIN_PHOTOS = 1;

export interface UploadedPhoto {
  id: string;
  src: string;
  label: string;
  isCover?: boolean;
}

interface CreateStep2PhotosProps {
  photos: UploadedPhoto[];
  setPhotos: React.Dispatch<React.SetStateAction<UploadedPhoto[]>>;
  floorPlan: string | null;
  setFloorPlan: (src: string | null) => void;
  epcFile: string | null;
  setEpcFile: (src: string | null) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const CreateStep2Photos: React.FC<CreateStep2PhotosProps> = ({
  photos,
  setPhotos,
  floorPlan,
  setFloorPlan,
  epcFile,
  setEpcFile,
  onBack,
  onContinue,
}) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const floorPlanInputRef = useRef<HTMLInputElement>(null);
  const epcInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_PHOTOS - photos.length;
    if (remainingSlots <= 0) return;

    const filesToAdd = Array.from(files).slice(0, remainingSlots);
    const newPhotos: UploadedPhoto[] = filesToAdd.map((file, idx) => ({
      id: `photo-${Date.now()}-${idx}`,
      src: URL.createObjectURL(file),
      label: `PHOTO ${photos.length + idx + 1}`,
      isCover: photos.length === 0 && idx === 0,
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length > 0 && !filtered.some((p) => p.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const handleFloorPlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFloorPlan(URL.createObjectURL(file));
    }
  };

  const handleEpcUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEpcFile(URL.createObjectURL(file));
    }
  };

  const canContinue = photos.length >= MIN_PHOTOS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">
          Upload Property Imagery & Documentation
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Upload up to {MAX_PHOTOS} high-resolution photographs, along with your official floor plan and EPC document.
        </p>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={photoInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
      <input
        ref={floorPlanInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFloorPlanUpload}
      />
      <input
        ref={epcInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleEpcUpload}
      />

      {/* Drag & Drop Photo Area */}
      <div
        onClick={() => photoInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 rounded-2xl p-8 sm:p-10 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-[#092167]/50 transition cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-[#092167]/10 text-slate-500 group-hover:text-[#092167] flex items-center justify-center mx-auto mb-3 transition">
          <Upload className="w-5 h-5" />
        </div>
        <p className="font-semibold text-sm text-slate-800">
          Drag photos here or <span className="text-[#092167] underline">click to browse</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          JPG, PNG or WEBP up to 25MB • Minimum {MIN_PHOTOS} photo required (up to {MAX_PHOTOS} total)
        </p>
      </div>

      {/* Photo Gallery Grid */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-slate-600 tracking-wider uppercase">
            UPLOADED PHOTOS ({photos.length} of {MAX_PHOTOS})
          </label>
          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="text-xs font-semibold text-[#092167] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Photos</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-2xs"
            >
              <Image
                src={photo.src}
                alt={photo.label}
                fill
                className="object-cover"
              />

              <div className="absolute top-2 left-2 z-10">
                {photo.isCover ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8A808] text-[#06143E] shadow-xs">
                    ★ COVER
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900/80 text-white backdrop-blur-xs">
                    {idx + 1}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => handleDeletePhoto(photo.id, e)}
                title="Remove photo"
                className="absolute top-2 right-2 z-10 w-6 h-6 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center hover:bg-red-600 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Empty slots placeholders */}
          {Array.from({ length: Math.max(0, MAX_PHOTOS - photos.length) }).map(
            (_, index) => (
              <div
                key={`empty-${index}`}
                onClick={() => photoInputRef.current?.click()}
                className="aspect-4/3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 hover:bg-slate-100/60 hover:border-slate-300 transition flex items-center justify-center text-slate-300 hover:text-slate-500 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </div>
            ),
          )}
        </div>
      </div>

      {/* Floor Plan & EPC Slots (E01) */}
      <div className="pt-4 border-t border-slate-100">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
          Brochure Attachments (Floor Plan & EPC)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Floor Plan Slot */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#092167] border border-blue-200 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Floor Plan</p>
                <p className="text-[11px] text-slate-500">
                  {floorPlan ? "Uploaded • ready for layout" : "Optional • 2D or 3D floor plan"}
                </p>
              </div>
            </div>

            {floorPlan ? (
              <button
                type="button"
                onClick={() => setFloorPlan(null)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-200 cursor-pointer"
                title="Remove floor plan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => floorPlanInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
              >
                Upload
              </button>
            )}
          </div>

          {/* EPC Certificate Slot */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">EPC Rating Chart</p>
                <p className="text-[11px] text-slate-500">
                  {epcFile ? "Uploaded • verified" : "Optional • Graph or certificate"}
                </p>
              </div>
            </div>

            {epcFile ? (
              <button
                type="button"
                onClick={() => setEpcFile(null)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-200 cursor-pointer"
                title="Remove EPC file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => epcInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
              >
                Upload
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="h-10 px-5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Details</span>
        </button>

        <div className="flex items-center gap-3">
          {!canContinue && (
            <span className="text-xs text-amber-700 font-medium hidden sm:inline">
              Upload at least {MIN_PHOTOS} photo to continue
            </span>
          )}
          <button
            type="button"
            disabled={!canContinue}
            onClick={onContinue}
            className="h-10 px-6 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-semibold text-xs shadow-sm transition inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Continue to Review</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStep2Photos;
