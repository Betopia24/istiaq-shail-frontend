import React, { Suspense } from "react";
import { CookieNotice } from "@/components/ui/CookieNotice";
import type { Metadata } from "next";
import ReduxProvider from "@/redux/ReduxProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Property Pack AI — Professional Property Marketing with AI",
  description:
    "Generate comprehensive, high-converting property marketing packs, descriptions, visual assets, and analytics powered by AI.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#E8A808]/30 selection:text-[#06143E] antialiased">
        <ReduxProvider>
          <Toaster position="top-right" />
          <Suspense fallback={null}>{children}</Suspense>
          <CookieNotice />
        </ReduxProvider>
      </body>
    </html>
  );
}
