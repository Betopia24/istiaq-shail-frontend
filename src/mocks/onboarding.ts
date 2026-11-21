import { PlanTier, BillingCycle, PlanOrderSummary } from "@/types/onboarding";

export const MOCK_PLANS: PlanTier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Essential AI brochure generation for independent estate agents.",
    priceMonthly: 29,
    priceAnnualMonthly: 24,
    currency: "GBP",
    currencySymbol: "£",
    packsPerMonth: 10,
    seats: 1,
    isPopular: false,
    features: [
      "10 AI property packs per month",
      "1 agency user seat",
      "High-res printable PDF exports",
      "Interactive digital share links",
      "Floor plan & EPC display slots",
      "Standard email support (24h SLA)",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "The complete marketing toolkit for growing estate agency branches.",
    priceMonthly: 79,
    priceAnnualMonthly: 65,
    currency: "GBP",
    currencySymbol: "£",
    packsPerMonth: 50,
    seats: 5,
    isPopular: true,
    badge: "Most Popular",
    features: [
      "50 AI property packs per month",
      "Up to 5 team member seats",
      "Custom agency branding, logos & colours",
      "Buyer viewing booking & lead capture",
      "Area valuation & sold price comparables",
      "Floor plan & EPC AI layout integration",
      "Priority agent support (4h SLA)",
    ],
  },
  {
    id: "team",
    name: "Team",
    tagline: "High-volume generation and governance for multi-branch agencies.",
    priceMonthly: 199,
    priceAnnualMonthly: 165,
    currency: "GBP",
    currencySymbol: "£",
    packsPerMonth: 200,
    seats: 15,
    isPopular: false,
    badge: "Scale & Volume",
    features: [
      "200 AI property packs per month",
      "Up to 15 agency seats & branch roles",
      "Multi-branch brand presets & disclaimers",
      "Portal sync & XML feed export ready",
      "Audit trail & regional compliance presets",
      "Dedicated account manager & phone support",
    ],
  },
];

export function getPlans(): PlanTier[] {
  return MOCK_PLANS;
}

export function getPlanById(id: string): PlanTier {
  const found = MOCK_PLANS.find((p) => p.id === id);
  return found || MOCK_PLANS[1]; // default to professional
}

export function calculateOrderSummary(
  planId: string,
  billingCycle: BillingCycle = "monthly",
): PlanOrderSummary {
  const plan = getPlanById(planId);
  const monthlyPrice = billingCycle === "annual" ? plan.priceAnnualMonthly : plan.priceMonthly;
  const billingMonths = billingCycle === "annual" ? 12 : 1;
  const subtotal = monthlyPrice * billingMonths;
  const vatRate = 0.2; // 20% UK VAT
  const vatAmount = Math.round(subtotal * vatRate * 100) / 100;
  const totalDueToday = Math.round((subtotal + vatAmount) * 100) / 100;

  const renewalDescription =
    billingCycle === "annual"
      ? `£${totalDueToday.toFixed(2)} billed annually (renews in 12 months)`
      : `£${totalDueToday.toFixed(2)} billed monthly (renews in 1 month)`;

  return {
    plan,
    billingCycle,
    subtotal,
    vatRate,
    vatAmount,
    totalDueToday,
    renewalDescription,
  };
}
