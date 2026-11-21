"use client";

import React, { useState } from "react";
import {
  Search,
  FileText,
  Download,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Send,
  CheckCircle2,
  LifeBuoy,
} from "lucide-react";
import toast from "react-hot-toast";

interface HelpGuide {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
}

const helpGuides: HelpGuide[] = [
  {
    id: "g1",
    category: "Brochures & AI Generation",
    title: "How to customize the AI tone and style for property brochures",
    summary:
      "Configure narrative voice from Executive Luxury to Contemporary Family in the Live Editor.",
    content:
      "When generating marketing packs, Property Pack AI tailors copy to the target demographic. In the Live Editor, you can switch between 'Luxury Estate', 'Contemporary Urban', or 'Family Residential' tones. You can also edit any paragraph inline and regenerate single sections without affecting the rest of your brochure.",
  },
  {
    id: "g2",
    category: "Photos & Floor Plans",
    title: "Recommended photo formats, resolutions, and floor plan dimensions",
    summary:
      "Maximum 10 photos per pack. Min 1200x800px for print-ready 300DPI brochures.",
    content:
      "For best print quality on exported 300 DPI PDF brochures, upload landscape JPG or PNG images with at least 1200x800 pixels. Floor plans should be uploaded in the dedicated Step 2 slot as PNG or PDF. Our processing engine automatically runs perspective correction and contrast enhancement.",
  },
  {
    id: "g3",
    category: "Compliance & Trading Standards",
    title: "Understanding UK CPR 2008 & NTSELAT Material Information Parts A, B, and C",
    summary:
      "Mandatory property disclosure requirements for Rightmove, Zoopla, and brochures.",
    content:
      "Under the Consumer Protection from Unfair Trading Regulations (CPR 2008), estate agents must disclose all material facts: Part A (Price, Council Tax Band, Tenure), Part B (Physical characteristics, utilities, heating type), and Part C (Flood risks, mining, conservation areas). All fields are automated within our Step 1 creation form.",
  },
  {
    id: "g4",
    category: "Portal Syndication",
    title: "Exporting BLM and CSV feeds for Rightmove Plus and Zoopla Pro",
    summary:
      "How to use pre-formatted portal descriptions or download BLM XML feeds.",
    content:
      "Our Portal Specs tab formats property descriptions with precise character counts and bullet structures that maximize portal search indexing. You can one-click copy the text or download standard BLM data to upload directly to Rightmove Plus.",
  },
  {
    id: "g5",
    category: "Team & Workspace",
    title: "Managing negotiator, valuer, and administrator permissions",
    summary:
      "Assign roles to ensure sensitive billing and branding controls remain secure.",
    content:
      "Valuers can adjust valuation strategies and comparable sales. Negotiators can create packs, upload photography, and manage viewing inquiries. Administrators manage branding assets and invoices, while the Owner retains billing and subscription control.",
  },
];

const complianceDownloads = [
  {
    title: "UK CPR 2008 Compliance Self-Audit Checklist",
    format: "PDF (2.4 MB)",
    desc: "Essential self-check guide before publishing marketing particulars to portals.",
  },
  {
    title: "NTSELAT Material Information Guidance (Parts A, B & C)",
    format: "PDF (1.8 MB)",
    desc: "Official National Trading Standards guidance for estate and letting agents.",
  },
  {
    title: "RICS Valuation Disclaimer & Methodology Template",
    format: "PDF (850 KB)",
    desc: "Recommended automated estimate disclaimer wording for presentation packs.",
  },
];

