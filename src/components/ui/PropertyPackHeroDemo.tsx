// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence, useInView } from "motion/react";
// import {
//   Sparkles,
//   MapPin,
//   BedDouble,
//   Bath,
//   Maximize2,
//   Check,
//   Building2,
//   FileText,
//   Loader2,
//   RefreshCw,
// } from "lucide-react";

// type Stage = "idle" | "typing" | "generating" | "result";

// /* ─────────────────────────────────────────────
//    Animated typed field
// ───────────────────────────────────────────── */
// function TypedField({
//   label,
//   value,
//   delay = 0,
//   active,
//   multiline = false,
// }: {
//   label: string;
//   value: string;
//   delay?: number;
//   active: boolean;
//   multiline?: boolean;
// }) {
//   const [displayed, setDisplayed] = useState("");
//   const [done, setDone] = useState(false);

//   useEffect(() => {
//     if (!active) { setDisplayed(""); setDone(false); return; }
//     let i = 0;
//     setDisplayed(""); setDone(false);
//     const t = setTimeout(() => {
//       const iv = setInterval(() => {
//         i++;
//         setDisplayed(value.slice(0, i));
//         if (i >= value.length) { clearInterval(iv); setDone(true); }
//       }, 22);
//       return () => clearInterval(iv);
//     }, delay);
//     return () => clearTimeout(t);
//   }, [active, value, delay]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: delay / 1000 + 0.1, duration: 0.35 }}
//       className="space-y-1.5"
//     >
//       <p className="text-[9px] sm:text-[10px] font-semibold text-[#7B9CC8] uppercase tracking-widest pl-0.5">
//         {label}
//       </p>
//       <div
//         className={`relative bg-[#162550]/70 rounded-xl px-3 sm:px-3.5 border text-white text-xs sm:text-[13px] font-sans flex items-start transition-all duration-200
//           ${!done && active
//             ? "border-[#E8A808]/60 shadow-[0_0_0_3px_rgba(232,168,8,0.08)]"
//             : "border-[#2A4A8A]/60"}
//           ${multiline ? "py-2 sm:py-2.5 min-h-[44px] sm:min-h-[52px]" : "py-2 sm:py-2.5"}`}
//       >
//         <span className="leading-snug flex-1">{displayed || "\u00a0"}</span>
//         {!done && active && (
//           <span className="inline-block w-[2px] h-3.5 bg-[#E8A808] ml-0.5 mt-0.5 animate-pulse rounded-sm shrink-0" />
//         )}
//       </div>
//     </motion.div>
//   );
// }

// /* ─────────────────────────────────────────────
//    Property pack output card
// ───────────────────────────────────────────── */
// function PropertyCard({ visible }: { visible: boolean }) {
//   const highlights = [
//     "Open-plan kitchen and dining",
//     "South-facing landscaped garden",
//     "Short walk to the station",
//   ];

