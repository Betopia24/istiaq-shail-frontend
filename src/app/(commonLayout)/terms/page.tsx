import React from "react";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { TERMS } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of Service | Property Pack AI",
  description: "The terms for using Property Pack AI: the service, plans and credits, your responsibilities, and how to end it.",
};

export default function TermsOfServicePage() {
  return <LegalPage title="Terms of Service" sections={TERMS} />;
}
