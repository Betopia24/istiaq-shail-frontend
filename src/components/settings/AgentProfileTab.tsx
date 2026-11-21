"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Check,
  Phone,
  Mail,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export const AgentProfileTab: React.FC = () => {
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

  const [notifications, setNotifications] = useState({
    packComplete: true,
    lowCredits: true,
    monthlyBilling: true,
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleHeadshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setHeadshotPreview(url);
      toast.success("Headshot photo uploaded!");
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile information updated successfully!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
      {/* Left Column: Personal Information Form */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 space-y-6 shadow-2xs">
        <div>
          <h2 className="font-heading font-medium text-lg text-slate-900">
            Personal Information
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            This contact info &amp; headshot photo will appear on your generated
            brochure signature blocks.
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

          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#06143E] text-white flex items-center justify-center font-heading font-medium text-xl shadow-md border-2 border-white/20 shrink-0">
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
                className="h-9 px-4 rounded-lg bg-[#06143E] hover:bg-[#092167] text-white font-medium text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-[#E8A808]" />
                <span>Upload Photo</span>
              </button>

              {headshotPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setHeadshotPreview(null);
                    toast.success("Photo removed");
                  }}
                  className="h-9 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-xs transition cursor-pointer"
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
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                FIRST NAME <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={profileForm.firstName}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, firstName: e.target.value })
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                LAST NAME <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={profileForm.lastName}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, lastName: e.target.value })
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                DIRECT EMAIL ADDRESS <span className="text-amber-500">*</span>
              </label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                DIRECT MOBILE NUMBER <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value })
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                ROLE / JOB TITLE <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={profileForm.roleTitle}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, roleTitle: e.target.value })
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
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
                  Last password update was 3 months ago
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
              className="h-11 px-7 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-medium text-sm shadow-sm transition cursor-pointer"
            >
              Save Changes
            </button>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
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
                  IS
                </div>
                <div>
                  <h4 className="font-heading font-medium text-sm text-slate-900">
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

              <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-[#092167] text-[#FFB800] tracking-wider uppercase">
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
            <h3 className="font-heading font-medium text-sm text-slate-900">
              Notification Preferences
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control system alerts sent to your email.
            </p>
          </div>

          <div className="space-y-4 pt-1 divide-y divide-slate-100">
            <div className="flex items-center justify-between gap-4 pt-2">
              <div>
                <p className="text-xs font-medium text-slate-800">
                  Pack Generation Complete
                </p>
                <p className="text-[11px] text-slate-500">
                  Receive email copy when a brochure is ready
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

            <div className="flex items-center justify-between gap-4 pt-3">
              <div>
                <p className="text-xs font-medium text-slate-800">
                  Low Pack Credits Warning
                </p>
                <p className="text-[11px] text-slate-500">
                  Notify when fewer than 15 credits remain
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

            <div className="flex items-center justify-between gap-4 pt-3">
              <div>
                <p className="text-xs font-medium text-slate-800">
                  Monthly Billing Statements
                </p>
                <p className="text-[11px] text-slate-500">
                  Send Stripe VAT invoices automatically
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
              onSubmit={(e) => {
                e.preventDefault();
                setIsPasswordModalOpen(false);
                toast.success("Password updated successfully!");
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                  CURRENT PASSWORD
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                  NEW PASSWORD
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#092167]"
                />
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
                  className="h-10 px-6 rounded-lg bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-medium text-xs shadow-sm transition cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentProfileTab;
