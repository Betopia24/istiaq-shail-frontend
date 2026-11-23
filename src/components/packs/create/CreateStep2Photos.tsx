"use client";

import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Upload,
  Plus,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Compass,
  Zap,
  Loader2,
} from "lucide-react";
import type { Pack, Photo } from "@/types/models";
import { ApiImage } from "@/components/ui/ApiImage";
import { errorText } from "@/lib/auth/client";
import {
  useDeletePhotoMutation,
  useReorderPhotosMutation,
  useUploadPhotosMutation,
} from "@/redux/api/packs/packsApi";

export const MAX_PHOTOS = 10;
export const MIN_PHOTOS = 3;
const MAX_FLOOR_PLANS = 4;
const MAX_FILE_BYTES = 15 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const TAGS = ["Exterior", "Living room", "Kitchen", "Dining room", "Bedroom", "Bathroom", "Garden", "Hallway", "Other"];

type Kind = "photo" | "floor_plan" | "epc";

interface CreateStep2PhotosProps {
  packId: string;
  pack: Pack;
  onBack: () => void;
  onContinue: () => void;
}

/** Client-side checks that mirror the server: type, size, and how many fit. */
function checkFiles(files: File[], room: number, label: string): File[] | null {
  if (files.length > room) {
    toast.error(room <= 0 ? `You have reached the ${label} limit` : `You can add ${room} more ${label}${room === 1 ? "" : "s"}`);
    return null;
  }
  for (const file of files) {
    if (!ACCEPTED.includes(file.type)) {
      toast.error(`${file.name}: only JPG, PNG or WEBP images are accepted`);
      return null;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error(`${file.name} is larger than 15MB`);
      return null;
    }
  }
  return files;
}

