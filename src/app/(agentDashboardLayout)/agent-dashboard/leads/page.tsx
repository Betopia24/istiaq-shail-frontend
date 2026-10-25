"use client";

import React, { useState } from "react";
import {
  Download,
  Eye,
  Mail,
  Trash2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ChevronDown,
  X,
  Phone,
  Building,
  Send,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";

type InquiryStatus = "Pending Action" | "Confirmed" | "Completed" | "Cancelled";

interface LeadInquiry {
  id: string;
  ref: string;
  buyerName: string;
  email: string;
  phone: string;
  initials: string;
  avatarColor: string;
  propertyTitle: string;
  propertyPrice: string;
  requestedDate: string;
  requestedTime: string;
  statusNote: string;
  statusNoteType: "warning" | "success" | "muted" | "danger";
  status: InquiryStatus;
  message?: string;
  preApproved?: boolean;
}

export default function LeadsInquiriesPage() {
  // Filter tab state
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");

  // Property filter dropdown state
  const [selectedPropertyFilter, setSelectedPropertyFilter] =
    useState("All Listings");
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);

  // Status dropdown menu state (which row has dropdown open)
  const [openStatusMenuId, setOpenStatusMenuId] = useState<string | null>(null);

  // Modal states
  const [selectedLeadForDetails, setSelectedLeadForDetails] =
    useState<LeadInquiry | null>(null);
  const [selectedLeadForEmail, setSelectedLeadForEmail] =
    useState<LeadInquiry | null>(null);
  const [emailSubject, setEmailSubject] = useState(
    "Regarding your viewing request for 16 Gorse Drive"
  );
  const [emailBody, setEmailBody] = useState(
    "Hi David,\n\nThank you for booking a viewing for 16 Gorse Drive, Chorlton. We are pleased to confirm your appointment for Saturday, 17 October at 10:30 AM.\n\nOur valuer Ishtiaq Sohail will meet you at the property.\n\nBest regards,\nPrestige Estates UK"
  );

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Leads Data initialized to exact Figma screen
  const [leads, setLeads] = useState<LeadInquiry[]>([
    {
      id: "lead-1",
      ref: "#PP-8492",
      buyerName: "David Harrison",
      email: "david.h@gmail.com",
      phone: "+44 7911 234567",
      initials: "DH",
      avatarColor: "bg-[#06143E]",
      propertyTitle: "16 Gorse Drive, Chorlton",
      propertyPrice: "£750,000 Guide",
      requestedDate: "Sat, 17 Oct",
      requestedTime: "10:30 AM",
      statusNote: "Submitted 24 mins ago",
      statusNoteType: "warning",
      status: "Pending Action",
      message:
        "Looking to view this Saturday morning. We are chain-free cash buyers with mortgage in principle ready.",
      preApproved: true,
    },
    {
      id: "lead-2",
      ref: "#PP-8492",
      buyerName: "Emma Richardson",
      email: "emma.r@outlook.co.uk",
      phone: "+44 7822 998811",
      initials: "ER",
      avatarColor: "bg-slate-700",
      propertyTitle: "16 Gorse Drive, Chorlton",
      propertyPrice: "£750,000 Guide",
      requestedDate: "Sat, 17 Oct",
      requestedTime: "11:30 AM",
      statusNote: "Calendar synced",
      statusNoteType: "success",
      status: "Confirmed",
      message:
        "First time buyer looking for a family home close to Metrolink station.",
      preApproved: true,
    },
    {
      id: "lead-3",
      ref: "#PP-8104",
      buyerName: "Marcus Wright",
      email: "m.wright@gmail.com",
      phone: "+44 7700 900142",
      initials: "MW",
      avatarColor: "bg-blue-900",
      propertyTitle: "42 Brookburn Road, Didsbury",
      propertyPrice: "£620,000 Guide",
      requestedDate: "Thu, 15 Oct",
      requestedTime: "02:00 PM",
      statusNote: "Viewing attended",
      statusNoteType: "muted",
      status: "Completed",
      message:
        "Requested floor plan and parking specifications before viewing.",
      preApproved: false,
    },
    {
      id: "lead-4",
      ref: "#PP-7940",
      buyerName: "Sophie Lewis",
      email: "sophie.l@icloud.com",
      phone: "+44 7412 883344",
      initials: "SL",
      avatarColor: "bg-rose-600",
      propertyTitle: "14 Victoria Road, Altrincham",
      propertyPrice: "£895,000 Guide",
      requestedDate: "Tue, 13 Oct",
      requestedTime: "04:30 PM",
      statusNote: "Buyer cancelled slot",
      statusNoteType: "danger",
      status: "Cancelled",
      message:
        "Unable to attend due to work rescheduling. Will rebook next week.",
      preApproved: true,
    },
    {
      id: "lead-5",
      ref: "#PP-8492",
      buyerName: "Jonathan Miller",
      email: "j.miller@hotmail.co.uk",
      phone: "+44 7921 556677",
      initials: "JM",
      avatarColor: "bg-emerald-800",
      propertyTitle: "16 Gorse Drive, Chorlton",
      propertyPrice: "£750,000 Guide",
      requestedDate: "Sun, 18 Oct",
      requestedTime: "01:00 PM",
      statusNote: "Submitted 1 hour ago",
      statusNoteType: "warning",
      status: "Pending Action",
      message: "Relocating from London, eager for prompt viewing.",
      preApproved: true,
    },
    {
      id: "lead-6",
      ref: "#PP-8104",
      buyerName: "Rachel Davies",
      email: "rachel.d@live.com",
      phone: "+44 7789 123987",
      initials: "RD",
      avatarColor: "bg-amber-700",
      propertyTitle: "42 Brookburn Road, Didsbury",
      propertyPrice: "£620,000 Guide",
      requestedDate: "Sat, 17 Oct",
      requestedTime: "03:15 PM",
      statusNote: "Calendar synced",
      statusNoteType: "success",
      status: "Confirmed",
      message: "Looking for garden orientation and EPC details.",
      preApproved: true,
    },
  ]);

  // Sync leads dynamically from public property viewing requests
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("pp_captured_leads");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLeads((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newOnes = parsed.filter((p: LeadInquiry) => !existingIds.has(p.id));
            return [...newOnes, ...prev];
          });
        }
      }
    } catch (e) {
      console.error("Failed to load leads from localStorage", e);
    }
  }, []);

  // Update Status handler
  const handleUpdateStatus = (leadId: string, newStatus: InquiryStatus) => {
    setLeads((prev) =>
      prev.map((item) =>
        item.id === leadId ? { ...item, status: newStatus } : item
      )
    );
    setOpenStatusMenuId(null);
    showToast(`Inquiry status updated to ${newStatus}`);
  };

  // Delete lead handler
  const handleDeleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((item) => item.id !== leadId));
    showToast("Lead removed from inquiries list");
  };

  // Export CSV handler
  const handleExportCSV = () => {
    const csvHeader =
      "Buyer Name,Email,Phone,Property Title,Price,Requested Date,Time,Status\n";
    const csvRows = leads
      .map(
        (l) =>
          `"${l.buyerName}","${l.email}","${l.phone}","${l.propertyTitle}","${l.propertyPrice}","${l.requestedDate}","${l.requestedTime}","${l.status}"`
      )
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_inquiries_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Leads CSV exported successfully!");
  };

  // Filter leads based on activeFilter & property filter
  const filteredLeads = leads.filter((lead) => {
    // Status filter
    if (activeFilter === "pending" && lead.status !== "Pending Action")
      return false;
    if (activeFilter === "confirmed" && lead.status !== "Confirmed")
      return false;
    if (activeFilter === "completed" && lead.status !== "Completed")
      return false;
    if (activeFilter === "cancelled" && lead.status !== "Cancelled")
      return false;

    // Property filter
    if (
      selectedPropertyFilter !== "All Listings" &&
      lead.propertyTitle !== selectedPropertyFilter
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-7 pb-16">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#06143E] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* =========================================================================
          TOP PAGE HEADER
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Buyer Inquiries &amp; Viewing Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Captured via Public Buyer Property Pages &amp; QR Codes
          </p>
        </div>

        {/* Export CSV Button matching Figma */}
        <button
          type="button"
          onClick={handleExportCSV}
          className="h-10 px-5 rounded-lg bg-[#06143E] hover:bg-[#092167] active:bg-[#040E2C] text-white font-heading font-bold text-xs shadow-sm transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <span>Export Leads CSV</span>
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* =========================================================================
          TOP 4 METRICS CARDS (Exact Figma Frame)
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Inquiries */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            TOTAL INQUIRIES
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900">
              28
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <span>▲</span>
              <span>+12 this week</span>
            </span>
          </div>
        </div>

        {/* Card 2: Pending Review */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            PENDING REVIEW
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900">
              4
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FEF3C7] text-[#B45309]">
              Needs Action
            </span>
          </div>
        </div>

        {/* Card 3: Confirmed Viewings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            CONFIRMED VIEWINGS
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900">
              18
            </span>
            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>6 this weekend</span>
            </span>
          </div>
        </div>

        {/* Card 4: Viewing Conversion */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            VIEWING CONVERSION
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-emerald-600">
              78.5%
            </span>
            <span className="text-xs text-slate-400">Lead to viewing</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FILTER PILLS & PROPERTY DROPDOWN
      ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto select-none">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeFilter === "all"
                ? "bg-[#06143E] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            All (28)
          </button>

          <button
            onClick={() => setActiveFilter("pending")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeFilter === "pending"
                ? "bg-[#06143E] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Pending (4)
          </button>

          <button
            onClick={() => setActiveFilter("confirmed")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeFilter === "confirmed"
                ? "bg-[#06143E] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Confirmed (18)
          </button>

          <button
            onClick={() => setActiveFilter("completed")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeFilter === "completed"
                ? "bg-[#06143E] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Completed (4)
          </button>

          <button
            onClick={() => setActiveFilter("cancelled")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              activeFilter === "cancelled"
                ? "bg-[#06143E] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Cancelled (2)
          </button>
        </div>

        {/* Right Property Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
            className="h-9 px-4 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <span className="text-slate-400">Filter by Property:</span>
            <span className="font-bold text-slate-900 truncate max-w-[200px]">
              {selectedPropertyFilter}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {isPropertyDropdownOpen && (
            <div className="absolute right-0 top-10 z-30 w-64 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 space-y-0.5 text-left animate-in fade-in zoom-in-95 duration-100">
              {[
                "All Listings",
                "16 Gorse Drive, Chorlton",
                "42 Brookburn Road, Didsbury",
                "14 Victoria Road, Altrincham",
              ].map((prop) => (
                <button
                  key={prop}
                  type="button"
                  onClick={() => {
                    setSelectedPropertyFilter(prop);
                    setIsPropertyDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-xs rounded-lg text-left transition cursor-pointer ${
                    selectedPropertyFilter === prop
                      ? "bg-slate-100 text-slate-900 font-bold"
                      : "text-slate-600 hover:bg-slate-50 font-medium"
                  }`}
                >
                  {prop}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          TABLE: BUYER DETAILS & VIEWINGS (Matching Figma Frame)
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 pl-6 font-semibold">BUYER DETAILS</th>
                <th className="py-3.5 font-semibold">INTERESTED PROPERTY</th>
                <th className="py-3.5 font-semibold">REQUESTED VIEWING</th>
                <th className="py-3.5 font-semibold">STATUS</th>
                <th className="py-3.5 pr-6 text-right font-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No inquiries found for this filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50/70 transition group"
                  >
                    {/* Column 1: Buyer Details */}
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${lead.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
                        >
                          {lead.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm">
                            {lead.buyerName}
                          </p>
                          <p className="text-slate-500 text-[11px] truncate">
                            {lead.email} • {lead.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Interested Property */}
                    <td className="py-4">
                      <div>
                        <p className="font-bold text-slate-900 text-xs">
                          {lead.propertyTitle}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          {lead.propertyPrice} • Ref: {lead.ref}
                        </p>
                      </div>
                    </td>

                    {/* Column 3: Requested Viewing */}
                    <td className="py-4">
                      <div>
                        <p className="font-bold text-slate-900 text-xs">
                          {lead.requestedDate} • {lead.requestedTime}
                        </p>
                        <p
                          className={`text-[11px] font-medium ${
                            lead.statusNoteType === "warning"
                              ? "text-amber-600 font-semibold"
                              : lead.statusNoteType === "success"
                              ? "text-emerald-600 font-semibold"
                              : lead.statusNoteType === "danger"
                              ? "text-rose-600 font-semibold"
                              : "text-slate-400"
                          }`}
                        >
                          {lead.statusNote}
                        </p>
                      </div>
                    </td>

                    {/* Column 4: Status Selector Dropdown */}
                    <td className="py-4 relative">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenStatusMenuId(
                              openStatusMenuId === lead.id ? null : lead.id
                            )
                          }
                          className={`h-8 px-3 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-2xs ${
                            lead.status === "Pending Action"
                              ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                              : lead.status === "Confirmed"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                              : lead.status === "Completed"
                              ? "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                              : "bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              lead.status === "Pending Action"
                                ? "bg-amber-500"
                                : lead.status === "Confirmed"
                                ? "bg-emerald-500"
                                : lead.status === "Completed"
                                ? "bg-slate-500"
                                : "bg-rose-500"
                            }`}
                          />
                          <span>{lead.status}</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>

                        {/* Dropdown Menu matching Figma */}
                        {openStatusMenuId === lead.id && (
                          <div className="absolute left-0 top-9 z-30 w-44 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 space-y-0.5 text-left animate-in fade-in zoom-in-95 duration-100">
                            {[
                              {
                                label: "Pending Action",
                                dot: "bg-amber-500",
                                text: "text-amber-800",
                              },
                              {
                                label: "Confirmed",
                                dot: "bg-emerald-500",
                                text: "text-emerald-800",
                              },
                              {
                                label: "Completed",
                                dot: "bg-slate-500",
                                text: "text-slate-800",
                              },
                              {
                                label: "Cancelled",
                                dot: "bg-rose-500",
                                text: "text-rose-800",
                              },
                            ].map((s) => (
                              <button
                                key={s.label}
                                type="button"
                                onClick={() =>
                                  handleUpdateStatus(
                                    lead.id,
                                    s.label as InquiryStatus
                                  )
                                }
                                className={`w-full px-3 py-2 text-xs rounded-lg flex items-center justify-between cursor-pointer transition ${
                                  lead.status === s.label
                                    ? "bg-slate-100 font-bold"
                                    : "hover:bg-slate-50 font-medium"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span
                                    className={`w-2 h-2 rounded-full ${s.dot}`}
                                  />
                                  <span className={s.text}>{s.label}</span>
                                </span>
                                {lead.status === s.label && (
                                  <Check className="w-3.5 h-3.5 text-amber-600" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Column 5: Actions */}
                    <td className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-400">
                        {/* View Lead Details */}
                        <button
                          type="button"
                          onClick={() => setSelectedLeadForDetails(lead)}
                          title="View Lead Details"
                          className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Email Buyer */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLeadForEmail(lead);
                            setEmailSubject(
                              `Viewing Confirmation: ${lead.propertyTitle}`
                            );
                            setEmailBody(
                              `Hi ${lead.buyerName.split(" ")[0]},\n\nThank you for requesting a viewing for ${lead.propertyTitle}.\nWe are pleased to confirm your appointment for ${lead.requestedDate} at ${lead.requestedTime}.\n\nOur valuer Ishtiaq Sohail will meet you at the property.\n\nBest regards,\nPrestige Estates UK`
                            );
                          }}
                          title="Email Buyer"
                          className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Mail className="w-4 h-4" />
                        </button>

                        {/* Delete Lead */}
                        <button
                          type="button"
                          onClick={() => handleDeleteLead(lead.id)}
                          title="Delete Lead"
                          className="p-1.5 rounded-lg hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* =========================================================================
            BOTTOM PAGINATION BAR
        ========================================================================= */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <p>
            Showing 1 to {filteredLeads.length} of {leads.length} inquiries
          </p>

          <div className="flex items-center gap-1.5 select-none">
            <button
              type="button"
              disabled
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-300 cursor-not-allowed"
            >
              &lt;
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-[#06143E] text-white font-bold flex items-center justify-center cursor-pointer shadow-2xs"
            >
              1
            </button>
            <button
              type="button"
              onClick={() => showToast("Loading Page 2...")}
              className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold flex items-center justify-center cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              onClick={() => showToast("Loading Next Page...")}
              className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: VIEW LEAD DETAILS
      ========================================================================= */}
      {selectedLeadForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full ${selectedLeadForDetails.avatarColor} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm`}
                >
                  {selectedLeadForDetails.initials}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    {selectedLeadForDetails.buyerName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lead Ref: {selectedLeadForDetails.ref}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadForDetails(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-xs">
              {/* Contact info grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedLeadForDetails.email}`}
                    className="font-semibold text-slate-800 hover:text-blue-600 truncate block mt-0.5"
                  >
                    {selectedLeadForDetails.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Mobile Phone
                  </span>
                  <a
                    href={`tel:${selectedLeadForDetails.phone}`}
                    className="font-semibold text-slate-800 hover:text-blue-600 block mt-0.5"
                  >
                    {selectedLeadForDetails.phone}
                  </a>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Property Requested
                </span>
                <p className="font-bold text-slate-900 text-sm">
                  {selectedLeadForDetails.propertyTitle}
                </p>
                <p className="text-slate-500 font-medium">
                  {selectedLeadForDetails.propertyPrice}
                </p>
              </div>

              {/* Viewing Slot */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Preferred Viewing Time
                </span>
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 flex items-center justify-between">
                  <span className="font-bold">
                    {selectedLeadForDetails.requestedDate} at{" "}
                    {selectedLeadForDetails.requestedTime}
                  </span>
                  <span className="text-[11px] font-medium">
                    {selectedLeadForDetails.statusNote}
                  </span>
                </div>
              </div>

              {/* Buyer Notes / Message */}
              {selectedLeadForDetails.message && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Buyer Message
                  </span>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed italic">
                    &ldquo;{selectedLeadForDetails.message}&rdquo;
                  </p>
                </div>
              )}

              {/* Pre-approval pill */}
              <div className="flex items-center gap-2 pt-1 text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mortgage Agreement in Principle (AIP) confirmed</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedLeadForDetails(null)}
                className="h-10 px-5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const lead = selectedLeadForDetails;
                  setSelectedLeadForDetails(null);
                  setSelectedLeadForEmail(lead);
                }}
                className="h-10 px-6 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] font-heading font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply by Email</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EMAIL BUYER DIRECTLY
      ========================================================================= */}
      {selectedLeadForEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Send Response to Buyer
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Replying to {selectedLeadForEmail.buyerName} (
                  {selectedLeadForEmail.email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadForEmail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSelectedLeadForEmail(null);
                showToast(`Email sent to ${selectedLeadForEmail.email}!`);
              }}
              className="space-y-4 text-xs"
            >
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  SUBJECT LINE
                </label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  MESSAGE BODY
                </label>
                <textarea
                  rows={6}
                  required
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition resize-y leading-relaxed font-sans"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Sender: Ishtiaq Sohail (info@prestigeestates.co.uk)</span>
                <span className="text-emerald-600 font-semibold">
                  Verified Mailer
                </span>
              </div>

              {/* Footer Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedLeadForEmail(null)}
                  className="h-10 px-5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
