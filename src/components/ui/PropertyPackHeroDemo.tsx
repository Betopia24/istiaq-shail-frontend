"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  Sparkles,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Check,
  Building2,
  ListFilter,
  Loader2,
  RefreshCw,
  Layers,
  ArrowRight,
} from "lucide-react";

type Stage = "idle" | "typing" | "generating" | "result";

/* ─── Animated Typed Field ─── */
function TypedField({
  label,
  value,
  delay = 0,
  active,
  multiline = false,
}: {
  label: string;
  value: string;
  delay?: number;
  active: boolean;
  multiline?: boolean;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      setDone(false);
      return;
    }
    let i = 0;
    setDisplayed("");
    setDone(false);
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(value.slice(0, i));
        if (i >= value.length) {
          clearInterval(iv);
          setDone(true);
        }
      }, 18);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [active, value, delay]);

  return (
    <div className="space-y-0.5 @[680px]:space-y-1">
      <p className="text-[9px] @[680px]:text-[10px] font-semibold text-slate-300 uppercase tracking-wider pl-0.5">
        {label}
      </p>
      <div
        className={`relative bg-[#071330]/90 border text-white text-[11px] @[680px]:text-xs font-sans flex items-start transition-all duration-200 rounded-lg @[680px]:rounded-xl px-2.5 @[680px]:px-3 ${
          !done && active
            ? "border-[#E8A808]/70 shadow-[0_0_0_2px_rgba(232,168,8,0.15)]"
            : "border-white/10"
        } ${multiline ? "py-1.5 @[680px]:py-2 min-h-[38px] @[680px]:min-h-[44px]" : "py-1.5 @[680px]:py-2"}`}
      >
        <span className="leading-snug flex-1 break-words">{displayed || "\u00a0"}</span>
        {!done && active && (
          <span className="inline-block w-[2px] h-3 @[680px]:h-3.5 bg-[#E8A808] ml-0.5 mt-0.5 animate-pulse rounded-full shrink-0" />
        )}
      </div>
    </div>
  );
}

