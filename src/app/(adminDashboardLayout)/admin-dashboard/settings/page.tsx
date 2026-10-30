"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/feature/user/userSlice";
import {
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Camera,
  KeyRound,
  Lock,
  User,
  Mail,
  Phone,
} from "lucide-react";

export default function SuperAdminSettingsPage() {
  const dispatch = useDispatch();

  // Profile Form State
  const [ownerName, setOwnerName] = useState("Ishtiaq Sohail");
  const [loginEmail, setLoginEmail] = useState("ishtiaq@propertypack.ai");
  const [escalationPhone, setEscalationPhone] = useState("+44 7911 202528");

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("••••••••••••••••");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Super Admin profile updated successfully!");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      showToast("Passwords do not match. Please verify.");
      return;
    }
    showToast("Master administrator password updated successfully!");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  // Password entropy calculation
  const getEntropyLevel = (pass: string) => {
    if (!pass) return 4; // default preview from figma
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score++;
    return Math.max(1, score);
  };

  const entropyBars = getEntropyLevel(newPassword);

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#06143E] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#E8A808]/40 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#E8A808]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-heading font-medium text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Super Admin Settings &amp; Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Master credentials, platform security, and owner session control
        </p>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Super Admin Profile */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div>
            <h2 className="font-heading font-medium text-lg text-slate-900">
              Super Admin Profile
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Master platform administrator profile and system contact details
            </p>
          </div>

          {/* Avatar Section */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-[#06143E] text-[#E8A808] font-heading font-medium text-xl flex items-center justify-center shrink-0 shadow-inner">
              IS
            </div>
            <div>
              <button
                type="button"
                onClick={() => showToast("Avatar upload feature ready")}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer"
              >
                Change Avatar
              </button>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Owner profile has unrestricted access to all agency databases
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-2">
                Platform Owner Name
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full h-11 px-4 text-sm font-medium bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-2">
                  Super Admin Login Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full h-11 px-4 text-sm font-medium bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-2">
                  Platform Escalation Phone
                </label>
                <input
                  type="text"
                  value={escalationPhone}
                  onChange={(e) => setEscalationPhone(e.target.value)}
                  className="w-full h-11 px-4 text-sm font-medium bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="h-11 px-6 rounded-lg bg-[#E8A808] hover:bg-[#d89b05] text-[#06143E] font-medium text-sm shadow-sm transition cursor-pointer"
              >
                Save Admin Profile
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Change Password & Admin Session */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Card: Change Password */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
            <div>
              <h2 className="font-heading font-medium text-lg text-slate-900">
                Change Password
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ensure high entropy for root administrator authentication
              </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-10 px-3.5 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-10 px-3.5 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition font-mono"
                />

                {/* Password Entropy Meter */}
                <div className="mt-2.5">
                  <div className="flex gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          bar <= entropyBars ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">
                    Maximum entropy (16+ chars, symbols &amp; digits)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 px-3.5 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-10 rounded-lg bg-[#06143E] hover:bg-[#092167] text-white text-xs sm:text-sm font-medium shadow-sm transition cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Card: Admin Session & Sign Out */}
          <div className="bg-white rounded-2xl border border-rose-200/80 shadow-sm p-6 sm:p-7">
            <div>
              <h2 className="font-heading font-medium text-base text-rose-600">
                Admin Session &amp; Sign Out
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Terminate active Super Admin authentication token
              </p>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full h-11 rounded-lg border border-rose-200 bg-rose-50/60 hover:bg-rose-100/70 text-rose-600 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Super Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
