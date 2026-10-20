import ForgotPasswordForm from "@/components/ui/AuthenticationAllPage/forgotPassword";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Property Pack AI",
  description: "Reset your Property Pack AI workstation password.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[520px] bg-white rounded-[28px] p-12 text-center text-slate-500 shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#092167] mx-auto mb-4" />
          <p className="text-sm">Loading reset form...</p>
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
