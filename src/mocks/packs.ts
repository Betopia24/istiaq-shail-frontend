import { PackBundle, PackShareSettings } from "@/types/packs";

export const MOCK_PACK_BUNDLES: PackBundle[] = [
  {
    id: "bundle-5",
    name: "5 Packs Top-up",
    packs: 5,
    price: 60,
    perPackPrice: 12,
    isPopular: false,
  },
  {
    id: "bundle-15",
    name: "15 Packs Top-up",
    packs: 15,
    price: 150,
    perPackPrice: 10,
    savingsPercent: 17,
    isPopular: true,
    badge: "Most Popular",
  },
  {
    id: "bundle-50",
    name: "50 Packs Bulk Saver",
    packs: 50,
    price: 375,
    perPackPrice: 7.5,
    savingsPercent: 37,
    isPopular: false,
    badge: "Best Value",
  },
];

export function getPackBundles(): PackBundle[] {
  return MOCK_PACK_BUNDLES;
}

export function getShareSettings(packId: string = "pack-1", title: string = "16 Gorse Drive"): PackShareSettings {
  return {
    packId,
    packTitle: title,
    isEnabled: true,
    publicUrl: `https://propertypack.ai/property/${packId}`,
    qrCodePlaceholder: `QR-CODE-${packId}`,
    expiresAt: null,
  };
}
