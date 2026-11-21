export interface PlanTier {
  id: "starter" | "professional" | "team";
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnualMonthly: number; // monthly equivalent when billed annually
  currency: "GBP";
  currencySymbol: "£";
  packsPerMonth: number;
  seats: number;
  isPopular?: boolean;
  badge?: string;
  features: string[];
}

export type BillingCycle = "monthly" | "annual";

export interface PlanOrderSummary {
  plan: PlanTier;
  billingCycle: BillingCycle;
  subtotal: number;
  vatRate: number; // e.g. 0.20 for 20% UK VAT
  vatAmount: number;
  totalDueToday: number;
  renewalDescription: string;
}

export interface PaymentDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  email: string;
  country: string;
  addressLine1: string;
  city: string;
  postcode: string;
}
