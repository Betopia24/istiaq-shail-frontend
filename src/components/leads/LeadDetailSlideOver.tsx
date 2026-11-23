"use client";

import React, { useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  X,
  Mail,
  Phone,
  Calendar,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { useGetLeadQuery } from "@/redux/api/leads/leadsApi";
import type { LeadDetail, LeadStatus } from "@/types/models";
import { formatDateTime, initials } from "@/lib/format";

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  pending: "Pending Action",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const EVENT_LABEL: Record<string, string> = {
  created: "Viewing Request Logged",
  emailed: "Email Sent",
  status_changed: "Status Changed",
  anonymised: "Personal Data Erased",
};

export type LeadDetailRow = LeadDetail & { id: string; status: LeadStatus; buyerName: string; email: string };

interface LeadDetailSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | null;
  canEdit?: boolean;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  onDeleteLead: (lead: LeadDetailRow) => void;
}

function eventNote(type: string, data: Record<string, unknown> | null | undefined) {
  if (type === "status_changed" && data) {
    const to = typeof data.to === "string" ? data.to : typeof data.status === "string" ? data.status : null;
    if (to) return `Now ${LEAD_STATUS_LABEL[to as LeadStatus] ?? to}`;
  }
  return null;
}

export const LeadDetailSlideOver: React.FC<LeadDetailSlideOverProps> = ({
  isOpen,
  onClose,
  leadId,
  canEdit = true,
  onStatusChange,
  onDeleteLead,
}) => {
  const { data: leadData, isFetching, error, refetch } = useGetLeadQuery(isOpen && leadId ? leadId : skipToken);

  const lead = leadData as LeadDetailRow | undefined;

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

  if (!isOpen || !leadId) return null;

  if (!lead) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Lead details"
        className="fixed inset-0 z-50 flex justify-end bg-[#06143E]/50 backdrop-blur-xs animate-in fade-in duration-200"
      >
        <div className="w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl p-6 space-y-4">
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer" aria-label="Close panel">
              <X className="w-5 h-5" />
            </button>
          </div>
          {error && !isFetching ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : (
            <div className="space-y-4 animate-pulse">
              <div className="h-11 w-2/3 bg-slate-200 rounded-2xl" />
              <div className="h-24 bg-slate-100 rounded-2xl" />
              <div className="h-32 bg-slate-100 rounded-2xl" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="slideover-title"
      className="fixed inset-0 z-50 flex justify-end bg-[#06143E]/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl bg-[#06143E] text-white font-heading font-bold text-sm flex items-center justify-center shadow-xs`}
            >
              {initials(lead.buyerName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="slideover-title"
                  className="font-heading font-bold text-lg text-slate-900 leading-tight"
                >
                  {lead.buyerName}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Buyer Lead &amp; Viewing Applicant
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Workflow Selector */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              Inquiry Lifecycle Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(LEAD_STATUS_LABEL) as LeadStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onStatusChange(lead.id, st)}
                  disabled={!canEdit}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition cursor-pointer ${
                    lead.status === st
                      ? "bg-[#092167] text-white border-[#092167] shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {LEAD_STATUS_LABEL[st]}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Buyer Contact Details
            </h3>
            <div className="divide-y divide-slate-100 border rounded-2xl border-slate-200 p-4 space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-2">
                <span className="text-slate-500 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email</span>
                </span>
                <a
                  href={`mailto:${lead.email}`}
                  className="font-medium text-[#092167] hover:underline"
                >
                  {lead.email}
                </a>
              </div>

              <div className="flex items-center justify-between pt-2 pb-2">
                <span className="text-slate-500 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone</span>
                </span>
                {lead.phone ? (
                  <a
                    href={`tel:${lead.phone}`}
                    className="font-medium text-slate-900 hover:underline"
                  >
                    {lead.phone}
                  </a>
                ) : (
                  <span className="text-slate-400">Not provided</span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Data Consent</span>
                </span>
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
                  {lead.consentGiven ? `Given ${formatDateTime(lead.consentAt)}` : "Not recorded"}
                </span>
              </div>
            </div>
          </div>

          {/* Property & Appointment */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Property &amp; Viewing Appointment
            </h3>
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  {lead.propertyTitle ?? lead.propertyAddress}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-amber-900 pt-1">
                <Calendar className="w-4 h-4 text-[#E8A808]" />
                <span className="font-medium">
                  {lead.requestedAt ? formatDateTime(lead.requestedAt) : "No time requested"}
                </span>
              </div>
            </div>
          </div>

          {/* Status History Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Audit &amp; Status History
            </h3>
            <div className="relative pl-5 space-y-4 border-l-2 border-slate-200 text-xs">
              {(lead.events ?? []).map((ev, i) => (
                <div key={`${ev.type}-${ev.createdAt}-${i}`} className="relative">
                  <span className={`w-2.5 h-2.5 rounded-full absolute -left-[26px] top-1 ${ev.type === "created" ? "bg-[#092167]" : "bg-emerald-500"}`} />
                  <p className="font-semibold text-slate-900">
                    {EVENT_LABEL[ev.type ?? ""] ?? ev.type}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {[eventNote(ev.type ?? "", ev.data), ev.actorName, formatDateTime(ev.createdAt)].filter(Boolean).join(" • ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onDeleteLead(lead)}
            aria-label="Delete lead"
            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
            title="Delete Lead"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
            <a
              href={`mailto:${lead.email}`}
              className="inline-flex items-center justify-center font-heading transition-all duration-200 cursor-pointer select-none h-9 px-3.5 text-xs rounded-lg gap-1.5 bg-[#E8A808] hover:bg-[#FFB800] text-[#06143E] font-semibold shadow-[0_2px_10px_rgba(232,168,8,0.3)]"
            >
              <span>Email Lead</span>
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailSlideOver;
