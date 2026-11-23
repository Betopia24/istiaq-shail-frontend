"use client";

import { startDownload } from "@/lib/download";
import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Download,
  Share2,
  Sparkles,
  RotateCw,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Plus,
  Loader2,
  FolderOpen,
  History,
  Trash2,
} from "lucide-react";
import { PackStatusBadge } from "@/components/packs/PackStatusBadge";
import { ShareDialog } from "@/components/packs/ShareDialog";
import { BuyPacksModal } from "@/components/packs/BuyPacksModal";
import { ManualComparableModal } from "@/components/editor/ManualComparableModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { ApiImage } from "@/components/ui/ApiImage";
import { StatsSkeleton } from "@/components/ui/skeletons/StatsSkeleton";
import { TableSkeleton } from "@/components/ui/skeletons/TableSkeleton";
import { usePack } from "@/hooks/usePack";
import { errorText } from "@/lib/auth/client";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";
import {
  useGeneratePackMutation,
  useGetPdfStatusQuery,
  useGetPortalExportQuery,
  useGetSectionVersionsQuery,
  useRegenerateMutation,
  useRequestPdfMutation,
  useUpdateSectionMutation,
} from "@/redux/api/packs/packsApi";
import {
  useApplyValuationMutation,
  useGetValuationPdfStatusQuery,
  useGetValuationQuery,
  useRemoveComparableMutation,
  useRequestValuationPdfMutation,
} from "@/redux/api/packs/valuationApi";
import { useGetBrandingQuery } from "@/redux/api/agency/agencyApi";
import type { Branding, Pack, SectionKey } from "@/types/models";

type ActiveTab = "brochure" | "social" | "valuation" | "portal";
type SocialPlatform = "facebook" | "instagram" | "tiktok";
type PortalPlatform = "rightmove" | "zoopla";
type Draft = Record<string, string>;

const SOCIAL_KEY: Record<SocialPlatform, SectionKey> = {
  facebook: "social_facebook",
  instagram: "social_instagram",
  tiktok: "social_tiktok",
};
const PORTAL_KEY: Record<PortalPlatform, SectionKey> = {
  rightmove: "portal_rightmove",
  zoopla: "portal_zoopla",
};

/* ---------- section content <-> editable text ---------- */

const asString = (v: unknown) => (typeof v === "string" ? v : "");
const asStrings = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const parseLines = (text: string) =>
  text
    .split("\n")
    .map((line) => line.replace(/^[•\-*]\s*/, "").trim())
    .filter(Boolean);
