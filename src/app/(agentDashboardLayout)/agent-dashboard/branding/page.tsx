"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Check,
  Building2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function AgencyBrandingPage() {
  // Form State initialized to exact Figma values
  const [agencyName, setAgencyName] = useState("Prestige Estates UK");
  const [tradingRegion, setTradingRegion] = useState("Manchester & Cheshire");
  const [licenseNumber, setLicenseNumber] = useState(
    "CRN-08492011 / TPO-MB920",
  );
  const [officePhone, setOfficePhone] = useState("+44 161 496 0200");
  const [inquiryEmail, setInquiryEmail] = useState(
    "contact@prestigeestates.co.uk",
  );
  const [officeAddress, setOfficeAddress] = useState(
    "14 Wilmslow Road, Didsbury, Manchester, M20 2RN",
  );

  // Logo state
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Palette State
  const [primaryColor, setPrimaryColor] = useState("#0B1736");
  const [accentColor, setAccentColor] = useState("#FFB800");

  // Operating Market State
  const [selectedMarket, setSelectedMarket] = useState<"UK" | "US">("UK");

  // Disclaimer text (dynamically adapts based on market or editable)
  const [disclaimerNotice, setDisclaimerNotice] = useState(
    "These particulars do not constitute any part of an offer or contract. All measurements, fixtures, and room layouts are approximate and verified independently.",
  );

  // Save feedback state
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      showToast("Vector logo uploaded successfully!");
    }
  };

  const handleMarketChange = (market: "UK" | "US") => {
    setSelectedMarket(market);
    if (market === "UK") {
      setDisclaimerNotice(
        "These particulars do not constitute any part of an offer or contract. All measurements, fixtures, and room layouts are approximate and verified independently.",
      );
    } else {
      setDisclaimerNotice(
        "Information is deemed reliable but not guaranteed. All properties are subject to prior sale, change, or withdrawal. Neither listing broker nor Property Pack AI shall be responsible for any typographical errors or misinformation.",
      );
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Agency branding & localization settings saved successfully!");
    }, 700);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#06143E] text-white px-5 py-3.5 rounded-lg shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* =========================================================================
          PAGE HEADER
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-medium text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Agency Branding &amp; Localization
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Single consolidated form to configure firm assets, primary currency, and legal defaults
          </p>
        </div>
      </div>

      {/* =========================================================================
          MAIN FORM CONTAINER CARD
      ========================================================================= */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 md:p-9 shadow-xs space-y-8"
      >
        {/* =======================================================================
            SECTION 1: AGENCY PROFILE & REGULATORY CREDENTIALS
        ======================================================================= */}
        <div className="space-y-6">
          <div>
            <h2 className="font-heading font-medium text-base sm:text-lg text-slate-900">
              1. Agency Profile &amp; Regulatory Credentials
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Applied directly to PDF brochure covers, public links, and
              regulatory compliance notices
            </p>
          </div>

          {/* Logo Uploader */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#071330] border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden shadow-xs relative">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Agency Logo"
                  fill
                  className="object-contain p-1"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[#FFB800] flex items-center justify-center shadow-xs">
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[11px] border-b-[#071330] mb-0.5" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,.png,.jpg,.jpeg"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-9 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-medium text-xs flex items-center gap-2 cursor-pointer transition shadow-2xs"
              >
                Upload Vector Logo
              </button>
              <p className="text-[11px] text-slate-400">
                SVG or transparent high-res PNG (min. 400×400px)
              </p>
            </div>
          </div>

          {/* Inputs Grid (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {/* Field 1: Commercial Name */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 uppercase tracking-wider mb-1.5">
                Agency Commercial Name
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="Prestige Estates UK"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/10 transition"
              />
            </div>

            {/* Field 2: Trading Region */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 uppercase tracking-wider mb-1.5">
                Trading Region / Sub-Territory
              </label>
              <input
                type="text"
                value={tradingRegion}
                onChange={(e) => setTradingRegion(e.target.value)}
                placeholder="Manchester & Cheshire"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/10 transition"
              />
            </div>

            {/* Field 3: Regulatory License */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 uppercase tracking-wider mb-1.5">
                Regulatory License / Company Reg. No. (CRN / DRE / TPO)
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="CRN-08492011 / TPO-MB920"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/10 transition"
              />
            </div>

            {/* Field 4: Office Telephone */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 uppercase tracking-wider mb-1.5">
                Office Telephone
              </label>
              <input
                type="text"
                value={officePhone}
                onChange={(e) => setOfficePhone(e.target.value)}
                placeholder="+44 161 496 0200"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/10 transition"
              />
            </div>

            {/* Field 5: Public Inquiry Email */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 uppercase tracking-wider mb-1.5">
                Public Inquiry Email
              </label>
              <input
                type="email"
                value={inquiryEmail}
                onChange={(e) => setInquiryEmail(e.target.value)}
                placeholder="contact@prestigeestates.co.uk"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/10 transition"
              />
            </div>

            {/* Field 6: Registered Office Address */}
            <div>
              <label className="block text-[11px] font-medium text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Office Address
              </label>
              <input
                type="text"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                placeholder="14 Wilmslow Road, Didsbury, Manchester, M20 2RN"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/10 transition"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* =======================================================================
            SECTION 2: PALETTE & BROCHURE ACCENT COLORS
        ======================================================================= */}
        <div className="space-y-4">
          <div>
            <h2 className="font-heading font-medium text-base sm:text-lg text-slate-900">
              2. Palette &amp; Brochure Accent Colors
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Defines styling for brochures, viewing buttons, and interactive
              cards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Primary Navy Color */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between gap-3.5 hover:bg-slate-50 transition">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-9 h-9 rounded-lg shrink-0 border border-black/10 shadow-2xs"
                  style={{ backgroundColor: primaryColor }}
                />
                <div className="min-w-0">
                  <p className="font-medium text-xs sm:text-sm text-slate-900">
                    Primary Navy Color
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {primaryColor} (Used for headers, text, and structure)
                  </p>
                </div>
              </div>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                title="Select Primary Color"
              />
            </div>

            {/* Accent Gold Color */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between gap-3.5 hover:bg-slate-50 transition">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-9 h-9 rounded-lg shrink-0 border border-amber-600/20 shadow-2xs"
                  style={{ backgroundColor: accentColor }}
                />
                <div className="min-w-0">
                  <p className="font-medium text-xs sm:text-sm text-slate-900">
                    Accent Gold Color
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {accentColor} (Used for CTAs, highlights, and badges)
                  </p>
                </div>
              </div>
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                title="Select Accent Color"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* =======================================================================
            SECTION 3: OPERATING MARKET, CURRENCY & LEGAL COMPLIANCE
        ======================================================================= */}
        <div className="space-y-4">
          <div>
            <h2 className="font-heading font-medium text-base sm:text-lg text-slate-900">
              3. Operating Market, Currency &amp; Legal Compliance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Determines default currency symbols, spelling rules, and
              disclaimer notices across all generated assets
            </p>
          </div>

          {/* Market Selection Cards (UK vs US) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* UK Market Card */}
            <div
              onClick={() => handleMarketChange("UK")}
              className={`rounded-xl p-4 flex items-center justify-between cursor-pointer transition select-none ${
                selectedMarket === "UK"
                  ? "border-2 border-[#FFB800] bg-amber-50/10 shadow-2xs"
                  : "border border-slate-200 bg-white hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#06143E] text-white font-medium text-sm flex items-center justify-center shrink-0 shadow-2xs">
                  £
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-xs sm:text-sm text-slate-900">
                    United Kingdom (UK)
                  </p>
                  <p className="text-[11px] text-[#B58306] font-medium mt-0.5">
                    Currency: GBP (£) • Guide Price, Freehold, EPC, UK CPR 2008
                  </p>
                </div>
              </div>

              {/* Radio Indicator */}
              <div className="shrink-0 ml-3">
                {selectedMarket === "UK" ? (
                  <div className="w-5 h-5 rounded-full bg-[#FFB800] text-[#06143E] flex items-center justify-center shadow-2xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300" />
                )}
              </div>
            </div>

            {/* US Market Card */}
            <div
              onClick={() => handleMarketChange("US")}
              className={`rounded-xl p-4 flex items-center justify-between cursor-pointer transition select-none ${
                selectedMarket === "US"
                  ? "border-2 border-[#FFB800] bg-amber-50/10 shadow-2xs"
                  : "border border-slate-200 bg-white hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-medium text-sm flex items-center justify-center shrink-0">
                  $
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-xs sm:text-sm text-slate-700">
                    United States (US)
                  </p>
                  <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                    Currency: USD ($) • Listing Price, HOA, Standard Disclosures
                  </p>
                </div>
              </div>

              {/* Radio Indicator */}
              <div className="shrink-0 ml-3">
                {selectedMarket === "US" ? (
                  <div className="w-5 h-5 rounded-full bg-[#FFB800] text-[#06143E] flex items-center justify-center shadow-2xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300" />
                )}
              </div>
            </div>
          </div>

          {/* Mandatory Legal Disclaimer */}
          <div className="pt-2">
            <label className="block text-[11px] font-medium text-slate-700 uppercase tracking-wider mb-2">
              Mandatory Legal Disclaimer (Printed on PDF &amp; Web Footers)
            </label>
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-1">
              <p className="font-mono font-medium text-xs text-slate-900 uppercase">
                Compliance Notice (
                {selectedMarket === "UK"
                  ? "UK CPR 2008"
                  : "US Standard Disclosures"}
                ):
              </p>
              <textarea
                rows={2}
                value={disclaimerNotice}
                onChange={(e) => setDisclaimerNotice(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-600 leading-relaxed resize-none focus:outline-none border-0 p-0"
              />
            </div>
          </div>
        </div>

        {/* =======================================================================
            FOOTER ACTIONS
        ======================================================================= */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSaving}
            className="h-11 px-7 rounded-lg bg-[#FFB800] hover:bg-[#E8A808] active:bg-[#D49800] text-[#06143E] font-heading font-medium text-sm shadow-[0_2px_10px_rgba(255,184,0,0.3)] transition cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto disabled:opacity-75"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-[#06143E] border-t-transparent rounded-full animate-spin" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <span>Save Agency Settings</span>
            )}
          </button>
          <p className="text-xs text-slate-500">
            Changes take effect globally across all active packs, PDFs, and team
            links.
          </p>
        </div>
      </form>
    </div>
  );
}
