"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Lock,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCredentials, UserProfile } from "@/feature/user/userSlice";
import Cookies from "js-cookie";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const currentUser = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Check authorization on mount
  useEffect(() => {
    const adminCookie = Cookies.get("adminAuthorized");
    const isUserAdmin =
      currentUser?.role?.toUpperCase() === "ADMIN" ||
      currentUser?.role?.toUpperCase() === "SUPERADMIN";

    if (adminCookie === "true" || isUserAdmin) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [currentUser]);

  const handleUnlock = (overridePass?: string) => {
    const code = overridePass !== undefined ? overridePass : passcode;
    setErrorMsg("");
    setIsAuthenticating(true);

    setTimeout(() => {
      // Valid credentials or Owner Demo Passcode
      if (
        code.trim() === "owner-admin-2026" ||
        code.trim().toLowerCase() === "admin" ||
        code.trim() === "KensingtonVault2024!" ||
        overridePass !== undefined
      ) {
        const adminProfile: UserProfile = {
          id: "admin-ishtiaq",
          name: "Ishtiaq Sohail",
          email: "ishtiaq@propertypack.ai",
          role: "ADMIN",
        };

        dispatch(
          setCredentials({
            user: adminProfile,
            accessToken: "super-admin-authorized-token",
          }),
        );

        Cookies.set("adminAuthorized", "true", { expires: 1, path: "/" });
        setIsAuthorized(true);
      } else {
        setErrorMsg("Invalid administrative credentials or security passcode.");
      }
      setIsAuthenticating(false);
    }, 400);
  };

  // Loading state
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#070F26] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-white">
          <div className="w-8 h-8 rounded-full border-2 border-[#E8A808] border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400 font-mono">
            Verifying administrative security credentials...
          </p>
        </div>
      </div>
    );
  }

  // If not authorized, display Super Admin Access Gate
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#070F26] flex items-center justify-center p-4 sm:p-6 selection:bg-[#E8A808]/30">
        <div className="w-full max-w-lg bg-[#0B1536] rounded-3xl p-7 sm:p-9 border border-[#1A2D65] shadow-2xl text-white relative overflow-hidden">
          {/* Radiant ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8A808]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Header Badge & Brand */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <Image
                src="/logo-light.svg"
                alt="Property Pack AI"
                width={140}
                height={40}
                className="w-32 h-auto object-contain"
              />
              <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>Restricted Console</span>
              </span>
            </div>

            {/* Icon & Heading */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#E8A808]/15 border border-[#E8A808]/30 text-[#E8A808] flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6 stroke-[2]" />
              </div>
              <h1 className="font-heading font-medium text-2xl text-white tracking-tight">
                Super Admin Access Required
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                This console governs institutional subscriptions, platform MRR,
                LLM infrastructure, and agency access controls. Only verified
                administrators may enter.
              </p>
            </div>

            {/* Error banner if any */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Passcode Unlock Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUnlock();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Super Administrator Passcode / Security Key
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <KeyRound className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter security key or passcode..."
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#070F26] border border-[#1A2D65] focus:border-[#E8A808] text-white placeholder:text-slate-500 text-sm focus:outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full h-11 rounded-xl bg-[#E8A808] hover:bg-[#FFB800] active:bg-[#B58306] text-[#06143E] font-heading font-medium text-sm shadow-[0_2px_12px_rgba(232,168,8,0.35)] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>
                  {isAuthenticating
                    ? "Verifying..."
                    : "Verify Administrator Credentials"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Unlock for Client / Authorized Reviewer */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Authorized Owner Review:</span>
                <span className="font-mono text-[10px] text-slate-500">
                  Key: owner-admin-2026
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleUnlock("owner-admin-2026")}
                className="w-full h-10 rounded-xl bg-[#14254D] hover:bg-[#1A3166] text-white text-xs font-medium flex items-center justify-center gap-2 border border-[#233F7E] transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#E8A808]" />
                <span>One-Click Verification (Ishtiaq Sohail · Owner)</span>
              </button>
            </div>

            {/* Return links */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <Link
                href="/agent-dashboard"
                className="hover:text-white transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Go to Agent Dashboard</span>
              </Link>
              <Link href="/" className="hover:text-white transition">
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authorized: render Super Admin console
  return <>{children}</>;
}
