"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Printer,
  ArrowLeft,
  Download,
  Share2,
  Phone,
  Mail,
  QrCode,
  Sparkles,
} from "lucide-react";
import {
  PropertyPackData,
  DEFAULT_PROPERTY_PACK,
  getPropertyPackById,
} from "@/types/property";

export default function BuyerTwoPagePdfBrochure() {
  const params = useParams();
  const propertyId = (params?.id as string) || "16-gorse-drive";

  // Dynamic Property Data (populated from backend AI response / localStorage / fallback)
  const [property, setProperty] = useState<PropertyPackData>(
    DEFAULT_PROPERTY_PACK,
  );

  useEffect(() => {
    if (propertyId) {
      const data = getPropertyPackById(propertyId);
      setProperty(data);
    }
  }, [propertyId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-200/80 text-slate-900 font-sans py-8 print:py-0 print:bg-white select-none">
      {/* Top Floating Control Bar (Hidden during print) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#06143E] text-white px-5 py-2.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-4 no-print">
        <Link
          href={`/property/${propertyId}`}
          className="text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Property Page</span>
        </Link>

        <div className="w-px h-4 bg-slate-700" />

        <div className="text-xs text-slate-300">
          Format: <strong className="text-[#E8A808]">A4 2-Page PDF</strong>
        </div>

        <button
          onClick={handlePrint}
          className="h-8 px-4 rounded-full bg-[#E8A808] hover:bg-[#d89b05] text-[#06143E] font-medium text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Outer Wrapper */}
      <div className="max-w-[794px] mx-auto space-y-8 print:space-y-0 print:max-w-none">
        {/* =========================================================================
            PAGE 1 OF 2 (A4 Dimensions: 210mm x 297mm)
        ========================================================================= */}
        <div className="w-full bg-white shadow-xl border border-slate-300/80 p-8 sm:p-10 space-y-6 relative print:shadow-none print:border-none print:p-8 page-break">
          {/* Header Bar */}
          <div className="bg-[#06143E] text-white rounded-lg px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-[#E8A808] font-medium text-lg">▲</span>
              <div>
                <span className="font-heading font-semibold text-sm tracking-wider uppercase block leading-tight">
                  {property.agency.name}
                </span>
                <span className="text-[9px] font-medium text-slate-400 tracking-widest uppercase block">
                  {property.agency.tagline}
                </span>
              </div>
            </div>
            <div className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-[#E8A808]" />
              <span>{property.agency.phone}</span>
            </div>
          </div>

          {/* Hero Image with Overlaid Badges */}
          <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden shadow-sm bg-slate-900">
            <Image
              src={property.images.hero}
              alt={property.title}
              fill
              priority
              className="object-cover"
            />
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                {property.statusBadge}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#06143E] text-white border border-[#E8A808]/40 shadow-sm">
                {property.propertyTypeBadge}
              </span>
            </div>
          </div>

          {/* Title & Price Header */}
          <div className="flex items-end justify-between border-b border-slate-200 pb-3">
            <div>
              <h1 className="font-heading font-semibold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {property.title}
              </h1>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {property.area}, {property.postcode}
              </p>
            </div>
            <div className="text-right">
              <div className="font-heading font-semibold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {property.price}
              </div>
              <div className="text-[11px] font-medium text-slate-500">
                {property.priceQualifier}
              </div>
            </div>
          </div>

          {/* 6-Column Specs Strip */}
          <div className="grid grid-cols-6 gap-2 text-center py-2.5 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="font-medium text-slate-900 block text-xs">
                {property.specs.bedrooms}
              </span>
            </div>
            <div className="border-l border-slate-200">
              <span className="font-medium text-slate-900 block text-xs">
                {property.specs.bathrooms}
              </span>
            </div>
            <div className="border-l border-slate-200">
              <span className="font-medium text-slate-900 block text-xs">
                {property.specs.sqft} ({property.specs.sqm})
              </span>
            </div>
            <div className="border-l border-slate-200">
              <span className="font-medium text-slate-900 block text-xs">
                {property.specs.propertyType}
              </span>
            </div>
            <div className="border-l border-slate-200">
              <span className="font-medium text-emerald-600 block text-xs">
                {property.specs.epcRating}
              </span>
            </div>
            <div className="border-l border-slate-200">
              <span className="font-medium text-slate-900 block text-xs">
                {property.specs.tenure}
              </span>
            </div>
          </div>

          {/* Property Overview */}
          <div className="space-y-1.5">
            <h2 className="font-heading font-medium text-sm uppercase tracking-wider text-slate-900">
              Property Overview
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {property.overview}
            </p>
          </div>

          {/* Key Features */}
          <div className="space-y-1.5">
            <h2 className="font-heading font-medium text-sm uppercase tracking-wider text-slate-900">
              Key Features
            </h2>
            <ul className="grid grid-cols-1 gap-1 text-xs text-slate-700">
              {property.keyFeatures.map((feat, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8A808] shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3 Bottom Gallery Thumbnails */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="relative h-24 rounded-lg overflow-hidden border border-slate-200">
              <Image
                src={property.images.kitchen}
                alt="Kitchen & Island"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-1 left-1.5 bg-black/60 text-white text-[9px] font-medium px-1.5 py-0.5 rounded backdrop-blur-xs">
                Kitchen &amp; Island
              </div>
            </div>
            <div className="relative h-24 rounded-lg overflow-hidden border border-slate-200">
              <Image
                src={property.images.garden}
                alt="South-Facing Garden"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-1 left-1.5 bg-black/60 text-white text-[9px] font-medium px-1.5 py-0.5 rounded backdrop-blur-xs">
                South-Facing Garden
              </div>
            </div>
            <div className="relative h-24 rounded-lg overflow-hidden border border-slate-200">
              <Image
                src={property.images.masterSuite}
                alt="Principal En-Suite"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-1 left-1.5 bg-black/60 text-white text-[9px] font-medium px-1.5 py-0.5 rounded backdrop-blur-xs">
                Principal En-Suite
              </div>
            </div>
          </div>

          {/* Page 1 Footer */}
          <div className="border-t border-slate-200 pt-3 flex justify-between text-[10px] text-slate-400 font-medium">
            <span>
              Page 1 of 2 • {property.title}, {property.postcode}
            </span>
            <span>{property.agency.name}</span>
          </div>
        </div>

        {/* =========================================================================
            PAGE 2 OF 2 (A4 Dimensions: 210mm x 297mm)
        ========================================================================= */}
        <div className="w-full bg-white shadow-xl border border-slate-300/80 p-8 sm:p-10 space-y-6 relative print:shadow-none print:border-none print:p-8">
          {/* Header Bar */}
          <div className="flex justify-between items-center border-b border-slate-200 pb-2 text-[10px] text-slate-500 font-medium uppercase tracking-wider">
            <span>
              {property.title.toUpperCase()} | {property.postcode}
            </span>
            <span>Page 2 of 2</span>
          </div>

          {/* Room Dimensions & Layout */}
          <div className="space-y-2">
            <h2 className="font-heading font-medium text-sm uppercase tracking-wider text-slate-900 border-l-2 border-[#E8A808] pl-2.5">
              Room Dimensions &amp; Layout
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-medium text-slate-900 block text-xs">
                  {property.roomDimensions.groundFloor.wingName}
                </span>
                {property.roomDimensions.groundFloor.items.map((item, idx) => (
                  <p key={idx} className="text-[11px] text-slate-600">
                    {item.name}: {item.dimension}
                  </p>
                ))}
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-medium text-slate-900 block text-xs">
                  {property.roomDimensions.firstFloor.wingName}
                </span>
                {property.roomDimensions.firstFloor.items.map((item, idx) => (
                  <p key={idx} className="text-[11px] text-slate-600">
                    {item.name}: {item.dimension}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Architectural Floor Plan */}
          <div className="space-y-2">
            <h2 className="font-heading font-medium text-sm uppercase tracking-wider text-slate-900 border-l-2 border-[#E8A808] pl-2.5">
              Architectural Floor Plan
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Ground Floor Diagram */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center">
                <div className="h-28 w-full border border-slate-300 rounded grid grid-cols-3 grid-rows-2 gap-1 p-1 bg-white text-[9px] font-medium text-slate-500 mb-2">
                  <div className="col-span-2 border border-slate-200 flex items-center justify-center bg-slate-50">
                    KITCHEN / DINING
                  </div>
                  <div className="row-span-2 border border-slate-200 flex items-center justify-center bg-slate-100">
                    GARAGE
                  </div>
                  <div className="col-span-2 border border-slate-200 flex items-center justify-center bg-slate-50">
                    LIVING ROOM
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-700">
                  GROUND FLOOR ({property.floorPlans.groundFloorArea})
                </span>
              </div>

              {/* First Floor Diagram */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center">
                <div className="h-28 w-full border border-slate-300 rounded grid grid-cols-2 grid-rows-2 gap-1 p-1 bg-white text-[9px] font-medium text-slate-500 mb-2">
                  <div className="border border-slate-200 flex items-center justify-center bg-slate-50">
                    BEDROOM 1
                  </div>
                  <div className="border border-slate-200 flex items-center justify-center bg-slate-50">
                    BEDROOM 2
                  </div>
                  <div className="border border-slate-200 flex items-center justify-center bg-slate-50">
                    BEDROOM 3
                  </div>
                  <div className="border border-slate-200 flex items-center justify-center bg-slate-100">
                    BED 4 / BATH
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-700">
                  FIRST FLOOR ({property.floorPlans.firstFloorArea})
                </span>
              </div>
            </div>
          </div>

          {/* Proximity & Commute */}
          <div className="space-y-2">
            <h2 className="font-heading font-medium text-sm uppercase tracking-wider text-slate-900">
              Proximity &amp; Commute
            </h2>
            <div className="grid grid-cols-4 gap-2.5 text-center text-xs">
              {property.commute.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <span
                    className={`font-heading font-medium text-base block ${item.highlight ? "text-emerald-600" : "text-slate-900"}`}
                  >
                    {item.metric}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Listing Agent Card & QR Code */}
          <div className="p-4 rounded-xl bg-[#06143E] text-white border-t-2 border-[#E8A808] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8A808] text-[#06143E] font-heading font-medium text-base flex items-center justify-center shrink-0 shadow-md">
                {property.agent.initials}
              </div>
              <div>
                <h3 className="font-heading font-medium text-sm text-white">
                  {property.agent.name}
                </h3>
                <p className="text-[11px] text-[#E8A808] font-medium">
                  {property.agent.role}
                </p>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  Direct: {property.agent.phone} | {property.agent.email}
                </p>
              </div>
            </div>

            {/* QR Code Block */}
            <div className="flex items-center gap-2.5 bg-[#092167] px-3 py-2 rounded-lg border border-slate-700">
              <div className="w-10 h-10 bg-white p-1 rounded flex items-center justify-center">
                <QrCode className="w-full h-full text-[#06143E]" />
              </div>
              <div className="text-left text-[10px]">
                <span className="font-medium text-[#E8A808] block leading-tight">
                  Scan to Book
                </span>
                <span className="text-slate-300 block leading-tight">
                  Private Viewing
                </span>
                <span className="text-[8px] text-slate-400 block mt-0.5">
                  Instant link to public pack
                </span>
              </div>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="text-[9px] text-slate-400 leading-tight text-center">
            {property.complianceNotice}
          </div>

          {/* Page 2 Footer */}
          <div className="border-t border-slate-200 pt-3 flex justify-between text-[10px] text-slate-400 font-medium">
            <span>
              {property.agency.name} • Property Pack AI Generation Engine
            </span>
            <span>Printed in A4 Format</span>
          </div>
        </div>
      </div>
    </div>
  );
}
