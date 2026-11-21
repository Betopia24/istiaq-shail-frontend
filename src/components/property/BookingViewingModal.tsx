"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  X,
  Calendar,
  Clock,
  Check,
  AlertCircle,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  RefreshCw,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { BookingModalState } from "@/types/buyer";
import toast from "react-hot-toast";

interface BookingViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  agentName: string;
  agencyName: string;
}

export const BookingViewingModal: React.FC<BookingViewingModalProps> = ({
  isOpen,
  onClose,
  propertyTitle,
  agentName,
  agencyName,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Form State
  const [fullName, setFullName] = useState("David Harrison");
  const [email, setEmail] = useState("david.harrison@gmail.com");
  const [phone, setPhone] = useState("+44 7911 123456");
  const [bookingDate, setBookingDate] = useState("2026-11-28");
  const [bookingTime, setBookingTime] = useState("11:00 AM");
  const [notes, setNotes] = useState("");
  const [gdprConsent, setGdprConsent] = useState(true);

  // State machine: form | submitting | success | error | rate_limited
  const [modalState, setModalState] = useState<BookingModalState>("form");
  const [demoScenario, setDemoScenario] = useState<"success" | "error" | "rate_limited">("success");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalState !== "submitting") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, modalState]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!gdprConsent) {
      toast.error("Please agree to the privacy policy to book a viewing.");
      return;
    }

    setModalState("submitting");

    setTimeout(() => {
      if (demoScenario === "error") {
        setModalState("error");
        toast.error("Booking submission failed");
      } else if (demoScenario === "rate_limited") {
        setModalState("rate_limited");
        toast.error("Rate limit exceeded");
      } else {
        setModalState("success");
        toast.success("Viewing appointment requested successfully!");
      }
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06143E]/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={modalState === "submitting"}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* DEMO SCENARIO TOGGLE */}
        <div className="mb-4 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2">
          <span className="font-semibold text-[11px]">S10 Demo:</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                setDemoScenario("success");
                setModalState("form");
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                demoScenario === "success"
                  ? "bg-[#092167] text-white"
                  : "bg-white text-slate-700 border border-amber-300"
              }`}
            >
              Success
            </button>
            <button
              type="button"
              onClick={() => {
                setDemoScenario("error");
                setModalState("form");
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                demoScenario === "error"
                  ? "bg-rose-700 text-white"
                  : "bg-white text-slate-700 border border-amber-300"
              }`}
            >
              Error
            </button>
            <button
              type="button"
              onClick={() => {
                setDemoScenario("rate_limited");
                setModalState("form");
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                demoScenario === "rate_limited"
                  ? "bg-amber-800 text-white"
                  : "bg-white text-slate-700 border border-amber-300"
              }`}
            >
              Rate Limit
            </button>
          </div>
        </div>

        {/* STATE 1: SUCCESS CONFIRMATION */}
        {modalState === "success" && (
          <div className="py-6 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs mb-2">
                APPOINTMENT CONFIRMED
              </span>
              <h3 className="font-heading font-bold text-2xl text-slate-900">
                Viewing Request Received!
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs sm:text-sm space-y-2">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Property</span>
                <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                  {propertyTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Requested Date</span>
                <span className="font-bold text-[#092167]">{bookingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Requested Time</span>
                <span className="font-bold text-[#092167]">{bookingTime}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Listing Agent</span>
                <span className="font-medium text-slate-800">
                  {agentName} ({agencyName})
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              We have dispatched a calendar placeholder and confirmation email to{" "}
              <strong>{email}</strong>. {agentName} will contact you if any schedule adjustment is needed.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full h-11 rounded-xl bg-[#06143E] hover:bg-[#092167] text-white font-semibold text-sm transition shadow-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* STATE 2: ERROR WITH RETRY */}
        {modalState === "error" && (
          <div className="py-6 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-rose-50 border-4 border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-8 h-8 stroke-[2]" />
            </div>

            <div>
              <h3 className="font-heading font-bold text-2xl text-slate-900">
                Booking Request Failed
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                We could not connect to the agency calendar server. Please check your network and try again.
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setModalState("form")}
                className="flex-1 h-11 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition shadow-xs"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Submission</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* STATE 3: RATE LIMITED */}
        {modalState === "rate_limited" && (
          <div className="py-6 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-amber-50 border-4 border-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8 stroke-[2]" />
            </div>

            <div>
              <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-xs mb-2">
                RATE LIMIT EXCEEDED
              </span>
              <h3 className="font-heading font-bold text-2xl text-slate-900">
                Too Many Requests
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                Multiple viewing inquiries have been sent recently from your connection. Please wait 60 seconds before trying again, or call the listing agency directly.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-center gap-2 font-semibold">
              <Phone className="w-4 h-4 text-[#092167]" />
              <span>Direct Agency Desk: +44 20 7946 0912</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full h-11 rounded-xl bg-[#06143E] hover:bg-[#092167] text-white font-semibold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* STATE 4: THE APPOINTMENT FORM */}
        {(modalState === "form" || modalState === "submitting") && (
          <div>
            <div className="mb-5">
              <h3
                id="booking-title"
                className="font-heading font-bold text-xl sm:text-2xl text-slate-900"
              >
                Book a Private Viewing
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Schedule an exclusive walkthrough of {propertyTitle} with {agentName}.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Full Name <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. David Harrison"
                    className="w-full h-11 pl-10 pr-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#092167] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Email Address <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="david@example.com"
                      className="w-full h-11 pl-10 pr-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#092167] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Phone Number <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 7911 123456"
                      className="w-full h-11 pl-10 pr-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#092167] focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* DATE & TIME PICKERS (E03) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#092167]" />
                    <span>Viewing Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full h-10 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#092167]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#092167]" />
                    <span>Time Slot</span>
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#092167] cursor-pointer"
                  >
                    <option value="09:30 AM">09:30 AM (Morning)</option>
                    <option value="11:00 AM">11:00 AM (Late Morning)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon)</option>
                    <option value="03:30 PM">03:30 PM (Mid Afternoon)</option>
                    <option value="05:00 PM">05:00 PM (Early Evening)</option>
                    <option value="06:30 PM">06:30 PM (Evening)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Questions or Special Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Inquiring about garden boundaries, chain-free status..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#092167] focus:bg-white resize-none"
                />
              </div>

              {/* GDPR CONSENT CHECKBOX (E03) */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#092167] border-slate-300 focus:ring-2 focus:ring-[#092167]/20 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 leading-normal">
                    I agree to the processing of my contact details by {agencyName} to schedule this property viewing in accordance with the{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="font-medium text-[#092167] underline hover:text-[#06143E]"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={modalState === "submitting"}
                  className="w-full h-11 sm:h-12 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-semibold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {modalState === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#06143E]" />
                      <span>Transmitting Inquiry to Agent...</span>
                    </>
                  ) : (
                    <span>Request Private Viewing Appointment</span>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>UK GDPR Compliant • Direct Agent Route</span>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingViewingModal;