//   return (
//     <AnimatePresence>
//       {visible && (
//         <motion.div
//           key="card"
//           initial={{ opacity: 0, y: 16, scale: 0.97 }}
//           animate={{ opacity: 1, y: 0, scale: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
//           className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-slate-200/70 flex flex-col h-full"
//         >
//           {/* Photo */}
//           <div className="relative shrink-0 overflow-hidden h-24 sm:h-28 lg:h-32">
//             <svg viewBox="0 0 320 120" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
//               <defs>
//                 <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopColor="#93C5FD" />
//                   <stop offset="100%" stopColor="#BFDBFE" />
//                 </linearGradient>
//               </defs>
//               <rect width="320" height="120" fill="url(#sky2)" />
//               <circle cx="280" cy="26" r="16" fill="#FCD34D" opacity="0.95" />
//               <ellipse cx="60" cy="28" rx="28" ry="11" fill="white" opacity="0.85" />
//               <ellipse cx="78" cy="24" rx="20" ry="10" fill="white" opacity="0.9" />
//               <rect x="0" y="96" width="320" height="24" fill="#4ADE80" opacity="0.6" />
//               <rect x="0" y="100" width="320" height="20" fill="#22C55E" opacity="0.4" />
//               <rect x="88" y="52" width="144" height="56" fill="#FEF3C7" />
//               <rect x="88" y="36" width="144" height="20" fill="#92400E" opacity="0.85" />
//               <rect x="82" y="33" width="156" height="5" fill="#78350F" rx="2" />
//               <rect x="62" y="60" width="28" height="44" fill="#FEF9EC" />
//               <rect x="230" y="60" width="28" height="44" fill="#FEF9EC" />
//               <rect x="104" y="40" width="26" height="12" fill="#BAE6FD" rx="2" opacity="0.9" />
//               <rect x="147" y="40" width="26" height="12" fill="#BAE6FD" rx="2" opacity="0.9" />
//               <rect x="190" y="40" width="26" height="12" fill="#BAE6FD" rx="2" opacity="0.9" />
//               <rect x="100" y="62" width="34" height="26" fill="#BAE6FD" rx="2" opacity="0.8" />
//               <rect x="186" y="62" width="34" height="26" fill="#BAE6FD" rx="2" opacity="0.8" />
//               <rect x="140" y="70" width="40" height="32" fill="#92400E" rx="2" />
//               <circle cx="176" cy="86" r="2.5" fill="#FCD34D" />
//               <rect x="138" y="100" width="44" height="20" fill="#D1D5DB" opacity="0.6" />
//               <rect x="36" y="72" width="7" height="28" fill="#78350F" />
//               <ellipse cx="39" cy="66" rx="14" ry="16" fill="#15803D" />
//               <ellipse cx="39" cy="58" rx="10" ry="12" fill="#16A34A" />
//               <rect x="274" y="72" width="7" height="28" fill="#78350F" />
//               <ellipse cx="277" cy="66" rx="14" ry="16" fill="#15803D" />
//               <ellipse cx="277" cy="58" rx="10" ry="12" fill="#16A34A" />
//             </svg>
//             <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
//             <div className="absolute top-2 left-2.5 flex items-center gap-1 bg-[#E8A808] text-[#06143E] text-[8px] sm:text-[9px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider shadow-md">
//               <FileText className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
//               Property Pack
//             </div>
//           </div>

//           {/* Body */}
//           <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-2.5 flex-1 overflow-y-auto">
//             {/* Title */}
//             <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
//               <p className="text-[8px] sm:text-[9px] font-bold text-[#E8A808] uppercase tracking-widest mb-0.5">Property Pack</p>
//               <h3 className="font-heading font-bold text-sm sm:text-[15px] text-[#06143E] leading-tight">14 Alder Grove</h3>
//               <p className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
//                 <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" /> Richmond, Surrey
//               </p>
//             </motion.div>

//             {/* Price */}
//             <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="flex items-baseline gap-1.5">
//               <span className="font-heading font-bold text-base sm:text-xl text-[#06143E]">£750,000</span>
//               <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">Guide price</span>
//             </motion.div>

//             {/* Specs pill row */}
//             <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
//               className="flex items-center text-[10px] sm:text-[11px] text-slate-600 bg-slate-50 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 border border-slate-100"
//             >
//               <span className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-center">
//                 <BedDouble className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E8A808]" />
//                 <span>4 bed</span>
//               </span>
//               <span className="w-px h-3.5 bg-slate-200" />
//               <span className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-center">
//                 <Bath className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E8A808]" />
//                 <span>3 bath</span>
//               </span>
//               <span className="w-px h-3.5 bg-slate-200" />
//               <span className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-center">
//                 <Maximize2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400" />
//                 <span className="hidden sm:inline">1,850 sq ft</span>
//                 <span className="sm:hidden">1,850</span>
//               </span>
//             </motion.div>

//             <div className="h-px bg-slate-100" />

//             {/* Description — hidden on very small to save space */}
//             <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
//               className="space-y-1 hidden sm:block"
//             >
//               <p className="text-[11px] font-bold text-slate-800">Description</p>
//               <p className="text-[10px] text-slate-500 leading-relaxed">
//                 A bright, extended family home on a quiet street, with open-plan kitchen, landscaped garden and easy access to schools and transport.
//               </p>
//             </motion.div>