export const CreateStep2Photos: React.FC<CreateStep2PhotosProps> = ({
  packId,
  pack,
  onBack,
  onContinue,
}) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const floorPlanInputRef = useRef<HTMLInputElement>(null);
  const epcInputRef = useRef<HTMLInputElement>(null);
  const [uploadPhotos] = useUploadPhotosMutation();
  const [reorderPhotos, { isLoading: reordering }] = useReorderPhotosMutation();
  const [deletePhoto] = useDeletePhotoMutation();
  const [uploading, setUploading] = useState<{ kind: Kind; count: number } | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [fileDragOver, setFileDragOver] = useState(false);

  const all: Photo[] = pack.photos ?? [];
  const byPosition = (a: Photo, b: Photo) => (a.position ?? 0) - (b.position ?? 0);
  const photos = all.filter((p) => p.kind === "photo").sort(byPosition);
  const floorPlans = all.filter((p) => p.kind === "floor_plan").sort(byPosition);
  const epc = all.find((p) => p.kind === "epc");

  const upload = async (files: File[], kind: Kind) => {
    if (!files.length) return;
    setUploading({ kind, count: files.length });
    try {
      await uploadPhotos({ id: packId, files, kind }).unwrap();
    } catch (err) {
      toast.error(errorText(err));
    } finally {
      setUploading(null);
    }
  };

  const handlePhotoFiles = (list: FileList | File[] | null) => {
    const files = Array.from(list ?? []);
    if (!files.length) return;
    const ok = checkFiles(files, MAX_PHOTOS - photos.length, "photo");
    if (ok) void upload(ok, "photo");
  };

  const handleFloorPlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    const ok = checkFiles(files, MAX_FLOOR_PLANS - floorPlans.length, "floor plan");
    if (ok) void upload(ok, "floor_plan");
  };

  const handleEpcUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 1);
    e.target.value = "";
    const ok = checkFiles(files, 1, "EPC chart");
    if (ok) void upload(ok, "epc");
  };

  const handleDelete = async (photoId: string | undefined, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!photoId) return;
    try {
      await deletePhoto({ id: packId, photoId }).unwrap();
    } catch (err) {
      toast.error(errorText(err));
    }
  };

  const saveOrder = async (ordered: Photo[]) => {
    try {
      await reorderPhotos({
        id: packId,
        photos: ordered.map((p) => ({ photoId: p.id as string, tag: p.tag ?? null })),
      }).unwrap();
    } catch (err) {
      toast.error(errorText(err));
    }
  };

  const handleDrop = (target: number) => {
    if (dragIndex === null || dragIndex === target) return;
    const next = [...photos];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(target, 0, moved);
    setDragIndex(null);
    void saveOrder(next);
  };

  const makeCover = (index: number) => {
    const next = [...photos];
    const [moved] = next.splice(index, 1);
    next.unshift(moved);
    void saveOrder(next);
  };

  const setTag = (index: number, tag: string) => {
    void saveOrder(photos.map((p, i) => (i === index ? { ...p, tag: tag || undefined } : p)));
  };

  const busy = uploading !== null;
  const canContinue = photos.length >= MIN_PHOTOS && !busy;

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
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => {
          handlePhotoFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={floorPlanInputRef}
        type="file"
        multiple
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={handleFloorPlanUpload}
      />
      <input
        ref={epcInputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={handleEpcUpload}
      />

      {/* Drag & Drop Photo Area */}
      <div
        onClick={() => photoInputRef.current?.click()}
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes("Files")) {
            e.preventDefault();
            setFileDragOver(true);
          }
        }}
        onDragLeave={() => setFileDragOver(false)}
        onDrop={(e) => {
          if (!e.dataTransfer.files.length) return;
          e.preventDefault();
          setFileDragOver(false);
          handlePhotoFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition cursor-pointer group ${
          fileDragOver
            ? "border-[#092167]/50 bg-slate-50"
            : "border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-[#092167]/50"
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-[#092167]/10 text-slate-500 group-hover:text-[#092167] flex items-center justify-center mx-auto mb-3 transition">
          {uploading?.kind === "photo" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
        </div>
        <p className="font-semibold text-sm text-slate-800">
          {uploading?.kind === "photo" ? (
            `Uploading ${uploading.count} photo${uploading.count === 1 ? "" : "s"}...`
          ) : (
            <>
              Drag photos here or <span className="text-[#092167] underline">click to browse</span>
            </>
          )}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          JPG, PNG or WEBP up to 15MB • Minimum {MIN_PHOTOS} photos required (up to {MAX_PHOTOS} total)
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
              draggable={!reordering}
              onDragStart={() => setDragIndex(idx)}
              onDragOver={(e) => dragIndex !== null && e.preventDefault()}
              onDrop={() => handleDrop(idx)}
              onDragEnd={() => setDragIndex(null)}
              className={`relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-2xs ${
                dragIndex === idx ? "opacity-50" : ""
              }`}
            >
              <ApiImage
                src={photo.thumbUrl ?? photo.url}
                alt={photo.tag ?? `Photo ${idx + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute top-2 left-2 z-10">
                {idx === 0 ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8A808] text-[#06143E] shadow-xs">
                    ★ COVER
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => makeCover(idx)}
                    title="Make cover photo"
                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900/80 text-white backdrop-blur-xs hover:bg-[#E8A808] hover:text-[#06143E] cursor-pointer"
                  >
                    {idx + 1}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => handleDelete(photo.id, e)}
                title="Remove photo"
                className="absolute top-2 right-2 z-10 w-6 h-6 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition flex items-center justify-center hover:bg-red-600 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <select
                value={photo.tag ?? ""}
                onChange={(e) => setTag(idx, e.target.value)}
                disabled={reordering}
                aria-label="Photo tag"
                className="absolute bottom-2 left-2 z-10 max-w-[80%] h-6 px-1.5 rounded bg-black/60 text-white text-[10px] focus:outline-none cursor-pointer"
              >
                <option value="">Tag</option>
                {photo.tag && !TAGS.includes(photo.tag) && <option value={photo.tag}>{photo.tag}</option>}
                {TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {uploading?.kind === "photo" &&
            Array.from({ length: uploading.count }).map((_, i) => (
              <div
                key={`uploading-${i}`}
                className="aspect-4/3 rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ))}

          {/* Empty slots placeholders */}
          {Array.from({
            length: Math.max(0, MAX_PHOTOS - photos.length - (uploading?.kind === "photo" ? uploading.count : 0)),
          }).map((_, index) => (
            <div
              key={`empty-${index}`}
              onClick={() => photoInputRef.current?.click()}
              className="aspect-4/3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 hover:bg-slate-100/60 hover:border-slate-300 transition flex items-center justify-center text-slate-300 hover:text-slate-500 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </div>
          ))}
        </div>
        {photos.length > 1 && (
          <p className="text-[11px] text-slate-400">Drag photos to reorder. The first photo is the cover.</p>
        )}
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
                  {uploading?.kind === "floor_plan"
                    ? "Uploading..."
                    : floorPlans.length
                      ? `${floorPlans.length} uploaded • ready for layout`
                      : "Optional • 2D or 3D floor plan"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {floorPlans.map((fp) => (
                <div key={fp.id} className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-200 group bg-slate-100">
                  <ApiImage src={fp.thumbUrl ?? fp.url} alt="Floor plan" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => handleDelete(fp.id, e)}
                    className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center justify-center cursor-pointer"
                    title="Remove floor plan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {floorPlans.length < MAX_FLOOR_PLANS && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => floorPlanInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  Upload
                </button>
              )}
            </div>
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
                  {uploading?.kind === "epc"
                    ? "Uploading..."
                    : epc
                      ? "Uploaded"
                      : "Optional • Graph or certificate"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {epc && (
                <button
                  type="button"
                  onClick={(e) => handleDelete(epc.id, e)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-200 cursor-pointer"
                  title="Remove EPC file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => epcInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs disabled:opacity-50"
              >
                {epc ? "Replace" : "Upload"}
              </button>
            </div>
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
          {photos.length < MIN_PHOTOS && (
            <span className="text-xs text-amber-700 font-medium hidden sm:inline">
              Upload at least {MIN_PHOTOS} photos to continue
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
