"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, CheckCircle2, AlertCircle, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { OtpInput } from "@/components/ui/OtpInput";
import toast from "react-hot-toast";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const email = emailParam ? decodeURIComponent(emailParam) : "eleanor@vanceprestige.com";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(45);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleVerify = (codeToVerify?: string) => {
    const code = codeToVerify || otp.join("");
    if (code.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    // Simulate verification
    setTimeout(() => {
      setIsSubmitting(false);
      // Simulate error code condition for demonstration
      if (code === "000000") {
        setErrorMessage("Invalid or expired verification code. Please check and try again.");
        toast.error("Invalid verification code");
        return;
      }

      setIsSuccess(true);
      toast.success("Email verified successfully!");

      // Route to plan selection
      setTimeout(() => {
        router.push(`/onboarding/plan?email=${encodeURIComponent(email)}`);
      }, 900);
    }, 600);
  };

  const handleResend = () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsResending(false);
      setResendTimer(45);
      setOtp(["", "", "", "", "", ""]);
      toast.success(`A new verification code has been sent to ${email}`);
    }, 500);
  };

  return (
    <div className="w-full max-w-[520px] bg-white rounded-[28px] p-8 sm:p-10 lg:p-11 shadow-[0_20px_50px_rgba(11,23,54,0.08),0_4px_16px_rgba(11,23,54,0.02)] border border-slate-100/80 transition-all duration-300">
      {/* Icon Badge */}
      <div className="w-13 h-13 rounded-2xl bg-[#092167]/5 border border-[#092167]/10 flex items-center justify-center text-[#092167] mb-6">
        <Mail className="w-6 h-6 stroke-[1.8]" />
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading font-medium text-2xl sm:text-[28px] text-[#020618] tracking-tight mb-2">
          Verify your email
        </h1>
        <p className="font-sans text-sm text-[#62748E] leading-relaxed">
          We have sent a 6-digit confirmation code to{" "}
          <span className="font-semibold text-slate-800 break-all">{email}</span>.
          Enter it below to confirm your account.
        </p>
      </div>

      {/* Live Region for Status & Errors */}
      <div aria-live="polite" className="min-h-[24px] mb-4">
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
        {isSuccess && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Email confirmed! Preparing your plan selection...</span>
          </div>
        )}
      </div>

      {/* OTP Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify();
        }}
        className="space-y-6"
      >
        <div>
          <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Security Code (6 Digits)
          </label>
          <OtpInput
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (errorMessage) setErrorMessage(null);
            }}
            isError={!!errorMessage}
            disabled={isSubmitting || isSuccess}
            onComplete={(code) => handleVerify(code)}
          />
        </div>

        {/* Quick Demo Helper */}
        <div className="text-center">
          <p className="text-[11px] text-slate-400">
            Demo tip: Type <span className="font-mono text-slate-600">123456</span> to continue, or <span className="font-mono text-slate-600">000000</span> to test error handling.
          </p>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting || isSuccess || otp.join("").length < 6}
            className="w-full h-11 sm:h-[50px] bg-[#0A2168] hover:bg-[#06143E] active:bg-[#040E2C] text-white font-sans font-medium text-sm sm:text-[15px] rounded-xl shadow-[0_4px_14px_rgba(10,33,104,0.25)] hover:shadow-[0_6px_18px_rgba(10,33,104,0.35)] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Verified</span>
              </>
            ) : (
              <span>Confirm & Continue</span>
            )}
          </button>
        </div>

        {/* Resend Countdown */}
        <div className="text-center pt-2">
          {resendTimer > 0 ? (
            <p className="font-sans text-xs sm:text-sm text-slate-500">
              Did not receive the code? Resend in{" "}
              <span className="font-semibold text-slate-700">{resendTimer}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center gap-1.5 font-sans text-xs sm:text-sm font-semibold text-[#092167] hover:text-[#06143E] hover:underline cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
              <span>Resend verification code</span>
            </button>
          )}
        </div>

        {/* Back Link */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 font-sans text-xs sm:text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Wrong email address? Back to Sign up</span>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[520px] bg-white rounded-[28px] p-12 text-center text-slate-500 shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#092167] mx-auto mb-4" />
          <p className="text-sm">Loading email verification...</p>
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
