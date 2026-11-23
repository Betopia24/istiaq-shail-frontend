"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { authClient, ApiError, errorText } from "@/lib/auth/client";
import { formatDate } from "@/lib/format";
import { useAppDispatch } from "@/redux/hook";
import { setSession } from "@/feature/user/userSlice";
import { useLookupInvitationQuery } from "@/redux/api/public/publicApi";
import { ROLE_LABEL, type AuthRole } from "@/types/auth";

const MIN_PASSWORD = 10;

function InviteAcceptForm({
  tokenPromise,
}: {
  tokenPromise: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token } = use(tokenPromise);

  const { data: invite, error, isLoading, refetch } = useLookupInvitationQuery(token);

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const lookupInfo = apiErrorInfo(error);

  useEffect(() => {
    if (!error) return;
    if (lookupInfo.status === 404) router.replace("/invite/expired?reason=not_found");
    else if (lookupInfo.status === 410) {
      router.replace(`/invite/expired?reason=${encodeURIComponent(lookupInfo.code ?? "invite_expired")}`);
    }
  }, [error, lookupInfo.status, lookupInfo.code, router]);

  if (isLoading || lookupInfo.status === 404 || lookupInfo.status === 410) {
    return (
      <div className="w-full max-w-[520px] bg-white rounded-[28px] p-12 text-center text-slate-500 shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#092167] mx-auto mb-4" />
        <p className="text-sm">Validating team invitation...</p>
      </div>
    );
  }
  if (error || !invite) {
    return (
      <div className="w-full max-w-[520px]">
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  const existingAccount = invite.existingAccount === true;
  const agencyName = invite.agencyName ?? "the agency";
  const assignedRole = invite.role ? ROLE_LABEL[invite.role as AuthRole] ?? invite.role : "team member";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!existingAccount) {
      if (password.length < MIN_PASSWORD) {
        setFormError(`Password must be at least ${MIN_PASSWORD} characters`);
        return;
      }
      if (password !== confirmPassword) {
        setFormError("Passwords do not match");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const { user } = await authClient.acceptInvite({
        token,
        ...(existingAccount ? {} : { fullName: fullName.trim() }),
        password,
      });
      dispatch(setSession(user));
      setIsSuccess(true);
      toast.success("Invitation accepted! Welcome to the agency team.");
      router.replace("/agent-dashboard");
    } catch (err) {
      setIsSubmitting(false);
      if (err instanceof ApiError && err.status === 410) {
        router.replace(`/invite/expired?reason=${encodeURIComponent(err.code)}`);
        return;
      }
      if (err instanceof ApiError && err.status === 404) {
        router.replace("/invite/expired?reason=not_found");
        return;
      }
      setFormError(errorText(err));
    }
  };

  return (
    <div className="w-full max-w-[520px] bg-white rounded-[28px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(11,23,54,0.08),0_4px_16px_rgba(11,23,54,0.02)] border border-slate-100/80 transition-all duration-300">
      {/* Header Badge */}
      <div className="w-13 h-13 rounded-2xl bg-[#092167]/5 border border-[#092167]/10 flex items-center justify-center text-[#092167] mb-6">
        <Building2 className="w-6 h-6 stroke-[1.8]" />
      </div>

      {/* Title */}
      <div className="mb-6">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#092167] text-[11px] font-semibold mb-2">
          AGENCY TEAM INVITATION
        </span>
        <h1 className="font-heading font-medium text-2xl sm:text-[28px] text-[#020618] tracking-tight mb-2">
          Join {agencyName}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
          {invite.inviterName ? (
            <>
              <strong>{invite.inviterName}</strong>
              {invite.inviterRole ? ` (${invite.inviterRole})` : ""} has invited you
            </>
          ) : (
            <>You have been invited</>
          )}{" "}
          to join the agency workstation as a <strong>{assignedRole}</strong>.
        </p>
      </div>

      {/* Invitation Metadata Pill */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-6 space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-400">Assigned Email:</span>
          <span className="font-semibold text-slate-900">{invite.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Invitation expires:</span>
          <span className="font-semibold text-slate-900">{formatDate(invite.expiresAt)}</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        {!existingAccount && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Your Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15"
              />
            </div>
          </div>
        )}

        {/* Set Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            {existingAccount ? "Your Current Password" : "Create Workstation Password"}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder={existingAccount ? "Enter your password" : `Minimum ${MIN_PASSWORD} characters`}
              minLength={existingAccount ? undefined : MIN_PASSWORD}
              autoComplete={existingAccount ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        {!existingAccount && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Re-enter password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15"
              />
            </div>
          </div>
        )}

        {formError && (
          <p role="alert" className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5">
            {formError}
          </p>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="w-full h-12 bg-[#0A2168] hover:bg-[#06143E] text-white font-sans font-semibold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Activating Account...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Invitation Accepted!</span>
              </>
            ) : (
              <span>Accept Invitation & Join Team</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

export default function InviteAcceptPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[520px] bg-white rounded-[28px] p-12 text-center text-slate-500 shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#092167] mx-auto mb-4" />
          <p className="text-sm">Validating team invitation...</p>
        </div>
      }
    >
      <InviteAcceptForm tokenPromise={params} />
    </Suspense>
  );
}