//             {/* Highlights */}
//             <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-1 sm:space-y-1.5">
//               <p className="text-[10px] sm:text-[11px] font-bold text-slate-800">Highlights</p>
//               <ul className="space-y-1 sm:space-y-1.5">
//                 {highlights.map((h, i) => (
//                   <motion.li
//                     key={h}
//                     initial={{ opacity: 0, x: -8 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.48 + i * 0.1 }}
//                     className="flex items-start gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-slate-600"
//                   >
//                     <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500 mt-0.5 shrink-0 stroke-[3]" />
//                     {h}
//                   </motion.li>
//                 ))}
//               </ul>
//             </motion.div>
//           </div>

//           {/* Footer */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.8 }}
//             className="flex items-center justify-between bg-[#06143E] px-3 sm:px-4 py-2 sm:py-2.5 shrink-0"
//           >
//             <span className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-semibold text-white">
//               <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E8A808] shrink-0" />
//               Your Agency Name
//             </span>
//             <span className="text-[9px] sm:text-[10px] text-slate-400">Agent name</span>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// /* ─────────────────────────────────────────────
//    Output placeholder / generating
// ───────────────────────────────────────────── */
// function OutputPlaceholder({ stage }: { stage: Stage }) {
//   return (
//     <div className="h-full min-h-[180px] flex flex-col items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6">
//       {stage === "generating" ? (
//         <>
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
//             className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-[3px] border-[#E8A808]/20 border-t-[#E8A808]"
//           />
//           <div className="w-full space-y-2 px-2">
//             {[100, 78, 60].map((w, i) => (
//               <motion.div
//                 key={i}
//                 className="h-1.5 sm:h-2 rounded-full bg-[#2A4A8A]/60"
//                 animate={{ opacity: [0.3, 0.8, 0.3] }}
//                 transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18 }}
//                 style={{ width: `${w}%` }}
//               />
//             ))}
//           </div>
//           <p className="text-[10px] sm:text-[11px] font-medium text-[#7B9CC8]">Building your pack…</p>
//         </>
//       ) : (
//         <div className="text-center space-y-2 sm:space-y-3">
//           <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#162550]/80 border border-[#2A4A8A]/50 flex items-center justify-center mx-auto">
//             <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A7BC8]/60" />
//           </div>
//           <p className="text-[10px] sm:text-[11px] text-[#4A6A9A] font-medium leading-snug max-w-[90px] sm:max-w-[100px] mx-auto">
//             Your pack will appear here
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    AI button + label
// ───────────────────────────────────────────── */
// function AIButton({
//   stage,
//   onClick,
//   orientation,
// }: {
//   stage: Stage;
//   onClick: () => void;
//   orientation: "horizontal" | "vertical";
// }) {
//   const isPulsing = stage === "idle" || stage === "typing";

//   return (
//     <div className={`flex items-center justify-center gap-2 ${orientation === "horizontal" ? "flex-col" : "flex-row"}`}>
//       <motion.button
//         onClick={onClick}
//         disabled={stage === "generating" || stage === "result"}
//         whileTap={{ scale: 0.88 }}
//         className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#E8A808] flex items-center justify-center cursor-pointer disabled:cursor-default shadow-[0_0_24px_rgba(232,168,8,0.5)] z-10 shrink-0"
//       >
//         {isPulsing && (
//           <>
//             <motion.div
//               className="absolute inset-0 rounded-xl sm:rounded-2xl bg-[#E8A808]"
//               animate={{ scale: [1, 1.55], opacity: [0.4, 0] }}
//               transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
//             />
//             <motion.div
//               className="absolute inset-0 rounded-xl sm:rounded-2xl bg-[#E8A808]"
//               animate={{ scale: [1, 1.3], opacity: [0.25, 0] }}
//               transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
//             />
//           </>
//         )}
//         {stage === "generating"
//           ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#06143E] animate-spin" />
//           : <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#06143E]" />
//         }
//       </motion.button>

//       <p className={`text-[9px] sm:text-[10px] font-semibold leading-tight text-[#9BB5D8] z-10
//         ${orientation === "horizontal" ? "text-center max-w-[56px]" : "text-left max-w-[80px]"}`}>
//         {stage === "result" ? (
//           <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400">
//             Pack ready!
//           </motion.span>
//         ) : stage === "generating" ? "Building…" : "AI builds the pack"}
//       </p>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    Main export
// ───────────────────────────────────────────── */
// export default function PropertyPackHeroDemo() {
//   const [stage, setStage] = useState<Stage>("idle");
//   const ref = useRef<HTMLDivElement>(null);
//   const isInView = useInView(ref, { once: true, margin: "-80px" });

