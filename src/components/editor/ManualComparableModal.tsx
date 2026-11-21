"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Plus } from "lucide-react";
import toast from "react-hot-toast";

export interface ManualComparable {
  id: string;
  address: string;
  saleDate: string;
  price: string;
  pricePerSqFt: string;
  distance: string;
  type: string;
}

interface ManualComparableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (comp: ManualComparable) => void;
}

export const ManualComparableModal: React.FC<ManualComparableModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState("");
  const [saleDate, setSaleDate] = useState("Oct 2026");
  const [price, setPrice] = useState("£735,000");
  const [sizeSqFt, setSizeSqFt] = useState("2,200");
  const [distance, setDistance] = useState("0.2 miles");
  const [propertyType, setPropertyType] = useState("Detached 4-Bed");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error("Please enter a property address");
      return;
    }

    const cleanPrice = parseInt(price.replace(/[^0-9]/g, ""), 10) || 735000;
    const cleanSize = parseInt(sizeSqFt.replace(/[^0-9]/g, ""), 10) || 2200;
    const pricePerSqFt = "£" + Math.round(cleanPrice / cleanSize);

    const newComp: ManualComparable = {
      id: "comp-" + Date.now(),
      address: address.trim(),
      saleDate,
      price: "£" + cleanPrice.toLocaleString(),
      pricePerSqFt,
      distance,
      type: propertyType,
    };

    onAdd(newComp);
    toast.success("Custom comparable added to valuation model!");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparable-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06143E]/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/90 space-y-5 relative animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <h2
              id="comparable-modal-title"
              className="font-heading font-semibold text-lg text-slate-900"
            >
              Add Custom Comparable Sale
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Include local off-market or recently completed sales in the valuation report.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Property Address <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 24 Gorse Drive, Chorlton, M21 2FA"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Sale Price (£) <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="£735,000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Completion Date
              </label>
              <input
                type="text"
                placeholder="Oct 2026"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Floor Area (Sq Ft)
              </label>
              <input
                type="text"
                placeholder="2,200"
                value={sizeSqFt}
                onChange={(e) => setSizeSqFt(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Proximity / Distance
              </label>
              <input
                type="text"
                placeholder="0.2 miles"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Property Style / Spec
            </label>
            <input
              type="text"
              placeholder="e.g. Detached 4-Bed, Contemporary Kitchen"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5 text-[#E8A808]" />
              <span>Add to Comparables</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualComparableModal;