const parseTags = (text: string) =>
  text
    .split(/[\s,]+/)
    .map((t) => t.replace(/^#/, "").trim())
    .filter(Boolean);
const tagsText = (tags: string[]) => tags.map((t) => `#${t}`).join(" ");

function toDraft(key: SectionKey, c: Record<string, unknown> | undefined): Draft {
  const content = c ?? {};
  switch (key) {
    case "brochure":
      return {
        headline: asString(content.headline),
        overview: asString(content.overview),
        keyFeatures: asStrings(content.keyFeatures).map((f) => `• ${f}`).join("\n"),
        socialCaption: asString(content.socialCaption),
      };
    case "social_tiktok":
      return { script: asString(content.script), text: asString(content.text), hashtags: tagsText(asStrings(content.hashtags)) };
    case "social_facebook":
    case "social_instagram":
      return { text: asString(content.text), hashtags: tagsText(asStrings(content.hashtags)) };
    default:
      return { summary: asString(content.summary), bullets: asStrings(content.bullets).join("\n"), description: asString(content.description) };
  }
}

function toContent(key: SectionKey, d: Draft): Record<string, unknown> {
  switch (key) {
    case "brochure":
      return { headline: d.headline, overview: d.overview, keyFeatures: parseLines(d.keyFeatures ?? ""), socialCaption: d.socialCaption };
    case "social_tiktok":
      return { script: d.script, text: d.text, hashtags: parseTags(d.hashtags ?? "") };
    case "social_facebook":
    case "social_instagram":
      return { text: d.text, hashtags: parseTags(d.hashtags ?? "") };
    default:
      return { summary: d.summary, bullets: parseLines(d.bullets ?? ""), description: d.description };
  }
}

/** The message a 422 gives for one field (`headline`, or `keyFeatures.2` for an array item). */
function fieldMessage(fields: Record<string, string>, name: string) {
  const hit = Object.keys(fields).find((k) => k === name || k.startsWith(`${name}.`) || k.startsWith(`${name}[`));
  return hit ? fields[hit] : null;
}

/* ---------- PDF: request, poll, open ---------- */

function usePdfDownload(packId: string, kind: "pack" | "valuation") {
  const [requestPack, packReq] = useRequestPdfMutation();
  const [requestValuation, valReq] = useRequestValuationPdfMutation();
  const [renderId, setRenderId] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const handled = useRef(0);
  const poll = { skip: !renderId, pollingInterval: 2000, refetchOnMountOrArgChange: true } as const;
  const packStatus = useGetPdfStatusQuery(packId, { ...poll, skip: poll.skip || kind !== "pack" });
  const valStatus = useGetValuationPdfStatusQuery(packId, { ...poll, skip: poll.skip || kind !== "valuation" });
  const st = (kind === "pack" ? packStatus : valStatus).data;
  const finished = !!renderId && st?.renderId === renderId && (st.status === "done" || st.status === "failed");
  const requesting = kind === "pack" ? packReq.isLoading : valReq.isLoading;
  const openUrl = finished && st?.status === "done" ? (st.url ?? null) : null;
  const busy = requesting || (!!renderId && !finished);

  useEffect(() => {
    if (!finished || handled.current === attempt || !st) return;
    handled.current = attempt;
    if (st.status === "done" && st.url) {
      startDownload(st.url);
    } else {
      toast.error(st.error || "The PDF could not be generated. Please try again.");
    }
  }, [finished, attempt, st]);

  const start = async () => {
    try {
      const res = await (kind === "pack" ? requestPack(packId) : requestValuation(packId)).unwrap();
      setAttempt((a) => a + 1);
      setRenderId(res.renderId);
    } catch (err) {
      toast.error(errorText(err));
    }
  };
  return { start, busy, openUrl };
}

/* ---------- small shared pieces ---------- */

interface PreviewCtx {
  pack: Pack;
  branding?: Branding;
  currency: "GBP" | "USD";
}

function packPhotos(pack: Pack) {
  return (pack.photos ?? [])
    .filter((p) => !p.kind || p.kind === "photo")
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

function priceLabel({ pack, currency }: PreviewCtx) {
  const prop = pack.property;
  if (prop?.transaction === "let") return prop.rentPcmPence ? `${formatMoney(prop.rentPcmPence, currency)} pcm` : null;
  return prop?.guidePricePence ? formatMoney(prop.guidePricePence, currency) : null;
}

function BrandHeader({ ctx }: { ctx: PreviewCtx }) {
  const b = ctx.branding;
  const name = b?.agencyName || "Your agency";
  return (
    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
      <div className="flex items-center gap-2.5">
        <ApiImage
          src={b?.logoUrl}
          alt={name}
          className="w-7 h-7 rounded-lg object-contain"
          fallback={
            <div
              className="w-7 h-7 rounded-lg bg-[#E8A808] flex items-center justify-center text-[#06143E] font-medium text-xs"
              style={b?.accentColour ? { backgroundColor: b.accentColour } : undefined}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          }
        />
        <div>
          <p className="font-heading font-medium text-xs text-slate-900 tracking-wide uppercase" style={b?.primaryColour ? { color: b.primaryColour } : undefined}>
            {name}
          </p>
          {b?.tradingRegion && <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">{b.tradingRegion}</p>}
        </div>
      </div>
      <div className="text-right">
        {b?.phone && <p className="font-medium text-xs text-slate-900">{b.phone}</p>}
        {b?.publicEmail && <p className="text-[10px] text-slate-400">{b.publicEmail}</p>}
      </div>
    </div>
  );
}

function HeroPhoto({ ctx }: { ctx: PreviewCtx }) {
  const photo = packPhotos(ctx.pack)[0];
  const price = priceLabel(ctx);
  return (
    <div className="relative aspect-16/10 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-100">
      <ApiImage
        src={photo?.url}
        alt={ctx.pack.address ?? "Property"}
        className="absolute inset-0 w-full h-full object-cover"
        fallback={<div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">No photos uploaded</div>}
      />
      {price && (
        <div className="absolute bottom-3.5 left-3.5 z-10">
          <span className="inline-block px-4 py-1.5 rounded-lg bg-[#06143E] text-[#E8A808] font-heading font-medium text-base shadow-lg">{price}</span>
        </div>
      )}
    </div>
  );
}

function AddressBlock({ ctx, title }: { ctx: PreviewCtx; title?: string }) {
  const a = ctx.pack.property?.address;
  const sub = [a?.town, a?.postcode].filter(Boolean).join(", ");
  return (
    <div>
      <h3 className="font-heading font-medium text-xl text-slate-900">{title || ctx.pack.address}</h3>
      <p className="text-xs text-slate-500 mt-0.5">{title ? ctx.pack.address : sub}</p>
    </div>
  );
}

function SpecBadges({ ctx }: { ctx: PreviewCtx }) {
  const p = ctx.pack.property;
  const items = [
    p?.bedrooms != null ? `${p.bedrooms} Bedrooms` : null,
    p?.bathrooms != null ? `${p.bathrooms} Bathrooms` : null,
    p?.sizeSqFt ? `${formatNumber(p.sizeSqFt)} sq ft` : null,
    p?.parking || null,
  ].filter(Boolean) as string[];
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((t) => (
        <span key={t} className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
          {t}
        </span>
      ))}
    </div>
  );
}

function Gallery({ ctx }: { ctx: PreviewCtx }) {
  const photos = packPhotos(ctx.pack).slice(1, 4);
  if (photos.length === 0) return null;
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {photos.map((ph, i) => (
        <div key={ph.id ?? i} className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-100 bg-slate-100">
          <ApiImage src={ph.thumbUrl || ph.url} alt={`Gallery ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}

function FieldError({ message }: { message: string | null }) {
  return message ? <p className="text-[11px] text-rose-600">{message}</p> : null;
}

function VersionHistory({ packId, sectionKey, onRestore, disabled }: { packId: string; sectionKey: SectionKey; onRestore: (content: Record<string, unknown>) => void; disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, error, refetch } = useGetSectionVersionsQuery({ id: packId, key: sectionKey }, { skip: !open });
  return (
    <div className="space-y-2">
      <button type="button" onClick={() => setOpen((o) => !o)} className="text-xs font-medium text-[#092167] hover:underline cursor-pointer flex items-center gap-1.5">
        <History className="w-3.5 h-3.5" />
        <span>{open ? "Hide version history" : "Version history"}</span>
      </button>
      {open && (
        <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
          {isLoading && <p className="p-3 text-slate-500">Loading versions...</p>}
          {isError && <ErrorState error={error} onRetry={refetch} className="m-3" />}
          {data && data.length === 0 && <p className="p-3 text-slate-500">No earlier versions yet.</p>}
          {data?.map((v) => (
            <div key={v.version} className="p-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-slate-800">
                  Version {v.version} · {v.source === "ai" ? "AI generated" : "Edited by you"}
                </p>
                <p className="text-slate-400">{v.createdAt ? formatDate(v.createdAt) : ""}</p>
              </div>
              <button
                type="button"
                disabled={disabled || !v.content}
                onClick={() => v.content && onRestore(v.content)}
                className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer disabled:opacity-50"
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- valuation tab ---------- */

function ValuationTab({ pack, packId, currency }: { pack: Pack; packId: string; currency: "GBP" | "USD" }) {
  const { data: v, isLoading, isError, error, refetch } = useGetValuationQuery(packId);
  const [removeComparable, { isLoading: removing }] = useRemoveComparableMutation();
  const [applyValuation, { isLoading: applying }] = useApplyValuationMutation();
  const pdf = usePdfDownload(packId, "valuation");
  const [chosen, setChosen] = useState<string | null>(null);
  const [isManualCompOpen, setIsManualCompOpen] = useState(false);

  if (isLoading)
    return (
      <div className="space-y-6">
        <StatsSkeleton />
        <TableSkeleton rows={4} columns={5} />
      </div>
    );

  if (isError) {
    const info = apiErrorInfo(error);
    if (info.code === "valuation_incomplete") {
      const messages = Object.values(info.fields);
      return (
        <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/80 text-amber-900 text-sm space-y-2">
          <p className="font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>We need a few more property details before we can value this property.</span>
          </p>
          <ul className="list-disc list-inside text-xs space-y-0.5">
            {(messages.length > 0 ? messages : [errorText(error)]).map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <Link href={`/agent-dashboard/create?pack=${packId}`} className="inline-block text-xs font-medium text-[#092167] hover:underline">
            Edit property details
          </Link>
        </div>
      );
    }
    return <ErrorState error={error} onRetry={refetch} />;
  }
  if (!v) return null;

  const cur = v.currency ?? currency;
  const strategies = v.strategies ?? [];
  const comparables = v.comparables ?? [];
  const recommended = strategies.find((s) => s.recommended);
  const selectedKey = chosen ?? v.chosenStrategy ?? recommended?.key ?? strategies[0]?.key;
  const selected = strategies.find((s) => s.key === selectedKey);
  const confidence = v.confidencePct ?? 0;
  const confidenceLabel = confidence >= 80 ? "High" : confidence >= 60 ? "Medium" : "Low";
  const price = (pence: number | undefined, kind?: string) => `${formatMoney(pence, cur)}${kind === "rent_pcm" ? " / month" : ""}`;

  const apply = async () => {
    if (!selected?.key) return;
    try {
      await applyValuation({ packId, strategy: selected.key }).unwrap();
      toast.success(`Applied ${price(selected.pricePence, selected.priceKind)} to the marketing pack`);
    } catch (err) {
      toast.error(errorText(err));
    }
  };

  const remove = async (comparableId: string) => {
    try {
      await removeComparable({ packId, comparableId }).unwrap();
      toast.success("Comparable removed");
    } catch (err) {
      toast.error(errorText(err));
    }
  };

  const typeLine = (c: (typeof comparables)[number]) =>
    [
      c.bedrooms != null ? `${c.bedrooms} Beds` : null,
      c.sizeSqFt ? `${formatNumber(c.sizeSqFt)} sq ft` : null,
      c.propertyType ? `(${c.propertyType})` : null,
      c.matchPct != null ? `${c.matchPct}% match` : null,
    ]
      .filter(Boolean)
      .join(" • ");

  return (
    <div className="space-y-6">
      {/* Top Banner: Valuation Metrics Header */}
      <div className="bg-[#0B1536] rounded-2xl p-6 sm:p-7 text-white shadow-md border border-[#162758]/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[11px] font-medium text-[#FFB800] uppercase tracking-wider">AI VALUATION ENGINE</span>
          </div>
          <p className="font-heading font-medium text-2xl sm:text-3xl text-white tracking-tight">
            {formatMoney(v.lowPence, cur)} – {formatMoney(v.highPence, cur)}
          </p>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Estimated market value range based on {comparables.length} comparable sale{comparables.length === 1 ? "" : "s"}
          </p>
        </div>

        <div>
          <span className="inline-block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">RECOMMENDED GUIDE PRICE</span>
          <p className="font-heading font-medium text-2xl sm:text-3xl text-[#FFB800] tracking-tight">{formatMoney(v.recommendedPence, cur)}</p>
          {recommended?.label && <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{recommended.label}</p>}
        </div>

        <div>
          <span className="inline-block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">AI ACCURACY CONFIDENCE</span>
          <p className="font-heading font-medium text-2xl sm:text-3xl text-emerald-400 tracking-tight">
            {confidence}% {confidenceLabel}
          </p>
          {v.dataSource && <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{v.dataSource}</p>}
        </div>

        <div>
          <span className="inline-block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">AVG DAYS ON MARKET</span>
          <p className="font-heading font-medium text-2xl sm:text-3xl text-white tracking-tight">{v.avgDaysOnMarket ?? "–"} Days</p>
        </div>
      </div>

      {v.sampleData && (
        <div role="alert" className="p-3.5 rounded-xl border border-amber-300 bg-amber-100/80 text-amber-900 text-xs flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <p className="leading-relaxed">
            <strong>Sample data:</strong> these comparable sales are generated for demonstration, not real sales.
          </p>
        </div>
      )}

      {/* Visible compliance disclaimer */}
      <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/80 text-amber-900 text-xs flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="leading-relaxed">
          <strong>Notice:</strong> {v.disclaimer}
        </p>
      </div>

      {/* Two Columns: Comps Table & Vendor Pricing Strategies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-medium text-base sm:text-lg text-slate-900">Recent Comparable Sales (Comps Analysis)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Comparable sales used for this estimate</p>
            </div>

            <button
              type="button"
              onClick={() => setIsManualCompOpen(true)}
              className="h-9 px-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs self-start sm:self-auto shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#E8A808]" />
              <span>Add Custom Comparable</span>
            </button>
          </div>

          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <table className="w-full text-left min-w-[560px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-4 rounded-l-lg">Comparable Property</th>
                  <th className="py-2.5 px-3">Distance</th>
                  <th className="py-2.5 px-3">Sale Date</th>
                  <th className="py-2.5 px-3">Sold Price</th>
                  <th className="py-2.5 px-4 rounded-r-lg">£/Sq Ft</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {comparables.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 px-4 text-center text-xs text-slate-500">
                      No comparable sales yet. Add a custom comparable to start.
                    </td>
                  </tr>
                )}
                {comparables.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-slate-900 text-sm">
                            {comp.address}
                            {comp.isManual && <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-medium align-middle">Custom</span>}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{typeLine(comp)}</p>
                        </div>
                        {comp.isManual && comp.id && (
                          <button
                            type="button"
                            disabled={removing}
                            onClick={() => remove(comp.id as string)}
                            aria-label="Remove comparable"
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 font-medium">{comp.distanceMiles != null ? `${comp.distanceMiles} mi` : "–"}</td>
                    <td className="py-3.5 px-3 text-slate-600 font-medium">{formatDate(comp.soldOn, "month")}</td>
                    <td className="py-3.5 px-3 font-medium text-slate-900">{formatMoney(comp.pricePence, cur)}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{comp.pricePerSqFtPence ? formatMoney(comp.pricePerSqFtPence, cur) : "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Valuation Methodology Note */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 space-y-2 text-xs text-slate-600 leading-relaxed shadow-2xs">
            <p className="font-medium text-slate-900 text-xs sm:text-sm">Valuation Methodology</p>
            <p className="text-slate-600 text-xs whitespace-pre-line">{v.methodology}</p>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
              {v.dataSource}
              {v.sizeEstimated ? " · Floor area is estimated." : ""}
            </p>
          </div>
        </div>

        {/* Right: Vendor Pricing Strategies */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-2xs">
          <div>
            <h3 className="font-heading font-medium text-base text-slate-900">Vendor Pricing Strategies</h3>
            <p className="text-xs text-slate-500 mt-0.5">Tailor the presentation pitch before meeting the owner</p>
          </div>

          {strategies.map((s) => (
            <div
              key={s.key}
              onClick={() => setChosen(s.key ?? null)}
              className={`p-4 rounded-xl border-2 transition cursor-pointer ${selectedKey === s.key ? "border-[#FFB800] bg-white shadow-xs" : "border-slate-200 bg-white hover:border-slate-300"}`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-medium text-sm text-slate-900">{s.label}</span>
                {s.recommended && <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-600 text-white tracking-wide">BEST PITCH</span>}
              </div>
              {s.description && <p className="text-xs text-slate-500">{s.description}</p>}
              <div className="flex items-baseline justify-between mt-2.5">
                <span className="font-heading font-medium text-xl text-slate-900">{price(s.pricePence, s.priceKind)}</span>
                {s.timeframe && <span className="text-xs text-slate-400 font-medium">{s.timeframe}</span>}
              </div>
            </div>
          ))}

          {/* Rental Yield Card */}
          {!!v.rentalPcmPence && (
            <div className="bg-blue-50/40 rounded-xl p-4 border border-blue-200/80 space-y-1 text-xs">
              <p className="font-medium text-blue-900">Projected Letting Potential (To Let)</p>
              <p className="text-blue-700">
                Estimated Rental:{" "}
                <span className="font-medium text-blue-900">
                  {v.rentalLowPence && v.rentalHighPence
                    ? `${formatMoney(v.rentalLowPence, cur)} – ${formatMoney(v.rentalHighPence, cur)} / month`
                    : `${formatMoney(v.rentalPcmPence, cur)} / month`}
                </span>
              </p>
              {v.yieldPct != null && (
                <p className="text-blue-700">
                  Estimated Gross Rental Yield: <span className="font-medium text-blue-900">{v.yieldPct}%</span>
                </p>
              )}
            </div>
          )}

          {v.appliedPricePence != null && (
            <p className="text-[11px] text-slate-500">
              Currently applied to the pack: <span className="font-medium text-slate-700">{formatMoney(v.appliedPricePence, cur)}</span>
            </p>
          )}

          {/* Apply Button */}
          <button
            type="button"
            disabled={!selected || applying}
            onClick={apply}
            className="w-full h-11 rounded-lg bg-[#FFB800] hover:bg-[#E8A808] active:bg-[#D49800] text-[#06143E] font-heading font-medium text-xs sm:text-sm transition cursor-pointer shadow-sm disabled:opacity-60"
          >
            {applying ? "Applying..." : selected ? `Apply ${price(selected.pricePence, selected.priceKind)} to Marketing Pack` : "Apply to Marketing Pack"}
          </button>
          <button
            type="button"
            disabled={pdf.busy}
            onClick={pdf.start}
            className="w-full h-10 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {pdf.busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5 text-slate-400" />}
            <span>{pdf.busy ? "Preparing valuation PDF..." : "Download Valuation PDF"}</span>
          </button>
          {pdf.openUrl && !pdf.busy && (
            <a href={pdf.openUrl} target="_blank" rel="noopener noreferrer" className="block text-center text-xs font-medium text-[#092167] hover:underline">
              Open valuation PDF
            </a>
          )}
        </div>
      </div>

      <ManualComparableModal isOpen={isManualCompOpen} onClose={() => setIsManualCompOpen(false)} packId={pack.id ?? packId} />
    </div>
  );
}

/* ---------- the editor ---------- */

function PackEditor() {
  const packId = useSearchParams().get("pack") ?? undefined;
  const { data: pack, isLoading, isError, error, refetch, generating } = usePack(packId);
  const { data: branding } = useGetBrandingQuery();
  const [updateSection, { isLoading: saving }] = useUpdateSectionMutation();
  const [regenerate, { isLoading: regenStarting }] = useRegenerateMutation();
  const [generatePack, { isLoading: generateStarting }] = useGeneratePackMutation();
  const pdf = usePdfDownload(packId ?? "", "pack");

  const [activeTab, setActiveTab] = useState<ActiveTab>("brochure");
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>("instagram");
  const [portalPlatform, setPortalPlatform] = useState<PortalPlatform>("rightmove");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  /** Unsaved edits, per section. A section with no entry shows the saved content. */
  const [edits, setEdits] = useState<Partial<Record<SectionKey, Draft>>>({});
  const [errors, setErrors] = useState<Partial<Record<SectionKey, Record<string, string>>>>({});

  const portalKey = PORTAL_KEY[portalPlatform];
  const portalExport = useGetPortalExportQuery(packId ? { id: packId, portal: portalPlatform } : (undefined as never), { skip: !packId || activeTab !== "portal" });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedKey(key);
        showToast("Copied to clipboard!");
        setTimeout(() => setCopiedKey(null), 2500);
      },
      () => toast.error("Could not copy to the clipboard"),
    );
  };

  if (!packId) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No pack selected"
        description="Open a pack from Saved Packs to edit its marketing copy."
        primaryAction={{ label: "Go to Saved Packs", href: "/agent-dashboard/saved-packs" }}
      />
    );
  }
  if (isLoading) {
    return (
      <div className="space-y-6">
        <TableSkeleton rows={4} columns={3} />
      </div>
    );
  }
  if (isError || !pack) {
    if (apiErrorInfo(error).status === 404) {
      return (
        <EmptyState
          icon={FolderOpen}
          title="Pack not found"
          description="This pack does not exist or you no longer have access to it."
          primaryAction={{ label: "Go to Saved Packs", href: "/agent-dashboard/saved-packs" }}
        />
      );
    }
    return <ErrorState error={error} onRetry={refetch} />;
  }

  const currency: "GBP" | "USD" = branding?.currency ?? (pack.market === "US" ? "USD" : "GBP");
  const ctx: PreviewCtx = { pack, branding, currency };
  const sections = pack.sections ?? [];
  const serverContent = (key: SectionKey) => sections.find((s) => s.key === key)?.content;
  const draftOf = (key: SectionKey): Draft => edits[key] ?? toDraft(key, serverContent(key));
  const setField = (key: SectionKey, field: string, value: string) => setEdits((e) => ({ ...e, [key]: { ...draftOf(key), [field]: value } }));
  const dirty = (key: SectionKey) => !!edits[key];
  const hasContent = sections.length > 0;
  const busyJob = generating || regenStarting || generateStarting;

  const startGeneration = async (run: () => Promise<unknown>) => {
    try {
      await run();
      showToast("Generating your marketing copy...");
    } catch (err) {
      const info = apiErrorInfo(err);
      if (info.status === 402 || info.code === "insufficient_credits") setShowBuyModal(true);
      else toast.error(errorText(err));
    }
  };
  const regenerateSection = (key: SectionKey) => {
    setEdits((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
    return startGeneration(() => regenerate({ id: packId, section: key }).unwrap());
  };
  const regenerateAll = () => {
    if (!window.confirm("Regenerate all marketing copy? This may use a pack credit and replaces your unsaved edits.")) return;
    setEdits({});
    return startGeneration(() => regenerate({ id: packId }).unwrap());
  };

  const save = async (key: SectionKey, content?: Record<string, unknown>) => {
    setErrors((e) => ({ ...e, [key]: {} }));
    try {
      await updateSection({ id: packId, key, content: content ?? toContent(key, draftOf(key)) }).unwrap();
      await refetch();
      setEdits((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
      showToast(content ? "Version restored." : "Saved! Live buyer page and PDF updated.");
    } catch (err) {
      const { fields } = apiErrorInfo(err);
      setErrors((e) => ({ ...e, [key]: fields }));
      toast.error(Object.keys(fields).length > 0 ? "Some fields need attention" : errorText(err));
    }
  };

  const err = (key: SectionKey, field: string) => fieldMessage(errors[key] ?? {}, field);
  const saveState = (key: SectionKey) => (saving ? "Saving..." : dirty(key) ? "Unsaved changes" : "All changes saved");

  const inputCls = "w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition";
  const areaCls = "w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition resize-y";

  const generatingScreen = (pack.status === "generating" || busyJob) && !hasContent;
  const failed = pack.status === "failed" && !hasContent;
  const notGenerated = !hasContent && !generatingScreen && !failed;

  const tabBtn = (tab: ActiveTab, extra = "") =>
    `${extra} px-4 py-2 rounded-lg font-heading text-xs sm:text-sm transition-all cursor-pointer shrink-0 ${
      activeTab === tab ? "bg-[#06143E] text-white font-medium shadow-sm" : "text-slate-600 hover:text-slate-900 font-medium"
    }`;

  const brochure = draftOf("brochure");
  const socialKey = SOCIAL_KEY[socialPlatform];
  const social = draftOf(socialKey);
  const portal = draftOf(portalKey);
  const socialCopyText = [socialPlatform === "tiktok" ? social.script : social.text, socialPlatform === "tiktok" ? social.text : "", social.hashtags].filter(Boolean).join("\n\n");
  const px = portalExport.data;
  const readiness = px?.readinessPct ?? 0;
  const photos = packPhotos(pack);
  const a = pack.property?.address;
  const buyerHref = pack.shareToken ? `/property/${pack.shareToken}` : null;
  const portalLabel = portalPlatform === "rightmove" ? "Rightmove" : "Zoopla";

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#06143E] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <Link href="/agent-dashboard/saved-packs" className="hover:text-slate-800 transition">
              Saved Packs
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900">
              {pack.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">Pack Results &amp; Live Editor</h1>
            <PackStatusBadge status={pack.status ?? "draft"} size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {buyerHref && (
            <Link
              href={buyerHref}
              target="_blank"
              className="h-10 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Buyer Public Page</span>
            </Link>
          )}

          <button
            type="button"
            disabled={pdf.busy || !hasContent}
            onClick={pdf.start}
            className="h-10 px-5 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-semibold text-xs shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {pdf.busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{pdf.busy ? "Preparing PDF..." : "2-Page A4 PDF"}</span>
          </button>
          {pdf.openUrl && !pdf.busy && (
            <a href={pdf.openUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#092167] hover:underline">
              Open PDF
            </a>
          )}

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="h-10 px-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Share Public Link & QR Code"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Generation state */}
      {generatingScreen && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-8 text-center space-y-3">
          <Loader2 className="w-6 h-6 text-[#E8A808] animate-spin mx-auto" />
          <p className="font-heading font-medium text-slate-900">Generating your marketing pack</p>
          <p className="text-xs text-slate-500">This usually takes under a minute. This page updates on its own.</p>
        </div>
      )}
      {failed && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center space-y-3" role="alert">
          <AlertTriangle className="w-6 h-6 text-rose-500 mx-auto" />
          <p className="font-heading font-medium text-rose-900">Generation failed</p>
          {pack.job?.error && <p className="text-xs text-rose-800">{pack.job.error}</p>}
          <button
            type="button"
            disabled={generateStarting}
            onClick={() => startGeneration(() => generatePack(packId).unwrap())}
            className="h-9 px-4 rounded-lg bg-white border border-rose-200 text-rose-700 text-xs font-medium hover:bg-rose-100 cursor-pointer disabled:opacity-60"
          >
            {generateStarting ? "Starting..." : "Try again"}
          </button>
        </div>
      )}
      {notGenerated && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
          <p className="font-heading font-medium text-slate-900">This pack has no marketing copy yet</p>
          <p className="text-xs text-slate-500">Generate the brochure, social posts and portal copy from the property details.</p>
          <button
            type="button"
            disabled={generateStarting}
            onClick={() => startGeneration(() => generatePack(packId).unwrap())}
            className="h-10 px-5 rounded-lg bg-[#06143E] hover:bg-[#0A2168] text-white font-medium text-xs transition cursor-pointer disabled:opacity-60"
          >
            {generateStarting ? "Starting..." : "Generate Pack"}
          </button>
        </div>
      )}
      {hasContent && busyJob && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-xs text-amber-900 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E8A808]" />
          <span>Regenerating copy. The editor updates when it finishes.</span>
        </div>
      )}

      {/* TAB NAVIGATION PILLS */}
      {(hasContent || activeTab === "valuation") && (
        <div className="bg-slate-100/70 p-1.5 rounded-xl inline-flex items-center gap-1.5 overflow-x-auto select-none border border-slate-200/40">
          <button onClick={() => setActiveTab("brochure")} className={tabBtn("brochure")}>
            Property Brochure
          </button>
          <button onClick={() => setActiveTab("social")} className={tabBtn("social", "flex items-center gap-1.5")}>
            <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
            <span>Multi-Channel Social</span>
          </button>
          <button onClick={() => setActiveTab("valuation")} className={tabBtn("valuation", "flex items-center gap-1.5")}>
            <span className="p-0.5 rounded bg-blue-500/20 text-xs">📊</span>
            <span>Property Valuation</span>
          </button>
          <button onClick={() => setActiveTab("portal")} className={tabBtn("portal")}>
            Portal Specs (Rightmove)
          </button>
        </div>
      )}

      {/* TAB 1: PROPERTY BROCHURE */}
      {hasContent && activeTab === "brochure" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-5 shadow-2xs">
            <div>
              <h2 className="font-heading font-medium text-lg text-slate-900">Editable Marketing Copy</h2>
              <p className="text-xs text-slate-500 mt-0.5">Click and edit any section below. The brochure preview updates live.</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">HEADLINE</label>
              <input type="text" value={brochure.headline} onChange={(e) => setField("brochure", "headline", e.target.value)} className={inputCls} />
              <FieldError message={err("brochure", "headline")} />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">LISTING OVERVIEW (NARRATIVE)</label>
                <button
                  type="button"
                  disabled={busyJob}
                  onClick={() => regenerateSection("brochure")}
                  className="text-xs font-medium text-[#092167] hover:underline cursor-pointer disabled:opacity-50"
                >
                  Regenerate Section
                </button>
              </div>
              <textarea rows={5} value={brochure.overview} onChange={(e) => setField("brochure", "overview", e.target.value)} className={areaCls} />
              <FieldError message={err("brochure", "overview")} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">KEY PROPERTY FEATURES</label>
              <textarea rows={5} value={brochure.keyFeatures} onChange={(e) => setField("brochure", "keyFeatures", e.target.value)} className={`${areaCls} font-mono`} />
              <FieldError message={err("brochure", "keyFeatures")} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">SOCIAL MEDIA CAPTION (INSTAGRAM / LINKEDIN)</label>
              <textarea rows={3} value={brochure.socialCaption} onChange={(e) => setField("brochure", "socialCaption", e.target.value)} className={areaCls} />
              <FieldError message={err("brochure", "socialCaption")} />
            </div>

            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                disabled={saving || !dirty("brochure")}
                onClick={() => save("brochure")}
                className="h-11 px-6 rounded-lg bg-[#06143E] hover:bg-[#0A2168] text-white font-medium text-xs sm:text-sm transition cursor-pointer shadow-sm disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes to Pack"}
              </button>
              <button
                type="button"
                disabled={busyJob}
                onClick={regenerateAll}
                className="h-11 px-5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Full Regenerate</span>
              </button>
              <span className="text-xs text-slate-400">{saveState("brochure")}</span>
            </div>

            <VersionHistory packId={packId} sectionKey="brochure" disabled={saving || busyJob} onRestore={(c) => save("brochure", c)} />
          </div>

          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-5 shadow-sm">
            <BrandHeader ctx={ctx} />
            <HeroPhoto ctx={ctx} />
            <AddressBlock ctx={ctx} title={brochure.headline} />
            <SpecBadges ctx={ctx} />

            <div className="space-y-1">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Property Overview</p>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{brochure.overview}</p>
            </div>

            <Gallery ctx={ctx} />

            {pack.disclaimer && (
              <div className="pt-2 border-t border-slate-100 text-[9px] text-slate-400 leading-tight">
                <p className="font-medium uppercase tracking-wider mb-0.5">IMPORTANT NOTICE & DISCLAIMER</p>
                <p>{pack.disclaimer}</p>
              </div>
            )}

            <div className="bg-slate-50 py-2 rounded-lg text-center text-xs font-medium text-slate-400">Client Print-Ready Preview</div>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-CHANNEL SOCIAL */}
      {hasContent && activeTab === "social" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-5 shadow-2xs">
            <div>
              <h2 className="font-heading font-medium text-lg text-slate-900">Platform-Optimized Social Copies</h2>
              <p className="text-xs text-slate-500 mt-0.5">Custom-tailored hooks, formats, and structures prepared for high engagement.</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {(["facebook", "instagram", "tiktok"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setSocialPlatform(p)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${socialPlatform === p ? "bg-[#06143E] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {p === "facebook" ? "Facebook Post" : p === "instagram" ? "Instagram Caption" : "TikTok / Reels Script"}
                </button>
              ))}
            </div>

            <div className="bg-[#FEFCE8] border border-[#FEF08A] rounded-2xl p-6 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#854D0E] uppercase tracking-wider flex items-center gap-1.5">
                  <span>📸</span>
                  <span>{socialPlatform === "facebook" ? "FACEBOOK FEED POST" : socialPlatform === "instagram" ? "INSTAGRAM CAPTION" : "TIKTOK / REELS SCRIPT"}</span>
                </span>
                <button
                  onClick={() => copyToClipboard(socialCopyText, "social-copy")}
                  className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "social-copy" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                {socialPlatform === "tiktok" && (
                  <>
                    <label className="block text-[11px] font-medium text-[#854D0E] uppercase tracking-wider">Video script</label>
                    <textarea rows={6} value={social.script} onChange={(e) => setField(socialKey, "script", e.target.value)} className={`${areaCls} border-[#FEF08A]`} />
                    <FieldError message={err(socialKey, "script")} />
                    <label className="block text-[11px] font-medium text-[#854D0E] uppercase tracking-wider pt-1">Caption</label>
                  </>
                )}
                <textarea rows={6} value={social.text} onChange={(e) => setField(socialKey, "text", e.target.value)} className={`${areaCls} border-[#FEF08A]`} />
                <FieldError message={err(socialKey, "text")} />
                <label className="block text-[11px] font-medium text-[#854D0E] uppercase tracking-wider pt-1">Hashtags</label>
                <input
                  type="text"
                  value={social.hashtags}
                  onChange={(e) => setField(socialKey, "hashtags", e.target.value)}
                  placeholder="#NewToMarket #HomeForSale"
                  className="w-full p-3 rounded-xl border border-[#FEF08A] bg-white text-xs text-blue-600 font-medium focus:outline-none focus:border-[#092167]"
                />
                <FieldError message={err(socialKey, "hashtags")} />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                disabled={saving || !dirty(socialKey)}
                onClick={() => save(socialKey)}
                className="h-10 px-5 rounded-lg bg-[#06143E] hover:bg-[#0A2168] text-white font-medium text-xs transition cursor-pointer disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                disabled={busyJob}
                onClick={() => regenerateSection(socialKey)}
                className="h-10 px-5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Regenerate Social Hook</span>
              </button>
              <span className="text-xs text-slate-400">{saveState(socialKey)}</span>
            </div>

            <VersionHistory key={socialKey} packId={packId} sectionKey={socialKey} disabled={saving || busyJob} onRestore={(c) => save(socialKey, c)} />
          </div>

          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-5 shadow-sm">
            <BrandHeader ctx={ctx} />
            <HeroPhoto ctx={ctx} />
            <AddressBlock ctx={ctx} />
            <SpecBadges ctx={ctx} />
            <Gallery ctx={ctx} />
            <div className="bg-slate-50 py-2 rounded-lg text-center text-xs font-medium text-slate-400">Client Print-Ready Preview</div>
          </div>
        </div>
      )}

      {/* TAB 3: PROPERTY VALUATION */}
      {activeTab === "valuation" && <ValuationTab pack={pack} packId={packId} currency={currency} />}

      {/* TAB 4: PORTAL SPECS */}
      {hasContent && activeTab === "portal" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-5 shadow-2xs">
            <div>
              <h2 className="font-heading font-medium text-lg text-slate-900">Rightmove & Zoopla Portal Specs</h2>
              <p className="text-xs text-slate-500 mt-0.5">Formatted and ready for copy-paste or portal feed upload.</p>
            </div>

            <div className="flex items-center gap-2">
              {(["rightmove", "zoopla"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPortalPlatform(p)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${portalPlatform === p ? "bg-[#06143E] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {p === "rightmove" ? "Rightmove Format" : "Zoopla Format"}
                </button>
              ))}
            </div>

            <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-600 uppercase tracking-wider">PORTAL BULLET POINTS (KEY FEATURES)</span>
                <button
                  onClick={() => copyToClipboard(parseLines(portal.bullets).map((b) => `• ${b}`).join("\n"), "bullets")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "bullets" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Bullets</span>
                    </>
                  )}
                </button>
              </div>
              <textarea rows={6} value={portal.bullets} onChange={(e) => setField(portalKey, "bullets", e.target.value)} className={`${areaCls} text-slate-700 font-medium`} />
              <p className="text-[11px] text-slate-400">One bullet per line, up to 10.</p>
              <FieldError message={err(portalKey, "bullets")} />
            </div>

            <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-600 uppercase tracking-wider">FULL PORTAL LISTING DESCRIPTION</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">{formatNumber(portal.description.length)} / 6,000</span>
                  <button
                    onClick={() => copyToClipboard(`${portal.summary}\n\n${portal.description}`, "description")}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === "description" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-sans">
                <p className="font-medium text-slate-900">SUMMARY:</p>
                <textarea rows={2} value={portal.summary} onChange={(e) => setField(portalKey, "summary", e.target.value)} className={areaCls} />
                <FieldError message={err(portalKey, "summary")} />
                <p className="font-medium text-slate-900 pt-1">DESCRIPTION:</p>
                <textarea rows={8} value={portal.description} onChange={(e) => setField(portalKey, "description", e.target.value)} className={areaCls} />
                <FieldError message={err(portalKey, "description")} />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={saving || !dirty(portalKey)}
                onClick={() => save(portalKey)}
                className="h-11 px-6 rounded-lg bg-[#06143E] hover:bg-[#0A2168] text-white font-medium text-xs sm:text-sm transition cursor-pointer shadow-sm disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                disabled={busyJob}
                onClick={() => regenerateSection(portalKey)}
                className="h-11 px-5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Regenerate</span>
              </button>
              <button
                type="button"
                disabled={!px}
                onClick={() => px && copyToClipboard([...(px.bullets ?? []).map((b) => `• ${b}`), "", px.description ?? ""].join("\n"), "all-portal")}
                className="h-11 px-6 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-medium text-xs sm:text-sm transition cursor-pointer shadow-sm disabled:opacity-60"
              >
                {copiedKey === "all-portal" ? "Copied!" : `Copy All ${portalLabel} Data`}
              </button>
              <a
                href={`/api/backend/packs/${packId}/portal-export?portal=${portalPlatform}&format=xml`}
                className="h-11 px-5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm transition cursor-pointer flex items-center"
              >
                Export XML
              </a>
              <a
                href={`/api/backend/packs/${packId}/portal-export?portal=${portalPlatform}&format=csv`}
                className="h-11 px-5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm transition cursor-pointer flex items-center"
              >
                Export CSV
              </a>
            </div>
            <p className="text-xs text-slate-400">{saveState(portalKey)}</p>

            <VersionHistory key={portalKey} packId={packId} sectionKey={portalKey} disabled={saving || busyJob} onRestore={(c) => save(portalKey, c)} />
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-2xs">
              <div>
                <h3 className="font-heading font-medium text-base text-slate-900">Portal Readiness Score</h3>
                <p className="text-xs text-slate-500 mt-0.5">Checks this pack against the {portalLabel} feed requirements</p>
              </div>

              {portalExport.isLoading && <div className="h-24 rounded-xl bg-slate-100 animate-pulse" />}
              {portalExport.isError && <ErrorState error={portalExport.error} onRetry={portalExport.refetch} />}
              {px && (
                <>
                  <div className={`rounded-xl p-4 border ${readiness >= 100 ? "bg-emerald-50 border-emerald-200/80 text-emerald-800" : "bg-amber-50 border-amber-200/80 text-amber-900"}`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-heading font-medium text-2xl ${readiness >= 100 ? "text-emerald-700" : "text-amber-700"}`}>{readiness}% Score</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${readiness >= 100 ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                    </div>
                    <p className="text-xs mt-1 font-medium">{readiness >= 100 ? "Ready for portal upload" : "Complete the items below before uploading"}</p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">COMPLIANCE & FEED VERIFICATION</p>
                    <div className="space-y-2 text-xs text-slate-700">
                      {(px.checklist ?? []).map((c) => (
                        <p key={c.item} className="flex items-center gap-2">
                          {c.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                          <span>{c.item}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-2xs">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{portalLabel.toUpperCase()} RESULT CARD PREVIEW</p>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="relative aspect-16/9 bg-slate-900">
                  <ApiImage src={photos[0]?.url} alt={`${portalLabel} preview`} className="absolute inset-0 w-full h-full object-cover" />
                  {photos.length > 0 && <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-medium">1/{photos.length}</div>}
                </div>
                <div className="p-3.5 space-y-1">
                  {priceLabel(ctx) && <p className="font-heading font-medium text-base text-slate-900">{priceLabel(ctx)}</p>}
                  <p className="text-xs text-slate-600">
                    {[pack.property?.bedrooms != null ? `${pack.property.bedrooms} bed` : null, pack.property?.propertyType, pack.property?.transaction === "let" ? "to let" : "for sale"].filter(Boolean).join(" ")}
                    {a?.line1 ? ` • ${a.line1}` : ""}
                  </p>
                  {branding?.agencyName && <p className="text-[11px] text-emerald-600 font-medium pt-1">Marketed by {branding.agencyName}</p>}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled
                  className="w-full h-11 rounded-lg bg-slate-100 text-slate-400 font-medium text-xs sm:text-sm border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>Direct Sync to Rightmove &amp; Zoopla</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">Coming Soon</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ShareDialog isOpen={showShareModal} onClose={() => setShowShareModal(false)} packId={packId} />
      <BuyPacksModal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} onPurchased={() => setShowBuyModal(false)} />
    </div>
  );
}

export default function PackEditorPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={4} columns={3} />}>
      <PackEditor />
    </Suspense>
  );
}
