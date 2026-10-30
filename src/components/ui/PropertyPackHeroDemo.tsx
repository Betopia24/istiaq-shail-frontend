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
  ArrowLeftRight,
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
    <div className="space-y-0.5">
      <p className="text-[9px] font-semibold text-slate-300 uppercase tracking-wider pl-0.5">
        {label}
      </p>
      <div
        className={`relative bg-[#071330]/90 border text-white text-[11px] font-sans flex items-start transition-all duration-200 rounded-lg px-2.5 ${
          !done && active
            ? "border-[#E8A808]/70 shadow-[0_0_0_2px_rgba(232,168,8,0.15)]"
            : "border-white/10"
        } ${multiline ? "py-1 min-h-[34px]" : "py-1"}`}
      >
        <span className="leading-snug flex-1 break-words">
          {displayed || "\u00a0"}
        </span>
        {!done && active && (
          <span className="inline-block w-[2px] h-3 bg-[#E8A808] ml-0.5 mt-0.5 animate-pulse rounded-full shrink-0" />
        )}
      </div>
    </div>
  );
}

/* ─── Property Output Card ─── */
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
          initial={{ opacity: 0, scale: 0.96, x: 10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.96, x: -10 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl shadow-xl border border-white/20 overflow-hidden flex flex-col w-full min-w-0 text-slate-900"
        >
          {/* Photo */}
          <div className="relative h-32 @[540px]:h-36 w-full shrink-0 overflow-hidden bg-slate-900">
            <Image
              src="/landing/villa-dusk.jpg"
              alt="14 Alder Grove"
              fill
              sizes="(max-width: 640px) 100vw, 360px"
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

            <div className="absolute top-2 left-2.5 flex items-center gap-1 bg-[#E8A808] text-[#06143E] text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              <Sparkles className="w-2 h-2" />
              <span>PROPERTY PACK</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-3.5 @[540px]:p-4 flex flex-col gap-2.5 flex-1 min-w-0">
            {/* Title & Location Header */}
            <div className="flex items-start justify-between gap-1.5 min-w-0">
              <div className="min-w-0 flex-1">
                <p className="text-[8px] font-bold text-[#E8A808] uppercase tracking-wider mb-0.5">
                  PROPERTY PACK
                </p>
                <h3 className="font-heading font-bold text-sm @[540px]:text-base text-slate-900 leading-tight truncate">
                  14 Alder Grove
                </h3>
                <p className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5 truncate">
                  <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  <span>Richmond, Surrey</span>
                </p>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <span className="font-heading font-bold text-base @[540px]:text-lg text-slate-900">
                  £750,000
                </span>
                <p className="text-[8px] text-slate-400 font-medium">
                  Guide price
                </p>
              </div>
            </div>

            {/* Specs Row */}
            <div className="flex items-center justify-between text-[11px] text-slate-700 bg-slate-50/90 rounded-lg px-3 py-2 border border-slate-200/70 min-w-0">
              <span className="inline-flex items-center gap-1 font-medium whitespace-nowrap">
                <BedDouble className="w-3 h-3 text-[#E8A808] shrink-0" />
                <span>4 bed</span>
              </span>
              <span className="w-px h-3 bg-slate-200" />
              <span className="inline-flex items-center gap-1 font-medium whitespace-nowrap">
                <Bath className="w-3 h-3 text-[#E8A808] shrink-0" />
                <span>3 bath</span>
              </span>
              <span className="w-px h-3 bg-slate-200" />
              <span className="inline-flex items-center gap-1 font-medium whitespace-nowrap">
                <Maximize2 className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                <span>1,850 sq ft</span>
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100" />

            {/* Description */}
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-900">
                Description
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                A bright, extended family home on a quiet residential street,
                with an open-plan kitchen, landscaped garden and easy access to
                schools.
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-900">Highlights</p>
              <ul className="space-y-0.5">
                {highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-1.5 text-[10px] @[540px]:text-[11px] text-slate-600 truncate"
                  >
                    <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                    <span className="leading-tight truncate">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Agency Footer Strip */}
          <div className="flex items-center justify-between bg-[#06143E] px-3 py-1.5 @[540px]:py-2 shrink-0">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-white">
              <Building2 className="w-3 h-3 text-[#E8A808] shrink-0" />
              <span>Your Agency Name</span>
            </span>
            <span className="text-[9px] text-slate-400 font-medium">
              Agent name
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Output Placeholder ─── */
function OutputPlaceholder({ stage }: { stage: Stage }) {
  return (
    <div className="h-full min-h-[300px] @[540px]:min-h-[340px] w-full rounded-2xl bg-[#0B1536]/40 border border-dashed border-white/15 backdrop-blur-md flex flex-col items-center justify-center gap-2.5 p-4 text-center min-w-0">
      {stage === "generating" ? (
        <>
          <div className="relative">
            <Loader2 className="w-7 h-7 text-[#E8A808] animate-spin" />
            <Sparkles className="w-3 h-3 text-[#FFD700] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="space-y-1.5 w-full max-w-[150px]">
            <div className="h-1.5 rounded-full bg-white/20 animate-pulse" />
            <div className="h-1.5 rounded-full bg-[#E8A808]/40 animate-pulse" />
            <div className="h-1.5 rounded-full bg-white/10 animate-pulse w-3/4 mx-auto" />
          </div>
          <p className="text-[10px] font-medium text-amber-200/90 mt-1">
            Generating outputs…
          </p>
        </>
      ) : (
        <>
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <Layers className="w-4 h-4 text-slate-300" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-white">
              Pack will appear here
            </p>
            <p className="text-[10px] text-slate-400 max-w-[140px] mx-auto leading-tight">
              Watch AI turn listing details into buyer packs in seconds.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Animated AI Shuttle Button (Moving Back and Forth with Waves) ─── */
function AnimatedAIButton({
  stage,
  onClick,
}: {
  stage: Stage;
  onClick: () => void;
}) {
  const isGenerating = stage === "generating";

  return (
    <div className="flex flex-col items-center justify-center relative py-1">
      {/* Dynamic Back-and-Forth Traveling Container */}
      <motion.div
        animate={{
          x: isGenerating ? [-12, 12, -12] : [-7, 7, -7],
        }}
        transition={{
          duration: isGenerating ? 0.75 : 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex items-center justify-center"
      >
        {/* Pulsing Concentric Gold Glow Rings */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-[#E8A808]"
          animate={{
            scale: isGenerating ? [1, 1.6, 1] : [1, 1.35, 1],
            opacity: isGenerating ? [0.65, 0, 0.65] : [0.45, 0, 0.45],
          }}
          transition={{
            duration: isGenerating ? 0.75 : 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -inset-1 rounded-2xl bg-[#FFB800]/40 blur-xs"
          animate={{
            scale: [0.95, 1.15, 0.95],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* The Animated Gold Sparkle Button */}
        <motion.button
          onClick={onClick}
          whileHover={{ scale: 1.18 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-8.5 h-8.5 @[540px]:w-10 @[540px]:h-10 rounded-xl @[540px]:rounded-2xl bg-gradient-to-br from-[#FFD700] via-[#E8A808] to-[#B58306] shadow-[0_0_24px_rgba(232,168,8,0.7)] border border-[#FFF066] flex items-center justify-center text-[#06143E] cursor-default z-10 shrink-0"
          title="AI generating property pack"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 @[540px]:w-5 @[540px]:h-5 animate-spin text-[#06143E]" />
          ) : stage === "result" ? (
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            >
              <ArrowLeftRight className="w-3.5 h-3.5 @[540px]:w-4 @[540px]:h-4 stroke-[2.5] text-[#06143E]" />
            </motion.div>
          ) : (
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 @[540px]:w-4 @[540px]:h-4 fill-current text-[#06143E]" />
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      {/* Label below button */}
      <motion.p
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="mt-1 text-[8px] @[540px]:text-[9px] font-bold text-[#FFD700] text-center leading-tight whitespace-nowrap drop-shadow-sm"
      >
        {stage === "result" ? "Play ⇄" : isGenerating ? "Building…" : "AI builds ✦"}
      </motion.p>
    </div>
  );
}

/* ─── Main Hero Demo Component ─── */
export default function PropertyPackHeroDemo() {
  const [stage, setStage] = useState<Stage>("idle");
  const [mobileTab, setMobileTab] = useState<"input" | "output">("input");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-60px" });

  // Initial Play Trigger when scrolled into view
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

  // Continuous Back-and-Forth Animation Cycle
  useEffect(() => {
    let loopTimer: NodeJS.Timeout;
    if (stage === "result") {
      // Lingers on result for 5 seconds, then cycles back to input and generates again
      loopTimer = setTimeout(() => {
        setStage("idle");
        setMobileTab("input");
        setTimeout(() => setStage("typing"), 300);
        setTimeout(() => setStage("generating"), 3800);
        setTimeout(() => {
          setStage("result");
          setMobileTab("output");
        }, 5200);
      }, 5000);
    }
    return () => clearTimeout(loopTimer);
  }, [stage]);

  // Manual Toggle / Play Back and Forth
  const handleTogglePlay = () => {
    if (stage === "result") {
      // Move back to input
      setStage("idle");
      setMobileTab("input");
      setTimeout(() => setStage("typing"), 200);
      setTimeout(() => setStage("generating"), 3600);
      setTimeout(() => {
        setStage("result");
        setMobileTab("output");
      }, 5000);
    } else if (stage === "idle" || stage === "typing") {
      // Move forward to generate immediately
      setStage("generating");
      setTimeout(() => {
        setStage("result");
        setMobileTab("output");
      }, 1400);
    }
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
    <div
      ref={ref}
      className="@container w-full max-w-[720px] w-full mx-auto select-none min-w-0 relative"
    >
      {/* ── Ambient Glow behind cards ── */}
      <motion.div
        className="absolute -inset-4 rounded-3xl pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(232,168,8,0.10) 0%, transparent 70%)",
            "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(232,168,8,0.17) 0%, transparent 70%)",
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(232,168,8,0.10) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -inset-8 pointer-events-none"
        animate={{
          opacity: [0.4, 0.85, 0.4],
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(14,32,90,0.35) 0%, transparent 70%)",
        }}
      />

      {/* ── Desktop & Tablet Side-by-Side Floating Layout (Shown when container >= 520px) ── */}
      <div className="hidden @[520px]:flex items-center justify-center gap-3 @[540px]:gap-4 relative z-10 w-full min-w-0">
        {/* LEFT: Compact Transparent Glassmorphic Input Card */}
        <div className="w-[220px] @[540px]:w-[250px] shrink-0 bg-[#0B1536]/85 backdrop-blur-xl border border-white/15 rounded-2xl p-4 @[540px]:p-5 shadow-xl flex flex-col gap-2 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between pb-1 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <ListFilter className="w-3.5 h-3.5 text-[#E8A808]" />
              <h4 className="text-[11px] @[540px]:text-xs font-semibold text-white tracking-wide truncate">
                Property info
              </h4>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A808]/70 animate-pulse" />
          </div>

          {/* Inputs list */}
          <div className="space-y-2 min-w-0">
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

          {/* Action indicator */}
          <div className="mt-1 flex items-center justify-center gap-1 text-[10px] @[540px]:text-[11px] font-medium text-slate-400">
            <span>Input details</span>
            <ArrowRight className="w-2.5 h-2.5 text-[#E8A808]" />
          </div>
        </div>

        {/* CENTER: Floating Animated AI Button (pure visual indicator) */}
        <div className="w-[60px] @[540px]:w-[72px] shrink-0 flex flex-col items-center justify-center relative py-1">
          {/* Track Line between left and right cards */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-white/10 via-[#E8A808]/50 to-white/10 pointer-events-none overflow-hidden">
            {/* Glowing Light Bead shuttling back and forth */}
            <motion.div
              className="w-3 h-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]"
              animate={{ x: ["-100%", "280%", "-100%"] }}
              transition={{
                duration: stage === "generating" ? 0.75 : 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Animated AI Button with Back-and-Forth Waves */}
          <AnimatedAIButton stage={stage} onClick={() => {}} />
        </div>

        {/* RIGHT: Compact Property Pack Output Card */}
        <div className="flex-1 min-w-0 max-w-[390px] relative flex items-center">
          {stage === "result" ? (
            <PropertyCard visible />
          ) : (
            <OutputPlaceholder stage={stage} />
          )}
        </div>
      </div>

      {/* ── Mobile View (Shown when container < 520px) ── */}
      <div className="block @[520px]:hidden relative z-10 max-w-[380px] mx-auto min-w-0">
        {/* Mobile Header with Animated AI Button in center */}
        <div className="flex items-center justify-between gap-2 mb-3 bg-[#071330]/85 backdrop-blur-md p-1.5 rounded-xl">
          <div className="flex items-center gap-1 flex-1">
            <button
              onClick={() => setMobileTab("input")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all ${
                mobileTab === "input"
                  ? "bg-[#E8A808] text-[#06143E] shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              1. Details
            </button>
            <button
              onClick={() => setMobileTab("output")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all ${
                mobileTab === "output"
                  ? "bg-[#E8A808] text-[#06143E] shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              2. Pack {stage === "result" && "✓"}
            </button>
          </div>
        </div>

        {mobileTab === "input" ? (
          /* Left Input Card on mobile */
          <div className="bg-[#0B1536]/85 backdrop-blur-xl border border-white/15 rounded-2xl p-3.5 shadow-xl space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <ListFilter className="w-3 h-3 text-[#E8A808]" />
                <span className="text-[11px] font-semibold text-white">
                  Property information
                </span>
              </div>
              <span className="text-[9px] text-slate-400">Step 1 of 2</span>
            </div>

            <div className="space-y-1.5">
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
              className="w-full h-8.5 rounded-xl bg-[#E8A808] text-[#06143E] font-semibold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm mt-2"
            >
              <span>View Generated Pack</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          /* Right Output Card on mobile */
          <div className="space-y-2">
            {stage === "result" ? (
              <PropertyCard visible />
            ) : (
              <OutputPlaceholder stage={stage} />
            )}

          </div>
        )}
      </div>
    </div>
  );
}
