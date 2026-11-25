"use client";

import React, { useState } from "react";
import {
  UserPlus,
  MoreVertical,
  UserX,
  UserCheck,
  ShieldCheck,
  ArrowUpRight,
  X,
  Info,
} from "lucide-react";
import { DangerModal } from "@/components/ui/DangerModal";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { TableSkeleton } from "@/components/ui/skeletons/TableSkeleton";
import toast from "react-hot-toast";
import type { Member } from "@/types/models";
import { errorText } from "@/lib/auth/client";
import { formatDate, initials } from "@/lib/format";
import { useAppSelector } from "@/redux/hook";
import {
  useCancelInvitationMutation,
  useGetTeamQuery,
  useInviteMemberMutation,
  useRemoveMemberMutation,
  useResendInvitationMutation,
  useUpdateMemberMutation,
} from "@/redux/api/team/teamApi";

type TeamRole = "owner" | "administrator" | "valuer" | "negotiator";

const ROLE_LABEL: Record<TeamRole, string> = {
  owner: "Owner",
  administrator: "Administrator",
  valuer: "Valuer",
  negotiator: "Negotiator",
};

const AVATAR_COLORS = ["bg-[#092167]", "bg-pink-600", "bg-blue-600", "bg-emerald-600", "bg-violet-600"];

function sentLabel(iso?: string | null) {
  return iso ? `Sent ${formatDate(iso)}` : "";
}

