"use client";

import { AgencyDataSection } from "@/components/settings/PrivacySettings";
import React, { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Scale,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { CardGridSkeleton } from "@/components/ui/skeletons/CardGridSkeleton";
import { errorText } from "@/lib/auth/client";
import { useAppSelector } from "@/redux/hook";
import {
  useGetBrandingQuery,
  useGetComplianceQuery,
  useUpdateComplianceMutation,
} from "@/redux/api/agency/agencyApi";

type ComplianceForm = {
  redressScheme: string;
  redressMembershipNo: string;
  cmpScheme: string;
  cmpNumber: string;
  hmrcAmlNumber: string;
  showMaterialInfo: boolean;
  requireEpc: boolean;
  autoPullFloodBroadband: boolean;
};;

type CmpSchemeType = string;

const STANDARD_DISCLAIMER =
  "These property particulars are produced in good faith and do not form part of any contractual agreement. All measurements, floor plans, and photographic references are for guidance only and must not be relied upon as statements of fact.";

export const RegionalComplianceTab: React.FC = () => {
  const role = useAppSelector((st) => st.user.user?.role);
  const canEdit = role === "owner" || role === "administrator";

  const compliance = useGetComplianceQuery();
  const branding = useGetBrandingQuery();
  const [updateCompliance, { isLoading: isSaving }] = useUpdateComplianceMutation();

  const [form, setForm] = useState<ComplianceForm | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Seed the editable form once the API data arrives.
  const [seededFrom, setSeededFrom] = useState<unknown>(null);
  if (compliance.data && seededFrom !== compliance.data) {
    setSeededFrom(compliance.data);
    const c = compliance.data;
    setForm({
      redressScheme: c.redressScheme ?? "",
      redressMembershipNo: c.redressMembershipNo ?? "",
      cmpScheme: c.cmpScheme ?? "",
      cmpNumber: c.cmpNumber ?? "",
      hmrcAmlNumber: c.hmrcAmlNumber ?? "",
      showMaterialInfo: c.showMaterialInfo !== false,
      requireEpc: c.requireEpc !== false,
      autoPullFloodBroadband: c.autoPullFloodBroadband === true,
    });
  }

  const getRedressLabel = (scheme: string) => {
    if (scheme === "TPO") return "The Property Ombudsman (TPO)";
    if (scheme === "PRS") return "Property Redress Scheme (PRS)";
    return scheme || "a redress scheme";
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
        return scheme || "Client Money Protection";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !canEdit) return;
    setFieldErrors({});
    try {
      await updateCompliance(form).unwrap();
      toast.success("Regional compliance settings saved");
    } catch (err) {
      const info = apiErrorInfo(err);
      if (info.status === 422) setFieldErrors(info.fields);
      toast.error(errorText(err));
    }
  };

  if (compliance.isLoading) return <CardGridSkeleton />;
  if (compliance.error) return <ErrorState error={compliance.error} onRetry={() => compliance.refetch()} />;
  if (!form) return null;

  const set = <K extends keyof ComplianceForm>(key: K, value: ComplianceForm[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  const err = (k: string) =>
    fieldErrors[k] ? <p className="text-[11px] text-rose-600">{fieldErrors[k]}</p> : null;

  const agencyName = branding.data?.agencyName || "Your agency";
  const disclaimer = branding.data?.disclaimerText?.trim() || STANDARD_DISCLAIMER;
  const redressScheme = form.redressScheme;
  const redressMembershipNumber = form.redressMembershipNo;
  const cmpScheme = form.cmpScheme;
  const cmpCertificateNumber = form.cmpNumber;
  const amlNumber = form.hmrcAmlNumber;

  const generatedFooterPreview = `${agencyName} is a member of ${getRedressLabel(
    redressScheme,
  )} (Membership: ${redressMembershipNumber || "n/a"}) and holds Client Money Protection via ${getCmpLabel(
    cmpScheme,
  )} (Cert: ${cmpCertificateNumber || "n/a"}). Supervised by HM Revenue & Customs for Anti-Money Laundering Regulations (AML Reg: ${amlNumber || "n/a"}). Consumer Protection from Unfair Trading Regulations 2008 (CPR): ${disclaimer}`;

  return (
    <div className="space-y-6">
    <form onSubmit={handleSave} className="space-y-6">
      <fieldset disabled={!canEdit || isSaving} className="contents">
      {!canEdit && (
        <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          Only owners and administrators can change these settings.
        </p>
      )}
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
                onClick={() => set("redressScheme", "TPO")}
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
                  onChange={() => set("redressScheme", "TPO")}
                  className="w-4 h-4 text-[#092167]"
                />
              </label>

              <label
                onClick={() => set("redressScheme", "PRS")}
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
                  onChange={() => set("redressScheme", "PRS")}
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
                value={redressMembershipNumber}
                onChange={(e) => set("redressMembershipNo", e.target.value)}
                placeholder="e.g. T01928 or PRS00284"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
              />
              {err("redressMembershipNo")}
              {err("redressScheme")}
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
                  onChange={(e) => set("cmpScheme", e.target.value as CmpSchemeType)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                >
                  <option value="">Select scheme</option>
                  {cmpScheme && !["Propertymark", "MoneyShield", "ClientMoneyProtect", "Safeagent", "RICS"].includes(cmpScheme) && (
                    <option value={cmpScheme}>{cmpScheme}</option>
                  )}
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
                  value={cmpCertificateNumber}
                  onChange={(e) => set("cmpNumber", e.target.value)}
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
                  value={amlNumber}
                  onChange={(e) => set("hmrcAmlNumber", e.target.value)}
                  placeholder="e.g. XAML00000192837"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 uppercase focus:outline-none focus:border-[#092167]"
                />
              </div>

            </div>
            {err("hmrcAmlNumber")}
          </div>

          {/* Card 4            </div>
          </div>

          {/* Card 4: Trading Standards Material Information Checklists */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
            <div>
              <h3 className="font-heading font-medium text-base text-slate-900">
                National Trading Standards Material Information
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
                    Show material information
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Council tax, asking price and tenure appear on brochures and
                    portal listings.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.showMaterialInfo}
                  onChange={(e) => set("showMaterialInfo", e.target.checked)}
                  className="w-4 h-4 rounded text-[#092167]"
                />
              </div>

              {/* Part B */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Require EPC rating
                  </p>
                  <p className="text-[11px] text-slate-500">
                    A pack needs an EPC rating before it can be generated.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.requireEpc}
                  onChange={(e) => set("requireEpc", e.target.checked)}
                  className="w-4 h-4 rounded text-[#092167]"
                />
              </div>

              {/* Part C */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Auto-pull flood risk &amp; broadband
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Look up flood risk and broadband speeds automatically for each
                    property.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.autoPullFloodBroadband}
                  onChange={(e) => set("autoPullFloodBroadband", e.target.checked)}
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
                <span>{agencyName.toUpperCase()}</span>
                <span>PAGE 2 OF 2 • LEGAL PARTICULARS</span>
              </div>
              <p className="text-slate-300 font-mono text-[10px] leading-relaxed">
                {generatedFooterPreview}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {branding.data?.disclaimerText?.trim()
                  ? "Using your custom disclaimer from Agency Branding."
                  : "Using the standard CPR 2008 text. Add a custom disclaimer on the Agency Branding page."}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={!canEdit || isSaving}
                className="disabled:opacity-60 w-full h-11 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-semibold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                <span>Save All Compliance Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      </fieldset>
    </form>
      <AgencyDataSection />
    </div>
  );
};

export default RegionalComplianceTab;
