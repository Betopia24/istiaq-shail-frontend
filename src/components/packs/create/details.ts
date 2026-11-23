import type { Pack, PropertyInput } from "@/types/models";
import { parseMoneyToPence } from "@/lib/format";

/** The Step 1 form as typed by the user (all strings); converted to a PropertyInput on save. */
export interface DetailsForm {
  referenceTitle: string;
  transaction: "sale" | "let";
  line1: string;
  town: string;
  postcode: string;
  price: string;
  propertyType: string;
  tenure: string;
  epcRating: string;
  councilTaxBand: string;
  bedrooms: string;
  bathrooms: string;
  sizeSqFt: string;
  parking: string;
  highlights: string[];
  specialNotes: string;
}

export const emptyForm: DetailsForm = {
  referenceTitle: "",
  transaction: "sale",
  line1: "",
  town: "",
  postcode: "",
  price: "",
  propertyType: "",
  tenure: "",
  epcRating: "",
  councilTaxBand: "",
  bedrooms: "",
  bathrooms: "",
  sizeSqFt: "",
  parking: "",
  highlights: [],
  specialNotes: "",
};

const pence = (p: number | null | undefined) => (p == null ? "" : String(Math.round(p / 100)));
const num = (n: number | null | undefined) => (n == null ? "" : String(n));

export function formFromPack(pack: Pack): DetailsForm {
  const p = pack.property ?? {};
  const transaction = p.transaction ?? "sale";
  return {
    referenceTitle: p.referenceTitle ?? "",
    transaction,
    line1: p.address?.line1 ?? "",
    town: p.address?.town ?? "",
    postcode: p.address?.postcode ?? "",
    price: transaction === "let" ? pence(p.rentPcmPence) : pence(p.guidePricePence),
    propertyType: p.propertyType ?? "",
    tenure: p.tenure ?? "",
    epcRating: p.epcRating ?? "",
    councilTaxBand: p.councilTaxBand ?? "",
    bedrooms: num(p.bedrooms),
    bathrooms: num(p.bathrooms),
    sizeSqFt: num(p.sizeSqFt),
    parking: p.parking ?? "",
    highlights: p.highlights ?? [],
    specialNotes: p.specialNotes ?? "",
  };
}

const toInt = (s: string): number | null => {
  const digits = s.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : null;
};
const text = (s: string): string | null => s.trim() || null;

/** Blank fields are sent as null so a cleared value is cleared on the pack. */
export function toPropertyInput(f: DetailsForm): Partial<PropertyInput> & { referenceTitle: string } {
  const money = parseMoneyToPence(f.price) ?? null;
  const body = {
    referenceTitle: f.referenceTitle.trim(),
    transaction: f.transaction,
    market: "UK",
    address: { line1: f.line1.trim(), town: f.town.trim(), postcode: f.postcode.trim().toUpperCase(), country: "GB" },
    guidePricePence: f.transaction === "sale" ? money : null,
    rentPcmPence: f.transaction === "let" ? money : null,
    propertyType: text(f.propertyType),
    bedrooms: toInt(f.bedrooms),
    bathrooms: toInt(f.bathrooms),
    sizeSqFt: toInt(f.sizeSqFt),
    parking: text(f.parking),
    tenure: text(f.tenure),
    epcRating: text(f.epcRating),
    councilTaxBand: text(f.councilTaxBand),
    highlights: f.highlights,
    specialNotes: text(f.specialNotes),
  };
  return body as unknown as Partial<PropertyInput> & { referenceTitle: string };
}