//   useEffect(() => {
//     if (!isInView) return;
//     const t1 = setTimeout(() => setStage("typing"),     500);
//     const t2 = setTimeout(() => setStage("generating"), 4000);
//     const t3 = setTimeout(() => setStage("result"),     5500);
//     return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
//   }, [isInView]);

//   const replay = () => {
//     setStage("idle");
//     setTimeout(() => setStage("typing"),     200);
//     setTimeout(() => setStage("generating"), 3800);
//     setTimeout(() => setStage("result"),     5300);
//   };

//   const typing = stage !== "idle";

//   const fields = [
//     { label: "Address",      value: "14 Alder Grove, Richmond",              delay: 0 },
//     { label: "Price",        value: "£750,000",                               delay: 480 },
//     { label: "Bedrooms",     value: "4",                                      delay: 820 },
//     { label: "Key features", value: "Extended kitchen, garden, near station", delay: 1100, multiline: true },
//     { label: "Photos",       value: "10 uploaded",                            delay: 1800 },
//   ];

//   const stageIndex = { idle: 0, typing: 1, generating: 2, result: 3 }[stage];

//   const handleButtonClick = () => {
//     if (stage === "idle") {
//       setStage("typing");
//       setTimeout(() => setStage("generating"), 3800);
//       setTimeout(() => setStage("result"),     5200);
//     }
//   };

//   return (
//     <div ref={ref} className="relative w-full">
//       {/* Ambient glow */}
//       <div className="absolute -inset-6 sm:-inset-8 pointer-events-none">
//         <div className="absolute inset-0 rounded-3xl bg-[#E8A808]/6 blur-3xl" />
//         <div className="absolute top-1/2 left-1/4 w-1/2 h-1/2 -translate-y-1/2 rounded-full bg-[#3B82F6]/8 blur-3xl" />
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 28 }}
//         animate={isInView ? { opacity: 1, y: 0 } : {}}
//         transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
//         className="relative"
//       >
//         <div
//           className="rounded-xl sm:rounded-2xl overflow-hidden border border-[#1E3A78]/50 shadow-[0_24px_48px_-8px_rgba(0,0,20,0.55)]"
//           style={{ background: "linear-gradient(145deg,#0D1E4A 0%,#0A1836 55%,#081330 100%)" }}
//         >
//           {/* ── Top chrome bar ── */}
//           <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-[#1E3A78]/40 bg-[#0A1836]/60">
//             <div className="flex items-center gap-2 sm:gap-2.5">
//               <div className="flex gap-1 sm:gap-1.5">
//                 <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-400/70" />
//                 <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400/70" />
//                 <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400/70" />
//               </div>
//               <p className="text-[10px] sm:text-[11px] font-semibold text-[#9BB5D8] tracking-wide">
//                 Property information
//               </p>
//             </div>
//             {/* Status badge */}
//             <AnimatePresence mode="wait">
//               <motion.span
//                 key={stage}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className={`text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
//                   stage === "result"
//                     ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
//                     : stage === "generating"
//                       ? "bg-[#E8A808]/15 border-[#E8A808]/30 text-[#E8A808]"
//                       : "bg-[#2A4A8A]/30 border-[#2A4A8A]/50 text-[#7B9CC8]"
//                 }`}
//               >
//                 {stage === "result" ? "✓ Ready" : stage === "generating" ? "Generating…" : stage === "typing" ? "Entering…" : "Idle"}
//               </motion.span>
//             </AnimatePresence>
//           </div>

//           {/* ── Main content ── */}
//           {/* MOBILE: vertical stack */}
//           <div className="block sm:hidden">
//             {/* Form fields */}
//             <div className="p-4 flex flex-col gap-3 border-b border-[#1E3A78]/40">
//               {/* Show only 3 fields on mobile to keep it compact */}
//               {fields.slice(0, 3).map((f) => (
//                 <TypedField
//                   key={f.label}
//                   label={f.label}
//                   value={f.value}
//                   delay={f.delay}
//                   active={typing}
//                   multiline={f.multiline}
//                 />
//               ))}
//             </div>