/* ─── Property Output Card (Container Query Responsive) ─── */
function PropertyCard({ visible }: { visible: boolean }) {
  const highlights = [
    "Open-plan kitchen and dining",
    "South-facing landscaped garden",
    "Short walk to the station",
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="card"
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl @[680px]:rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col w-full min-w-0 text-slate-900"
        >
          {/* Real Property Photo (Landscape Aspect) */}
          <div className="relative h-28 @[500px]:h-36 @[680px]:h-40 w-full shrink-0 overflow-hidden bg-slate-900">
            <Image
              src="/landing/villa-dusk.jpg"
              alt="14 Alder Grove"
              fill
              sizes="(max-width: 640px) 100vw, 420px"
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

            {/* Top Badge */}
            <div className="absolute top-2 left-2.5 @[680px]:top-2.5 @[680px]:left-3 flex items-center gap-1.5 bg-[#E8A808] text-[#06143E] text-[8px] @[680px]:text-[9px] font-bold px-2 py-0.5 @[680px]:px-2.5 rounded-full uppercase tracking-wider shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              <span>PROPERTY PACK</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-3 @[680px]:p-4.5 flex flex-col gap-2 @[680px]:gap-2.5 flex-1 min-w-0">
            {/* Title & Location Header */}
            <div className="flex items-start justify-between gap-2 min-w-0">
              <div className="min-w-0 flex-1">
                <p className="text-[9px] @[680px]:text-[10px] font-bold text-[#E8A808] uppercase tracking-wider mb-0.5">
                  PROPERTY PACK
                </p>
                <h3 className="font-heading font-bold text-sm @[680px]:text-base text-slate-900 leading-tight truncate">
                  14 Alder Grove
                </h3>
                <p className="flex items-center gap-1 text-[10px] @[680px]:text-[11px] text-slate-500 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Richmond, Surrey</span>
                </p>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <span className="font-heading font-bold text-base @[680px]:text-lg text-slate-900">
                  £750,000
                </span>
                <p className="text-[9px] @[680px]:text-[10px] text-slate-400 font-medium">Guide price</p>
              </div>
            </div>

            {/* Specs Row: Adaptable Container Strip */}
            <div className="flex items-center justify-between text-[10px] @[680px]:text-xs text-slate-700 bg-slate-50/90 rounded-lg @[680px]:rounded-xl px-2.5 @[680px]:px-3.5 py-1.5 @[680px]:py-2 border border-slate-200/70 min-w-0">
              <span className="inline-flex items-center gap-1 @[680px]:gap-1.5 font-medium whitespace-nowrap">
                <BedDouble className="w-3 h-3 @[680px]:w-3.5 @[680px]:h-3.5 text-[#E8A808] shrink-0" />
                <span>4 bed</span>
              </span>
              <span className="w-px h-3 bg-slate-200" />
              <span className="inline-flex items-center gap-1 @[680px]:gap-1.5 font-medium whitespace-nowrap">
                <Bath className="w-3 h-3 @[680px]:w-3.5 @[680px]:h-3.5 text-[#E8A808] shrink-0" />
                <span>3 bath</span>
              </span>
              <span className="w-px h-3 bg-slate-200" />
              <span className="inline-flex items-center gap-1 @[680px]:gap-1.5 font-medium whitespace-nowrap">
                <Maximize2 className="w-2.5 h-2.5 @[680px]:w-3 @[680px]:h-3 text-slate-400 shrink-0" />
                <span>1,850 sq ft</span>
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100" />

            {/* Description */}
            <div className="space-y-0.5">
              <p className="text-[10px] @[680px]:text-[11px] font-bold text-slate-900">Description</p>
              <p className="text-[10px] @[680px]:text-[11px] text-slate-600 leading-relaxed line-clamp-2 @[680px]:line-clamp-none">
                A bright, extended family home on a quiet residential street, with
                an open-plan kitchen, landscaped garden and easy access to schools.
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-1">
              <p className="text-[10px] @[680px]:text-[11px] font-bold text-slate-900">Highlights</p>
              <ul className="space-y-1">
                {highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-1.5 @[680px]:gap-2 text-[10px] @[680px]:text-[11px] text-slate-600 truncate"
                  >
                    <Check className="w-3 h-3 @[680px]:w-3.5 @[680px]:h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                    <span className="leading-tight truncate">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Agency Footer Strip */}
          <div className="flex items-center justify-between bg-[#06143E] px-3.5 py-2 @[680px]:px-4 @[680px]:py-2.5 shrink-0">
            <span className="flex items-center gap-1.5 @[680px]:gap-2 text-[11px] @[680px]:text-xs font-semibold text-white">
              <Building2 className="w-3 h-3 @[680px]:w-3.5 @[680px]:h-3.5 text-[#E8A808] shrink-0" />
              <span>Your Agency Name</span>
            </span>
            <span className="text-[10px] @[680px]:text-[11px] text-slate-400 font-medium">Agent name</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Output Placeholder ─── */
function OutputPlaceholder({ stage }: { stage: Stage }) {
  return (
    <div className="h-full min-h-[340px] @[680px]:min-h-[380px] w-full rounded-2xl @[680px]:rounded-3xl bg-[#0B1536]/40 border border-dashed border-white/15 backdrop-blur-md flex flex-col items-center justify-center gap-3 p-5 text-center min-w-0">
      {stage === "generating" ? (
        <>
          <div className="relative">
            <Loader2 className="w-8 h-8 @[680px]:w-9 @[680px]:h-9 text-[#E8A808] animate-spin" />
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="space-y-2 w-full max-w-[180px]">
            <div className="h-1.5 rounded-full bg-white/20 animate-pulse" />
            <div className="h-1.5 rounded-full bg-[#E8A808]/40 animate-pulse" />
            <div className="h-1.5 rounded-full bg-white/10 animate-pulse w-3/4 mx-auto" />
          </div>
          <p className="text-[11px] @[680px]:text-xs font-medium text-amber-200/90 mt-1">
            Generating 10 marketing outputs…
          </p>
        </>
      ) : (
        <>
          <div className="w-10 h-10 @[680px]:w-12 @[680px]:h-12 rounded-xl @[680px]:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <Layers className="w-4 h-4 @[680px]:w-5 @[680px]:h-5 text-slate-300" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] @[680px]:text-xs font-semibold text-white">
              Pack will appear here
            </p>
            <p className="text-[10px] @[680px]:text-[11px] text-slate-400 max-w-[160px] mx-auto leading-tight">
              Watch AI turn listing details into buyer packs in seconds.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Main Hero Demo Component ─── */
export default function PropertyPackHeroDemo() {
  const [stage, setStage] = useState<Stage>("idle");
  const [mobileTab, setMobileTab] = useState<"input" | "output">("input");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!isInView) return;
    const t1 = setTimeout(() => setStage("typing"), 400);
    const t2 = setTimeout(() => setStage("generating"), 3800);
    const t3 = setTimeout(() => {
      setStage("result");
      setMobileTab("output");
    }, 5200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isInView]);

  const replay = () => {
    setStage("idle");
    setMobileTab("input");
    setTimeout(() => setStage("typing"), 200);
    setTimeout(() => setStage("generating"), 3600);
    setTimeout(() => {
      setStage("result");
      setMobileTab("output");
    }, 5000);
  };

  const fields = [
    { label: "Address", value: "14 Alder Grove, Richmond", delay: 0 },
    { label: "Price", value: "£750,000", delay: 350 },
    { label: "Bedrooms", value: "4", delay: 700 },
    {
      label: "Key features",
      value: "Extended kitchen, garden, near station",
      delay: 950,
      multiline: true,
    },
    { label: "Photos", value: "10 uploaded", delay: 1600 },
  ];

  const typing = stage !== "idle";

  return (
    <div ref={ref} className="@container w-full max-w-[720px] mx-auto select-none min-w-0">
      {/* ── Ambient Glow behind cards ── */}
      <div className="absolute -inset-4 bg-[#E8A808]/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Desktop & Tablet Side-by-Side Floating Layout (Shown when container >= 580px) ── */}
      <div className="hidden @[580px]:flex items-center justify-center gap-2.5 @[680px]:gap-3.5 relative z-10 w-full min-w-0">
        {/* LEFT: Compact Transparent Glassmorphic Input Card */}
        <div className="w-[195px] @[680px]:w-[235px] shrink-0 bg-[#0B1536]/85 backdrop-blur-xl border border-white/15 rounded-2xl @[680px]:rounded-3xl p-3.5 @[680px]:p-4.5 shadow-2xl flex flex-col gap-2 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between pb-1 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <ListFilter className="w-3 h-3 @[680px]:w-3.5 @[680px]:h-3.5 text-[#E8A808]" />
              <h4 className="text-[11px] @[680px]:text-xs font-semibold text-white tracking-wide truncate">
                Property info
              </h4>
            </div>
          </div>

          {/* Inputs list */}
          <div className="space-y-1.5 @[680px]:space-y-2 min-w-0">
            {fields.map((f) => (
              <TypedField
                key={f.label}
                label={f.label}
                value={f.value}
                delay={f.delay}
                active={typing}
                multiline={f.multiline}
              />
            ))}
          </div>

          {/* Replay action */}
          {stage === "result" && (
            <button
              onClick={replay}
              className="mt-0.5 flex items-center justify-center gap-1.5 text-[10px] @[680px]:text-[11px] font-semibold text-[#E8A808] hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Replay demo</span>
            </button>
          )}
        </div>

        {/* CENTER: Floating Gold AI Button + Connecting Line */}
        <div className="w-[40px] @[680px]:w-[52px] shrink-0 flex flex-col items-center justify-center relative py-2">
          {/* Horizontal Line flowing behind button */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-white/10 via-[#E8A808]/60 to-white/10 pointer-events-none" />

          {/* The Gold Sparkle Button */}
          <button
            onClick={() => {
              if (stage === "idle") {
                setStage("typing");
                setTimeout(() => setStage("generating"), 3600);
                setTimeout(() => setStage("result"), 5000);
              }
            }}
            disabled={stage === "generating"}
            className="relative w-9 h-9 @[680px]:w-11 @[680px]:h-11 rounded-xl @[680px]:rounded-2xl bg-[#E8A808] hover:bg-[#FFB800] active:scale-95 transition-all shadow-[0_0_20px_rgba(232,168,8,0.45)] border border-[#FFD700] flex items-center justify-center text-[#06143E] cursor-pointer z-10 shrink-0"
            title="Generate Pack"
          >
            {stage === "generating" ? (
              <Loader2 className="w-4 h-4 @[680px]:w-5 @[680px]:h-5 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 @[680px]:w-5 @[680px]:h-5 fill-current" />
            )}
          </button>

          {/* Label below button */}
          <p className="mt-1.5 text-[8px] @[680px]:text-[9px] font-semibold text-slate-300 text-center leading-tight max-w-[48px] @[680px]:max-w-[58px]">
            {stage === "result" ? (
              <span className="text-emerald-400">Ready!</span>
            ) : stage === "generating" ? (
              "Building…"
            ) : (
              "AI builds"
            )}
          </p>
        </div>

        {/* RIGHT: Spacious Property Pack Output Card */}
        <div className="flex-1 min-w-0 max-w-[390px] relative flex items-center">
          {stage === "result" ? (
            <PropertyCard visible />
          ) : (
            <OutputPlaceholder stage={stage} />
          )}
        </div>
      </div>

      {/* ── Mobile View (Shown when container < 580px) ── */}
      <div className="block @[580px]:hidden relative z-10 max-w-[420px] mx-auto min-w-0">
        {/* Mobile View Toggle */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5 bg-[#071330]/85 backdrop-blur-md p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setMobileTab("input")}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold transition-all ${
              mobileTab === "input"
                ? "bg-[#E8A808] text-[#06143E] shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            1. Property Details
          </button>
          <button
            onClick={() => setMobileTab("output")}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold transition-all ${
              mobileTab === "output"
                ? "bg-[#E8A808] text-[#06143E] shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            2. Generated Pack {stage === "result" && "✓"}
          </button>
        </div>

        {mobileTab === "input" ? (
          /* Left Input Card on mobile */
          <div className="bg-[#0B1536]/85 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <ListFilter className="w-3.5 h-3.5 text-[#E8A808]" />
                <span className="text-xs font-semibold text-white">
                  Property information
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Step 1 of 2</span>
            </div>

            <div className="space-y-2">
              {fields.map((f) => (
                <TypedField
                  key={f.label}
                  label={f.label}
                  value={f.value}
                  delay={f.delay}
                  active={typing}
                  multiline={f.multiline}
                />
              ))}
            </div>

            <button
              onClick={() => {
                setMobileTab("output");
                if (stage === "idle") {
                  setStage("typing");
                  setTimeout(() => setStage("generating"), 3600);
                  setTimeout(() => setStage("result"), 5000);
                }
              }}
              className="w-full h-9 rounded-xl bg-[#E8A808] text-[#06143E] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm mt-2.5"
            >
              <span>View Generated Pack</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Right Output Card on mobile with full breathing room */
          <div className="space-y-2.5">
            {stage === "result" ? (
              <PropertyCard visible />
            ) : (
              <OutputPlaceholder stage={stage} />
            )}
            {stage === "result" && (
              <button
                onClick={replay}
                className="w-full py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white font-medium flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-[#E8A808]" />
                <span>Replay Demo</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
