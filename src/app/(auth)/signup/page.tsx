import SignUpForm from "@/components/ui/AuthenticationAllPage/signUp";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Property Pack AI",
  description: "Start creating professional property marketing packs with AI.",
};

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[520px] bg-white rounded-[28px] p-12 text-center text-slate-500 shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#092167] mx-auto mb-4" />
          <p className="text-sm">Loading signup form...</p>
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