//             {/* AI button row */}
//             <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E3A78]/40 bg-[#081330]/40">
//               <p className="text-[10px] text-[#4A6A9A] font-medium">
//                 {stage === "idle" && "Tap to generate →"}
//                 {stage === "typing" && "Filling in details…"}
//                 {stage === "generating" && "Building your pack…"}
//                 {stage === "result" && "✓ Pack ready!"}
//               </p>
//               <AIButton stage={stage} onClick={handleButtonClick} orientation="vertical" />
//             </div>

//             {/* Output */}
//             <div className="p-3" style={{ minHeight: stage === "result" ? "auto" : 160 }}>
//               {stage === "result"
//                 ? <PropertyCard visible />
//                 : <OutputPlaceholder stage={stage} />
//               }
//             </div>
//           </div>

//           {/* TABLET/DESKTOP: 3-column horizontal layout */}
//           <div className="hidden sm:flex" style={{ minHeight: 420 }}>
//             {/* LEFT: Form */}
//             <div
//               className="flex flex-col gap-3.5 p-5 border-r border-[#1E3A78]/40 shrink-0"
//               style={{ width: "44%" }}
//             >
//               {fields.map((f) => (
//                 <TypedField
//                   key={f.label}
//                   label={f.label}
//                   value={f.value}
//                   delay={f.delay}
//                   active={typing}
//                   multiline={f.multiline}
//                 />
//               ))}
//               {/* Replay button */}
//               <AnimatePresence>
//                 {stage === "result" && (
//                   <motion.button
//                     initial={{ opacity: 0, y: 4 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ delay: 0.6 }}
//                     onClick={replay}
//                     className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#E8A808]/70 hover:text-[#E8A808] transition-colors cursor-pointer mt-auto pt-2"
//                   >
//                     <RefreshCw className="w-3 h-3" />
//                     Run again
//                   </motion.button>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* CENTER: AI connector + button */}
//             <div className="flex flex-col items-center justify-center gap-3 px-3 shrink-0 relative">
//               {/* Vertical connector lines */}
//               <div className="absolute top-0 bottom-1/2 left-1/2 w-px bg-gradient-to-b from-transparent to-[#E8A808]/25 -translate-x-1/2" />
//               <div className="absolute bottom-0 top-1/2 left-1/2 w-px bg-gradient-to-t from-transparent to-[#E8A808]/25 -translate-x-1/2" />
//               <AIButton stage={stage} onClick={handleButtonClick} orientation="horizontal" />
//             </div>

//             {/* RIGHT: Output */}
//             <div className="flex-1 min-w-0 overflow-hidden">
//               {stage === "result"
//                 ? <PropertyCard visible />
//                 : <OutputPlaceholder stage={stage} />
//               }
//             </div>
//           </div>

