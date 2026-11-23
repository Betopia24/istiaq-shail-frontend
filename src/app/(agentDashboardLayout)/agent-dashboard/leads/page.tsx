"use client";

import React, { useEffect, useState } from "react";
import {
  Download,
  Eye,
  Mail,
  Trash2,
  ChevronDown,
  Search,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/Badge";
import { DangerModal } from "@/components/ui/DangerModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import TableSkeleton from "@/components/ui/skeletons/TableSkeleton";
import StatsSkeleton from "@/components/ui/skeletons/StatsSkeleton";
import { LeadDetailSlideOver, LEAD_STATUS_LABEL } from "@/components/leads/LeadDetailSlideOver";
import {
  useDeleteLeadMutation,
  useGetLeadsQuery,
  useUpdateLeadStatusMutation,
} from "@/redux/api/leads/leadsApi";
import { useListPacksQuery } from "@/redux/api/packs/packsApi";
import { errorText } from "@/lib/auth/client";
import { formatDate, formatDateTime, initials } from "@/lib/format";
import type { Lead, LeadStatus } from "@/types/models";

const LIMIT = 20;
type Row = Lead & { id: string; status: LeadStatus; buyerName: string; email: string; createdAt: string };
const AVATAR_COLORS = ["bg-[#06143E]", "bg-[#065F46]", "bg-[#C2410C]", "bg-[#7C3AED]", "bg-[#0E7490]"];
const STATUS_STYLE: Record<LeadStatus, { pill: string; dot: string; text: string }> = {
  pending: { pill: "bg-amber-50 text-amber-800 border-amber-200/70 hover:bg-amber-100", dot: "bg-amber-500", text: "text-amber-800" },
  confirmed: { pill: "bg-emerald-50 text-emerald-800 border-emerald-200/70 hover:bg-emerald-100", dot: "bg-emerald-500", text: "text-emerald-800" },
  completed: { pill: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200", dot: "bg-slate-500", text: "text-slate-700" },
  cancelled: { pill: "bg-rose-50 text-rose-800 border-rose-200/70 hover:bg-rose-100", dot: "bg-rose-500", text: "text-rose-800" },
};

function avatarColor(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export default function LeadsInquiriesPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | LeadStatus>("all");
  const [packId, setPackId] = useState<string | undefined>(undefined);
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [openStatusMenuId, setOpenStatusMenuId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<{ id: string; buyerName: string } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const status = activeFilter === "all" ? undefined : activeFilter;
  const { data, isLoading, isFetching, error, refetch } = useGetLeadsQuery({ status, packId, q: q || undefined, page, limit: LIMIT });
  const { data: packs } = useListPacksQuery({ pageSize: 100 });
  const [updateStatus] = useUpdateLeadStatusMutation();
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();

  const stats = data?.stats;
  const leads = (data?.items ?? []) as Row[];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / LIMIT));
  const selectedPackTitle = packs?.items.find((p) => p.id === packId)?.title ?? "All Listings";

  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    setOpenStatusMenuId(null);
    try {
      await updateStatus({ id: leadId, status: newStatus }).unwrap();
      toast.success(`Inquiry status updated to ${LEAD_STATUS_LABEL[newStatus]}`);
    } catch (err) {
      if (apiErrorInfo(err).code === "lead_changed") {
        toast.error("Someone else just changed this inquiry. The latest version is now shown.");
        refetch();
      } else {
        toast.error(errorText(err));
      }
    }
  };

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return;
    try {
      await deleteLead(leadToDelete.id).unwrap();
      toast.success("Personal data erased. The inquiry stays in your statistics.");
      if (selectedLeadId === leadToDelete.id) setSelectedLeadId(null);
      setLeadToDelete(null);
    } catch (err) {
      toast.error(errorText(err));
    }
  };

  const exportParams = new URLSearchParams();
  if (status) exportParams.set("status", status);
  if (packId) exportParams.set("packId", packId);
  const exportHref = `/api/backend/leads/export${exportParams.size ? `?${exportParams}` : ""}`;

  return (
    <div className="space-y-6">
      {/* =========================================================================
          TOP PAGE HEADER (Concise & Clean Typography)
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/70">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">
            Buyer Inquiries &amp; Viewing Requests
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Captured via Public Buyer Property Pages &amp; QR Codes
          </p>
        </div>

        <a
          href={exportHref}
          className="self-start sm:self-auto inline-flex items-center justify-center font-heading transition-all duration-200 cursor-pointer select-none h-10 px-5 text-xs sm:text-sm rounded-xl gap-2 bg-[#06143E] hover:bg-[#0B1E48] text-white font-semibold border border-[#162758] shadow-xs"
        >
          <span>Export Leads CSV</span>
          <Download className="w-4 h-4 text-[#E8A808]" />
        </a>
      </div>

      {/* =========================================================================
          TOP 4 METRICS CARDS (Clean, Concise Semibold Metrics)
      ========================================================================= */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
      <div className="@container"><div className="grid grid-cols-1 @sm:grid-cols-2 @xl:grid-cols-4 gap-4 sm:gap-5">
        <div className="@container bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-3">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
            TOTAL INQUIRIES
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-medium text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {stats?.total ?? 0}
            </span>
          </div>
        </div>

        <div className="@container bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-3">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
            PENDING REVIEW
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-medium text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {stats?.pending ?? 0}
            </span>
            {(stats?.pending ?? 0) > 0 && (
              <Badge variant="brand" className="font-medium">
                Needs Action
              </Badge>
            )}
          </div>
        </div>

        <div className="@container bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-3">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
            CONFIRMED VIEWINGS
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-medium text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {stats?.confirmed ?? 0}
            </span>
          </div>
        </div>

        <div className="@container bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-3">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
            VIEWING CONVERSION
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-medium text-2xl sm:text-3xl text-emerald-600 tracking-tight">
              {stats?.conversionPct ?? 0}%
            </span>
            <span className="text-xs text-slate-400 font-normal">
              Lead to viewing
            </span>
          </div>
        </div>
      </div>
      </div>
      )}

      {/* =========================================================================
          FILTER PILLS & PROPERTY DROPDOWN
      ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto select-none py-1">
          {[
            { id: "all", label: `All (${stats?.total ?? 0})` },
            { id: "pending", label: `Pending (${stats?.pending ?? 0})` },
            { id: "confirmed", label: `Confirmed (${stats?.confirmed ?? 0})` },
            { id: "completed", label: `Completed (${stats?.completed ?? 0})` },
            { id: "cancelled", label: `Cancelled (${stats?.cancelled ?? 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveFilter(tab.id as "all" | LeadStatus);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                activeFilter === tab.id
                  ? "bg-[#06143E] text-white shadow-xs font-medium"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Property Selector Dropdown */}
        <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            aria-label="Search inquiries"
            className="h-10 w-48 pl-8 pr-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#E8A808] shadow-2xs"
          />
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
            className="h-10 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-2 cursor-pointer shadow-2xs transition"
          >
            <span className="text-slate-400">Filter by Property:</span>
            <span className="font-medium text-slate-900 truncate max-w-[200px]">
              {selectedPackTitle}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {isPropertyDropdownOpen && (
            <div className="absolute right-0 top-11 z-30 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 space-y-1 text-left animate-in fade-in zoom-in-95 duration-150">
              {[{ id: undefined as string | undefined, title: "All Listings" }, ...(packs?.items ?? [])].map((prop) => (
                <button
                  key={prop.id ?? "all"}
                  type="button"
                  onClick={() => {
                    setPackId(prop.id);
                    setPage(1);
                    setIsPropertyDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-xs rounded-xl text-left transition cursor-pointer truncate ${
                    packId === prop.id
                      ? "bg-slate-100 text-slate-900 font-medium"
                      : "text-slate-600 hover:bg-slate-50 font-normal"
                  }`}
                >
                  {prop.title}
                </button>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>

      {/* =========================================================================
          TABLE: BUYER DETAILS & VIEWINGS (Readable, Medium & Semibold locked)
      ========================================================================= */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={4} />
      ) : error && !data ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : leads.length === 0 ? (
        <EmptyState
          icon={Users}
          title={q || status || packId ? "No inquiries match these filters" : "No inquiries yet"}
          description={q || status || packId ? "Try a different search or clear the filters." : "Viewing requests from your public property pages will appear here."}
        />
      ) : (
      <div className="@container bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 uppercase text-xs font-semibold tracking-wider bg-slate-50/90 border-b border-slate-200">
                <th className="py-3.5 pl-6 font-medium">BUYER DETAILS</th>
                <th className="py-3.5 font-medium">INTERESTED PROPERTY</th>
                <th className="py-3.5 font-medium">REQUESTED VIEWING</th>
                <th className="py-3.5 font-medium">STATUS</th>
                <th className="py-3.5 pr-6 text-right font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Column 1: Buyer Details */}
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-full ${avatarColor(lead.id)} text-white flex items-center justify-center font-medium text-xs shrink-0 shadow-2xs`}
                        >
                          {initials(lead.buyerName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 text-sm leading-snug">
                            {lead.buyerName}
                          </p>
                          <p className="text-slate-500 text-[11px] truncate mt-0.5">
                            {[lead.email, lead.phone].filter(Boolean).join(" • ")}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Interested Property */}
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-slate-900 text-xs">
                          {lead.propertyTitle}
                        </p>
                        {lead.propertyAddress && (
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            {lead.propertyAddress}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Column 3: Requested Viewing */}
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-slate-900 text-xs">
                          {lead.requestedAt ? formatDateTime(lead.requestedAt) : "No time requested"}
                        </p>
                        <p
                          className={`text-[11px] mt-0.5 ${
                            lead.status === "pending"
                              ? "text-amber-700 font-medium"
                              : lead.status === "confirmed"
                                ? "text-emerald-700 font-medium"
                                : lead.status === "cancelled"
                                  ? "text-rose-700 font-medium"
                                  : "text-slate-400 font-normal"
                          }`}
                        >
                          Submitted {formatDate(lead.createdAt)}
                        </p>
                      </div>
                    </td>

                    {/* Column 4: Status Selector Dropdown */}
                    <td className="py-4 relative">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenStatusMenuId(
                              openStatusMenuId === lead.id ? null : lead.id,
                            )
                          }
                          className={`h-8 px-3 rounded-full text-xs font-medium transition flex items-center gap-1.5 cursor-pointer border shadow-2xs ${STATUS_STYLE[lead.status].pill}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${STATUS_STYLE[lead.status].dot}`}
                          />
                          <span>{LEAD_STATUS_LABEL[lead.status]}</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {openStatusMenuId === lead.id && (
                          <div className="absolute left-0 top-9 z-30 w-44 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 space-y-0.5 text-left animate-in fade-in zoom-in-95 duration-100">
                            {(Object.keys(LEAD_STATUS_LABEL) as LeadStatus[]).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleUpdateStatus(lead.id, st)}
                                className={`w-full px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 hover:bg-slate-50 transition ${STATUS_STYLE[st].text} font-medium cursor-pointer ${
                                  lead.status === st ? "bg-slate-100 font-medium" : ""
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${STATUS_STYLE[st].dot}`}
                                />
                                <span>{LEAD_STATUS_LABEL[st]}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Column 5: Actions */}
                    <td className="py-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedLeadId(lead.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                          title="View lead viewing details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <a
                          href={`mailto:${lead.email}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#092167] hover:bg-slate-100 transition cursor-pointer"
                          title="Send email reply to lead"
                          aria-label={`Email ${lead.buyerName}`}
                        >
                          <Mail className="w-4 h-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() => setLeadToDelete(lead)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-normal">
          <p>Showing {leads.length} of {total} inquiries</p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
              className="w-8 h-8 rounded-xl border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹
            </button>
            <span className="px-2 font-medium text-slate-700">
              {page} / {pageCount}
            </span>
            <button
              type="button"
              disabled={page >= pageCount || isFetching}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
              className="w-8 h-8 rounded-xl border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ›
            </button>
          </div>
        </div>
      </div>
      )}

      {/* S11 LEAD DETAIL SLIDE-OVER */}
      <LeadDetailSlideOver
        isOpen={!!selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        leadId={selectedLeadId}
        onStatusChange={handleUpdateStatus}
        onDeleteLead={(lead) => setLeadToDelete({ id: lead.id, buyerName: lead.buyerName })}
      />

      <DangerModal
        isOpen={!!leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirm={confirmDeleteLead}
        isLoading={isDeleting}
        title="Delete this inquiry?"
        description="The buyer's personal data is erased. The row stays in your statistics, without any personal details."
        itemName={leadToDelete?.buyerName}
        confirmText="Erase Personal Data"
      />
    </div>
  );
}
