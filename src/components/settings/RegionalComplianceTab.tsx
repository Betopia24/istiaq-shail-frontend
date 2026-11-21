"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Scale,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

type CmpSchemeType =
  | "Propertymark"
  | "MoneyShield"
  | "ClientMoneyProtect"
  | "Safeagent"
  | "RICS";

export const RegionalComplianceTab: React.FC = () => {
  const [redressScheme, setRedressScheme] = useState<"TPO" | "PRS">("TPO");
  const [redressMembershipNumber, setRedressMembershipNumber] =
    useState("T01928-PRS");

  const [cmpScheme, setCmpScheme] = useState<CmpSchemeType>("Propertymark");
  const [cmpCertificateNumber, setCmpCertificateNumber] =
    useState("C0014285-CMP");

  const [amlNumber, setAmlNumber] = useState("XAML00000192837");
  const [mlroName, setMlroName] = useState("Ishtiaq Sohail");

  const [tradingStandardsParts, setTradingStandardsParts] = useState({
    partA: true, // Price, Tenure, Council Tax Band
    partB: true, // Physical Characteristics, Utilities, Heating
    partC: true, // Flood Risk, Mining, Restrictive Covenants
  });

  const [disclaimerType, setDisclaimerType] = useState<"standard" | "custom">(
    "standard",
  );
  const [customDisclaimer, setCustomDisclaimer] = useState(
    "These particulars are prepared for guidance only and do not constitute part of an offer or contract. All descriptions, dimensions, and reference to condition are given in good faith.",
  );

  const getRedressLabel = (scheme: string) => {
    return scheme === "TPO"
      ? "The Property Ombudsman (TPO)"
      : "Property Redress Scheme (PRS)";
  };

  const getCmpLabel = (scheme: string) => {
    switch (scheme) {
      case "Propertymark":
        return "Propertymark Client Money Protection";
      case "MoneyShield":
        return "Money Shield CMP";
      case "ClientMoneyProtect":
        return "Client Money Protect (CMP)";
      case "Safeagent":
        return "Safeagent CMP Scheme";
      case "RICS":
        return "RICS Client Money Protection Scheme";
      default:
        return "Client Money Protection";
    }
  };

  const generatedFooterPreview = `Prestige Estates UK Ltd is a member of ${getRedressLabel(
    redressScheme,
  )} (Membership: ${redressMembershipNumber}) and holds Client Money Protection via ${getCmpLabel(
    cmpScheme,
  )} (Cert: ${cmpCertificateNumber}). Supervised by HM Revenue & Customs for Anti-Money Laundering Regulations (AML Reg: ${amlNumber}). Consumer Protection from Unfair Trading Regulations 2008 (CPR): ${
    disclaimerType === "standard"
      ? "These property particulars are produced in good faith and do not form part of any contractual agreement. All measurements, floor plans, and photographic references are for guidance only and must not be relied upon as statements of fact."
      : customDisclaimer
  }`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("UK Regional Compliance credentials updated successfully!");
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Consumer Redress Scheme */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5 shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#E8A808]" />
                  <h3 className="font-heading font-medium text-base text-slate-900">
                    Mandatory Consumer Redress Scheme
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Estate agents in the UK are legally required under the
                  Consumers, Estate Agents and Redress Act 2007 to belong to a
                  government-approved redress scheme.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setRedressScheme("TPO")}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                  redressScheme === "TPO"
                    ? "border-[#092167] bg-blue-50/50 shadow-2xs"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div>
                  <p className="font-medium text-xs text-slate-900">
                    The Property Ombudsman
                  </p>
                  <p className="text-[10px] text-slate-500">TPO Approved</p>
                </div>
                <input
                  type="radio"
                  name="redress"
                  checked={redressScheme === "TPO"}
                  onChange={() => setRedressScheme("TPO")}
                  className="w-4 h-4 text-[#092167]"
                />
              </label>

              <label
                onClick={() => setRedressScheme("PRS")}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                  redressScheme === "PRS"
                    ? "border-[#092167] bg-blue-50/50 shadow-2xs"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div>
                  <p className="font-medium text-xs text-slate-900">
                    Property Redress Scheme
                  </p>
                  <p className="text-[10px] text-slate-500">PRS Accredited</p>
                </div>
                <input
                  type="radio"
                  name="redress"
                  checked={redressScheme === "PRS"}
                  onChange={() => setRedressScheme("PRS")}
                  className="w-4 h-4 text-[#092167]"
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Redress Scheme Membership / Reference Number
              </label>
              <input
                type="text"
                required
                value={redressMembershipNumber}
                onChange={(e) => setRedressMembershipNumber(e.target.value)}
                placeholder="e.g. T01928 or PRS00284"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
              />
            </div>
          </div>

          {/* Card 2: Client Money Protection (CMP) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5 shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E8A808]" />
                <h3 className="font-heading font-medium text-base text-slate-900">
                  Client Money Protection (CMP)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Mandatory for all letting agents holding tenant deposits or
                landlord rent monies under The Client Money Protection Schemes
                Regulations 2019.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  CMP Provider Scheme
                </label>
                <select
                  value={cmpScheme}
                  onChange={(e) =>
                    setCmpScheme(e.target.value as CmpSchemeType)
                  }
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                >
                  <option value="Propertymark">Propertymark CMP</option>
                  <option value="MoneyShield">Money Shield</option>
                  <option value="ClientMoneyProtect">
                    Client Money Protect
                  </option>
                  <option value="Safeagent">Safeagent CMP</option>
                  <option value="RICS">RICS Client Money Protection</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Certificate / Policy Number
                </label>
                <input
                  type="text"
                  required
                  value={cmpCertificateNumber}
                  onChange={(e) => setCmpCertificateNumber(e.target.value)}
                  placeholder="e.g. C0014285-CMP"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                />
              </div>
            </div>
          </div>

          {/* Card 3: HMRC Anti-Money Laundering (AML) Supervision */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5 shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#E8A808]" />
                <h3 className="font-heading font-medium text-base text-slate-900">
                  HMRC Anti-Money Laundering (AML)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Property businesses must be registered with HMRC under the Money
                Laundering, Terrorist Financing and Transfer of Funds Regulations
                2017.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  HMRC AML Registration Number
                </label>
                <input
                  type="text"
                  required
                  value={amlNumber}
                  onChange={(e) => setAmlNumber(e.target.value)}
                  placeholder="e.g. XAML00000192837"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 uppercase focus:outline-none focus:border-[#092167]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Nominated Officer / MLRO
                </label>
                <input
                  type="text"
                  required
                  value={mlroName}
                  onChange={(e) => setMlroName(e.target.value)}
                  placeholder="e.g. Ishtiaq Sohail"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Trading Standards Material Information Checklists */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
            <div>
              <h3 className="font-heading font-medium text-base text-slate-900">
                National Trading Standards Material Information (Parts A, B & C)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                National Trading Standards Estate and Letting Agency Team
                (NTSELAT) guidelines compliance.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {/* Part A */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Part A: Council Tax, Asking Price &amp; Tenure
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Mandatory for all property portals and brochures at point of
                    marketing.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={tradingStandardsParts.partA}
                  onChange={(e) =>
                    setTradingStandardsParts((prev) => ({
                      ...prev,
                      partA: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-[#092167]"
                />
              </div>

              {/* Part B */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Part B: Utilities, Construction &amp; Parking
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Heating source, sewerage, electricity, and broadband speeds.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={tradingStandardsParts.partB}
                  onChange={(e) =>
                    setTradingStandardsParts((prev) => ({
                      ...prev,
                      partB: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-[#092167]"
                />
              </div>

              {/* Part C */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Part C: Flood Risk, Rights of Way &amp; Covenants
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Environmental risks, mining heritage, and conservation area
                    status.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={tradingStandardsParts.partC}
                  onChange={(e) =>
                    setTradingStandardsParts((prev) => ({
                      ...prev,
                      partC: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-[#092167]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live PDF Footer Preview & Disclaimer */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-2xs sticky top-20">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6605] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                  LIVE PDF &amp; BROCHURE PREVIEW
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h4 className="font-heading font-medium text-sm text-slate-900 mt-2">
                Exported Footnote Disclaimer
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically appended to page 2 of every generated PDF pack and
                public viewing link.
              </p>
            </div>

            <div className="rounded-xl border border-slate-300 bg-slate-900 text-slate-200 p-4 space-y-3 font-sans text-[11px] leading-relaxed shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <span>PRESTIGE ESTATES UK</span>
                <span>PAGE 2 OF 2 • LEGAL PARTICULARS</span>
              </div>
              <p className="text-slate-300 font-mono text-[10px] leading-relaxed">
                {generatedFooterPreview}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Brochure Disclaimer Text Choice
              </label>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="radio"
                    name="disclaimerChoice"
                    checked={disclaimerType === "standard"}
                    onChange={() => setDisclaimerType("standard")}
                    className="w-3.5 h-3.5 text-[#092167]"
                  />
                  <span>Standard CPR 2008 &amp; RICS Recommended Text</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="radio"
                    name="disclaimerChoice"
                    checked={disclaimerType === "custom"}
                    onChange={() => setDisclaimerType("custom")}
                    className="w-3.5 h-3.5 text-[#092167]"
                  />
                  <span>Custom Solicitor-Approved Notice</span>
                </label>
              </div>

              {disclaimerType === "custom" && (
                <div className="pt-2">
                  <textarea
                    rows={3}
                    value={customDisclaimer}
                    onChange={(e) => setCustomDisclaimer(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                  />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-semibold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                <span>Save All Compliance Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RegionalComplianceTab;
