"use client";

import { PersonalDataSection } from "@/components/settings/PrivacySettings";
import React, { useState } from "react";
import { Check, Phone, Mail, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { CardGridSkeleton } from "@/components/ui/skeletons/CardGridSkeleton";
import { errorText } from "@/lib/auth/client";
import { initials } from "@/lib/format";
import { ROLE_LABEL } from "@/types/auth";
import { useAppSelector } from "@/redux/hook";
import {
  useChangePasswordMutation,
  useGetBrandingQuery,
  useGetProfileQuery,
  useUpdateNotificationsMutation,
  useUpdateProfileMutation,
} from "@/redux/api/agency/agencyApi";

type NotificationKey = "packComplete" | "lowCredits" | "billingStatements" | "newLead";

interface ProfileForm {
  fullName: string;
  phone: string;
  licenceId: string;
  bio: string;
}

export const AgentProfileTab: React.FC = () => {
  const sessionUser = useAppSelector((st) => st.user.user);
  const profile = useGetProfileQuery();
  const branding = useGetBrandingQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [updateNotifications, { isLoading: isTogglingNotification }] = useUpdateNotificationsMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [profileForm, setProfileForm] = useState<ProfileForm | null>(null);
  const [seededFrom, setSeededFrom] = useState<unknown>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (profile.data && seededFrom !== profile.data) {
    setSeededFrom(profile.data);
    setProfileForm({
      fullName: profile.data.fullName ?? "",
      phone: profile.data.phone ?? "",
      licenceId: profile.data.licenceId ?? "",
      bio: profile.data.bio ?? "",
    });
  }

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm) return;
    setFieldErrors({});
    try {
      await updateProfile(profileForm).unwrap();
      toast.success("Profile information updated successfully!");
    } catch (err) {
      const info = apiErrorInfo(err);
      if (info.status === 422) setFieldErrors(info.fields);
      toast.error(errorText(err));
    }
  };

  const toggleNotification = async (key: NotificationKey) => {
    const current = profile.data?.notifications?.[key] ?? false;
    try {
      await updateNotifications({ [key]: !current }).unwrap();
    } catch (err) {
      toast.error(errorText(err));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});
    try {
      await changePassword(passwordForm).unwrap();
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      toast.success("Password updated. Other devices have been signed out.");
    } catch (err) {
      const info = apiErrorInfo(err);
      if (info.status === 400) setPasswordErrors({ currentPassword: "Your current password is incorrect." });
      else if (info.status === 422) setPasswordErrors(info.fields);
      else toast.error(errorText(err));
    }
  };

  if (profile.isLoading) return <CardGridSkeleton count={2} />;
  if (profile.error) return <ErrorState error={profile.error} onRetry={() => profile.refetch()} />;
  if (!profileForm || !profile.data) return null;

  const notifications = profile.data.notifications ?? {};
  const displayName = profileForm.fullName || profile.data.fullName || "";
  const roleLabel = sessionUser?.role ? ROLE_LABEL[sessionUser.role] : "";
  const isDirty =
    profileForm.fullName !== (profile.data.fullName ?? "") ||
    profileForm.phone !== (profile.data.phone ?? "") ||
    profileForm.licenceId !== (profile.data.licenceId ?? "") ||
    profileForm.bio !== (profile.data.bio ?? "");
  const fieldErr = (k: string) =>
    fieldErrors[k] ? <p className="text-[11px] text-rose-600">{fieldErrors[k]}</p> : null;

  return (
    <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
      {/* Left Column: Personal Information Form */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 space-y-6 shadow-2xs">
        <div>
          <h2 className="font-heading font-medium text-lg text-slate-900">
            Personal Information
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            This contact info will appear on your generated
            brochure signature blocks.
          </p>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-5 pt-1">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#06143E] text-white flex items-center justify-center font-heading font-medium text-xl shadow-md border-2 border-white/20 shrink-0">
            <span>{initials(displayName)}</span>
          </div>
        </div>

        {/* Form Fields Grid */}
        <form onSubmit={handleProfileSave} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
              FULL NAME <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              value={profileForm.fullName}
              onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
            />
            {fieldErr("fullName")}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                DIRECT EMAIL ADDRESS <span className="text-amber-500">*</span>
              </label>
              <input
                type="email"
                readOnly
                value={profile.data.email ?? ""}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm focus:outline-none cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                DIRECT MOBILE NUMBER
              </label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value })
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
              />
              {fieldErr("phone")}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                AGENCY ROLE
              </label>
              <input
                type="text"
                readOnly
                value={roleLabel}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm focus:outline-none cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                PROFESSIONAL LICENCE / NAEA ID
              </label>
              <input
                type="text"
                value={profileForm.licenceId}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, licenceId: e.target.value })
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
              AGENT PROFESSIONAL BIO
            </label>
            <textarea
              rows={3}
              value={profileForm.bio}
              onChange={(e) =>
                setProfileForm({ ...profileForm, bio: e.target.value })
              }
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167] transition resize-y leading-relaxed"
            />
          </div>

          {/* Account Security Box */}
          <div className="pt-2">
            <div className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
              <div>
                <h4 className="font-heading font-medium text-xs text-slate-900">
                  Account Security &amp; Password
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Changing your password signs you out of your other devices
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="h-9 px-4 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-medium text-xs transition cursor-pointer self-start sm:self-auto shadow-2xs"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSaving || !isDirty}
              className="disabled:opacity-60 disabled:cursor-not-allowed h-11 px-7 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-medium text-sm shadow-sm transition cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            {!isDirty && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Profile up to date</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Right Column: Signature Preview & Notification Preferences */}
      <div className="lg:col-span-5 space-y-6">
        {/* Card 1: Brochure Signature Preview */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
          <div>
            <h3 className="font-heading font-medium text-sm text-slate-900">
              Brochure Signature Preview
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              This is how your agent contact info looks on Page 2 of the PDF.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#06143E] text-white flex items-center justify-center font-medium text-sm shrink-0">
                  {initials(displayName)}
                </div>
                <div>
                  <h4 className="font-heading font-medium text-sm text-slate-900">
                    {displayName}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">{roleLabel}</p>
                  {branding.data?.agencyName && (
                    <p className="text-[11px] text-slate-400">{branding.data.agencyName}</p>
                  )}
                </div>
              </div>

              {roleLabel && (
                <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-[#092167] text-[#FFB800] tracking-wider uppercase">
                  {roleLabel}
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-[#E8A808]" />
                <span>{profileForm.phone || "No phone number"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-[#E8A808]" />
                <span className="truncate">{profile.data.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Notification Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
          <div>
            <h3 className="font-heading font-medium text-sm text-slate-900">
              Notification Preferences
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control system alerts sent to your email.
            </p>
          </div>

          <div className="space-y-4 pt-1 divide-y divide-slate-100">
            {(
              [
                ["packComplete", "Pack Generation Complete", "Receive email copy when a brochure is ready"],
                ["lowCredits", "Low Pack Credits Warning", "Notify when your pack credits are running low"],
                ["billingStatements", "Monthly Billing Statements", "Send Stripe VAT invoices automatically"],
                ["newLead", "New Viewing Request", "Email me when a buyer requests a viewing"],
              ] as [NotificationKey, string, string][]
            ).map(([key, title, hint], i) => (
              <div key={key} className={`flex items-center justify-between gap-4 ${i === 0 ? "pt-2" : "pt-3"}`}>
                <div>
                  <p className="text-xs font-medium text-slate-800">{title}</p>
                  <p className="text-[11px] text-slate-500">{hint}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!notifications[key]}
                  aria-label={title}
                  disabled={isTogglingNotification}
                  onClick={() => toggleNotification(key)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 disabled:opacity-60 ${
                    notifications[key] ? "bg-[#092167]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                      notifications[key] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-medium text-lg text-slate-900">
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
              onSubmit={handlePasswordSubmit}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                  CURRENT PASSWORD
                </label>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-[11px] text-rose-600">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                  NEW PASSWORD
                </label>
                <input
                  type="password"
                  required
                  minLength={10}
                  autoComplete="new-password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="At least 10 characters"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
                />
                {passwordErrors.newPassword && (
                  <p className="text-[11px] text-rose-600">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="h-10 px-5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="h-10 px-6 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-medium text-xs shadow-sm transition cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                >
                  {isChangingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
      <PersonalDataSection />
    </div>
  );
};

export default AgentProfileTab;
