import type { components } from "./api";

/** API models, straight from the contract (src/types/api.ts is generated: `npm run types:frontend` in the backend). */
type S = components["schemas"];
export type Pack = S["Pack"];
export type PackSummary = S["PackSummary"];
export type PackStatus = S["PackStatus"];
export type PropertyInput = S["PropertyInput"];
export type Photo = S["Photo"];
export type Section = S["Section"];
export type SectionKey = S["SectionKey"];
export type SectionVersion = S["SectionVersion"];
export type PdfStatus = S["PdfStatus"];
export type PortalExport = S["PortalExport"];
export type ShareLink = S["ShareLink"];
export type Valuation = S["Valuation"];
export type Comparable = S["Comparable"];
export type Strategy = S["Strategy"];
export type Plan = S["Plan"];
export type Subscription = S["Subscription"];
export type Invoice = S["Invoice"];
export type Lead = S["Lead"];
export type LeadList = S["LeadList"];
export type LeadDetail = S["LeadDetail"];
export type LeadStatus = S["LeadStatus"];
export type TeamList = S["TeamList"];
export type Member = S["Member"];
export type Invitation = S["Invitation"];
export type MemberRole = S["MemberRole"];
export type InvitationLookup = S["InvitationLookup"];
export type Branding = S["Branding"];
export type Profile = S["Profile"];
export type PublicPack = S["PublicPack"];
export type Address = S["Address"];
export type PackBundle = S["PackBundle"];
export type CreditBalances = S["CreditBalances"];
export type AdminOverview = S["AdminOverview"];
export type AdminUser = S["AdminUser"];
export type AdminAgency = S["AdminAgency"];
export type AdminAgencyList = S["AdminAgencyList"];
export type AdminAgencyCredits = S["AdminAgencyCredits"];
export type AdminUserList = S["AdminUserList"];
export type AdminSubscription = S["AdminSubscription"];
export type AdminSubscriptionList = S["AdminSubscriptionList"];
export type AuditList = S["AuditList"];

export interface DashboardSummary {
  totalPacks: number;
  /** Monthly allowance plus pay-as-you-go. */
  creditsRemaining: number;
  allowanceCredits: number;
  paygCredits: number;
  planAllocation: number;
  packsUsedThisPeriod: number;
  livePacks: number;
  draftPacks: number;
  readyPacks: number;
  recent: PackSummary[];
}

export interface PackListQuery {
  status?: PackStatus;
  q?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
  page?: number;
  pageSize?: number;
}

export interface PackList {
  items: PackSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Compliance {
  redressScheme: string | null;
  redressMembershipNo: string | null;
  cmpScheme: string | null;
  cmpNumber: string | null;
  hmrcAmlNumber: string | null;
  /** Buyer enquiries are anonymised this many months after they arrive; 0 = keep them. */
  leadRetentionMonths?: number;
  [key: string]: unknown;
}

export interface NotificationSettings {
  packComplete: boolean;
  lowCredits: boolean;
  billingStatements: boolean;
  newLead: boolean;
}

export interface JobStarted {
  jobId: string;
  status: string;
  creditsRemaining: number;
}
