"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { PropertySpecs } from "@/types/packs";

interface CreateStep1DetailsProps {
  formData: PropertySpecs;
  setFormData: React.Dispatch<React.SetStateAction<PropertySpecs>>;
  onContinue: () => void;
}

export const CreateStep1Details: React.FC<CreateStep1DetailsProps> = ({
  formData,
  setFormData,
  onContinue,
}) => {
  const [newBullet, setNewBullet] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBullet = () => {
    const trimmed = newBullet.trim();
    if (!trimmed) return;
    if (!formData.bulletFeatures.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        bulletFeatures: [...prev.bulletFeatures, trimmed],
      }));
    }
    setNewBullet("");
  };

  const handleRemoveBullet = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      bulletFeatures: prev.bulletFeatures.filter((f) => f !== feature),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">
          Property Information
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Provide factual specifications to generate compliant UK brochure copy and layout.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        {/* Estimated Listing Title */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 tracking-wider uppercase mb-1.5">
            Estimated Listing Title <span className="text-amber-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g. 16 Gorse Drive Executive Detached"
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167]"
          />
        </div>

        {/* Address and Separate Postcode */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-600 tracking-wider uppercase mb-1.5">
              Property Address <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="e.g. 16 Gorse Drive, Chorlton, Manchester"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 tracking-wider uppercase mb-1.5">
              UK Postcode <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              name="postcode"
              value={formData.postcode}
              onChange={handleInputChange}
              placeholder="e.g. M21 8XQ"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm uppercase focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167]"
            />
          </div>
        </div>

        {/* Price & Property Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 tracking-wider uppercase mb-1.5">
              Guide / Asking Price (£) <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="£750,000"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 tracking-wider uppercase mb-1.5">
              Property Type <span className="text-amber-500">*</span>
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleInputChange}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167]"
            >
              <option>Detached Home</option>
              <option>Semi-Detached</option>
              <option>Terraced</option>
              <option>Luxury Apartment</option>
              <option>Penthouse Suite</option>
              <option>Bungalow</option>
              <option>Maisonette</option>
            </select>
          </div>
        </div>

        {/* UK Compliance Fields: Tenure, EPC, Council Tax */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 tracking-wider uppercase mb-1.5">
              Tenure <span className="text-amber-500">*</span>
            </label>
            <select
              name="tenure"
              value={formData.tenure}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-[#092167]"
            >
              <option value="Freehold">Freehold</option>
              <option value="Leasehold">Leasehold</option>
              <option value="Share of Freehold">Share of Freehold</option>
              <option value="Commonhold">Commonhold</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 tracking-wider uppercase mb-1.5">
              EPC Rating <span className="text-amber-500">*</span>
            </label>
            <select
              name="epcRating"
              value={formData.epcRating}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-[#092167]"
            >
              <option value="A">Band A (92-100)</option>
              <option value="B">Band B (81-91)</option>
              <option value="C">Band C (69-80)</option>
              <option value="D">Band D (55-68)</option>
              <option value="E">Band E (39-54)</option>
              <option value="F">Band F (21-38)</option>
              <option value="G">Band G (1-20)</option>
              <option value="Exempt">Exempt / In Progress</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 tracking-wider uppercase mb-1.5">
              Council Tax Band <span className="text-amber-500">*</span>
            </label>
            <select
              name="councilTaxBand"
              value={formData.councilTaxBand}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-[#092167]"
            >
              {["A", "B", "C", "D", "E", "F", "G", "H"].map((band) => (
                <option key={band} value={band}>
                  Band {band}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bedrooms, Bathrooms, Size */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 tracking-wider uppercase mb-1.5">
              Bedrooms
            </label>
            <input
              type="text"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              placeholder="4 Bedrooms"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 tracking-wider uppercase mb-1.5">
              Bathrooms
            </label>
            <input
              type="text"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              placeholder="3 Bathrooms"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 tracking-wider uppercase mb-1.5">
              Property Size (Sq Ft)
            </label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="2,150 sq ft"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
            />
          </div>
        </div>

        {/* Parking & Garage */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 tracking-wider uppercase mb-1.5">
            Parking & Garage
          </label>
          <input
            type="text"
            name="parking"
            value={formData.parking}
            onChange={handleInputChange}
            placeholder="Private driveway with space for 2 cars & double garage"
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
          />
        </div>

        {/* Bullet Features (E01) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 tracking-wider uppercase mb-1.5">
            Bullet Features (Key Selling Points)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newBullet}
              onChange={(e) => setNewBullet(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddBullet();
                }
              }}
              placeholder="Add feature (e.g. South facing garden, Underfloor heating) and press Enter"
              className="flex-1 h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
            />
            <button
              type="button"
              onClick={handleAddBullet}
              className="px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {formData.bulletFeatures.map((feature, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium"
              >
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBullet(feature)}
                  className="hover:text-red-600 cursor-pointer"
                  aria-label={`Remove ${feature}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 tracking-wider uppercase mb-1.5">
            Property Highlights & Detailed Notes
          </label>
          <textarea
            name="highlights"
            rows={3}
            value={formData.highlights}
            onChange={handleInputChange}
            placeholder="South-facing mature rear garden, bespoke kitchen fitted 2024, open-plan living space..."
            className="w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] resize-y"
          />
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <Link
          href="/agent-dashboard"
          className="h-10 px-5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </Link>

        <button
          type="button"
          onClick={onContinue}
          className="h-10 px-6 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-semibold text-xs shadow-sm transition inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Continue to Photos & Floor Plan</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};

export default CreateStep1Details;
