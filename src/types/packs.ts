export type PackStatus =
  | "draft"
  | "generating"
  | "ready"
  | "failed"
  | "live"
  | "archived";

export interface PackBundle {
  id: string;
  name: string;
  packs: number;
  price: number;
  perPackPrice: number;
  savingsPercent?: number;
  isPopular?: boolean;
  badge?: string;
}

export interface PackShareSettings {
  packId: string;
  packTitle: string;
  isEnabled: boolean;
  publicUrl: string;
  qrCodePlaceholder: string;
  expiresAt: string | null;
}

export interface PropertySpecs {
  title: string;
  address: string;
  postcode: string;
  price: string;
  propertyType: string;
  tenure: "Freehold" | "Leasehold" | "Share of Freehold" | "Commonhold";
  epcRating: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "Exempt";
  councilTaxBand: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
  bedrooms: string;
  bathrooms: string;
  size: string;
  parking: string;
  bulletFeatures: string[];
  highlights: string;
}
