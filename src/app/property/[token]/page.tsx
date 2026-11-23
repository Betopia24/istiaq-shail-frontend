"use client";

import React, { use, useState } from "react";
import { notFound } from "next/navigation";
import {
  Phone,
  Mail,
  Download,
  Calendar,
  X,
  Maximize2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BookingViewingModal } from "@/components/property/BookingViewingModal";
import { PropertyUnavailable } from "@/components/property/PropertyUnavailable";
import { useBrochureDownload } from "@/components/property/useBrochureDownload";
import { ApiImage } from "@/components/ui/ApiImage";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { useGetPublicPackQuery } from "@/redux/api/public/publicApi";
import { initials } from "@/lib/format";

const HEX = /^#[0-9a-fA-F]{6}$/;
const safeColour = (value: string | undefined, fallback: string) => (value && HEX.test(value) ? value : fallback);

function Skeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="h-20 border-b border-slate-200" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="h-10 w-2/3 bg-slate-200 rounded-lg" />
        <div className="h-[360px] sm:h-[460px] bg-slate-100 rounded-2xl" />
        <div className="h-20 bg-slate-100 rounded-xl" />
        <div className="h-40 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

export default function PublicBuyerPropertyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const { data: property, isLoading, error, refetch } = useGetPublicPackQuery(token);
  const brochure = useBrochureDownload(token);

  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  if (isLoading) return <Skeleton />;
  if (error || !property) {
    const { status } = apiErrorInfo(error);
    if (status === 404) notFound();
    if (status === 410 || brochure.state === "gone") return <PropertyUnavailable />;
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <ErrorState error={error} onRetry={refetch} className="max-w-md w-full" />
      </div>
    );
  }
  if (brochure.state === "gone") return <PropertyUnavailable />;

  const agency = property.agency ?? { name: "" };
  const facts = property.facts ?? {};
  const photos = property.photos ?? [];
  const features = property.keyFeatures ?? [];
  const brand = safeColour(agency.primaryColour, "#06143E");
  const accent = safeColour(agency.accentColour, "#E8A808");
  const title = property.title ?? property.address ?? "";
  const subtitle = [property.address, property.postcode && !property.address?.includes(property.postcode) ? property.postcode : null]
    .filter(Boolean)
    .join(", ");
  const photoAlt = (i: number) => photos[i]?.tag || title;
  const preparing = brochure.state === "preparing";
  const sizeSqM = facts.sizeSqFt ? Math.round(facts.sizeSqFt * 0.092903) : null;

  const specs: { label: string; value: React.ReactNode; sub?: string; green?: boolean }[] = [
    facts.bedrooms != null && { label: "BEDROOMS", value: facts.bedrooms },
    facts.bathrooms != null && { label: "BATHROOMS", value: facts.bathrooms },
    facts.sizeSqFt != null && { label: "TOTAL AREA", value: `${facts.sizeSqFt.toLocaleString("en-GB")} sq ft`, sub: sizeSqM ? `${sizeSqM} sq m` : undefined },
    facts.type && { label: "PROPERTY TYPE", value: facts.type },
    facts.epc && { label: "ENERGY RATING", value: facts.epc, green: true },
    facts.tenure && { label: "TENURE", value: facts.tenure },
  ].filter(Boolean) as { label: string; value: React.ReactNode; sub?: string; green?: boolean }[];

  const openGallery = (i: number) => {
    setActiveGalleryIndex(i);
    setIsGalleryModalOpen(true);
  };

  const brochureLabel = (short: boolean) =>
    preparing ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Preparing your brochure…</span>
      </>
    ) : (
      <>
        <Download className={short ? "w-3.5 h-3.5" : "w-4 h-4 text-slate-500"} />
        <span>Download brochure</span>
      </>
    );

  return (
    <div
      style={{ "--brand": brand, "--accent": accent } as React.CSSProperties}
      className="min-h-screen bg-white text-slate-900 font-sans pb-24 selection:bg-[var(--accent)]/20"
    >
      {/* TOP AGENCY HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ApiImage
              src={agency.logoUrl}
              alt={agency.name ?? ""}
              className="w-9 h-9 rounded-lg object-contain"
              fallback={
                <div className="w-9 h-9 rounded-lg bg-[var(--brand)] flex items-center justify-center text-[var(--accent)] shadow-sm font-medium text-base">
                  ▲
                </div>
              }
            />
            <div className="font-heading font-semibold text-base sm:text-lg text-[var(--brand)] tracking-tight leading-tight">
              {agency.name}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {agency.phone && (
              <>
                <a
                  href={`tel:${agency.phone.replace(/\s+/g, "")}`}
                  className="hidden md:flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-[var(--brand)] transition"
                >
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{agency.phone}</span>
                </a>
                <div className="hidden md:block w-px h-6 bg-slate-200" />
              </>
            )}

            <button
              type="button"
              onClick={brochure.start}
              disabled={preparing}
              className="h-10 px-4 rounded-lg border border-slate-200 hover:border-slate-300 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 transition flex items-center gap-2 shadow-2xs cursor-pointer disabled:opacity-70"
            >
              {brochureLabel(false)}
            </button>

            <button
              type="button"
              onClick={() => setIsViewingModalOpen(true)}
              className="h-10 px-5 rounded-lg bg-[var(--accent)] hover:opacity-90 text-[var(--brand)] font-medium text-xs sm:text-sm shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Viewing</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {brochure.state === "error" && (
          <p role="alert" className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
            We could not get the brochure. Please try again.
          </p>
        )}

        {/* Title, Badges & Price Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {property.transaction && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-medium uppercase tracking-wider bg-emerald-600 text-white">
                {property.transaction === "let" ? "To Let" : "For Sale"}
              </span>
            )}
            {facts.type && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-medium uppercase tracking-wider bg-[var(--brand)] text-white">
                {facts.type}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-heading font-semibold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                {title}
              </h1>
              {subtitle && <p className="text-sm sm:text-base text-slate-500 mt-1">{subtitle}</p>}
            </div>

            {property.priceLabel && (
              <div className="sm:text-right">
                <div className="font-heading font-semibold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                  {property.priceLabel}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PHOTO GALLERY GRID */}
        {photos.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 h-[360px] sm:h-[460px] lg:h-[520px] rounded-2xl overflow-hidden shadow-sm">
            <div
              onClick={() => openGallery(0)}
              className={`${photos.length > 1 ? "lg:col-span-8" : "lg:col-span-12"} relative h-full group cursor-pointer overflow-hidden rounded-xl bg-slate-900`}
            >
              <ApiImage
                src={photos[0].url}
                alt={photoAlt(0)}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
              {photos[0].tag && (
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md">
                    {photos[0].tag}
                  </span>
                </div>
              )}
            </div>

            {photos.length > 1 && (
              <div className={`lg:col-span-4 grid ${photos.length > 2 ? "grid-rows-2" : "grid-rows-1"} gap-3.5 h-full`}>
                <div
                  onClick={() => openGallery(1)}
                  className="relative h-full group cursor-pointer overflow-hidden rounded-xl bg-slate-100"
                >
                  <ApiImage
                    src={photos[1].thumbUrl ?? photos[1].url}
                    alt={photoAlt(1)}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {photos[1].tag && (
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-md">
                        {photos[1].tag}
                      </span>
                    </div>
                  )}
                </div>

                {photos.length > 2 && (
                  <div className={`grid ${photos.length > 3 ? "grid-cols-2" : "grid-cols-1"} gap-3.5 h-full`}>
                    <div
                      onClick={() => openGallery(2)}
                      className="relative h-full group cursor-pointer overflow-hidden rounded-xl bg-slate-100"
                    >
                      <ApiImage
                        src={photos[2].thumbUrl ?? photos[2].url}
                        alt={photoAlt(2)}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {photos[2].tag && (
                        <div className="absolute bottom-2 left-2">
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-md">
                            {photos[2].tag}
                          </span>
                        </div>
                      )}
                    </div>

                    {photos.length > 3 && (
                      <div
                        onClick={() => openGallery(0)}
                        className="relative h-full group cursor-pointer overflow-hidden rounded-xl bg-[var(--brand)] text-white flex flex-col items-center justify-center p-3 text-center hover:opacity-90 transition"
                      >
                        <Maximize2 className="w-5 h-5 text-[var(--accent)] mb-1 group-hover:scale-110 transition-transform" />
                        <span className="font-heading font-semibold text-base tracking-tight">
                          +{photos.length - 3} More
                        </span>
                        <span className="text-[10px] font-medium text-slate-300 tracking-wider uppercase">
                          VIEW GALLERY
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PROPERTY SPECS STRIP */}
        {specs.length > 0 && (
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
              {specs.map((spec, i) => (
                <div key={spec.label} className={`pt-2 sm:pt-0 ${i > 0 ? "sm:pl-3" : ""}`}>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    {spec.label}
                  </span>
                  <span className={`font-heading font-medium text-lg sm:text-xl block mt-0.5 ${spec.green ? "text-emerald-600" : "text-slate-900"}`}>
                    {spec.value}
                  </span>
                  {spec.sub && <span className="text-[10px] text-slate-400 font-medium">{spec.sub}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OVERVIEW & KEY FEATURES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            {property.overview && (
              <section className="space-y-3">
                <h2 className="font-heading font-medium text-xl sm:text-2xl text-slate-900">
                  Property Overview
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {property.overview}
                </p>
              </section>
            )}

            {features.length > 0 && (
              <section className="space-y-4">
                <h2 className="font-heading font-medium text-xl sm:text-2xl text-slate-900">
                  Key Features
                </h2>
                <ul className="space-y-2.5">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {property.disclaimer && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                {property.disclaimer}
              </div>
            )}
          </div>

          {/* Right Column: agency + booking card */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-6 sticky top-28 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-[var(--brand)] font-heading font-medium text-base flex items-center justify-center shrink-0 shadow-sm">
                {initials(agency.name)}
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-medium text-base text-slate-900">{agency.name}</h3>
                {agency.websiteUrl && /^https?:\/\//.test(agency.websiteUrl) && (
                  <a
                    href={agency.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-500 font-medium hover:underline truncate block"
                  >
                    {agency.websiteUrl.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>

            {(agency.phone || agency.email) && (
              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                {agency.phone && (
                  <a href={`tel:${agency.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2.5 hover:text-[var(--brand)] transition-colors">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{agency.phone}</span>
                  </a>
                )}
                {agency.email && (
                  <a href={`mailto:${agency.email}`} className="flex items-center gap-2.5 hover:text-[var(--brand)] transition-colors">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{agency.email}</span>
                  </a>
                )}
              </div>
            )}

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setIsViewingModalOpen(true)}
                className="w-full h-11 rounded-lg bg-[var(--accent)] hover:opacity-90 text-[var(--brand)] font-medium text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Private Viewing</span>
              </button>

              <button
                type="button"
                onClick={brochure.start}
                disabled={preparing}
                className="w-full h-10 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-2 transition shadow-2xs cursor-pointer disabled:opacity-70"
              >
                {brochureLabel(true)}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: BOOK A VIEWING / INQUIRY */}
      <BookingViewingModal
        isOpen={isViewingModalOpen}
        onClose={() => setIsViewingModalOpen(false)}
        token={token}
        propertyTitle={title}
        agencyName={agency.name ?? ""}
        agencyPhone={agency.phone}
      />

      {/* LIGHTBOX GALLERY MODAL */}
      {isGalleryModalOpen && photos[activeGalleryIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
        >
          <button
            type="button"
            onClick={() => setIsGalleryModalOpen(false)}
            aria-label="Close gallery"
            className="absolute top-5 right-5 p-2 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full text-center space-y-4">
            <div className="relative h-[65vh] w-full rounded-2xl overflow-hidden bg-black">
              <ApiImage
                src={photos[activeGalleryIndex].url}
                alt={photoAlt(activeGalleryIndex)}
                className="absolute inset-0 w-full h-full object-contain"
              />
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() => setActiveGalleryIndex((i) => (i - 1 + photos.length) % photos.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() => setActiveGalleryIndex((i) => (i + 1) % photos.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            <div className="text-white">
              {photos[activeGalleryIndex].tag && (
                <p className="font-heading font-medium text-lg">{photos[activeGalleryIndex].tag}</p>
              )}
              <p className="text-xs text-white/60">
                Photo {activeGalleryIndex + 1} of {photos.length}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
              {photos.map((img, i) => (
                <button
                  type="button"
                  key={img.id ?? i}
                  onClick={() => setActiveGalleryIndex(i)}
                  aria-label={`Photo ${i + 1}`}
                  className={`relative w-16 h-12 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                    activeGalleryIndex === i ? "border-[var(--accent)]" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <ApiImage
                    src={img.thumbUrl ?? img.url}
                    alt={img.tag ?? ""}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
