import { ViewingInquiry } from "@/types/buyer";

export const MOCK_INQUIRIES: ViewingInquiry[] = [
  {
    id: "inq-1",
    propertyId: "16-gorse-drive",
    propertyTitle: "16 Gorse Drive, Chorlton, Manchester",
    fullName: "David Harrison",
    email: "david.harrison@gmail.com",
    phone: "+44 7911 123456",
    bookingDate: "2026-11-28",
    bookingTime: "11:00 AM",
    notes: "Interested in the garden and school catchment area.",
    gdprConsent: true,
    createdAt: "2026-11-21T10:30:00Z",
  },
];

export function getAgencyContact(propertyId: string = "16-gorse-drive") {
  return {
    propertyId,
    agencyName: "Prestige Estates UK",
    agentName: "Eleanor Vance",
    role: "Senior Partner & Valuer",
    phone: "+44 (0) 20 7946 0912",
    email: "eleanor@prestigeestates.co.uk",
    address: "45 Kensington High Street, London, W8 5SE",
  };
}
