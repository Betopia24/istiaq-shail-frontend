"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAppDispatch } from "@/redux/hook";
import { setSession } from "@/feature/user/userSlice";
import { authClient, errorText } from "@/lib/auth/client";
import toast from "react-hot-toast";

export default function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error("Please accept the Terms of Service and Privacy Policy.");
      return;
    }
    if (password.length < 10) {
      toast.error("Use at least 10 characters for your password.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await authClient.signup({
        fullName,
        company: companyName || undefined,
        email,
        password,
        acceptTerms: true,
      });
      dispatch(setSession(user));
      toast.success("Account created successfully!");
      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }, 800);
    } catch (err) {
      // No fallback account: a failed sign-up stays signed out.
      toast.error(errorText(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[520px] bg-white rounded-[28px] p-8 sm:p-10 lg:p-11 shadow-[0_20px_50px_rgba(11,23,54,0.08),0_4px_16px_rgba(11,23,54,0.02)] border border-slate-100/80 transition-all duration-300">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-heading font-medium text-2xl sm:text-[30px] text-[#020618] tracking-tight mb-2">
          Create your account
        </h1>
        <p className="font-sans text-sm sm:text-[14.5px] text-[#62748E] leading-relaxed">
          Start creating professional property marketing packs with AI.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <User className="w-5 h-5 stroke-[1.75]" />
            </div>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Eleanor Vance"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15 transition-all duration-150"
            />
          </div>
        </div>

        {/* Company Name (Optional) */}
        <div>
          <label className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
            Agency / Company Name (Optional)
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Building2 className="w-5 h-5 stroke-[1.75]" />
            </div>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Vance Prestige Properties"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15 transition-all duration-150"
            />
          </div>
        </div>

        {/* Work Email */}
        <div>
          <label className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
            Work Email
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Mail className="w-5 h-5 stroke-[1.75]" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@vanceprestige.com"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15 transition-all duration-150"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Lock className="w-5 h-5 stroke-[1.75]" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full h-12 pl-11 pr-11 rounded-xl border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 tracking-wider focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15 transition-all duration-150"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="w-5 h-5 stroke-[1.75]" />
              ) : (
                <EyeOff className="w-5 h-5 stroke-[1.75]" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Lock className="w-5 h-5 stroke-[1.75]" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full h-12 pl-11 pr-11 rounded-xl border border-slate-200 bg-white font-sans text-sm text-slate-900 placeholder:text-slate-400 tracking-wider focus:outline-none focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15 transition-all duration-150"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <Eye className="w-5 h-5 stroke-[1.75]" />
              ) : (
                <EyeOff className="w-5 h-5 stroke-[1.75]" />
              )}
            </button>
          </div>
        </div>

        {/* Terms and Privacy Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              id="terms-checkbox"
              required
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#0A2168] border-slate-300 focus:ring-2 focus:ring-[#0A2168]/20 focus:ring-offset-0 cursor-pointer"
            />
            <span className="font-sans text-xs text-slate-600 leading-normal">
              I agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                className="font-medium text-[#0A2168] hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                target="_blank"
                className="font-medium text-[#0A2168] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 sm:h-[50px] bg-[#0A2168] hover:bg-[#06143E] active:bg-[#040E2C] text-white font-sans font-medium text-sm sm:text-[15px] rounded-lg shadow-[0_4px_14px_rgba(10,33,104,0.25)] hover:shadow-[0_6px_18px_rgba(10,33,104,0.35)] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Account Created!</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </div>

        {/* Sign In link */}
        <div className="text-center pt-2">
          <p className="font-sans text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#0A2168] hover:text-[#06143E] hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Disclaimer */}
        <div className="text-center pt-2 pb-1">
          <p className="font-sans text-xs text-slate-400 leading-normal max-w-sm mx-auto">
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="text-[#0A2168] font-medium hover:underline"
            >
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-[#0A2168] font-medium hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </form>
    </div>
  );
}
