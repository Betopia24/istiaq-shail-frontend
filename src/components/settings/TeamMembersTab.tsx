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
import toast from "react-hot-toast";

export type TeamRole = "Owner" | "Valuer" | "Negotiator" | "Administrator";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: "Active" | "Inactive";
  initials: string;
  avatarColor: string;
  isOwner?: boolean;
}

export interface PendingInvite {
  id: string;
  email: string;
  role: TeamRole;
  sentAt: string;
}

export const TeamMembersTab: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "m-1",
      name: "Ishtiaq Sohail",
      email: "ishtiaq@prestigeestates.co.uk",
      role: "Owner",
      status: "Active",
      initials: "IS",
      avatarColor: "bg-[#092167]",
      isOwner: true,
    },
    {
      id: "m-2",
      name: "Sarah Jenkins",
      email: "sarah@prestigeestates.co.uk",
      role: "Valuer",
      status: "Active",
      initials: "SJ",
      avatarColor: "bg-pink-600",
    },
    {
      id: "m-3",
      name: "David Brooks",
      email: "david@prestigeestates.co.uk",
      role: "Negotiator",
      status: "Active",
      initials: "DB",
      avatarColor: "bg-blue-600",
    },
    {
      id: "m-4",
      name: "Emily Carter",
      email: "emily@prestigeestates.co.uk",
      role: "Administrator",
      status: "Active",
      initials: "EC",
      avatarColor: "bg-emerald-600",
    },
  ]);

  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([
    {
      id: "inv-1",
      email: "james@prestigeestates.co.uk",
      role: "Negotiator",
      sentAt: "Sent 2 days ago",
    },
    {
      id: "inv-2",
      email: "claire@prestigeestates.co.uk",
      role: "Valuer",
      sentAt: "Sent 5 hours ago",
    },
  ]);

  const [activeMenuMemberId, setActiveMenuMemberId] = useState<string | null>(
    null,
  );
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("Negotiator");

  // DangerModal state
  const [dangerTarget, setDangerTarget] = useState<{
    member: TeamMember;
    action: "remove" | "deactivate";
  } | null>(null);

  const roleHints: Record<TeamRole, string> = {
    Owner:
      "Full administrative authority over workspace billing, subscriptions, API keys, compliance, and user deletion.",
    Valuer:
      "Can generate property packs, modify AI valuation comparables, adjust rental yields, and export valuation PDFs.",
    Negotiator:
      "Can create and edit property brochures, generate marketing descriptions, and manage buyer inquiries and viewings.",
    Administrator:
      "Can invite colleagues, configure agency branding, manage regional compliance, and download VAT invoices.",
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }
    const newInvite: PendingInvite = {
      id: `inv-${Date.now()}`,
      email: inviteEmail.trim(),
      role: inviteRole,
      sentAt: "Sent just now",
    };
    setPendingInvites((prev) => [newInvite, ...prev]);
    setIsInviteModalOpen(false);
    setInviteEmail("");
    toast.success(`Invitation email sent to ${newInvite.email}`);
  };

  const handleConfirmDangerAction = () => {
    if (!dangerTarget) return;
    const { member, action } = dangerTarget;

    if (action === "remove") {
      setTeamMembers((prev) => prev.filter((m) => m.id !== member.id));
      toast.success(`Removed "${member.name}" from workspace`);
    } else {
      setTeamMembers((prev) =>
        prev.map((m) =>
          m.id === member.id
            ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" }
            : m,
        ),
      );
      toast.success(
        `User "${member.name}" marked as ${
          member.status === "Active" ? "Inactive" : "Active"
        }`,
      );
    }
    setDangerTarget(null);
  };

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
            : dangerTarget?.member.status === "Active"
            ? "Deactivate Team Member"
            : "Reactivate Team Member"
        }
        description={
          dangerTarget?.action === "remove"
            ? `Are you sure you want to revoke workspace access for ${dangerTarget?.member.name}? They will immediately lose access to all generated property brochures.`
            : `Are you sure you want to change the active status for ${dangerTarget?.member.name}?`
        }
        itemName={dangerTarget?.member.name}
        confirmText={
          dangerTarget?.action === "remove"
            ? "Remove Member"
            : dangerTarget?.member.status === "Active"
            ? "Deactivate"
            : "Reactivate"
        }
        icon={dangerTarget?.action === "remove" ? "trash" : "warning"}
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
                onClick={() => setIsInviteModalOpen(true)}
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
                  {teamMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      {/* Member Info */}
                      <td className="py-3.5 pl-1">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${member.avatarColor} text-white flex items-center justify-center font-medium text-xs shrink-0 shadow-2xs`}
                          >
                            {member.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 text-sm">
                              {member.name}
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
                            {member.role}
                          </span>
                          <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 cursor-help" />
                          <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block z-30 w-56 p-2 rounded-lg bg-slate-900 text-white text-[10px] leading-tight shadow-xl pointer-events-none">
                            {roleHints[member.role]}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            member.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>

                      {/* Action Menu */}
                      <td className="py-3.5 pr-2 text-right relative">
                        {member.isOwner ? (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Protected
                          </span>
                        ) : (
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenuMemberId(
                                  activeMenuMemberId === member.id
                                    ? null
                                    : member.id,
                                )
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                              aria-label="Member options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {activeMenuMemberId === member.id && (
                              <div className="absolute right-0 top-8 z-30 w-48 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 space-y-0.5 text-left animate-in fade-in zoom-in-95 duration-100">
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
                                    {member.status === "Active"
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
                    {role}
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
              {pendingInvites.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {inv.email}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {inv.role} · {inv.sentAt}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toast.success(`Invitation re-sent to ${inv.email}`)
                    }
                    className="h-7 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-[11px] transition cursor-pointer shadow-2xs shrink-0"
                  >
                    Resend
                  </button>
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
              Your Professional Tier includes up to <strong>5 seats</strong> (4
              of 5 currently assigned). To invite additional valuers and
              negotiators, upgrade to the Team Plan (15 seats).
            </p>
            <div className="pt-1">
              <a
                href="/agent-dashboard/settings"
                className="text-xs font-semibold text-[#092167] hover:text-[#E8A808] transition inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Upgrade to Team Tier (£199/mo)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
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
                  placeholder="james@prestigeestates.co.uk"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                  ASSIGN ROLE <span className="text-amber-500">*</span>
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
                >
                  <option value="Negotiator">Negotiator</option>
                  <option value="Valuer">Valuer</option>
                  <option value="Administrator">Administrator</option>
                </select>
                <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                  {roleHints[inviteRole]}
                </p>
              </div>

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
                  className="h-10 px-6 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-medium text-xs shadow-sm transition cursor-pointer"
                >
                  Send Invite
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
