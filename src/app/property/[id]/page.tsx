"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Phone,
  Download,
  Calendar,
  Check,
  CheckCircle2,
  X,
  Bed,
  Bath,
  Maximize2,
  Home,
  Zap,
  Shield,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Share2,
} from "lucide-react";
import {
  PropertyPackData,
  DEFAULT_PROPERTY_PACK,
  getPropertyPackById,
} from "@/types/property";

export default function PublicBuyerPropertyPage() {
  const params = useParams();
  const propertyId = (params?.id as string) || "16-gorse-drive";

  // Dynamic Property Data (populated from backend / localStorage / default fallback)
  const [property, setProperty] = useState<PropertyPackData>(DEFAULT_PROPERTY_PACK);

  useEffect(() => {
    if (propertyId) {
      const data = getPropertyPackById(propertyId);
      setProperty(data);
    }
  }, [propertyId]);

  // Modal States
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [viewingTime, setViewingTime] = useState("Saturday Morning (10:00 - 12:00)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Gallery Photos
  const galleryImages = [
    { src: "/landing/villa-dusk.jpg", label: "Front Exterior & Heated Pool" },
    { src: "/landing/semi-detached-wilmslow.jpg", label: "Open Plan Kitchen & Dining" },
    { src: "/landing/townhouse-dusk.jpg", label: "Master Suite & Private Terrace" },
    { src: "/landing/agent-keys.jpg", label: "Entrance Hall & Staircase" },
    { src: "/landing/villa-dusk.jpg", label: "South-Facing Landscaped Lawn" },
    { src: "/landing/semi-detached-wilmslow.jpg", label: "Principal En-Suite Wet Room" },
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      showToast("Please provide your name and email address");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      // Save lead to localStorage for Agent Dashboard sync
      const newLead = {
        id: `lead-${Date.now()}`,
        ref: "#PP-8492",
        buyerName: fullName,
        email: email,
        phone: phone || "+44 7911 234567",
        initials: fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "DH",
        avatarColor: "bg-[#06143E]",
        propertyTitle: "16 Gorse Drive, Chorlton",
        propertyPrice: "£750,000 Guide",
        requestedDate: "This Weekend",
        requestedTime: viewingTime.split(" ")[0],
        statusNote: "Just submitted via Public Pack",
        statusNoteType: "warning",
        status: "Pending Action",
        message: `Requested viewing time: ${viewingTime}`,
        preApproved: true,
      };

      try {
        const stored = localStorage.getItem("pp_captured_leads");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newLead);
        localStorage.setItem("pp_captured_leads", JSON.stringify(list));
      } catch (err) {
        console.error("Local storage error:", err);
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast("Viewing appointment requested successfully!");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-24 selection:bg-[#E8A808]/20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#06143E] text-white px-5 py-3.5 rounded-lg shadow-2xl flex items-center gap-3 border border-[#E8A808]/40 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#E8A808]" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TOP AGENCY HEADER BAR
      ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Agency Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#06143E] flex items-center justify-center text-[#E8A808] shadow-sm font-bold text-base">
              ▲
            </div>
            <div>
              <div className="font-heading font-extrabold text-base sm:text-lg text-[#06143E] tracking-tight leading-tight">
                {property.agency.name}
              </div>
              <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                {property.agency.tagline}
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Phone */}
            <a
              href={`tel:${property.agency.phone.replace(/\s+/g, "")}`}
              className="hidden md:flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#06143E] transition"
            >
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{property.agency.phone}</span>
            </a>

            <div className="hidden md:block w-px h-6 bg-slate-200" />

            {/* Download PDF Brochure Button */}
            <Link
              href={`/property/${propertyId}/pdf`}
              className="h-10 px-4 rounded-lg border border-slate-200 hover:border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 transition flex items-center gap-2 shadow-2xs"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>↓ PDF Brochure</span>
            </Link>

            {/* Book a Viewing Button */}
            <button
              onClick={() => {
                setIsSubmitted(false);
                setIsViewingModalOpen(true);
              }}
              className="h-10 px-5 rounded-lg bg-[#E8A808] hover:bg-[#d89b05] text-[#06143E] font-bold text-xs sm:text-sm shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Viewing</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Title, Badges & Price Section */}
        <div className="space-y-3">
          {/* Status Badges */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white">
              {property.statusBadge}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#06143E] text-white">
              {property.propertyTypeBadge}
            </span>
          </div>

          {/* Heading & Price Grid */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                {property.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-500 mt-1">
                {property.area}, {property.postcode}
              </p>
            </div>

            <div className="sm:text-right">
              <div className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                {property.price}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500">
                {property.priceQualifier}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PHOTO GALLERY GRID (Exact Figma Matching)
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 h-[360px] sm:h-[460px] lg:h-[520px] rounded-2xl overflow-hidden shadow-sm">
          {/* Main Large Hero Image (Left 8 cols) */}
          <div
            onClick={() => {
              setActiveGalleryIndex(0);
              setIsGalleryModalOpen(true);
            }}
            className="lg:col-span-8 relative h-full group cursor-pointer overflow-hidden rounded-xl bg-slate-900"
          >
            <Image
              src={property.images.hero}
              alt={property.title}
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 text-white">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md">
                {property.images.gallery[0]?.label || "Front Exterior & Heated Pool"}
              </span>
            </div>
          </div>

          {/* Right Column Thumbnail Grid (Right 4 cols) */}
          <div className="lg:col-span-4 grid grid-rows-2 gap-3.5 h-full">
            {/* Top Right Photo */}
            <div
              onClick={() => {
                setActiveGalleryIndex(1);
                setIsGalleryModalOpen(true);
              }}
              className="relative h-full group cursor-pointer overflow-hidden rounded-xl bg-slate-100"
            >
              <Image
                src={property.images.kitchen}
                alt="Kitchen & Dining"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-3 left-3">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-md">
                  Kitchen &amp; Dining
                </span>
              </div>
            </div>

            {/* Bottom Right Photo Row (Split in 2) */}
            <div className="grid grid-cols-2 gap-3.5 h-full">
              {/* Master Suite */}
              <div
                onClick={() => {
                  setActiveGalleryIndex(2);
                  setIsGalleryModalOpen(true);
                }}
                className="relative h-full group cursor-pointer overflow-hidden rounded-xl bg-slate-100"
              >
                <Image
                  src={property.images.masterSuite}
                  alt="Master Suite"
                  fill
                  sizes="20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 left-2">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-md">
                    Master Suite
                  </span>
                </div>
              </div>

              {/* View Gallery Overlay (+7 More) */}
              <div
                onClick={() => {
                  setActiveGalleryIndex(0);
                  setIsGalleryModalOpen(true);
                }}
                className="relative h-full group cursor-pointer overflow-hidden rounded-xl bg-[#06143E] text-white flex flex-col items-center justify-center p-3 text-center hover:bg-[#092167] transition"
              >
                <Maximize2 className="w-5 h-5 text-[#E8A808] mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-heading font-extrabold text-base tracking-tight">
                  +{property.images.gallery.length} More
                </span>
                <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase">
                  VIEW GALLERY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PROPERTY SPECS STRIP
        ========================================================================= */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="pt-2 sm:pt-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                BEDROOMS
              </span>
              <span className="font-heading font-bold text-lg sm:text-xl text-slate-900 block mt-0.5">
                {property.specs.bedrooms}
              </span>
            </div>

            <div className="pt-2 sm:pt-0 sm:pl-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                BATHROOMS
              </span>
              <span className="font-heading font-bold text-lg sm:text-xl text-slate-900 block mt-0.5">
                {property.specs.bathrooms}
              </span>
            </div>

            <div className="pt-2 sm:pt-0 sm:pl-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                TOTAL AREA
              </span>
              <span className="font-heading font-bold text-lg sm:text-xl text-slate-900 block mt-0.5">
                {property.specs.sqft}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">{property.specs.sqm}</span>
            </div>

            <div className="pt-2 sm:pt-0 sm:pl-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                PROPERTY TYPE
              </span>
              <span className="font-heading font-bold text-lg sm:text-xl text-slate-900 block mt-0.5">
                {property.specs.propertyType}
              </span>
            </div>

            <div className="pt-2 sm:pt-0 sm:pl-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                ENERGY RATING
              </span>
              <span className="font-heading font-bold text-lg sm:text-xl text-emerald-600 block mt-0.5">
                {property.specs.epcRating}
              </span>
            </div>

            <div className="pt-2 sm:pt-0 sm:pl-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                TENURE
              </span>
              <span className="font-heading font-bold text-lg sm:text-xl text-slate-900 block mt-0.5">
                {property.specs.tenure}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PROPERTY OVERVIEW & KEY FEATURES (Driven by AI Generated Copy)
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Description & Features */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview */}
            <section className="space-y-3">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900">
                Property Overview
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {property.overview}
              </p>
            </section>

            {/* Key Features */}
            <section className="space-y-4">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900">
                Key Features
              </h2>
              <ul className="space-y-2.5">
                {property.keyFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-[#E8A808] mt-1.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Compliance notice */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
              {property.complianceNotice}
            </div>
          </div>

          {/* Right Column: Appointment Booking Sticky Card */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-6 sticky top-28 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <div className="w-12 h-12 rounded-full bg-[#E8A808] text-[#06143E] font-heading font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
                {property.agent.initials}
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {property.agent.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {property.agent.role}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Appointment Schedule
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Private viewings are conducted on Saturdays and weekday evenings.
                Slots are reserved on a first-come basis.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setIsViewingModalOpen(true);
                }}
                className="w-full h-11 rounded-lg bg-[#E8A808] hover:bg-[#d89b05] text-[#06143E] font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Private Viewing</span>
              </button>

              <Link
                href={`/property/${propertyId}/pdf`}
                className="w-full h-10 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Printable A4 PDF</span>
              </Link>
            </div>

            <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#E8A808]" />
              <span>Instant confirmation &amp; calendar invite</span>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          MODAL: BOOK A VIEWING / INQUIRY (Image 2 - Right Frame)
      ========================================================================= */}
      {isViewingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setIsViewingModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                  Viewing Request Received!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{fullName}</strong>. Your viewing appointment for{" "}
                  <strong>{viewingTime}</strong> has been logged and sent directly to{" "}
                  {property.agent.name} at {property.agency.name}.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsViewingModalOpen(false)}
                    className="h-10 px-6 rounded-lg bg-[#06143E] hover:bg-[#092167] text-white font-semibold text-sm transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="mb-5">
                  <h3 className="font-heading font-bold text-xl text-slate-900">
                    Book a Viewing / Inquiry
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct access to the appointed listing agent
                  </p>
                </div>

                {/* Agent Card Banner */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#E8A808] text-[#06143E] font-heading font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                    {property.agent.initials}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 leading-tight">
                      {property.agent.name}
                    </div>
                    <div className="text-xs text-slate-500 font-medium leading-tight">
                      {property.agent.role}
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Harrison"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-10 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="david@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-10 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+44 7911 234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-10 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Preferred Viewing Time
                    </label>
                    <select
                      value={viewingTime}
                      onChange={(e) => setViewingTime(e.target.value)}
                      className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#092167] focus:bg-white transition cursor-pointer"
                    >
                      <option value="Saturday Morning (10:00 - 12:00)">
                        Saturday Morning (10:00 - 12:00)
                      </option>
                      <option value="Saturday Afternoon (14:00 - 16:00)">
                        Saturday Afternoon (14:00 - 16:00)
                      </option>
                      <option value="Sunday Morning (11:00 - 13:00)">
                        Sunday Morning (11:00 - 13:00)
                      </option>
                      <option value="Weekday Evening (17:30 - 19:00)">
                        Weekday Evening (17:30 - 19:00)
                      </option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-lg bg-[#E8A808] hover:bg-[#d89b05] text-[#06143E] font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Submitting Request...</span>
                      ) : (
                        <span>Request Private Viewing Appointment</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          LIGHTBOX GALLERY MODAL
      ========================================================================= */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <button
            onClick={() => setIsGalleryModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full text-center space-y-4">
            <div className="relative h-[65vh] w-full rounded-2xl overflow-hidden bg-black">
              <Image
                src={galleryImages[activeGalleryIndex].src}
                alt={galleryImages[activeGalleryIndex].label}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-white">
              <p className="font-heading font-bold text-lg">
                {galleryImages[activeGalleryIndex].label}
              </p>
              <p className="text-xs text-white/60">
                Photo {activeGalleryIndex + 1} of {galleryImages.length}
              </p>
            </div>

            {/* Thumbnail navigation */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveGalleryIndex(i)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition ${
                    activeGalleryIndex === i ? "border-[#E8A808]" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img.src} alt={img.label} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
