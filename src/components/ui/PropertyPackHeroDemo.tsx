"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  Sparkles,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Check,
  ArrowRight,
  Building2,
  FileText,
  Loader2,
} from "lucide-react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type Stage = "idle" | "typing" | "generating" | "result";

/* ─────────────────────────────────────────────
   ANIMATED TYPING FIELD
───────────────────────────────────────────── */
function TypedField({
  label,
  value,
  delay = 0,
  active,
}: {
  label: string;
  value: string;
  delay?: number;
  active: boolean;
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
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(value.slice(0, i));
        if (i >= value.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, 28);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [active, value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.3 }}
      className="space-y-1"
    >
      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      <div className="relative bg-[#0D1E4A]/80 rounded-lg px-3 py-2.5 border border-[#1E3B87]/60 text-white text-xs font-sans min-h-[34px] flex items-center">
        <span className="leading-snug">{displayed}</span>
        {!done && active && (
          <span className="inline-block w-[2px] h-3 bg-[#E8A808] ml-0.5 animate-pulse rounded-full shrink-0" />
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   PROPERTY PACK OUTPUT CARD
───────────────────────────────────────────── */
function PropertyPackCard({ visible }: { visible: boolean }) {
  const highlights = [
    "Open-plan kitchen and dining",
    "South-facing landscaped garden",
    "Short walk to the station",
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="pack-card"
          initial={{ opacity: 0, x: 24, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 24, scale: 0.96 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col"
          style={{ minWidth: 0 }}
        >
          {/* Property Photo */}
          <div className="relative h-28 sm:h-32 bg-gradient-to-br from-[#1a3a6b] via-[#0f2548] to-[#0a1932] overflow-hidden shrink-0">
            {/* Architectural illustration */}
            <svg
              viewBox="0 0 300 130"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Sky */}
              <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7EC8E3" />
                  <stop offset="100%" stopColor="#B8DFF0" />
                </linearGradient>
                <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5DB075" />
                  <stop offset="100%" stopColor="#3E8A55" />
                </linearGradient>
                <linearGradient id="houseGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#D4A96A" />
                  <stop offset="100%" stopColor="#C8933A" />
                </linearGradient>
              </defs>
              <rect width="300" height="130" fill="url(#skyGrad)" />
              {/* Sun */}
              <circle cx="260" cy="28" r="14" fill="#FFD700" opacity="0.9" />
              {/* Cloud */}
              <ellipse cx="80" cy="25" rx="22" ry="10" fill="white" opacity="0.7" />
              <ellipse cx="96" cy="22" rx="16" ry="9" fill="white" opacity="0.8" />
              {/* Ground */}
              <rect x="0" y="100" width="300" height="30" fill="url(#grassGrad)" />
              {/* House main body */}
              <rect x="80" y="55" width="140" height="55" fill="#F5E6CC" />
              {/* House second floor (dark wood) */}
              <rect x="80" y="40" width="140" height="20" fill="#6B4226" />
              {/* Roof accent line */}
              <rect x="75" y="38" width="150" height="4" fill="#8B5A2B" rx="1" />
              {/* Flat roof extension left */}
              <rect x="60" y="58" width="25" height="40" fill="#E8D5B0" />
              {/* Flat roof extension right */}
              <rect x="215" y="58" width="25" height="40" fill="#E8D5B0" />
              {/* Windows second floor */}
              <rect x="100" y="44" width="28" height="13" fill="#87CEEB" rx="2" opacity="0.85" />
              <rect x="140" y="44" width="28" height="13" fill="#87CEEB" rx="2" opacity="0.85" />
              <rect x="180" y="44" width="28" height="13" fill="#87CEEB" rx="2" opacity="0.85" />
              {/* Windows ground floor */}
              <rect x="95" y="65" width="32" height="24" fill="#87CEEB" rx="2" opacity="0.8" />
              <rect x="170" y="65" width="32" height="24" fill="#87CEEB" rx="2" opacity="0.8" />
              {/* Door */}
              <rect x="130" y="72" width="22" height="28" fill="#8B4513" rx="2" />
              <circle cx="149" cy="86" r="2" fill="#FFD700" />
              {/* Driveway */}
              <rect x="125" y="100" width="50" height="30" fill="#C8B89A" />
              {/* Trees */}
              <rect x="38" y="72" width="6" height="28" fill="#6B4226" />
              <ellipse cx="41" cy="68" rx="12" ry="14" fill="#2E7D32" />
              <rect x="252" y="72" width="6" height="28" fill="#6B4226" />
              <ellipse cx="255" cy="68" rx="12" ry="14" fill="#2E7D32" />
            </svg>
            {/* Subtle gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {/* Property Pack label */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-2.5 left-3 flex items-center gap-1.5 bg-[#E8A808] text-[#06143E] text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shadow"
            >
              <FileText className="w-2.5 h-2.5" />
              Property Pack
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col gap-3 flex-1">
            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-[9px] font-semibold text-[#E8A808] uppercase tracking-widest mb-0.5">
                Property Pack
              </p>
              <h3 className="font-heading font-semibold text-sm text-[#06143E] leading-tight">
                14 Alder Grove
              </h3>
              <p className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                Richmond, Surrey
              </p>
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="font-heading font-bold text-base text-[#06143E]">
                £750,000
              </span>
              <span className="text-[9px] text-slate-400 ml-1.5">
                Guide price
              </span>
            </motion.div>

            {/* Specs */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-3 text-[10px] text-slate-600"
            >
              <span className="flex items-center gap-1">
                <BedDouble className="w-3 h-3 text-[#E8A808]" />
                4 bed
              </span>
              <span className="w-px h-3 bg-slate-200" />
              <span className="flex items-center gap-1">
                <Bath className="w-3 h-3 text-[#E8A808]" />
                3 bath
              </span>
              <span className="w-px h-3 bg-slate-200" />
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-slate-400" />
                1,850 sq ft
              </span>
            </motion.div>

            {/* Divider */}
            <div className="h-px bg-slate-100" />

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-1.5"
            >
              <p className="text-[10px] font-semibold text-slate-800">
                Description
              </p>
              <p className="text-[9px] text-slate-500 leading-relaxed">
                A bright, extended family home on a quiet residential street,
                with an open-plan kitchen, landscaped garden and easy access to
                schools and transport.
              </p>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="space-y-1.5"
            >
              <p className="text-[10px] font-semibold text-slate-800">
                Highlights
              </p>
              <ul className="space-y-1">
                {highlights.map((h, i) => (
                  <motion.li
                    key={h}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-start gap-1.5 text-[9px] text-slate-600"
                  >
                    <Check className="w-2.5 h-2.5 text-emerald-500 mt-0.5 shrink-0 stroke-[3]" />
                    {h}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Agency Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="flex items-center justify-between bg-[#06143E] px-4 py-2.5 shrink-0"
          >
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-white">
              <Building2 className="w-3 h-3 text-[#E8A808]" />
              Your Agency Name
            </span>
            <span className="text-[9px] text-slate-400">Agent name</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   AI BUTTON
───────────────────────────────────────────── */
function AIButton({
  stage,
  onClick,
}: {
  stage: Stage;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0 z-10">
      <motion.button
        onClick={onClick}
        disabled={stage === "generating" || stage === "result"}
        whileTap={{ scale: 0.9 }}
        className="relative w-12 h-12 rounded-2xl bg-[#E8A808] shadow-[0_0_24px_rgba(232,168,8,0.55)] flex items-center justify-center cursor-pointer disabled:cursor-default overflow-hidden select-none"
        aria-label="Generate Property Pack"
      >
        {/* Shimmer ring */}
        {(stage === "idle" || stage === "typing") && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-[#E8A808]/50"
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {stage === "generating" ? (
          <Loader2 className="w-5 h-5 text-[#06143E] animate-spin" />
        ) : (
          <Sparkles className="w-5 h-5 text-[#06143E]" />
        )}
      </motion.button>

      <p className="text-center text-[9px] font-semibold text-white/70 leading-tight max-w-[52px]">
        {stage === "idle" || stage === "typing"
          ? "AI builds the pack"
          : stage === "generating"
            ? "Building..."
            : "Pack ready!"}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function PropertyPackHeroDemo() {
  const [stage, setStage] = useState<Stage>("idle");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Auto-run animation once in view
  useEffect(() => {
    if (!isInView) return;
    // Start typing after 600ms
    const t1 = setTimeout(() => setStage("typing"), 600);
    // Start generating after typing fills (~2s per field × 5 fields ≈ 3.2s)
    const t2 = setTimeout(() => setStage("generating"), 4200);
    // Show result after 1.4s of "generating"
    const t3 = setTimeout(() => setStage("result"), 5600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isInView]);

  // Manual replay
  const replay = () => {
    setStage("idle");
    setTimeout(() => setStage("typing"), 200);
    setTimeout(() => setStage("generating"), 4400);
    setTimeout(() => setStage("result"), 5800);
  };

  const fields = [
    { label: "Address", value: "14 Alder Grove, Richmond", delay: 0 },
    { label: "Price", value: "£750,000", delay: 500 },
    { label: "Bedrooms", value: "4", delay: 900 },
    {
      label: "Key features",
      value: "Extended kitchen, garden, near station",
      delay: 1200,
    },
    { label: "Photos", value: "10 uploaded", delay: 1900 },
  ];

  const typing = stage === "typing" || stage === "generating" || stage === "result";

  return (
    <div ref={ref} className="relative w-full select-none">
      {/* Glow effect behind card */}
      <div className="absolute -inset-6 rounded-3xl bg-[#E8A808]/8 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-stretch gap-0"
      >
        {/* ── LEFT PANEL: Property Information Form ── */}
        <motion.div
          className="flex-1 min-w-0 bg-[#060F2E] rounded-l-2xl p-4 flex flex-col gap-3 border border-[#1E3B87]/50 border-r-0"
          style={{ maxWidth: "52%" }}
        >
          {/* Panel Header */}
          <div className="flex items-center gap-2 pb-1">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A808]/70" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A808]/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A808]/20" />
            </div>
            <p className="text-[10px] font-semibold text-white/80 ml-1">
              Property information
            </p>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-2.5">
            {fields.map((f) => (
              <TypedField
                key={f.label}
                label={f.label}
                value={f.value}
                delay={f.delay}
                active={typing}
              />
            ))}
          </div>

          {/* Replay button when done */}
          <AnimatePresence>
            {stage === "result" && (
              <motion.button
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
                onClick={replay}
                className="mt-1 flex items-center justify-center gap-1.5 text-[9px] font-semibold text-[#E8A808]/80 hover:text-[#E8A808] transition-colors cursor-pointer"
              >
                <ArrowRight className="w-2.5 h-2.5 rotate-180" />
                Run again
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── CENTER: AI Button connector ── */}
        <div className="flex flex-col items-center justify-center px-2 py-4 bg-[#050D28] relative z-10 border-y border-[#1E3B87]/50">
          {/* Connector lines */}
          <div className="absolute left-0 top-1/2 w-2 h-px bg-[#E8A808]/30 -translate-y-1/2" />
          <div className="absolute right-0 top-1/2 w-2 h-px bg-[#E8A808]/30 -translate-y-1/2" />

          <AIButton
            stage={stage}
            onClick={() => {
              if (stage === "idle") {
                setStage("typing");
                setTimeout(() => setStage("generating"), 3800);
                setTimeout(() => setStage("result"), 5200);
              }
            }}
          />
        </div>

        {/* ── RIGHT PANEL: Output or placeholder ── */}
        <div
          className="flex-1 min-w-0 rounded-r-2xl overflow-hidden border border-[#1E3B87]/50 border-l-0"
          style={{ maxWidth: "44%" }}
        >
          {stage !== "result" ? (
            /* Placeholder / generating state */
            <motion.div
              className="h-full bg-[#060F2E] flex flex-col items-center justify-center gap-3 p-4"
              animate={
                stage === "generating"
                  ? { backgroundColor: ["#060F2E", "#081436", "#060F2E"] }
                  : {}
              }
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              {stage === "generating" ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-8 h-8 rounded-full border-2 border-[#E8A808]/30 border-t-[#E8A808] shadow-[0_0_12px_rgba(232,168,8,0.3)]"
                  />
                  <div className="space-y-1.5 w-full px-2">
                    {[1, 0.7, 0.5].map((op, i) => (
                      <motion.div
                        key={i}
                        className="h-1.5 rounded-full bg-[#E8A808]/20"
                        animate={{ opacity: [op * 0.4, op, op * 0.4] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                        style={{ width: `${90 - i * 18}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-[9px] text-[#E8A808]/60 font-medium">
                    Generating pack…
                  </p>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E8A808]/10 border border-[#E8A808]/20 flex items-center justify-center mx-auto">
                    <FileText className="w-4 h-4 text-[#E8A808]/50" />
                  </div>
                  <p className="text-[9px] text-white/30 font-medium leading-snug max-w-[80px] mx-auto">
                    Pack will appear here
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <PropertyPackCard visible={stage === "result"} />
          )}
        </div>
      </motion.div>

      {/* Bottom status bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className="mt-3 flex items-center justify-between px-1"
      >
        <div className="flex items-center gap-2">
          {(["idle", "typing", "generating", "result"] as Stage[]).map(
            (s, i) => (
              <motion.div
                key={s}
                className="h-1 rounded-full transition-all duration-500"
                animate={{
                  width: stage === s ? 20 : 6,
                  backgroundColor:
                    i <= (["idle", "typing", "generating", "result"] as Stage[]).indexOf(stage)
                      ? "#E8A808"
                      : "rgba(255,255,255,0.15)",
                }}
              />
            )
          )}
        </div>
        <p className="text-[9px] text-white/30 font-medium">
          {stage === "idle" && "Ready"}
          {stage === "typing" && "Entering details…"}
          {stage === "generating" && "AI building pack…"}
          {stage === "result" && "✓ Pack generated in 1.4s"}
        </p>
      </motion.div>
    </div>
  );
}
