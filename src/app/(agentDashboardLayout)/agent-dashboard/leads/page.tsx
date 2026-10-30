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
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

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
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");

  const [selectedPropertyFilter, setSelectedPropertyFilter] =
    useState("All Listings");
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [openStatusMenuId, setOpenStatusMenuId] = useState<string | null>(null);

  const [selectedLeadForDetails, setSelectedLeadForDetails] =
    useState<LeadInquiry | null>(null);
  const [selectedLeadForEmail, setSelectedLeadForEmail] =
    useState<LeadInquiry | null>(null);
  const [emailSubject, setEmailSubject] = useState(
    "Regarding your viewing request for 16 Gorse Drive",
  );
  const [emailBody, setEmailBody] = useState(
    "Hi David,\n\nThank you for booking a viewing for 16 Gorse Drive, Chorlton. We are pleased to confirm your appointment for Saturday, 17 October at 10:30 AM.\n\nOur valuer will meet you at the property.\n\nBest regards,\nPrestige Estates UK",
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
      avatarColor: "bg-[#1E293B]",
      propertyTitle: "16 Gorse Drive, Chorlton",
      propertyPrice: "£750,000 Guide",
      requestedDate: "Sat, 17 Oct",
      requestedTime: "11:30 AM",
      statusNote: "Calendar synced",
      statusNoteType: "success",
      status: "Confirmed",
      message:
        "Second viewing with my partner. Very interested in making an offer if conditions match survey.",
      preApproved: true,
    },
    {
      id: "lead-3",
      ref: "#PP-8104",
      buyerName: "Marcus Wright",
      email: "m.wright@gmail.com",
      phone: "+44 7700 900142",
      initials: "MW",
      avatarColor: "bg-[#0A2540]",
      propertyTitle: "42 Brookburn Road, Didsbury",
      propertyPrice: "£620,000 Guide",
      requestedDate: "Thu, 15 Oct",
      requestedTime: "02:00 PM",
      statusNote: "Viewing attended",
      statusNoteType: "muted",
      status: "Completed",
      message:
        "Attended viewing on Thursday. Awaiting vendor feedback on our £615k verbal proposal.",
      preApproved: false,
    },
    {
      id: "lead-4",
      ref: "#PP-7940",
      buyerName: "Sophie Lewis",
      email: "sophie.l@icloud.com",
      phone: "+44 7412 883344",
      initials: "SL",
      avatarColor: "bg-[#E11D48]",
      propertyTitle: "14 Victoria Road, Altrincham",
      propertyPrice: "£895,000 Guide",
      requestedDate: "Tue, 13 Oct",
      requestedTime: "04:30 PM",
      statusNote: "Buyer cancelled slot",
      statusNoteType: "danger",
      status: "Cancelled",
      message:
        "Had to reschedule due to work commitments. Will rebook for next weekend.",
      preApproved: false,
    },
    {
      id: "lead-5",
      ref: "#PP-8492",
      buyerName: "Jonathan Miller",
      email: "j.miller@hotmail.co.uk",
      phone: "+44 7921 556677",
      initials: "JM",
      avatarColor: "bg-[#065F46]",
      propertyTitle: "16 Gorse Drive, Chorlton",
      propertyPrice: "£750,000 Guide",
      requestedDate: "Sun, 18 Oct",
      requestedTime: "01:00 PM",
      statusNote: "Submitted 1 hour ago",
      statusNoteType: "warning",
      status: "Pending Action",
      message:
        "First-time buyers with DIP certificate from Santander ready for inspection.",
      preApproved: true,
    },
    {
      id: "lead-6",
      ref: "#PP-8104",
      buyerName: "Rachel Davies",
      email: "rachel.d@live.com",
      phone: "+44 7789 123987",
      initials: "RD",
      avatarColor: "bg-[#C2410C]",
      propertyTitle: "42 Brookburn Road, Didsbury",
      propertyPrice: "£620,000 Guide",
      requestedDate: "Sat, 17 Oct",
      requestedTime: "03:15 PM",
      statusNote: "Calendar synced",
      statusNoteType: "success",
      status: "Confirmed",
      message:
        "Relocating from London next month, looking for quick completion.",
      preApproved: true,
    },
  ]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("pp_captured_leads");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLeads((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newOnes = parsed.filter(
              (p: LeadInquiry) => !existingIds.has(p.id),
            );
            return [...newOnes, ...prev];
          });
        }
      }
    } catch (e) {
      console.error("Failed to load leads from localStorage", e);
    }
  }, []);

  const handleUpdateStatus = (leadId: string, newStatus: InquiryStatus) => {
    setLeads((prev) =>
      prev.map((item) =>
        item.id === leadId ? { ...item, status: newStatus } : item,
      ),
    );
    setOpenStatusMenuId(null);
    showToast(`Inquiry status updated to ${newStatus}`);
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((item) => item.id !== leadId));
    showToast("Lead removed from inquiries list");
  };

  const handleExportCSV = () => {
    const csvHeader =
      "Buyer Name,Email,Phone,Property Title,Price,Requested Date,Time,Status\n";
    const csvRows = leads
      .map(
        (l) =>
          `"${l.buyerName}","${l.email}","${l.phone}","${l.propertyTitle}","${l.propertyPrice}","${l.requestedDate}","${l.requestedTime}","${l.status}"`,
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

  const filteredLeads = leads.filter((lead) => {
    if (activeFilter === "pending" && lead.status !== "Pending Action")
      return false;
    if (activeFilter === "confirmed" && lead.status !== "Confirmed")
      return false;
    if (activeFilter === "completed" && lead.status !== "Completed")
      return false;
    if (activeFilter === "cancelled" && lead.status !== "Cancelled")
      return false;

    if (
      selectedPropertyFilter !== "All Listings" &&
      lead.propertyTitle !== selectedPropertyFilter
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#06143E] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[2]" />
          </div>
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* =========================================================================
          TOP PAGE HEADER (Concise & Clean Typography)
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-medium text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Buyer Inquiries &amp; Viewing Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Captured via Public Buyer Property Pages &amp; QR Codes
          </p>
        </div>

        {/* Reusable Button component with concise semibold weight */}
        <Button
          type="button"
          onClick={handleExportCSV}
          variant="secondary"
          size="md"
          icon={<Download className="w-4 h-4 text-[#E8A808]" />}
          className="self-start sm:self-auto"
        >
          Export Leads CSV
        </Button>
      </div>

      {/* =========================================================================
          TOP 4 METRICS CARDS (Clean, Concise Semibold Metrics)
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Inquiries */}
        <div className="@container bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-3">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            TOTAL INQUIRIES
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-medium text-3xl sm:text-4xl text-slate-900 tracking-tight">
              28
            </span>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <span>▲</span>
              <span>+12 this week</span>
            </span>
          </div>
        </div>

        {/* Card 2: Pending Review */}
        <div className="@container bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-3">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            PENDING REVIEW
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-medium text-3xl sm:text-4xl text-slate-900 tracking-tight">
              4
            </span>
            <Badge variant="brand" className="font-medium">
              Needs Action
            </Badge>
          </div>
        </div>

        {/* Card 3: Confirmed Viewings */}
        <div className="@container bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-3">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            CONFIRMED VIEWINGS
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-medium text-3xl sm:text-4xl text-slate-900 tracking-tight">
              18
            </span>
            <span className="text-xs font-medium text-blue-600 flex items-center gap-1.5 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>6 this weekend</span>
            </span>
          </div>
        </div>

        {/* Card 4: Viewing Conversion */}
        <div className="@container bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-3">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            VIEWING CONVERSION
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-medium text-3xl sm:text-4xl text-emerald-600 tracking-tight">
              78.5%
            </span>
            <span className="text-xs text-slate-400 font-normal">
              Lead to viewing
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FILTER PILLS & PROPERTY DROPDOWN
      ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto select-none py-1">
          {[
            { id: "all", label: "All (28)" },
            { id: "pending", label: "Pending (4)" },
            { id: "confirmed", label: "Confirmed (18)" },
            { id: "completed", label: "Completed (4)" },
            { id: "cancelled", label: "Cancelled (2)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                activeFilter === tab.id
                  ? "bg-[#06143E] text-white shadow-xs font-medium"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Property Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
            className="h-10 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-2 cursor-pointer shadow-2xs transition"
          >
            <span className="text-slate-400">Filter by Property:</span>
            <span className="font-medium text-slate-900 truncate max-w-[200px]">
              {selectedPropertyFilter}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {isPropertyDropdownOpen && (
            <div className="absolute right-0 top-11 z-30 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 space-y-1 text-left animate-in fade-in zoom-in-95 duration-150">
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
                  className={`w-full px-3 py-2 text-xs rounded-xl text-left transition cursor-pointer ${
                    selectedPropertyFilter === prop
                      ? "bg-slate-100 text-slate-900 font-medium"
                      : "text-slate-600 hover:bg-slate-50 font-normal"
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
          TABLE: BUYER DETAILS & VIEWINGS (Readable, Medium & Semibold locked)
      ========================================================================= */}
      <div className="@container bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase text-[10px] font-medium tracking-wider">
                <th className="py-3.5 pl-6 font-medium">BUYER DETAILS</th>
                <th className="py-3.5 font-medium">INTERESTED PROPERTY</th>
                <th className="py-3.5 font-medium">REQUESTED VIEWING</th>
                <th className="py-3.5 font-medium">STATUS</th>
                <th className="py-3.5 pr-6 text-right font-medium">ACTIONS</th>
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
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Column 1: Buyer Details */}
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-full ${lead.avatarColor} text-white flex items-center justify-center font-medium text-xs shrink-0 shadow-2xs`}
                        >
                          {lead.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 text-sm leading-snug">
                            {lead.buyerName}
                          </p>
                          <p className="text-slate-500 text-[11px] truncate mt-0.5">
                            {lead.email} • {lead.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Interested Property */}
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-slate-900 text-xs">
                          {lead.propertyTitle}
                        </p>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {lead.propertyPrice} • Ref: {lead.ref}
                        </p>
                      </div>
                    </td>

                    {/* Column 3: Requested Viewing */}
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-slate-900 text-xs">
                          {lead.requestedDate} • {lead.requestedTime}
                        </p>
                        <p
                          className={`text-[11px] mt-0.5 ${
                            lead.statusNoteType === "warning"
                              ? "text-amber-700 font-medium"
                              : lead.statusNoteType === "success"
                                ? "text-emerald-700 font-medium"
                                : lead.statusNoteType === "danger"
                                  ? "text-rose-700 font-medium"
                                  : "text-slate-400 font-normal"
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
                              openStatusMenuId === lead.id ? null : lead.id,
                            )
                          }
                          className={`h-8 px-3 rounded-full text-xs font-medium transition flex items-center gap-1.5 cursor-pointer border shadow-2xs ${
                            lead.status === "Pending Action"
                              ? "bg-amber-50 text-amber-800 border-amber-200/70 hover:bg-amber-100"
                              : lead.status === "Confirmed"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200/70 hover:bg-emerald-100"
                                : lead.status === "Completed"
                                  ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                                  : "bg-rose-50 text-rose-800 border-rose-200/70 hover:bg-rose-100"
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

                        {/* Dropdown Menu */}
                        {openStatusMenuId === lead.id && (
                          <div className="absolute left-0 top-9 z-30 w-44 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 space-y-0.5 text-left animate-in fade-in zoom-in-95 duration-100">
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
                                text: "text-slate-700",
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
                                    s.label as InquiryStatus,
                                  )
                                }
                                className={`w-full px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 hover:bg-slate-50 transition ${s.text} font-medium cursor-pointer ${
                                  lead.status === s.label
                                    ? "bg-slate-100 font-medium"
                                    : ""
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${s.dot}`}
                                />
                                <span>{s.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Column 5: Actions */}
                    <td className="py-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedLeadForDetails(lead)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                          title="View lead viewing details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLeadForEmail(lead);
                            setEmailSubject(
                              `Regarding your viewing request for ${lead.propertyTitle}`,
                            );
                            setEmailBody(
                              `Hi ${lead.buyerName.split(" ")[0]},\n\nThank you for booking a viewing for ${lead.propertyTitle}. We are pleased to confirm your appointment for ${lead.requestedDate} at ${lead.requestedTime}.\n\nOur agent will meet you at the property.\n\nBest regards,\nPrestige Estates`,
                            );
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#092167] hover:bg-slate-100 transition cursor-pointer"
                          title="Send email reply to lead"
                        >
                          <Mail className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete inquiry"
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

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-normal">
          <p>Showing {filteredLeads.length} of 6 inquiries</p>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-xl border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer">
              ‹
            </button>
            <button className="w-8 h-8 rounded-xl bg-[#06143E] text-white font-medium flex items-center justify-center shadow-2xs">
              1
            </button>
            <button className="w-8 h-8 rounded-xl border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer">
              2
            </button>
            <button className="w-8 h-8 rounded-xl border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: VIEW INQUIRY DETAILS
      ========================================================================= */}
      {selectedLeadForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${selectedLeadForDetails.avatarColor} text-white flex items-center justify-center font-medium text-sm shrink-0 shadow-sm`}
                >
                  {selectedLeadForDetails.initials}
                </div>
                <div>
                  <h3 className="font-heading font-medium text-lg text-slate-900">
                    {selectedLeadForDetails.buyerName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Lead Ref: {selectedLeadForDetails.ref}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLeadForDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                    CONTACT EMAIL
                  </span>
                  <a
                    href={`mailto:${selectedLeadForDetails.email}`}
                    className="font-medium text-[#092167] hover:underline"
                  >
                    {selectedLeadForDetails.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                    CONTACT PHONE
                  </span>
                  <a
                    href={`tel:${selectedLeadForDetails.phone}`}
                    className="font-medium text-slate-800 hover:underline"
                  >
                    {selectedLeadForDetails.phone}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                  REQUESTED PROPERTY
                </span>
                <p className="font-medium text-slate-900 text-sm">
                  {selectedLeadForDetails.propertyTitle}
                </p>
                <p className="text-slate-500 text-xs">
                  {selectedLeadForDetails.propertyPrice}
                </p>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-2xl border border-amber-200/70">
                <div>
                  <span className="text-[10px] font-medium text-amber-800 uppercase tracking-wider block">
                    APPOINTMENT TIME
                  </span>
                  <span className="font-medium text-amber-950 text-sm">
                    {selectedLeadForDetails.requestedDate} •{" "}
                    {selectedLeadForDetails.requestedTime}
                  </span>
                </div>
                <Badge variant="warning">{selectedLeadForDetails.status}</Badge>
              </div>

              {selectedLeadForDetails.message && (
                <div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                    BUYER MESSAGE / NOTE
                  </span>
                  <p className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed font-normal">
                    {selectedLeadForDetails.message}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLeadForDetails(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const lead = selectedLeadForDetails;
                  setSelectedLeadForDetails(null);
                  setSelectedLeadForEmail(lead);
                }}
                icon={<Mail className="w-3.5 h-3.5" />}
              >
                Email Lead
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: SEND EMAIL TO LEAD
      ========================================================================= */}
      {selectedLeadForEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#8C6605] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-medium text-lg text-slate-900">
                    Reply to {selectedLeadForEmail.buyerName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    To: {selectedLeadForEmail.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLeadForEmail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider mb-1.5">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#E8A808] focus:ring-1 focus:ring-[#E8A808]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider mb-1.5">
                  Email Message
                </label>
                <textarea
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-[#E8A808] focus:ring-1 focus:ring-[#E8A808]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLeadForEmail(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  showToast(`Email sent to ${selectedLeadForEmail.email}`);
                  setSelectedLeadForEmail(null);
                }}
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