//           {/* ── Bottom status bar ── */}
//           <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3 border-t border-[#1E3A78]/40 bg-[#081330]/60">
//             <div className="flex items-center gap-1 sm:gap-1.5">
//               {(["idle", "typing", "generating", "result"] as Stage[]).map((s, i) => (
//                 <motion.div
//                   key={s}
//                   className="h-1 sm:h-1.5 rounded-full"
//                   animate={{
//                     width: stageIndex === i ? 16 : 5,
//                     backgroundColor: i <= stageIndex ? "#E8A808" : "rgba(255,255,255,0.12)",
//                   }}
//                   transition={{ duration: 0.4 }}
//                 />
//               ))}
//             </div>
//             <motion.p
//               key={stage}
//               initial={{ opacity: 0, y: 4 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-[9px] sm:text-[10px] font-medium text-[#4A6A9A]"
//             >
//               {stage === "idle"       && "Ready to generate"}
//               {stage === "typing"     && "Entering details…"}
//               {stage === "generating" && "AI generating pack…"}
//               {stage === "result"     && "✓ Pack generated in 1.5s"}
//             </motion.p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

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
      }, 20);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [active, value, delay]);

  return (
    <div className="space-y-1">
      <p className="text-[10px] sm:text-[11px] font-medium text-slate-300 uppercase tracking-wider pl-0.5">
        {label}
      </p>
      <div
        className={`relative bg-[#071330]/85 border text-white text-xs sm:text-[13px] font-sans flex items-start transition-all duration-200 rounded-xl px-3 sm:px-3.5 ${
          !done && active
            ? "border-[#E8A808]/70 shadow-[0_0_0_2px_rgba(232,168,8,0.15)]"
            : "border-white/10"
        } ${multiline ? "py-2 sm:py-2.5 min-h-[46px] sm:min-h-[50px]" : "py-2 sm:py-2.5"}`}
      >
        <span className="leading-snug flex-1 truncate">
          {displayed || "\u00a0"}
        </span>
        {!done && active && (
          <span className="inline-block w-[2px] h-3.5 bg-[#E8A808] ml-0.5 mt-0.5 animate-pulse rounded-full shrink-0" />
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
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col w-full h-full text-slate-900"
        >
          {/* Real Property Photo */}
          <div className="relative h-32 sm:h-36 w-full shrink-0 overflow-hidden bg-slate-900">
            <Image
              src="/landing/villa-dusk.jpg"
              alt="14 Alder Grove"
              fill
              sizes="(max-width: 640px) 100vw, 360px"
              priority
              className="object-cover object-center"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

            {/* Top Badge */}
            <div className="absolute top-2.5 left-3 flex items-center gap-1.5 bg-[#E8A808] text-[#06143E] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              <span>PROPERTY PACK</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1 overflow-y-auto">
            {/* Header info */}
            <div>
              <p className="text-[10px] font-bold text-[#E8A808] uppercase tracking-wider">
                PROPERTY PACK
              </p>
              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 leading-snug">
                14 Alder Grove
              </h3>
              <p className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Richmond, Surrey</span>
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-bold text-lg sm:text-xl text-slate-900">
                £750,000
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Guide price
              </span>
            </div>

            {/* Spacious Specs Row (Never squished) */}
            <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <BedDouble className="w-3.5 h-3.5 text-[#E8A808] shrink-0" />
                <span className="font-medium text-slate-700">4 bed</span>
              </span>
              <span className="w-px h-3.5 bg-slate-200" />
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Bath className="w-3.5 h-3.5 text-[#E8A808] shrink-0" />
                <span className="font-medium text-slate-700">3 bath</span>
              </span>
              <span className="w-px h-3.5 bg-slate-200" />
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Maximize2 className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-700">1,850 sq ft</span>
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100" />

            {/* Description */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-900">
                Description
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                A bright, extended family home on a quiet residential street,
                with an open-plan kitchen, landscaped garden and easy access to
                schools and transport.
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-900">Highlights</p>
              <ul className="space-y-1">
                {highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-[11px] text-slate-600"
                  >
                    <Check className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0 stroke-[2.5]" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Agency Footer Strip */}
          <div className="flex items-center justify-between bg-[#06143E] px-4 py-2.5 shrink-0">
            <span className="flex items-center gap-2 text-xs font-semibold text-white">
              <Building2 className="w-3.5 h-3.5 text-[#E8A808] shrink-0" />
              <span>Your Agency Name</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
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
    <div className="h-full min-h-[320px] sm:min-h-[380px] rounded-2xl sm:rounded-3xl bg-[#0B1536]/40 border border-dashed border-white/15 backdrop-blur-md flex flex-col items-center justify-center gap-3 p-6 text-center">
      {stage === "generating" ? (
        <>
          <div className="relative">
            <Loader2 className="w-9 h-9 text-[#E8A808] animate-spin" />
            <Sparkles className="w-4 h-4 text-[#FFD700] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="space-y-2 w-full max-w-[180px]">
            <div className="h-2 rounded-full bg-white/20 animate-pulse" />
            <div className="h-2 rounded-full bg-[#E8A808]/40 animate-pulse" />
            <div className="h-2 rounded-full bg-white/10 animate-pulse w-3/4 mx-auto" />
          </div>
          <p className="text-xs font-medium text-amber-200/90 mt-1">
            Generating 10 marketing outputs…
          </p>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <Layers className="w-5 h-5 text-slate-300" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-white">
              Pack will appear here
            </p>
            <p className="text-[11px] text-slate-400 max-w-[160px] mx-auto leading-tight">
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
    { label: "Price", value: "£750,000", delay: 400 },
    { label: "Bedrooms", value: "4", delay: 750 },
    {
      label: "Key features",
      value: "Extended kitchen, garden, near station",
      delay: 1000,
      multiline: true,
    },
    { label: "Photos", value: "10 uploaded", delay: 1700 },
  ];

  const typing = stage !== "idle";

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[620px] mx-auto select-none"
    >
      {/* ── Mobile View Toggle (< sm) ── */}
      <div className="flex sm:hidden items-center justify-between gap-2 mb-3 bg-[#071330]/80 backdrop-blur-md p-1 rounded-xl border border-white/10">
        <button
          onClick={() => setMobileTab("input")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            mobileTab === "input"
              ? "bg-[#E8A808] text-[#06143E] shadow-sm"
              : "text-slate-300 hover:text-white"
          }`}
        >
          1. Property Details
        </button>
        <button
          onClick={() => setMobileTab("output")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            mobileTab === "output"
              ? "bg-[#E8A808] text-[#06143E] shadow-sm"
              : "text-slate-300 hover:text-white"
          }`}
        >
          2. Generated Pack {stage === "result" && "✓"}
        </button>
      </div>

      {/* ── Floating Layout Container ── */}
      <div className="relative">
        {/* Subtle Ambient Gold Glow behind cards */}
        <div className="absolute -inset-4 bg-[#E8A808]/10 rounded-full blur-3xl pointer-events-none" />

        {/* ── Desktop & Tablet Side-by-Side Floating Layout (sm+) ── */}
        <div className="hidden sm:grid grid-cols-12 gap-3 sm:gap-4 items-center relative z-10">
          {/* LEFT: Transparent Glassmorphic Input Card (5 cols) */}
          <div className="col-span-5 bg-[#0B1536]/80 backdrop-blur-xl border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3 relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ListFilter className="w-3.5 h-3.5 text-[#E8A808]" />
                <h4 className="text-xs font-semibold text-white tracking-wide">
                  Property information
                </h4>
              </div>
            </div>

            {/* Inputs list */}
            <div className="space-y-2.5">
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
                className="mt-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#E8A808] hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replay demo</span>
              </button>
            )}
          </div>

          {/* CENTER: Floating Gold AI Button + Connecting Line (2 cols) */}
          <div className="col-span-2 flex flex-col items-center justify-center relative py-4">
            {/* Horizontal Line flowing behind button */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-white/10 via-[#E8A808]/50 to-white/10 pointer-events-none" />

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
              className="relative w-12 h-12 rounded-2xl bg-[#E8A808] hover:bg-[#FFB800] active:scale-95 transition-all shadow-[0_0_24px_rgba(232,168,8,0.45)] border border-[#FFD700] flex items-center justify-center text-[#06143E] cursor-pointer z-10 shrink-0"
              title="Generate Pack"
            >
              {stage === "generating" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 fill-current" />
              )}
            </button>

            {/* Label below button */}
            <p className="mt-2 text-[10px] font-semibold text-slate-300 text-center leading-tight max-w-[64px]">
              {stage === "result" ? (
                <span className="text-emerald-400">Pack ready!</span>
              ) : stage === "generating" ? (
                "Building…"
              ) : (
                "AI builds the pack"
              )}
            </p>
          </div>

          {/* RIGHT: Property Pack Output Card (5 cols) */}
          <div className="col-span-5 relative flex items-center">
            {stage === "result" ? (
              <PropertyCard visible />
            ) : (
              <OutputPlaceholder stage={stage} />
            )}
          </div>
        </div>

        {/* ── Mobile View (< sm) ── */}
        <div className="block sm:hidden relative z-10">
          {mobileTab === "input" ? (
            /* Left Input Card on mobile */
            <div className="bg-[#0B1536]/85 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                <div className="flex items-center gap-2">
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
                className="w-full h-10 rounded-xl bg-[#E8A808] text-[#06143E] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-3"
              >
                <span>View Generated Pack</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Right Output Card on mobile with full breathing room */
            <div className="space-y-3">
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
    </div>
  );
}
