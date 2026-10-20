import LoginForm from "@/components/ui/AuthenticationAllPage/login";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Property Pack AI",
  description: "Sign in to continue to your Property Pack AI institutional workstation.",
};

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[520px] bg-white rounded-[28px] p-12 text-center text-slate-500 shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#092167] mx-auto mb-4" />
          <p className="text-sm">Loading workstation sign-in...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
