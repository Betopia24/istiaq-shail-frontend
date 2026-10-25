"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Download,
  Upload,
  Trash2,
  Plus,
  X,
  MoreVertical,
  ExternalLink,
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  Sparkles,
  Clock,
  ArrowUpRight,
  Lock,
  UserPlus,
  Edit3,
  FileText,
  UserX,
  UserCheck,
} from "lucide-react";

type ActiveTab = "profile" | "billing" | "team" | "compliance";
type TeamRole = "Owner" | "Valuer" | "Negotiator" | "Administrator";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: "Active" | "Inactive";
  initials: string;
  avatarColor: string;
  isOwner?: boolean;
}

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  sentAt: string;
}

export default function SettingsBillingPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");

  // =========================================================================
  // STATE: TAB 1 - AGENT PROFILE
  // =========================================================================
  const [profileForm, setProfileForm] = useState({
    firstName: "Ishtiaq",
    lastName: "Sohail",
    email: "ishtiaq@prestigeestates.co.uk",
    phone: "+44 7911 123456",
    roleTitle: "Senior Managing Director",
    licenceId: "NAEA-MEMBER-49201",
    bio: "Specialising in prime residential properties across Greater Manchester for over 12 years with proven expertise in luxury market valuations.",
  });
  const [headshotPreview, setHeadshotPreview] = useState<string | null>(null);
  const headshotInputRef = useRef<HTMLInputElement>(null);

  // Notification Toggles
  const [notifications, setNotifications] = useState({
    packComplete: true,
    lowCredits: true,
    monthlyBilling: true,
  });

  // Password modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // =========================================================================
  // STATE: TAB 2 - SUBSCRIPTION & BILLING
  // =========================================================================
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [billingAddress, setBillingAddress] = useState(
    "14 Gorse gate, Manchester, M21 2FA, United Kingdom"
  );
  const [billingEntity, setBillingEntity] = useState(
    "Prestige Estates UK Ltd (Ishtiaq Sohail)"
  );
  const [vatId, setVatId] = useState("GB 282 0512 44");

  // Invoices list matching Figma
  const [invoices] = useState([
    {
      id: "PP-2024-11",
      date: "15 Oct 2024",
      amount: "£79.00",
      status: "PAID",
      description: "Pro Agency Plan (Monthly)",
    },
    {
      id: "PP-2024-10",
      date: "15 Sep 2024",
      amount: "£79.00",
      status: "PAID",
      description: "Pro Agency Plan (Monthly)",
    },
    {
      id: "PP-2024-09",
      date: "15 Aug 2024",
      amount: "£79.00",
      status: "PAID",
      description: "Pro Agency Plan (Monthly)",
    },
    {
      id: "TOPUP-2024-08",
      date: "10 Aug 2024",
      amount: "£39.00",
      status: "PAID",
      description: "+25 Extra Pack Top-up",
    },
  ]);

  // =========================================================================
  // STATE: TAB 3 - TEAM MEMBERS
  // =========================================================================
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

  // Active action menu member ID
  const [activeMenuMemberId, setActiveMenuMemberId] = useState<string | null>(
    null
  );

  // Invite modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("Negotiator");
  const [sendInviteEmailCheckbox, setSendInviteEmailCheckbox] = useState(true);

  // =========================================================================
  // STATE: TAB 4 - REGIONAL COMPLIANCE
  // =========================================================================
  const [complianceRegion, setComplianceRegion] = useState<"UK" | "US">("UK");
  const [cprDisclaimers, setCprDisclaimers] = useState(true);
  const [showNaeaBadge, setShowNaeaBadge] = useState(true);
  const [customDisclaimerText, setCustomDisclaimerText] = useState(
    "These particulars are prepared for guidance only and do not constitute part of an offer or contract. All descriptions, dimensions, and reference to condition are given in good faith."
  );

  // =========================================================================
  // TOAST FEEDBACK
  // =========================================================================
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Profile Save
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Profile information updated successfully!");
  };

  // Photo Upload Handler
  const handleHeadshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setHeadshotPreview(url);
      showToast("Headshot photo uploaded!");
    }
  };

  // Invite Member Handler
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      showToast("Please enter a valid email address");
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
    showToast(`Invitation sent to ${newInvite.email}`);
  };

  // Member Action Handler
  const handleMemberAction = (
    action: "edit" | "deactivate" | "remove",
    memberId: string
  ) => {
    setActiveMenuMemberId(null);
    if (action === "remove") {
      setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
      showToast("Team member removed from workspace");
    } else if (action === "deactivate") {
      setTeamMembers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" }
            : m
        )
      );
      showToast("Member status toggled");
    } else {
      showToast("Edit Role & Access modal opened");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-7 pb-16">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#06143E] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* =========================================================================
          TOP PAGE HEADER & PACK REMAINING BADGE
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {activeTab === "profile" && "Agent Profile & Preferences"}
            {activeTab === "billing" && "Subscription & Billing"}
            {activeTab === "team" && "Team Members"}
            {activeTab === "compliance" && "Regional Compliance"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {activeTab === "profile" &&
              "Manage your agent bio, headshot photo, and security credentials."}
            {activeTab === "billing" &&
              "Manage your agency plan, payment methods, pack credits, and Stripe invoices."}
            {activeTab === "team" &&
              "Manage your agency's negotiators, valuers, and administrators. Assign roles and email invitations."}
            {activeTab === "compliance" &&
              "Configure regional trading standards disclaimers, CPR compliance, and licensing badges."}
          </p>
        </div>

        {/* Top Right Badges */}
        <div className="flex items-center gap-4 self-start sm:self-auto">
          {/* Packs Remaining Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#E8A808] animate-pulse" />
            <span>14 Packs Remaining</span>
          </div>

          {/* Log Out Button */}
          <button
            onClick={() => {
              showToast("Logging out...");
              setTimeout(() => {
                window.location.href = "/login";
              }, 600);
            }}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 transition cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB NAVIGATION BAR
      ========================================================================= */}
      <div className="border-b border-slate-200 flex items-center gap-2 sm:gap-6 overflow-x-auto select-none">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3.5 text-xs sm:text-sm font-heading transition-all border-b-2 cursor-pointer shrink-0 ${
            activeTab === "profile"
              ? "border-[#E8A808] text-[#092167] font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900 font-semibold"
          }`}
        >
          Agent Profile
        </button>

        <button
          onClick={() => setActiveTab("billing")}
          className={`pb-3.5 text-xs sm:text-sm font-heading transition-all border-b-2 cursor-pointer shrink-0 ${
            activeTab === "billing"
              ? "border-[#E8A808] text-[#092167] font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900 font-semibold"
          }`}
        >
          Subscription &amp; Billing
        </button>

        <button
          onClick={() => setActiveTab("team")}
          className={`pb-3.5 text-xs sm:text-sm font-heading transition-all border-b-2 cursor-pointer shrink-0 ${
            activeTab === "team"
              ? "border-[#E8A808] text-[#092167] font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900 font-semibold"
          }`}
        >
          Team Members
        </button>

        <button
          onClick={() => setActiveTab("compliance")}
          className={`pb-3.5 text-xs sm:text-sm font-heading transition-all border-b-2 cursor-pointer shrink-0 ${
            activeTab === "compliance"
              ? "border-[#E8A808] text-[#092167] font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900 font-semibold"
          }`}
        >
          Regional Compliance
        </button>
      </div>

      {/* =========================================================================
          TAB 1: AGENT PROFILE & PREFERENCES
      ========================================================================= */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left Column: Personal Information Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Personal Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                This contact info &amp; headshot photo will appear on your generated brochure signature blocks.
              </p>
            </div>

            {/* Avatar & Photo Upload Controls */}
            <div className="flex items-center gap-5 pt-1">
              <input
                ref={headshotInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleHeadshotUpload}
              />

              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#06143E] text-white flex items-center justify-center font-heading font-extrabold text-xl shadow-md border-2 border-slate-200 shrink-0">
                {headshotPreview ? (
                  <Image
                    src={headshotPreview}
                    alt="Agent Headshot"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span>IS</span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => headshotInputRef.current?.click()}
                    className="h-9 px-4 rounded-lg bg-[#06143E] hover:bg-[#092167] text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#E8A808]" />
                    <span>Upload Photo</span>
                  </button>

                  {headshotPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setHeadshotPreview(null);
                        showToast("Photo removed");
                      }}
                      className="h-9 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Recommended: Square format (PNG/JPG), min 400x400px.
                </p>
              </div>
            </div>

            {/* Form Fields Grid */}
            <form onSubmit={handleProfileSave} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    FIRST NAME <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.firstName}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    LAST NAME <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.lastName}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    DIRECT EMAIL ADDRESS <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    DIRECT MOBILE NUMBER <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Role / Job Title */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    ROLE / JOB TITLE <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.roleTitle}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        roleTitle: e.target.value,
                      })
                    }
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                  />
                </div>

                {/* Licence / NAEA ID */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    PROFESSIONAL LICENCE / NAEA ID
                  </label>
                  <input
                    type="text"
                    value={profileForm.licenceId}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        licenceId: e.target.value,
                      })
                    }
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  AGENT PROFESSIONAL BIO
                </label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, bio: e.target.value })
                  }
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition resize-y leading-relaxed"
                />
              </div>

              {/* Account Security Box */}
              <div className="pt-2">
                <div className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
                  <div>
                    <h4 className="font-heading font-bold text-xs text-slate-900">
                      Account Security &amp; Password
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Last password change was 3 months ago
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="h-9 px-4 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-semibold text-xs transition cursor-pointer self-start sm:self-auto shadow-2xs"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="submit"
                  className="h-11 px-7 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-sm shadow-sm transition cursor-pointer"
                >
                  Save Changes
                </button>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Profile up to date</span>
                </span>
              </div>
            </form>
          </div>

          {/* Right Column: Signature Preview & Notification Preferences */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 1: Brochure Signature Preview */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900">
                  Brochure Signature Preview
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This is how your agent contact info looks on Page 2 of the PDF.
                </p>
              </div>

              {/* Preview Card matching Figma */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#06143E] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      IS
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-slate-900">
                        {profileForm.firstName} {profileForm.lastName}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        {profileForm.roleTitle}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Prestige Estates UK
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#092167] text-[#FFB800] tracking-wider uppercase">
                    DIRECTOR/VALUER
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-[#E8A808]" />
                    <span>{profileForm.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-[#E8A808]" />
                    <span className="truncate">{profileForm.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Notification Preferences */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900">
                  Notification Preferences
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Control system alerts sent to your email.
                </p>
              </div>

              <div className="space-y-4 pt-1 divide-y divide-slate-100">
                {/* Switch 1 */}
                <div className="flex items-center justify-between gap-4 pt-2">
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Pack Generation Complete
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Receive email copy when a report is ready
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        packComplete: !prev.packComplete,
                      }))
                    }
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      notifications.packComplete ? "bg-[#092167]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                        notifications.packComplete
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Switch 2 */}
                <div className="flex items-center justify-between gap-4 pt-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Low Pack Credits Warning
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Notify when fewer than 3 credits remain
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        lowCredits: !prev.lowCredits,
                      }))
                    }
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      notifications.lowCredits ? "bg-[#092167]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                        notifications.lowCredits
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Switch 3 */}
                <div className="flex items-center justify-between gap-4 pt-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Monthly Billing Statements
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Send Stripe invoices automatically
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        monthlyBilling: !prev.monthlyBilling,
                      }))
                    }
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      notifications.monthlyBilling
                        ? "bg-[#092167]"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                        notifications.monthlyBilling
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Multi-Agent Workspace Tip */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50 p-5 space-y-2 text-xs text-slate-600 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#E8A808]" />
                <span>Multi-Agent Workspace Tip</span>
              </div>
              <p className="leading-relaxed text-slate-500 text-[11px]">
                If your agency has multiple negotiators or valuers, use the &lsquo;Team Members&rsquo; tab to invite more users under your Prestige Estates subscription.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: SUBSCRIPTION & BILLING
      ========================================================================= */}
      {activeTab === "billing" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left Column: Active Subscription & Payment Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: Active Subscription */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 space-y-6 shadow-2xs">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Active Subscription
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your agency is currently on the Pro Tier billed monthly via Stripe.
                </p>
              </div>

              {/* Plan Container matching Figma */}
              <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h4 className="font-heading font-extrabold text-base text-slate-900">
                      Pro Agency Plan
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    £79.00 / month · Renews on Nov 15, 2024
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => showToast("Opening Stripe Plan Upgrade Portal...")}
                  className="h-10 px-5 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-xs shadow-sm transition cursor-pointer self-start sm:self-auto"
                >
                  Upgrade
                </button>
              </div>

              {/* Pack Credits Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">Pack Credits Remaining</span>
                  <span className="text-slate-900 font-bold">14 / 50 Packs</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-[#E8A808] rounded-full"
                    style={{ width: "28%" }}
                  />
                </div>
              </div>

              {/* Low Credits Warning Banner */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 flex items-center gap-2.5 text-xs text-amber-900 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Low credits alert active (Notifying when fewer than 3 remain)
                </span>
              </div>
            </div>

            {/* Card 2: Payment Method & Tax Info */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 space-y-6 shadow-2xs">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Payment Method &amp; Tax Info
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Primary card used for recurring automated billing and invoicing.
                </p>
              </div>

              {/* Credit Card Box */}
              <div className="rounded-xl border border-slate-200 p-4 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-7 rounded bg-[#06143E] text-white flex items-center justify-center font-extrabold text-[10px] tracking-wider shrink-0">
                    VISA
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Visa ending in 4242
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Expires 12/28 · Default Payment Method
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingPayment(true)}
                  className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer shadow-2xs"
                >
                  Edit
                </button>
              </div>

              {/* Billing Entity & Registered Address */}
              <div className="pt-2 border-t border-slate-100 space-y-4 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    BILLING ENTITY &amp; COMPANY
                  </span>
                  <p className="font-semibold text-slate-900 mt-1">
                    {billingEntity}
                  </p>
                  <p className="text-slate-500 text-[11px]">VAT / Tax ID: {vatId}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    REGISTERED BILLING ADDRESS
                  </span>
                  <p className="text-slate-700 mt-1 leading-relaxed">
                    {billingAddress}
                  </p>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="h-9 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-xs transition cursor-pointer"
                  >
                    Update Billing Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stripe Billing History & VAT Support */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 1: Stripe Billing History */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900">
                  Stripe Billing History
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Download official monthly VAT invoices &amp; receipts.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">
                        Invoice #{inv.id}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {inv.date} · {inv.amount}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {inv.status}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          showToast(`Downloading VAT Invoice #${inv.id}...`)
                        }
                        className="h-7 px-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        <span>PDF</span>
                        <Download className="w-3 h-3 text-slate-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Need Custom VAT Receipts? */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-3 shadow-2xs">
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Need Custom VAT Receipts?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                All Stripe invoices include UK VAT calculations. To assign multi-office tax codes or split billing across regional agency branches, contact support.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() =>
                    showToast("Opening billing support request ticket...")
                  }
                  className="text-xs font-bold text-[#092167] hover:text-[#E8A808] transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Contact Billing Support</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: TEAM MEMBERS
      ========================================================================= */}
      {activeTab === "team" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left Column: Active Team Members Table */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 space-y-6 shadow-2xs">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Active Team Members
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Colleagues with access to generate, edit, and export property packs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsInviteModalOpen(true)}
                className="h-10 px-5 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite Member</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[520px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <th className="pb-3 pl-1 font-semibold">Member</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 pr-2 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/70 transition">
                      {/* Member Info */}
                      <td className="py-3.5 pl-1">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${member.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
                          >
                            {member.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-sm">
                              {member.name}
                            </p>
                            <p className="text-slate-500 text-[11px] truncate">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5">
                        <span className="font-semibold text-slate-700">
                          {member.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                                    : member.id
                                )
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu matching Figma */}
                            {activeMenuMemberId === member.id && (
                              <div className="absolute right-0 top-8 z-30 w-48 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 space-y-0.5 text-left animate-in fade-in zoom-in-95 duration-100">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMemberAction("edit", member.id)
                                  }
                                  className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 cursor-pointer transition font-medium"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Edit Role &amp; Access</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMemberAction("deactivate", member.id)
                                  }
                                  className="w-full px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 rounded-lg flex items-center gap-2 cursor-pointer transition font-medium"
                                >
                                  <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Deactivate Member</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMemberAction("remove", member.id)
                                  }
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

          {/* Right Column: Pending Invitations & Workspace Limit */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: Pending Invitations */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
              <div>
                <h4 className="font-heading font-bold text-sm text-slate-900">
                  Pending Invitations
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Invited members who haven&apos;t accepted yet.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {pendingInvites.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {inv.email}
                      </p>
                      <p className="text-[11px] text-slate-400">{inv.sentAt}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        showToast(`Invitation re-sent to ${inv.email}`)
                      }
                      className="h-7 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[11px] transition cursor-pointer shadow-2xs shrink-0"
                    >
                      Resend
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Workspace Limit */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-[#E8A808]" />
                <span>Workspace Limit</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your Pro Tier plan includes up to 5 team members. Upgrade your plan to add more negotiators and maintenance features.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() =>
                    showToast("Opening Subscription Upgrade dialog...")
                  }
                  className="text-xs font-bold text-[#092167] hover:text-[#E8A808] transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Upgrade Subscription</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: REGIONAL COMPLIANCE
      ========================================================================= */}
      {activeTab === "compliance" && (
        <div className="max-w-4xl bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Regional Compliance &amp; Legal Disclaimers
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ensure all generated PDF brochures and portal listings satisfy regional trading standards.
            </p>
          </div>

          <div className="space-y-5 pt-1">
            {/* Region Selector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                PRIMARY TRADING JURISDICTION
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setComplianceRegion("UK")}
                  className={`h-11 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-2 cursor-pointer ${
                    complianceRegion === "UK"
                      ? "border-[#092167] bg-[#092167] text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>🇬🇧 United Kingdom (CPR/Trading Standards)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setComplianceRegion("US")}
                  className={`h-11 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-2 cursor-pointer ${
                    complianceRegion === "US"
                      ? "border-[#092167] bg-[#092167] text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>🇺🇸 United States (NAR/Fair Housing)</span>
                </button>
              </div>
            </div>

            {/* CPR & Legal Toggles */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Mandatory Consumer Protection Regulations (CPR) Disclaimers
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Automatically append verified measurements and tenure disclaimers to exported brochures.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCprDisclaimers(!cprDisclaimers)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    cprDisclaimers ? "bg-[#092167]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                      cprDisclaimers ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Display Professional Ombudsman &amp; NAEA Badge
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Show TPO and Propertymark logos in the footer of all presentation packs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNaeaBadge(!showNaeaBadge)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    showNaeaBadge ? "bg-[#092167]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                      showNaeaBadge ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Custom Disclaimer Textarea */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                CUSTOM AGENCY LEGAL NOTICE
              </label>
              <textarea
                rows={3}
                value={customDisclaimerText}
                onChange={(e) => setCustomDisclaimerText(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition resize-y leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  showToast("Compliance and legal disclaimers saved successfully!")
                }
                className="h-11 px-7 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-sm shadow-sm transition cursor-pointer"
              >
                Save Compliance Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: INVITE NEW TEAM MEMBER (Matching Figma Frame)
      ========================================================================= */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Invite New Team Member
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Invite negotiators, valuers, and administrators to collaborate and generate packs.
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

            {/* Modal Form */}
            <form onSubmit={handleSendInvite} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  EMAIL ADDRESS <span className="text-amber-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="james@prestigeestates.co.uk"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                />
              </div>

              {/* Assign Workspace Role */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  ASSIGN WORKSPACE ROLE <span className="text-amber-500">*</span>
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                >
                  <option value="Negotiator">Negotiator</option>
                  <option value="Valuer">Valuer</option>
                  <option value="Administrator">Administrator</option>
                </select>
                <p className="text-[11px] text-slate-500 leading-relaxed pt-0.5">
                  {inviteRole === "Negotiator" &&
                    "Negotiators can generate and edit property packs, but cannot manage billing or workspace settings."}
                  {inviteRole === "Valuer" &&
                    "Valuers can generate property packs, adjust valuation pricing strategies, and manage valuation PDFs."}
                  {inviteRole === "Administrator" &&
                    "Administrators can invite members, manage agency branding, and export invoices."}
                </p>
              </div>

              {/* Email Checkbox */}
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer pt-1 select-none">
                <input
                  type="checkbox"
                  checked={sendInviteEmailCheckbox}
                  onChange={(e) =>
                    setSendInviteEmailCheckbox(e.target.checked)
                  }
                  className="w-4 h-4 rounded text-[#092167] border-slate-300 focus:ring-[#092167]"
                />
                <span>Send an invitation email with access instructions</span>
              </label>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="h-10 px-5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-xs shadow-sm transition cursor-pointer"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CHANGE PASSWORD
      ========================================================================= */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Change Password
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ensure your account is protected with a strong password.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsPasswordModalOpen(false);
                showToast("Password updated successfully!");
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  CURRENT PASSWORD
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  NEW PASSWORD
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] focus:ring-1 focus:ring-[#092167] transition"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="h-10 px-5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-xs shadow-sm transition cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT PAYMENT / BILLING DETAILS
      ========================================================================= */}
      {(isEditingPayment || isEditingAddress) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  {isEditingPayment ? "Update Payment Method" : "Update Billing Entity"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage Stripe billing credentials and invoices.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditingPayment(false);
                  setIsEditingAddress(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditingPayment(false);
                setIsEditingAddress(false);
                showToast("Billing information updated!");
              }}
              className="space-y-4"
            >
              {isEditingPayment ? (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      CARD NUMBER
                    </label>
                    <input
                      type="text"
                      defaultValue="•••• •••• •••• 4242"
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        EXPIRY
                      </label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        CVC
                      </label>
                      <input
                        type="password"
                        defaultValue="•••"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      BILLING ENTITY
                    </label>
                    <input
                      type="text"
                      value={billingEntity}
                      onChange={(e) => setBillingEntity(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      BILLING ADDRESS
                    </label>
                    <input
                      type="text"
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm"
                    />
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingPayment(false);
                    setIsEditingAddress(false);
                  }}
                  className="h-10 px-5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-bold text-xs shadow-sm transition cursor-pointer"
                >
                  Save Billing Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
