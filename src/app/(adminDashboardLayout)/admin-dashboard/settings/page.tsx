"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useLogout } from "@/components/auth/SessionBootstrap";
import { LogOut, ScrollText } from "lucide-react";
import { useChangePasswordMutation, useGetProfileQuery, useUpdateProfileMutation } from "@/redux/api/agency/agencyApi";
import { useGetAuditLogQuery } from "@/redux/api/admin/adminApi";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/skeletons/TableSkeleton";
import { errorText } from "@/lib/auth/client";
import { formatDateTime, initials } from "@/lib/format";

const AUDIT_PAGE_SIZE = 10;

function auditOutcome(data: Record<string, unknown> | null | undefined) {
  const outcome = data?.outcome;
  return typeof outcome === "string" ? outcome : "–";
}

function ProfileCard() {
  const profile = useGetProfileQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
  const [form, setForm] = useState<{ fullName: string; phone: string } | null>(null);
  const [seededFrom, setSeededFrom] = useState<unknown>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (profile.data && seededFrom !== profile.data) {
    setSeededFrom(profile.data);
    setForm({ fullName: profile.data.fullName ?? "", phone: profile.data.phone ?? "" });
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setFieldErrors({});
    try {
      await updateProfile({ fullName: form.fullName, phone: form.phone }).unwrap();
      toast.success("Super Admin profile updated");
    } catch (err) {
      setFieldErrors(apiErrorInfo(err).fields);
      toast.error(errorText(err));
    }
  };

  return (
    <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
      <div>
        <h2 className="font-heading font-medium text-lg text-slate-900">Super Admin Profile</h2>
        <p className="text-xs text-slate-500 mt-0.5">Master platform administrator profile and system contact details</p>
      </div>

      {profile.isLoading ? (
        <div className="mt-6 space-y-4 animate-pulse">
          <div className="h-16 w-16 rounded-full bg-slate-200" />
          <div className="h-11 bg-slate-100 rounded-lg" />
          <div className="h-11 bg-slate-100 rounded-lg" />
        </div>
      ) : profile.isError || !form ? (
        <div className="mt-6">
          <ErrorState error={profile.error} onRetry={profile.refetch} />
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-[#06143E] text-[#E8A808] font-heading font-medium text-xl flex items-center justify-center shrink-0 shadow-inner">
              {initials(form.fullName)}
            </div>
            <p className="text-[11px] text-slate-400">Owner profile has unrestricted access to all agency databases</p>
          </div>

          <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-2">
                Platform Owner Name
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full h-11 px-4 text-sm font-medium bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition"
              />
              {fieldErrors.fullName && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-2">
                  Super Admin Login Email
                </label>
                <input
                  type="email"
                  value={profile.data?.email ?? ""}
                  readOnly
                  className="w-full h-11 px-4 text-sm font-medium bg-slate-100 border border-slate-200 rounded-lg text-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-2">
                  Platform Escalation Phone
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full h-11 px-4 text-sm font-medium bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition"
                />
                {fieldErrors.phone && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.phone}</p>}
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="h-11 px-6 rounded-lg bg-[#E8A808] hover:bg-[#d89b05] text-[#06143E] font-medium text-sm shadow-sm transition disabled:opacity-60 cursor-pointer"
              >
                {saving ? "Saving..." : "Save Admin Profile"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

function AuditLogCard() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } = useGetAuditLogQuery({ page, limit: AUDIT_PAGE_SIZE });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / AUDIT_PAGE_SIZE));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="p-6 sm:p-7 border-b border-slate-100">
        <h2 className="font-heading font-medium text-lg text-slate-900">Audit Log</h2>
        <p className="text-xs text-slate-500 mt-0.5">Every administrator action on the platform</p>
      </div>
      {isLoading ? (
        <TableSkeleton rows={5} columns={5} className="border-0 rounded-none" />
      ) : isError ? (
        <div className="p-6">
          <ErrorState error={error} onRetry={refetch} />
        </div>
      ) : items.length === 0 ? (
        <div className="p-6">
          <EmptyState icon={ScrollText} title="No audit entries yet" description="Administrator actions will be recorded here." />
        </div>
      ) : (
        <>
          <div className={`overflow-x-auto ${isFetching ? "opacity-70" : ""}`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Actor</th>
                  <th className="px-6 py-3">Target</th>
                  <th className="px-6 py-3">Outcome</th>
                  <th className="px-6 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {items.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-3 font-mono text-xs text-slate-900">{entry.action}</td>
                    <td className="px-6 py-3 text-slate-700">{entry.actor?.fullName ?? entry.actor?.email ?? "System"}</td>
                    <td className="px-6 py-3 text-xs text-slate-500 font-mono">
                      {entry.targetType ? `${entry.targetType}${entry.targetId ? `:${entry.targetId}` : ""}` : "–"}
                    </td>
                    <td className="px-6 py-3 text-slate-700 capitalize">{auditOutcome(entry.data)}</td>
                    <td className="px-6 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDateTime(entry.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              <strong>{total}</strong> entries
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 px-3 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
              >
                Previous
              </button>
              <span>
                Page {page} of {pageCount}
              </span>
              <button
                type="button"
                disabled={page >= pageCount}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 px-3 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function SuperAdminSettingsPage() {
  const signOut = useLogout();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});
    if (newPassword !== confirmPassword) {
      setPasswordErrors({ confirmPassword: "Passwords do not match." });
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success("Password updated. Other sessions have been signed out.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const fields = apiErrorInfo(err).fields;
      setPasswordErrors(fields);
      toast.error(errorText(err));
    }
  };

  const handleLogout = () => {
    void signOut();
  };

  const getEntropyLevel = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 10) score++;
    if (pass.length >= 14) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const entropyBars = getEntropyLevel(newPassword);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading font-semibold text-2xl text-slate-900 tracking-tight">
          Super Admin Settings &amp; Security
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Master credentials, platform security, and owner session control
        </p>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <ProfileCard />

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
                  required
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-10 px-3.5 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition font-mono"
                />
                {passwordErrors.currentPassword && <p className="text-[11px] text-rose-600 mt-1">{passwordErrors.currentPassword}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  required
                  minLength={10}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-10 px-3.5 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition font-mono"
                />

                {passwordErrors.newPassword && <p className="text-[11px] text-rose-600 mt-1">{passwordErrors.newPassword}</p>}
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
                    Use at least 10 characters; longer with symbols &amp; digits is stronger
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
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 px-3.5 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:border-[#092167] focus:bg-white transition font-mono"
                />
                {passwordErrors.confirmPassword && <p className="text-[11px] text-rose-600 mt-1">{passwordErrors.confirmPassword}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full h-10 rounded-lg bg-[#06143E] hover:bg-[#092167] text-white text-xs sm:text-sm font-medium shadow-sm transition disabled:opacity-60 cursor-pointer"
                >
                  {changingPassword ? "Updating..." : "Update Password"}
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

      <AuditLogCard />
    </div>
  );
}
