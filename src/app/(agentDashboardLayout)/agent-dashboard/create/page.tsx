"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  Plus,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Sparkles,
  FileText,
  Trash2,
} from "lucide-react";

interface UploadedPhoto {
  id: string;
  src: string;
  label: string;
  isCover?: boolean;
}

export default function CreatePackPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stepper state (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State (Step 1)
  const [formData, setFormData] = useState({
    title: "16 Gorse Drive Executive Detached",
    address: "16 Gorse Drive, Chorlton, Manchester, M21 8XQ",
    price: "£750,000",
    propertyType: "Detached Home",
    bedrooms: "4 Bedrooms",
    bathrooms: "3 Bathrooms",
    size: "2,150 sq ft",
    parking: "Private driveway with space for 2 cars & double garage",
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

  // Loading/feedback state
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: UploadedPhoto[] = Array.from(files).map((file, idx) => ({
      id: `photo-${Date.now()}-${idx}`,
      src: URL.createObjectURL(file),
      label: `PHOTO ${photos.length + idx + 1}`,
    }));

    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 10));
    showToast(`${newPhotos.length} photo(s) added`);
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length <= 1) {
      showToast("At least 1 photo is required");
      return;
    }
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length > 0 && !filtered.some((p) => p.isCover)) {
        filtered[0].isCover = true;
        filtered[0].label = "COVER";
      }
      return filtered;
    });
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    showToast("Compiling specs and generating high-res brochure PDF...");
    setTimeout(() => {
      setIsGenerating(false);
      router.push("/agent-dashboard/editor");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-7 pb-16">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#06143E] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Top Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Create Property Pack
        </h1>
      </div>

      {/* =========================================================================
          STEPPER TABS
      ========================================================================= */}
      <div className="max-w-2xl mx-auto w-full">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center select-none">
          {/* Step 1 Tab */}
          <button
            onClick={() => setCurrentStep(1)}
            className="group cursor-pointer flex flex-col items-center"
          >
            <div className="flex items-center gap-1.5 mb-2">
              {currentStep > 1 ? (
                <span className="w-4 h-4 rounded-full bg-[#06143E] text-[#E8A808] flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              ) : null}
              <span
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  currentStep === 1
                    ? "text-[#06143E] font-bold"
                    : currentStep > 1
                    ? "text-slate-800"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              >
                Step 1: Details
              </span>
            </div>
            {/* Step Underline Bar */}
            <div
              className={`w-full h-1 rounded-full transition-all duration-300 ${
                currentStep >= 1 ? "bg-[#06143E]" : "bg-slate-200"
              }`}
            />
          </button>

          {/* Step 2 Tab */}
          <button
            onClick={() => setCurrentStep(2)}
            className="group cursor-pointer flex flex-col items-center"
          >
            <div className="flex items-center gap-1.5 mb-2">
              {currentStep > 2 ? (
                <span className="w-4 h-4 rounded-full bg-[#06143E] text-[#E8A808] flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              ) : null}
              <span
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  currentStep === 2
                    ? "text-[#06143E] font-bold"
                    : currentStep > 2
                    ? "text-slate-800"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              >
                Step 2: Upload Photos
              </span>
            </div>
            {/* Step Underline Bar */}
            <div
              className={`w-full h-1 rounded-full transition-all duration-300 ${
                currentStep >= 2 ? "bg-[#06143E]" : "bg-slate-200"
              }`}
            />
          </button>

          {/* Step 3 Tab */}
          <button
            onClick={() => setCurrentStep(3)}
            className="group cursor-pointer flex flex-col items-center"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  currentStep === 3
                    ? "text-[#06143E] font-bold"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              >
                Step 3: Review & Launch
              </span>
            </div>
            {/* Step Underline Bar */}
            <div
              className={`w-full h-1 rounded-full transition-all duration-300 ${
                currentStep === 3 ? "bg-[#06143E]" : "bg-slate-200"
              }`}
            />
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN WHITE CARD CONTAINER
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 md:p-10 transition-all">
        {/* =======================================================================
            STEP 1: PROPERTY INFORMATION
        ======================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Card Header */}
            <div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                Property Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Provide factual details about your property to auto-create
                compliant copy and brochure layout.
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 pt-2">
              {/* Estimated Listing Title */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  ESTIMATED LISTING TITLE <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. 16 Gorse Drive Executive Detached"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                />
              </div>

              {/* Full Property Address & Postcode */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  FULL PROPERTY ADDRESS & POSTCODE{" "}
                  <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. 16 Gorse Drive, Chorlton, Manchester, M21 8XQ"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                />
              </div>

              {/* Price & Property Type (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                    GUIDE / ASKING PRICE (£){" "}
                    <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="£750,000"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                    PROPERTY TYPE <span className="text-amber-500">*</span>
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                  >
                    <option>Detached Home</option>
                    <option>Semi-Detached</option>
                    <option>Terraced</option>
                    <option>Luxury Apartment</option>
                    <option>Penthouse Suite</option>
                    <option>Bungalow</option>
                  </select>
                </div>
              </div>

              {/* Bedrooms, Bathrooms, Size (3 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                    BEDROOMS
                  </label>
                  <input
                    type="text"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="4 Bedrooms"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                    BATHROOMS
                  </label>
                  <input
                    type="text"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="3 Bathrooms"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                    PROPERTY SIZE (SQ FT)
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="2,150 sq ft"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                  />
                </div>
              </div>

              {/* Parking & Garage */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  PARKING & GARAGE
                </label>
                <input
                  type="text"
                  name="parking"
                  value={formData.parking}
                  onChange={handleInputChange}
                  placeholder="Private driveway with space for 2 cars & double garage"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                />
              </div>

              {/* Property Highlights & Amenities */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  PROPERTY HIGHLIGHTS & AMENITIES
                </label>
                <textarea
                  name="highlights"
                  rows={3}
                  value={formData.highlights}
                  onChange={handleInputChange}
                  placeholder="South-facing mature rear garden, bespoke kitchen fitted 2024, open-plan living space..."
                  className="w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition resize-y"
                />
              </div>
            </div>

            {/* Footer Navigation Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/agent-dashboard"
                className="h-10 px-5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </Link>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="h-10 px-6 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-xs shadow-sm transition inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Photos</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* =======================================================================
            STEP 2: UPLOAD PROPERTY IMAGERY
        ======================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Card Header */}
            <div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                Upload Property Imagery
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Provide at least 3 photos (up to 12 photos). Front photo will be used as the primary cover.
              </p>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Drag & Drop Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-2xl p-8 sm:p-10 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-[#092167]/50 transition cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-[#092167]/10 text-slate-500 group-hover:text-[#092167] flex items-center justify-center mx-auto mb-3 transition">
                <Upload className="w-5 h-5" />
              </div>
              <p className="font-semibold text-sm text-slate-800">
                Drag photos here or <span className="text-[#092167] underline">click to browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports JPG, PNG or WEBP • Optimized automatically for print PDF
              </p>
            </div>

            {/* Uploaded Photos Grid */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
                  UPLOADED PHOTOS ({photos.length} of 10)
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-[#092167] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More</span>
                </button>
              </div>

              {/* 5-column grid matching Figma */}
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

                    {/* Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      {photo.isCover ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8A808] text-[#06143E] shadow-xs">
                          ★ COVER
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-xs">
                          {idx + 1}. {photo.label}
                        </span>
                      )}
                    </div>

                    {/* Delete overlay */}
                    <button
                      onClick={(e) => handleDeletePhoto(photo.id, e)}
                      title="Remove photo"
                      className="absolute top-2 right-2 z-10 w-6 h-6 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center hover:bg-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Empty Slots placeholder matching Figma */}
                {Array.from({ length: Math.max(0, 10 - photos.length) }).map(
                  (_, index) => (
                    <div
                      key={`empty-${index}`}
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-4/3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 hover:bg-slate-100/60 hover:border-slate-300 transition flex items-center justify-center text-slate-300 hover:text-slate-500 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2]" />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Footer Navigation Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="h-10 px-5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="h-10 px-6 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-xs shadow-sm transition inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Review</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* =======================================================================
            STEP 3: REVIEW & GENERATE BROCHURE
        ======================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Card Header */}
            <div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                Review & Generate Brochure
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Make sure your specifications are verified before generating your marketing materials and PDF.
              </p>
            </div>

            {/* Review Content: 2-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
              {/* Left Column: Specifications Table */}
              <div className="lg:col-span-7">
                <div className="divide-y divide-slate-100 border-y border-slate-100 text-xs sm:text-sm">
                  {/* Row 1 */}
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">
                      Listing Reference
                    </span>
                    <span className="font-semibold text-slate-900">
                      16 Gorse Drive
                    </span>
                  </div>

                  {/* Row 2 */}
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">
                      Property Type
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formData.propertyType} - For Sale
                    </span>
                  </div>

                  {/* Row 3 */}
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Location</span>
                    <span className="font-semibold text-slate-900">
                      Chorlton, Manchester
                    </span>
                  </div>

                  {/* Row 4 */}
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Guide Price</span>
                    <span className="font-semibold text-slate-900">
                      {formData.price}
                    </span>
                  </div>

                  {/* Row 5 */}
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Total Space</span>
                    <span className="font-semibold text-slate-900">
                      {formData.bedrooms.replace(" Bedrooms", " Beds")} •{" "}
                      {formData.bathrooms.replace(" Bathrooms", " Baths")} •{" "}
                      {formData.size}
                    </span>
                  </div>

                  {/* Row 6 */}
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">
                      Photos Included
                    </span>
                    <span className="font-semibold text-slate-900">
                      {photos.length} / 12 photos optimized
                    </span>
                  </div>

                  {/* Row 7 */}
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">
                      Target Compliance
                    </span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>UK Trading Standards (CPR)</span>
                    </span>
                  </div>

                  {/* Row 8 */}
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">
                      Linked Agency Branding
                    </span>
                    <span className="font-semibold text-slate-900">
                      Prestige Estates UK
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Cover Preview & Cost Box */}
              <div className="lg:col-span-5 space-y-4">
                {/* Cover Preview Card */}
                <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                  <Image
                    src={photos[0]?.src || "/landing/villa-dusk.jpg"}
                    alt="Cover Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-block px-2.5 py-1 rounded text-[10px] font-bold bg-slate-900/85 text-white tracking-wider uppercase backdrop-blur-xs">
                      COVER PREVIEW
                    </span>
                  </div>
                </div>

                {/* Pack Credit Notice Box */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
                    <p className="font-semibold text-xs text-slate-900">
                      1 Pack Credit will be used
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    This pack will be compiled into brochure copy and printable PDF immediately. You can make adjustments and regenerations anytime before export.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Navigation Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="h-10 px-5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerate}
                className="h-10 px-6 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-xs shadow-sm transition inline-flex items-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isGenerating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#06143E] border-t-transparent rounded-full animate-spin" />
                    <span>Generating Pack...</span>
                  </>
                ) : (
                  <span>Generate Property Pack</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