export const TeamMembersTab: React.FC<{ onOpenBilling?: () => void }> = ({ onOpenBilling }) => {
  const me = useAppSelector((s) => s.user.user);
  const canManage = me?.role === "owner" || me?.role === "administrator";
  const isOwner = me?.role === "owner";

  const team = useGetTeamQuery(undefined, { skip: !canManage });
  const [inviteMember, { isLoading: isInviting }] = useInviteMemberMutation();
  const [resendInvitation] = useResendInvitationMutation();
  const [cancelInvitation] = useCancelInvitationMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
  const [removeMember, { isLoading: isRemoving }] = useRemoveMemberMutation();

  const [activeMenuMemberId, setActiveMenuMemberId] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Exclude<TeamRole, "owner">>("negotiator");
  const [inviteFieldErrors, setInviteFieldErrors] = useState<Record<string, string>>({});
  const [inviteError, setInviteError] = useState<string | null>(null);

  // DangerModal state
  const [dangerTarget, setDangerTarget] = useState<{
    member: Member;
    action: "remove" | "deactivate";
  } | null>(null);

  const roleHints: Record<TeamRole, string> = {
    owner:
      "Full administrative authority over workspace billing, subscriptions, API keys, compliance, and user deletion.",
    valuer:
      "Can generate property packs, modify AI valuation comparables, adjust rental yields, and export valuation PDFs.",
    negotiator:
      "Can create and edit property brochures, generate marketing descriptions, and manage buyer inquiries and viewings.",
    administrator:
      "Can invite colleagues, configure agency branding, manage regional compliance, and download VAT invoices.",
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteFieldErrors({});
    setInviteError(null);
    try {
      await inviteMember({ email: inviteEmail.trim(), role: inviteRole }).unwrap();
      toast.success(`Invitation email sent to ${inviteEmail.trim()}`);
      setIsInviteModalOpen(false);
      setInviteEmail("");
    } catch (err) {
      const info = apiErrorInfo(err);
      if (info.status === 422) setInviteFieldErrors(info.fields);
      else if (info.code === "seat_limit") {
        setInviteError("You have used every seat on your plan. Upgrade your plan to invite more colleagues.");
      } else setInviteError(errorText(err));
    }
  };

  const handleConfirmDangerAction = async () => {
    if (!dangerTarget) return;
    const { member, action } = dangerTarget;
    try {
      if (action === "remove") {
        await removeMember(member.id ?? "").unwrap();
        toast.success(`Removed "${member.fullName}" from workspace`);
      } else {
        const next = member.status === "active" ? "deactivated" : "active";
        await updateMember({ id: member.id ?? "", status: next }).unwrap();
        toast.success(`User "${member.fullName}" ${next === "active" ? "reactivated" : "deactivated"}`);
      }
      setDangerTarget(null);
    } catch (err) {
      toast.error(errorText(err));
      setDangerTarget(null);
    }
  };

  const handleChangeRole = async (member: Member, role: TeamRole) => {
    setActiveMenuMemberId(null);
    try {
      await updateMember({ id: member.id ?? "", role }).unwrap();
      toast.success(`${member.fullName} is now ${ROLE_LABEL[role]}`);
    } catch (err) {
      toast.error(errorText(err));
    }
  };

  const handleResend = async (id: string, email?: string) => {
    try {
      await resendInvitation(id).unwrap();
      toast.success(`Invitation re-sent to ${email}`);
    } catch (err) {
      toast.error(errorText(err));
    }
  };

  const handleCancelInvite = async (id: string) => {
    try {
      await cancelInvitation(id).unwrap();
      toast.success("Invitation cancelled");
    } catch (err) {
      toast.error(errorText(err));
    }
  };

  if (!canManage) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center shadow-2xs">
        <p className="text-sm font-medium text-slate-800">Team management is for owners and administrators</p>
        <p className="text-xs text-slate-500 mt-1">Ask your agency owner or an administrator to manage seats.</p>
      </div>
    );
  }

  if (team.isLoading) return <TableSkeleton rows={4} columns={3} />;
  if (team.error) return <ErrorState error={team.error} onRetry={() => team.refetch()} />;

  const members = team.data?.members ?? [];
  const pendingInvites = (team.data?.invitations ?? []).filter((i) => !i.status || i.status === "pending");
  /** null = unlimited (Agency Pro). */
  const seatLimit: number | null = team.data?.seatLimit ?? null;
  const seatLimitText = seatLimit == null ? "unlimited seats" : `${seatLimit} seat${seatLimit === 1 ? "" : "s"}`;
  const seatsUsed = team.data?.seatsUsed ?? 0;
  const dangerName = dangerTarget?.member.fullName;

  return (
    <div className="space-y-6">
      {/* DangerModal Confirmation */}
      <DangerModal
        isOpen={!!dangerTarget}
        onClose={() => setDangerTarget(null)}
        onConfirm={handleConfirmDangerAction}
        title={
          dangerTarget?.action === "remove"
            ? "Remove Team Member"
            : dangerTarget?.member.status === "active"
            ? "Deactivate Team Member"
            : "Reactivate Team Member"
        }
        description={
          dangerTarget?.action === "remove"
            ? `Are you sure you want to revoke workspace access for ${dangerName}? They will immediately lose access to all generated property brochures.`
            : `Are you sure you want to change the active status for ${dangerName}?`
        }
        itemName={dangerName}
        confirmText={
          dangerTarget?.action === "remove"
            ? "Remove Member"
            : dangerTarget?.member.status === "active"
            ? "Deactivate"
            : "Reactivate"
        }
        icon={dangerTarget?.action === "remove" ? "trash" : "warning"}
        isLoading={isRemoving || isUpdating}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column: Team Table & Role Guidance */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 space-y-6 shadow-2xs">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-medium text-lg text-slate-900">
                  Active Team Members
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Colleagues with seat access to generate, edit, and export
                  property packs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setInviteError(null);
                  setInviteFieldErrors({});
                  setIsInviteModalOpen(true);
                }}
                className="h-10 px-5 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-medium text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite Member</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[540px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-medium tracking-wider">
                    <th className="pb-3 pl-1 font-medium">Member</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 pr-2 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">
                        No team members yet
                      </td>
                    </tr>
                  )}
                  {members.map((member, idx) => (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      {/* Member Info */}
                      <td className="py-3.5 pl-1">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} text-white flex items-center justify-center font-medium text-xs shrink-0 shadow-2xs`}
                          >
                            {initials(member.fullName)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 text-sm">
                              {member.fullName}
                              {member.isYou && <span className="ml-1.5 text-[10px] text-slate-400 font-medium">(You)</span>}
                            </p>
                            <p className="text-slate-500 text-[11px] truncate">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role with Hover Hint */}
                      <td className="py-3.5">
                        <div className="group relative inline-flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800">
                            {ROLE_LABEL[(member.role ?? "valuer") as TeamRole]}
                          </span>
                          <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 cursor-help" />
                          <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block z-30 w-56 p-2 rounded-lg bg-slate-900 text-white text-[10px] leading-tight shadow-xl pointer-events-none">
                            {roleHints[(member.role ?? "valuer") as TeamRole]}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            member.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {member.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Action Menu */}
                      <td className="py-3.5 pr-2 text-right relative">
                        {member.isYou || (member.role === "owner" && !isOwner) ? (
                          <span className="text-[11px] text-slate-400 font-medium">
                            {member.isYou ? "You" : "Protected"}
                          </span>
                        ) : (
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenuMemberId(
                                  activeMenuMemberId === member.id
                                    ? null
                                    : (member.id ?? null),
                                )
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                              aria-label="Member options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {activeMenuMemberId === member.id && (
                              <div className="absolute right-0 top-8 z-30 w-48 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 space-y-0.5 text-left animate-in fade-in zoom-in-95 duration-100">
                                {(["administrator", "valuer", "negotiator", ...(isOwner ? ["owner"] : [])] as TeamRole[])
                                  .filter((r) => r !== member.role)
                                  .map((r) => (
                                    <button
                                      key={r}
                                      type="button"
                                      onClick={() => handleChangeRole(member, r)}
                                      className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 cursor-pointer transition font-medium"
                                    >
                                      <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                                      <span>Make {ROLE_LABEL[r]}</span>
                                    </button>
                                  ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuMemberId(null);
                                    setDangerTarget({
                                      member,
                                      action: "deactivate",
                                    });
                                  }}
                                  className="w-full px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 rounded-lg flex items-center gap-2 cursor-pointer transition font-medium"
                                >
                                  <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                                  <span>
                                    {member.status === "active"
                                      ? "Deactivate Member"
                                      : "Activate Member"}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuMemberId(null);
                                    setDangerTarget({
                                      member,
                                      action: "remove",
                                    });
                                  }}
                                  className="w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 cursor-pointer transition font-medium"
                                >
                                  <UserX className="w-3.5 h-3.5 text-red-500" />
                                  <span>Remove from Workspace</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* E11: Role Permissions Reference Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
            <h4 className="font-heading font-medium text-sm text-slate-900">
              Agency Seat Roles &amp; Permissions Matrix
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {(Object.keys(roleHints) as TeamRole[]).map((role) => (
                <div
                  key={role}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-1"
                >
                  <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#E8A808]" />
                    {ROLE_LABEL[role]}
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {roleHints[role]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pending Invites & Workspace Seat Limit */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pending Invitations */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
            <div>
              <h4 className="font-heading font-medium text-sm text-slate-900">
                Pending Invitations
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Invited members who haven&apos;t accepted their token link yet.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {pendingInvites.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-3">No pending invitations</p>
              )}
              {pendingInvites.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">{inv.email}</p>
                    <p className="text-[11px] text-slate-500">
                      {ROLE_LABEL[(inv.role ?? "valuer") as TeamRole]} · {sentLabel(inv.resentAt ?? inv.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleResend(inv.id ?? "", inv.email)}
                      className="h-7 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-[11px] transition cursor-pointer shadow-2xs"
                    >
                      Resend
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancelInvite(inv.id ?? "")}
                      aria-label="Cancel invitation"
                      className="h-7 w-7 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center cursor-pointer shadow-2xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seat Capacity Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 font-medium text-sm">
              <ShieldCheck className="w-4 h-4 text-[#E8A808]" />
              <span>Team Seat Allowance</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {team.data?.planName ? `Your ${team.data.planName} plan` : "Your plan"} includes{" "}
              <strong>{seatLimitText}</strong>. Seats used: {seatsUsed}
              {seatLimit != null ? ` / ${seatLimit}` : ""} (active members plus open invitations).
            </p>
            {isOwner && onOpenBilling && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onOpenBilling}
                  className="text-xs font-semibold text-[#092167] hover:text-[#E8A808] transition inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Upgrade your plan</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-medium text-lg text-slate-900">
                  Invite Team Member
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Invite a valuer or negotiator to your agency workstation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                  EMAIL ADDRESS <span className="text-amber-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="colleague@youragency.co.uk"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
                />
                {inviteFieldErrors.email && <p className="text-[11px] text-rose-600">{inviteFieldErrors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                  ASSIGN ROLE <span className="text-amber-500">*</span>
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Exclude<TeamRole, "owner">)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
                >
                  <option value="negotiator">Negotiator</option>
                  <option value="valuer">Valuer</option>
                  <option value="administrator">Administrator</option>
                </select>
                <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                  {roleHints[inviteRole]}
                </p>
                {inviteFieldErrors.role && <p className="text-[11px] text-rose-600">{inviteFieldErrors.role}</p>}
              </div>

              {inviteError && (
                <p role="alert" className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                  {inviteError}
                </p>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="h-10 px-5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="h-10 px-6 disabled:opacity-60 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-medium text-xs shadow-sm transition cursor-pointer"
                >
                  {isInviting ? "Sending..." : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembersTab;