export default function HelpCentrePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openGuideId, setOpenGuideId] = useState<string | null>("g1");

  // Ticket Form State
  const [ticketTopic, setTicketTopic] = useState("technical");
  const [propertyPackRef, setPropertyPackRef] = useState("");
  const [ticketPriority, setTicketPriority] = useState("normal");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const filteredGuides = helpGuides.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTicket(true);
    setTimeout(() => {
      setIsSubmittingTicket(false);
      setTicketSubmitted(true);
      toast.success(
        "Support ticket #TCK-" +
          Math.floor(100000 + Math.random() * 900000) +
          " created successfully!",
      );
    }, 1000);
  };

  const handleDownload = (docTitle: string) => {
    toast.success(`Downloading ${docTitle}...`);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Search Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#06143E] to-[#092167] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs">
            <LifeBuoy className="w-3.5 h-3.5 text-[#E8A808]" />
            <span>Agent Knowledge Base &amp; Support</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            How can we help your agency today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Search our guides on AI brochure creation, photo guidelines, UK
            trading standards compliance, and portal feeds.
          </p>

          {/* Search Bar */}
          <div className="pt-2 relative max-w-xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides (e.g. CPR compliance, photo limits, floor plans)..."
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none shadow-lg"
            />
          </div>
        </div>

        {/* Subtle Decorative Background Glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#E8A808]/15 blur-3xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Guides Accordion & Compliance Downloads */}
        <div className="lg:col-span-7 space-y-8">
          {/* Help Guides Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-lg text-slate-900">
                  Popular Help Guides
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Frequently referenced workflows for agency negotiators and
                  valuers.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                {filteredGuides.length} Guides
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {filteredGuides.map((guide) => {
                const isOpen = openGuideId === guide.id;
                return (
                  <div
                    key={guide.id}
                    className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenGuideId(isOpen ? null : guide.id)
                      }
                      className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-slate-50/80 transition cursor-pointer"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#092167] bg-blue-50 px-2 py-0.5 rounded">
                          {guide.category}
                        </span>
                        <h3 className="font-heading font-semibold text-xs sm:text-sm text-slate-900 mt-1.5">
                          {guide.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {guide.summary}
                        </p>
                      </div>
                      <div className="pt-1 text-slate-400">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-600 leading-relaxed font-sans">
                        {guide.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compliance Downloads Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E8A808]" />
                <h2 className="font-heading font-bold text-lg text-slate-900">
                  Compliance Documents &amp; Checklists
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Downloadable reference PDFs for estate agency compliance
                officers.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {complianceDownloads.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs">
                      <FileText className="w-4 h-4 text-[#092167]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-xs sm:text-sm text-slate-900 truncate">
                        {doc.title}
                      </p>
                      <p className="text-[11px] text-slate-500">{doc.desc}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownload(doc.title)}
                    className="h-8 px-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition cursor-pointer shadow-2xs flex items-center gap-1.5 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>{doc.format}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Submit Support Ticket */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 sticky top-20">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#E8A808]" />
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Submit Support Ticket
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Our UK team monitors tickets 9:00am – 5:30pm GMT Monday to Friday.
            </p>
          </div>

          {ticketSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Ticket Logged!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                We have assigned your inquiry to an engineering specialist. You
                will receive email updates at{" "}
                <strong>ishtiaq@prestigeestates.co.uk</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setTicketSubmitted(false);
                  setTicketMessage("");
                  setPropertyPackRef("");
                }}
                className="mt-3 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Inquiry Category <span className="text-amber-500">*</span>
                </label>
                <select
                  value={ticketTopic}
                  onChange={(e) => setTicketTopic(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                >
                  <option value="technical">
                    Brochure Generation / Rendering Error
                  </option>
                  <option value="billing">Pack Allowance / Billing Query</option>
                  <option value="branding">
                    Agency Logo &amp; Colour Palette Setup
                  </option>
                  <option value="portal">
                    Rightmove / Zoopla Feed Integration
                  </option>
                  <option value="compliance">
                    Regional Compliance &amp; CPR Disclaimer
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Property Pack Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 16 Gorse Drive or pack ID #492"
                  value={propertyPackRef}
                  onChange={(e) => setPropertyPackRef(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Priority Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "normal", "urgent"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTicketPriority(p)}
                      className={`h-9 rounded-lg text-xs font-semibold capitalize border transition cursor-pointer ${
                        ticketPriority === p
                          ? "border-[#092167] bg-[#092167] text-white shadow-2xs"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Description of Issue <span className="text-amber-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please provide details of what you were doing or what assistance you need..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingTicket}
                className="w-full h-11 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white font-heading font-semibold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5 text-[#E8A808]" />
                <span>
                  {isSubmittingTicket ? "Logging Ticket..." : "Submit Ticket"}
                </span>
              </button>
            </form>
          )}

          {/* Quick Help Contacts */}
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <p>
              Direct Email:{" "}
              <a
                href="mailto:support@propertypack.ai"
                className="text-[#092167] font-semibold underline"
              >
                support@propertypack.ai
              </a>
            </p>
            <p>Direct Phone: +44 161 496 0200</p>
          </div>
        </div>
      </div>
    </div>
  );
}
