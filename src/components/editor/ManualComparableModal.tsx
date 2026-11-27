"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { useAddComparableMutation } from "@/redux/api/packs/valuationApi";
import { apiErrorInfo } from "@/components/ui/ErrorState";
import { errorText } from "@/lib/auth/client";
import { parseMoneyToPence } from "@/lib/format";

interface ManualComparableModalProps {
  isOpen: boolean;
  onClose: () => void;
  packId: string;
  /** `let`: the comparable is an achieved monthly rent, not a sale price. */
  transaction?: "sale" | "let";
}

export const ManualComparableModal: React.FC<ManualComparableModalProps> = ({
  isOpen,
  onClose,
  packId,
  transaction = "sale",
}) => {
  const letting = transaction === "let";
  const modalRef = useRef<HTMLDivElement>(null);
  const [addComparable, { isLoading }] = useAddComparableMutation();
  const [address, setAddress] = useState("");
  const [saleDate, setSaleDate] = useState("");
  const [price, setPrice] = useState("");
  const [sizeSqFt, setSizeSqFt] = useState("");
  const [distance, setDistance] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pricePence = parseMoneyToPence(price);
    if (!address.trim() || pricePence === undefined) {
      setFieldErrors({
        ...(address.trim() ? {} : { address: "Enter the property address" }),
        ...(pricePence === undefined ? { pricePence: letting ? "Enter the monthly rent" : "Enter the sale price" } : {}),
      });
      return;
    }
    const num = (v: string) => {
      const n = Number(v.replace(/[^0-9.]/g, ""));
      return v.trim() && Number.isFinite(n) ? n : undefined;
    };
    try {
      await addComparable({
        packId,
        body: {
          address: address.trim(),
          pricePence,
          soldOn: saleDate.trim() || undefined,
          sizeSqFt: num(sizeSqFt),
          distanceMiles: num(distance),
          propertyType: propertyType.trim() || undefined,
          bedrooms: num(bedrooms),
        },
      }).unwrap();
      toast.success("Custom comparable added to valuation model");
      setAddress("");
      setSaleDate("");
      setPrice("");
      setSizeSqFt("");
      setDistance("");
      setPropertyType("");
      setBedrooms("");
      setFieldErrors({});
      onClose();
    } catch (err) {
      const { fields } = apiErrorInfo(err);
      setFieldErrors(fields);
      if (Object.keys(fields).length === 0) toast.error(errorText(err));
    }
  };

  const fieldError = (name: string) =>
    fieldErrors[name] ? <p className="text-[11px] text-rose-600">{fieldErrors[name]}</p> : null;

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
              {letting ? "Add a Verified Comparable Let" : "Add a Verified Comparable Sale"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {letting
                ? "Add a let you can vouch for: the achieved monthly rent is used in the estimate."
                : "Add a sale you can vouch for (for example from Land Registry or your own completions). Only verified comparables are used in the estimate."}
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
            {fieldError("address")}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                {letting ? "Achieved Rent (£ per month)" : "Sale Price (£)"} <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="£735,000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
              />
              {fieldError("pricePence")}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                {letting ? "Let Date" : "Completion Date"}
              </label>
              <input
                type="text"
                placeholder="2026-10 (YYYY-MM)"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
              />
              {fieldError("soldOn")}
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
              {fieldError("sizeSqFt")}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Proximity / Distance
              </label>
              <input
                type="text"
                placeholder="0.2 (miles)"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
              />
              {fieldError("distanceMiles")}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Property Style / Spec
              </label>
              <input
                type="text"
                placeholder="e.g. Detached"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
              />
              {fieldError("propertyType")}
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Bedrooms
              </label>
              <input
                type="text"
                placeholder="4"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
              />
              {fieldError("bedrooms")}
            </div>
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
              disabled={isLoading}
              className="disabled:opacity-60 h-10 px-5 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5 text-[#E8A808]" />
              <span>{isLoading ? "Adding..." : "Add to Comparables"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualComparableModal;
