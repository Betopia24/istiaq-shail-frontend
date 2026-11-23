"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { useSendInquiryMutation } from "@/redux/api/public/publicApi";
import { apiErrorInfo } from "@/components/ui/ErrorState";
import { errorText } from "@/lib/auth/client";

type BookingModalState = "form" | "submitting" | "success" | "error" | "rate_limited" | "gone";

interface BookingViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The share token of the public page. */
  token: string;
  propertyTitle: string;
  agencyName: string;
  agencyPhone?: string | null;
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
}

const TIME_SLOTS = [
  { value: "09:30", label: "09:30 AM (Morning)" },
  { value: "11:00", label: "11:00 AM (Late Morning)" },
  { value: "14:00", label: "02:00 PM (Afternoon)" },
  { value: "15:30", label: "03:30 PM (Mid Afternoon)" },
  { value: "17:00", label: "05:00 PM (Early Evening)" },
  { value: "18:30", label: "06:30 PM (Evening)" },
];

function isoDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const BookingViewingModal: React.FC<BookingViewingModalProps> = ({
  isOpen,
  onClose,
  token,
  propertyTitle,
  agencyName,
  agencyPhone,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileId = useRef<string | undefined>(undefined);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState(TIME_SLOTS[1].value);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState("");

  const [modalState, setModalState] = useState<BookingModalState>("form");
  const [sendInquiry] = useSendInquiryMutation();

  const minDate = isoDate(new Date());
  const maxDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    d.setDate(d.getDate() - 1);
    return isoDate(d);
  })();

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

  // Cloudflare Turnstile (only when a site key is configured)
  const showForm = modalState === "form" || modalState === "submitting";
  useEffect(() => {
    if (!isOpen || !showForm || !TURNSTILE_SITE_KEY) return;
    let cancelled = false;
    const mount = () => {
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (cancelled || !api || !turnstileRef.current || turnstileId.current) return;
      turnstileId.current = api.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (t) => setCaptchaToken(t),
        "expired-callback": () => setCaptchaToken(""),
        "error-callback": () => setCaptchaToken(""),
      });
    };
    let script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    if ((window as unknown as { turnstile?: TurnstileApi }).turnstile) mount();
    else script.addEventListener("load", mount);
    return () => {
      cancelled = true;
      script?.removeEventListener("load", mount);
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (turnstileId.current && api) api.remove(turnstileId.current);
      turnstileId.current = undefined;
      setCaptchaToken("");
    };
  }, [isOpen, showForm]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!gdprConsent) {
      setFieldErrors({ consent: "Please agree so the agency can contact you." });
      return;
    }
    const preferred = new Date(`${bookingDate}T${bookingTime}:00`);
    if (Number.isNaN(preferred.getTime())) {
      setFieldErrors({ preferredAt: "Choose a viewing date and time." });
      return;
    }

    setModalState("submitting");
    try {
      await sendInquiry({
        token,
        body: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          preferredAt: preferred.toISOString(),
          consent: true,
          captchaToken: captchaToken || undefined,
          website,
        },
      }).unwrap();
      setModalState("success");
    } catch (err) {
      const info = apiErrorInfo(err);
      if (info.status === 429) {
        setModalState("rate_limited");
      } else if (info.status === 410) {
        setModalState("gone");
      } else if (info.status === 422) {
        setFieldErrors(info.fields);
        setErrorMessage(errorText(err));
        setModalState("form");
      } else {
        setErrorMessage(errorText(err));
        setModalState("error");
      }
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (turnstileId.current && api) api.reset(turnstileId.current);
      setCaptchaToken("");
    }
  };

  const fieldError = (name: string) =>
    fieldErrors[name] ? <p className="text-[11px] text-rose-600 mt-1">{fieldErrors[name]}</p> : null;

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

        {/* STATE 1: SUCCESS CONFIRMATION */}
        {modalState === "success" && (
          <div className="py-6 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs mb-2">
                REQUEST RECEIVED
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
                <span className="font-bold text-[#092167]">{TIME_SLOTS.find((t) => t.value === bookingTime)?.label.split(" (")[0]}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Listing Agency</span>
                <span className="font-medium text-slate-800">{agencyName}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              We have emailed a confirmation to <strong>{email}</strong>. {agencyName} will be in touch to confirm the appointment.
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
                {errorMessage || "Something went wrong. Please try again."}
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
                Too many requests, try again later. You can also contact the listing agency directly.
              </p>
            </div>

            {agencyPhone && (
              <a href={`tel:${agencyPhone.replace(/\s+/g, "")}`} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-center gap-2 font-semibold">
                <Phone className="w-4 h-4 text-[#092167]" />
                <span>Direct Agency Desk: {agencyPhone}</span>
              </a>
            )}

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

        {modalState === "gone" && (
          <div className="py-6 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-slate-100 border-4 border-slate-200 text-slate-500 flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-8 h-8 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-2xl text-slate-900">
                This Link is No Longer Available
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                The agency has disabled or expired this listing, so viewing requests are closed.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full h-11 rounded-xl bg-[#06143E] hover:bg-[#092167] text-white font-semibold text-sm cursor-pointer"
            >
              Close
            </button>
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
                Schedule an exclusive walkthrough of {propertyTitle} with {agencyName}.
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
                {fieldError("fullName")}
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
                  {fieldError("email")}
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
                  {fieldError("phone")}
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
                    min={minDate}
                    max={maxDate}
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
                    {TIME_SLOTS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {fieldError("preferredAt")}

              {/* Honeypot: people leave this empty */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
                className="absolute -left-[9999px] w-px h-px opacity-0"
              />

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
                    I agree that {agencyName} may contact me about this property and store my details for that purpose.
                  </span>
                </label>
                {fieldError("consent")}
              </div>

              {TURNSTILE_SITE_KEY && (
                <div>
                  <div ref={turnstileRef} />
                  {fieldError("captchaToken")}
                </div>
              )}

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
