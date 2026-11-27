import React from "react";
import type { Metadata } from "next";
import { DraftNotice } from "@/components/legal/LegalPage";
import { LEGAL } from "@/content/legal";

export const metadata: Metadata = {
  title: "Cookie Policy | Property Pack AI",
  description: "The cookies Property Pack AI sets, and why. Essential cookies only: no advertising or analytics.",
};

/** Every cookie the site sets. Keep in step with src/lib/auth/server.ts and session-token.ts. */
const COOKIES = [
  { name: "pp_session", by: "Property Pack AI", purpose: "Keeps you signed in and decides which pages you can open.", duration: "Until you close the browser, or 30 days with “keep me signed in”" },
  { name: "pp_at", by: "Property Pack AI", purpose: "Short-lived sign-in token, readable only by our server.", duration: "Up to 15 minutes" },
  { name: "pp_rt", by: "Property Pack AI", purpose: "Renews your sign-in without asking for your password again.", duration: "Until you close the browser, or 30 days with “keep me signed in”" },
  { name: "pp_remember", by: "Property Pack AI", purpose: "Remembers whether you chose “keep me signed in”.", duration: "Same as above" },
  { name: "__stripe_mid", by: "Stripe (payments)", purpose: "Fraud prevention when you pay. Set only on payment pages.", duration: "1 year" },
  { name: "__stripe_sid", by: "Stripe (payments)", purpose: "Fraud prevention when you pay. Set only on payment pages.", duration: "30 minutes" },
];

export default function CookiePolicyPage() {
  return (
    <div className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="space-y-3 pb-8 border-b border-slate-200">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#06143E] tracking-tight">Cookie Policy</h1>
        <p className="text-xs sm:text-sm text-slate-500">Last updated: {LEGAL.lastUpdated}</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Property Pack AI uses only <strong>strictly necessary</strong> cookies: the ones that keep you signed in, and the ones Stripe needs to
          prevent fraud when you pay. We do not use advertising, tracking or analytics cookies. Because these cookies are essential to the service,
          the law (UK PECR and UK GDPR) does not require your consent for them, but you are entitled to know what they are.
        </p>
        <DraftNotice />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs sm:text-sm min-w-[620px]">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Cookie</th>
              <th className="px-4 py-3">Set by</th>
              <th className="px-4 py-3">Why</th>
              <th className="px-4 py-3">How long</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {COOKIES.map((c) => (
              <tr key={c.name}>
                <td className="px-4 py-3 font-mono text-xs text-slate-900">{c.name}</td>
                <td className="px-4 py-3">{c.by}</td>
                <td className="px-4 py-3">{c.purpose}</td>
                <td className="px-4 py-3">{c.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-slate-600 leading-relaxed space-y-3">
        <p>
          The site also stores one setting in your browser (not a cookie): that you have seen the cookie notice, so it is not shown again.
        </p>
        <p>
          You can delete or block cookies in your browser settings. If you block the sign-in cookies you will not be able to sign in. Stripe&apos;s
          own policy is at{" "}
          <a href="https://stripe.com/cookie-settings" className="underline text-[#092167]" rel="noopener noreferrer" target="_blank">
            stripe.com/cookie-settings
          </a>
          .
        </p>
        <p>
          To get a copy of your data or delete your account, use <strong>Settings → Agent Profile → Your data and privacy</strong>. For anything
          else, see the <a href="/privacy" className="underline text-[#092167]">Privacy Policy</a> or contact {LEGAL.contactEmail}.
        </p>
      </div>
    </div>
  );
}
