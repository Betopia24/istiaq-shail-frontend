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
  RefreshCw,
} from "lucide-react";

type Stage = "idle" | "typing" | "generating" | "result";

/* ─── Animated typed field ─────────────────── */
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
    if (!active) { setDisplayed(""); setDone(false); return; }
    let i = 0;
    setDisplayed(""); setDone(false);
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(value.slice(0, i));
        if (i >= value.length) { clearInterval(iv); setDone(true); }
      }, 22);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [active, value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000 + 0.1, duration: 0.35 }}
      className="space-y-1.5"
    >
      <p className="text-[10px] font-semibold text-[#7B9CC8] uppercase tracking-widest pl-0.5">
        {label}
      </p>
      <div
        className={`relative bg-[#162550]/70 rounded-xl px-3.5 border border-[#2A4A8A]/60 text-white text-[13px] font-sans flex items-start transition-all duration-200 ${
          !done && active ? "border-[#E8A808]/60 shadow-[0_0_0_3px_rgba(232,168,8,0.08)]" : ""
        } ${multiline ? "py-2.5 min-h-[52px]" : "py-2.5"}`}
      >
        <span className="leading-snug flex-1">{displayed || "\u00a0"}</span>
        {!done && active && (
          <span className="inline-block w-[2px] h-4 bg-[#E8A808] ml-0.5 mt-0.5 animate-pulse rounded-sm shrink-0" />
        )}
      </div>
    </motion.div>
  );
}

