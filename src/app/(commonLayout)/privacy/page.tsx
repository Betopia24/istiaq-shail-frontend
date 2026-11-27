import React from "react";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { PRIVACY } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy | Property Pack AI",
  description: "How Property Pack AI collects, uses and protects personal data, and how to use your rights under UK GDPR.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="How we collect, use and protect personal data for estate agents, their teams and the buyers who contact them, and how to use your rights."
      sections={PRIVACY}
    />
  );
}
