"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Building,
  CheckCircle2,
  Trash2,
  Plus,
  Send,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export interface LeadDetailData {
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
  status: "Pending Action" | "Confirmed" | "Completed" | "Cancelled";
  message?: string;
  preApproved?: boolean;
}

interface LeadDetailSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadDetailData | null;
  onStatusChange: (leadId: string, newStatus: LeadDetailData["status"]) => void;
  onEmailLead: (lead: LeadDetailData) => void;
  onDeleteLead: (lead: LeadDetailData) => void;
}

export const LeadDetailSlideOver: React.FC<LeadDetailSlideOverProps> = ({
  isOpen,
  onClose,
  lead,
  onStatusChange,
  onEmailLead,
  onDeleteLead,
}) => {
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState<
    { id: string; author: string; time: string; text: string }[]
  >([
    {
      id: "note-1",
      author: "Eleanor Vance",
      time: "Today, 10:45 AM",
      text: "Buyer confirmed mortgage in principle with Halifax (£800k). Proceeding with viewing.",
    },
  ]);

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

  if (!isOpen || !lead) return null;

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes((prev) => [
      ...prev,
      {
        id: `note-${Date.now()}`,
        author: "Agent",
        time: "Just now",
        text: newNote.trim(),
      },
    ]);
    setNewNote("");
    toast.success("Note added to lead record");
  };

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
              className={`w-11 h-11 rounded-2xl ${lead.avatarColor} text-white font-heading font-bold text-sm flex items-center justify-center shadow-xs`}
            >
              {lead.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="slideover-title"
                  className="font-heading font-bold text-lg text-slate-900 leading-tight"
                >
                  {lead.buyerName}
                </h2>
                <span className="text-[10px] font-mono text-slate-400">
                  {lead.ref}
                </span>
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
              {(
                [
                  "Pending Action",
                  "Confirmed",
                  "Completed",
                  "Cancelled",
                ] as LeadDetailData["status"][]
              ).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onStatusChange(lead.id, st)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition cursor-pointer ${
                    lead.status === st
                      ? "bg-[#092167] text-white border-[#092167] shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {st}
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
                <a
                  href={`tel:${lead.phone}`}
                  className="font-medium text-slate-900 hover:underline"
                >
                  {lead.phone}
                </a>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mortgage Status</span>
                </span>
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
                  {lead.preApproved ? "Pre-Approved Decision" : "Self-Funded"}
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
                  {lead.propertyTitle}
                </span>
                <span className="font-heading font-extrabold text-[#092167]">
                  {lead.propertyPrice}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-amber-900 pt-1">
                <Calendar className="w-4 h-4 text-[#E8A808]" />
                <span className="font-medium">
                  {lead.requestedDate} at {lead.requestedTime}
                </span>
              </div>
            </div>
          </div>

          {/* Buyer Message if present */}
          {lead.message && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Buyer Message / Inquiry Notes
              </h3>
              <p className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                &ldquo;{lead.message}&rdquo;
              </p>
            </div>
          )}

          {/* Status History Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Audit &amp; Status History
            </h3>
            <div className="relative pl-5 space-y-4 border-l-2 border-slate-200 text-xs">
              <div className="relative">
                <span className="w-2.5 h-2.5 rounded-full bg-[#092167] absolute -left-[26px] top-1" />
                <p className="font-semibold text-slate-900">
                  Viewing Request Logged
                </p>
                <p className="text-[11px] text-slate-400">
                  Transmitted via Public Buyer Pack ({lead.requestedDate})
                </p>
              </div>
              <div className="relative">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[26px] top-1" />
                <p className="font-semibold text-slate-900">
                  Contact Verified
                </p>
                <p className="text-[11px] text-slate-400">
                  SMS &amp; Email auto-acknowledgement dispatched
                </p>
              </div>
            </div>
          </div>

          {/* Agent Internal Notes */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Internal Agency Notes
            </h3>

            <div className="space-y-2">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-700">
                      {n.author}
                    </span>
                    <span>{n.time}</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed">{n.text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
                placeholder="Add private note..."
                className="flex-1 h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#092167]"
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onDeleteLead(lead)}
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
            <Button
              variant="primary"
              size="sm"
              onClick={() => onEmailLead(lead)}
              icon={<Mail className="w-3.5 h-3.5" />}
            >
              Email Lead
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailSlideOver;