/* ─── Property output card ─────────────────── */
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
          initial={{ opacity: 0, x: 20, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200/70 flex flex-col h-full"
        >
          {/* Photo */}
          <div className="relative shrink-0 overflow-hidden" style={{ height: 120 }}>
            <svg viewBox="0 0 320 120" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#93C5FD" />
                  <stop offset="100%" stopColor="#BFDBFE" />
                </linearGradient>
              </defs>
              <rect width="320" height="120" fill="url(#sky2)" />
              {/* Sun */}
              <circle cx="280" cy="26" r="16" fill="#FCD34D" opacity="0.95" />
              {/* Clouds */}
              <ellipse cx="60" cy="28" rx="28" ry="11" fill="white" opacity="0.85" />
              <ellipse cx="78" cy="24" rx="20" ry="10" fill="white" opacity="0.9" />
              {/* Ground */}
              <rect x="0" y="96" width="320" height="24" fill="#4ADE80" opacity="0.6" />
              <rect x="0" y="100" width="320" height="20" fill="#22C55E" opacity="0.4" />
              {/* House body */}
              <rect x="88" y="52" width="144" height="56" fill="#FEF3C7" />
              {/* Second floor dark */}
              <rect x="88" y="36" width="144" height="20" fill="#92400E" opacity="0.85" />
              {/* Roof cap */}
              <rect x="82" y="33" width="156" height="5" fill="#78350F" rx="2" />
              {/* Side extensions */}
              <rect x="62" y="60" width="28" height="44" fill="#FEF9EC" />
              <rect x="230" y="60" width="28" height="44" fill="#FEF9EC" />
              {/* Windows second floor */}
              <rect x="104" y="40" width="26" height="12" fill="#BAE6FD" rx="2" opacity="0.9" />
              <rect x="147" y="40" width="26" height="12" fill="#BAE6FD" rx="2" opacity="0.9" />
              <rect x="190" y="40" width="26" height="12" fill="#BAE6FD" rx="2" opacity="0.9" />
              {/* Windows ground */}
              <rect x="100" y="62" width="34" height="26" fill="#BAE6FD" rx="2" opacity="0.8" />
              <rect x="186" y="62" width="34" height="26" fill="#BAE6FD" rx="2" opacity="0.8" />
              {/* Door */}
              <rect x="140" y="70" width="40" height="32" fill="#92400E" rx="2" />
              <circle cx="176" cy="86" r="2.5" fill="#FCD34D" />
              {/* Driveway */}
              <rect x="138" y="100" width="44" height="20" fill="#D1D5DB" opacity="0.6" />
              {/* Trees */}
              <rect x="36" y="72" width="7" height="28" fill="#78350F" />
              <ellipse cx="39" cy="66" rx="14" ry="16" fill="#15803D" />
              <ellipse cx="39" cy="58" rx="10" ry="12" fill="#16A34A" />
              <rect x="274" y="72" width="7" height="28" fill="#78350F" />
              <ellipse cx="277" cy="66" rx="14" ry="16" fill="#15803D" />
              <ellipse cx="277" cy="58" rx="10" ry="12" fill="#16A34A" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            {/* Badge */}
            <div className="absolute top-2.5 left-3 flex items-center gap-1.5 bg-[#E8A808] text-[#06143E] text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              <FileText className="w-2.5 h-2.5" />
              Property Pack
            </div>
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col gap-2.5 flex-1 overflow-y-auto">
            {/* Label + Title */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <p className="text-[9px] font-bold text-[#E8A808] uppercase tracking-widest mb-0.5">Property Pack</p>
              <h3 className="font-heading font-bold text-[15px] text-[#06143E] leading-tight">14 Alder Grove</h3>
              <p className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> Richmond, Surrey
              </p>
            </motion.div>

            {/* Price */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="flex items-baseline gap-2">
              <span className="font-heading font-bold text-xl text-[#06143E]">£750,000</span>
              <span className="text-[10px] text-slate-400 font-medium">Guide price</span>
            </motion.div>

            {/* Specs */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
              className="flex items-center gap-0 text-[11px] text-slate-600 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100"
            >
              <span className="flex items-center gap-1.5 flex-1 justify-center">
                <BedDouble className="w-3.5 h-3.5 text-[#E8A808]" /> 4 bed
              </span>
              <span className="w-px h-4 bg-slate-200" />
              <span className="flex items-center gap-1.5 flex-1 justify-center">
                <Bath className="w-3.5 h-3.5 text-[#E8A808]" /> 3 bath
              </span>
              <span className="w-px h-4 bg-slate-200" />
              <span className="flex items-center gap-1.5 flex-1 justify-center">
                <Maximize2 className="w-3 h-3 text-slate-400" /> 1,850 sq ft
              </span>
            </motion.div>

            <div className="h-px bg-slate-100" />

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }} className="space-y-1">
              <p className="text-[11px] font-bold text-slate-800">Description</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                A bright, extended family home on a quiet residential street, with an open-plan kitchen, landscaped garden and easy access to schools and transport.
              </p>
            </motion.div>

            {/* Highlights */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-800">Highlights</p>
              <ul className="space-y-1.5">
                {highlights.map((h, i) => (
                  <motion.li
                    key={h}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.48 + i * 0.1 }}
                    className="flex items-start gap-2 text-[10px] text-slate-600"
                  >
                    <Check className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0 stroke-[3]" />
                    {h}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-between bg-[#06143E] px-4 py-3 shrink-0"
          >
            <span className="flex items-center gap-2 text-[11px] font-semibold text-white">
              <Building2 className="w-3.5 h-3.5 text-[#E8A808]" />
              Your Agency Name
            </span>
            <span className="text-[10px] text-slate-400">Agent name</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Placeholder / Generating state ──────── */
function OutputPlaceholder({ stage }: { stage: Stage }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
      {stage === "generating" ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full border-[3px] border-[#E8A808]/20 border-t-[#E8A808]"
          />
          <div className="w-full space-y-2 px-2">
            {[100, 78, 60].map((w, i) => (
              <motion.div
                key={i}
                className="h-2 rounded-full bg-[#2A4A8A]/60"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18 }}
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
          <p className="text-[11px] font-medium text-[#7B9CC8]">Building your pack…</p>
        </>
      ) : (
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#162550]/80 border border-[#2A4A8A]/50 flex items-center justify-center mx-auto">
            <FileText className="w-5 h-5 text-[#4A7BC8]/60" />
          </div>
          <p className="text-[11px] text-[#4A6A9A] font-medium leading-snug max-w-[100px] mx-auto">
            Your pack will appear here
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Main component ────────────────────────── */
export default function PropertyPackHeroDemo() {
  const [stage, setStage] = useState<Stage>("idle");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;
    const t1 = setTimeout(() => setStage("typing"),     500);
    const t2 = setTimeout(() => setStage("generating"), 4000);
    const t3 = setTimeout(() => setStage("result"),     5500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isInView]);

  const replay = () => {
    setStage("idle");
    setTimeout(() => setStage("typing"),     200);
    setTimeout(() => setStage("generating"), 3800);
    setTimeout(() => setStage("result"),     5300);
  };

  const typing = stage !== "idle";

  const fields = [
    { label: "Address",      value: "14 Alder Grove, Richmond",               delay: 0 },
    { label: "Price",        value: "£750,000",                                delay: 480 },
    { label: "Bedrooms",     value: "4",                                       delay: 820 },
    { label: "Key features", value: "Extended kitchen, garden, near station",  delay: 1100, multiline: true },
    { label: "Photos",       value: "10 uploaded",                             delay: 1800 },
  ];

  const stageIndex = { idle: 0, typing: 1, generating: 2, result: 3 }[stage];

  return (
    <div ref={ref} className="relative w-full">
      {/* Ambient glow */}
      <div className="absolute -inset-8 pointer-events-none">
        <div className="absolute inset-0 rounded-3xl bg-[#E8A808]/6 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-1/2 h-1/2 -translate-y-1/2 rounded-full bg-[#3B82F6]/8 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* ── Card shell ── */}
        <div
          className="rounded-2xl overflow-hidden border border-[#1E3A78]/50 shadow-[0_32px_64px_-12px_rgba(0,0,20,0.6)]"
          style={{ background: "linear-gradient(145deg, #0D1E4A 0%, #0A1836 50%, #081330 100%)" }}
        >
          {/* Top bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1E3A78]/40 bg-[#0A1836]/60">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
            </div>
            <p className="text-[11px] font-semibold text-[#9BB5D8] ml-1.5 tracking-wide">
              Property information
            </p>
          </div>

          {/* Content row */}
          <div className="flex" style={{ minHeight: 440 }}>
            {/* LEFT: Form */}
            <div className="flex flex-col gap-4 p-5 border-r border-[#1E3A78]/40" style={{ width: "46%", flexShrink: 0 }}>
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

              {/* Replay */}
              <AnimatePresence>
                {stage === "result" && (
                  <motion.button
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={replay}
                    className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#E8A808]/70 hover:text-[#E8A808] transition-colors cursor-pointer mt-auto pt-2"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Run again
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* CENTER: AI connector */}
            <div className="flex flex-col items-center justify-center gap-3 px-3 shrink-0 relative">
              {/* Top connector */}
              <motion.div
                className="absolute top-0 bottom-1/2 w-px bg-gradient-to-b from-transparent to-[#E8A808]/30"
              />
              {/* Bottom connector */}
              <motion.div
                className="absolute bottom-0 top-1/2 w-px bg-gradient-to-t from-transparent to-[#E8A808]/30"
              />

              {/* Button */}
              <motion.button
                onClick={() => {
                  if (stage === "idle") {
                    setStage("typing");
                    setTimeout(() => setStage("generating"), 3800);
                    setTimeout(() => setStage("result"), 5200);
                  }
                }}
                disabled={stage === "generating" || stage === "result"}
                whileTap={{ scale: 0.88 }}
                className="relative w-14 h-14 rounded-2xl bg-[#E8A808] flex items-center justify-center cursor-pointer disabled:cursor-default shadow-[0_0_28px_rgba(232,168,8,0.5)] z-10"
              >
                {/* Pulse rings */}
                {(stage === "idle" || stage === "typing") && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-[#E8A808]"
                      animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-[#E8A808]"
                      animate={{ scale: [1, 1.3], opacity: [0.25, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                    />
                  </>
                )}
                {stage === "generating"
                  ? <Loader2 className="w-6 h-6 text-[#06143E] animate-spin" />
                  : <Sparkles className="w-6 h-6 text-[#06143E]" />
                }
              </motion.button>

              <p className="text-[10px] font-semibold text-center leading-tight text-[#9BB5D8] max-w-[56px] z-10">
                {stage === "result" ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-emerald-400"
                  >
                    Pack ready!
                  </motion.span>
                ) : stage === "generating" ? (
                  "Building…"
                ) : (
                  "AI builds the pack"
                )}
              </p>
            </div>

            {/* RIGHT: Output */}
            <div className="flex-1 min-w-0 overflow-hidden">
              {stage === "result"
                ? <PropertyCard visible />
                : <OutputPlaceholder stage={stage} />
              }
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#1E3A78]/40 bg-[#081330]/60">
            {/* Step dots */}
            <div className="flex items-center gap-1.5">
              {(["idle", "typing", "generating", "result"] as Stage[]).map((s, i) => (
                <motion.div
                  key={s}
                  className="h-1.5 rounded-full"
                  animate={{
                    width: stageIndex === i ? 20 : 6,
                    backgroundColor:
                      i <= stageIndex ? "#E8A808" : "rgba(255,255,255,0.12)",
                  }}
                  transition={{ duration: 0.4 }}
                />
              ))}
            </div>
            <motion.p
              key={stage}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] font-medium text-[#4A6A9A]"
            >
              {stage === "idle"       && "Ready to generate"}
              {stage === "typing"     && "Entering details…"}
              {stage === "generating" && "AI generating pack…"}
              {stage === "result"     && "✓ Pack generated in 1.5s"}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
