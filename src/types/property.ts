export interface RoomDimensionItem {
  name: string;
  dimension: string;
}

export interface CommuteItem {
  metric: string;
  label: string;
  highlight?: boolean;
}

export interface PropertyPackData {
  id: string;
  ref: string;
  agency: {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    logoText?: string;
  };
  agent: {
    name: string;
    role: string;
    phone: string;
    email: string;
    initials: string;
    avatarBg?: string;
  };
  title: string;
  address: string;
  area: string;
  postcode: string;
  price: string;
  priceQualifier: string;
  statusBadge: string;
  propertyTypeBadge: string;
  specs: {
    bedrooms: string;
    bathrooms: string;
    sqft: string;
    sqm: string;
    propertyType: string;
    epcRating: string;
    tenure: string;
  };
  images: {
    hero: string;
    kitchen: string;
    garden: string;
    masterSuite: string;
    gallery: { src: string; label: string }[];
  };
  overview: string;
  keyFeatures: string[];
  roomDimensions: {
    groundFloor: {
      wingName: string;
      items: RoomDimensionItem[];
    };
    firstFloor: {
      wingName: string;
      items: RoomDimensionItem[];
    };
  };
  floorPlans: {
    groundFloorArea: string;
    firstFloorArea: string;
  };
  commute: CommuteItem[];
  complianceNotice: string;
}

export const DEFAULT_PROPERTY_PACK: PropertyPackData = {
  id: "16-gorse-drive",
  ref: "#PP-8492",
  agency: {
    name: "PRESTIGE ESTATES",
    tagline: "MANCHESTER & CHESHIRE",
    phone: "+44 161 496 0200",
    email: "manchester@prestigeestates.co.uk",
  },
  agent: {
    name: "Ishtiaq Sohail",
    role: "Senior Negotiator • Prestige Estates UK",
    phone: "+44 161 496 0200",
    email: "ishtiaq@prestigeestates.co.uk",
    initials: "IS",
    avatarBg: "bg-[#E8A808]",
  },
  title: "16 Gorse Drive, Chorlton",
  address: "16 Gorse Drive",
  area: "Chorlton-cum-Hardy, Manchester",
  postcode: "M21 8XQ",
  price: "£750,000",
  priceQualifier: "Guide Price • Freehold",
  statusBadge: "FOR SALE",
  propertyTypeBadge: "DETACHED RESIDENCE",
  specs: {
    bedrooms: "4 Bedrooms",
    bathrooms: "2 Bathrooms",
    sqft: "2,150 sq ft",
    sqm: "199 sq m",
    propertyType: "Detached Residence",
    epcRating: "EPC: B",
    tenure: "Freehold Tenure",
  },
  images: {
    hero: "/landing/villa-dusk.jpg",
    kitchen: "/landing/semi-detached-wilmslow.jpg",
    garden: "/landing/villa-dusk.jpg",
    masterSuite: "/landing/townhouse-dusk.jpg",
    gallery: [
      { src: "/landing/villa-dusk.jpg", label: "Front Exterior & Heated Pool" },
      { src: "/landing/semi-detached-wilmslow.jpg", label: "Kitchen & Dining Wing" },
      { src: "/landing/townhouse-dusk.jpg", label: "Master Suite & Private Balcony" },
      { src: "/landing/agent-keys.jpg", label: "Entrance Hall & Staircase" },
      { src: "/landing/villa-dusk.jpg", label: "South-Facing Landscaped Lawn" },
      { src: "/landing/semi-detached-wilmslow.jpg", label: "Principal En-Suite Wet Room" },
    ],
  },
  overview:
    "An exceptional four-bedroom executive detached family residence situated in one of Chorlton's most sought-after tree-lined enclaves. Fully modernized throughout while retaining magnificent period proportions, featuring an expansive open-plan kitchen and entertaining wing with bi-fold glazing opening directly onto a secluded, landscaped south-facing garden.",
  keyFeatures: [
    "Bespoke German fitted kitchen with integrated Neff appliances and quartz island",
    "Expansive south-facing landscaped lawn with paved porcelain entertaining patio",
    "Principal suite with bespoke dressing cabinetry and porcelain en-suite wet room",
    "Multi-vehicle block paved driveway plus integrated garage with EV charger provision",
    "Prime catchment area for outstanding primary and grammar schools",
  ],
  roomDimensions: {
    groundFloor: {
      wingName: "Ground Floor Entertaining Wing",
      items: [
        { name: "Open-Plan Living & Dining", dimension: "8.4m x 4.8m (27'6\" x 15'9\")" },
        { name: "Bespoke German Kitchen", dimension: "4.6m x 3.9m (15'1\" x 12'9\")" },
        { name: "Formal Reception / Snug", dimension: "4.2m x 3.8m (13'9\" x 12'5\")" },
        { name: "Utility Room & Cloakroom / WC", dimension: "2.4m x 1.8m (7'10\" x 5'11\")" },
      ],
    },
    firstFloor: {
      wingName: "First Floor Accommodations",
      items: [
        { name: "Principal Bedroom Suite", dimension: "5.2m x 4.1m (17'1\" x 13'5\")" },
        { name: "Bedroom Two (Double)", dimension: "4.1m x 3.6m (13'5\" x 11'10\")" },
        { name: "Bedroom Three", dimension: "3.8m x 3.2m (12'5\" x 10'6\")" },
        { name: "Bedroom Four / Executive Study", dimension: "3.1m x 2.6m (10'2\" x 8'6\")" },
      ],
    },
  },
  floorPlans: {
    groundFloorArea: "108 sq m",
    firstFloorArea: "91 sq m",
  },
  commute: [
    { metric: "0.3 Miles", label: "Chorlton Tram Metrolink" },
    { metric: "4 Mins", label: "Beech Road Boutiques" },
    { metric: "Outstanding", label: "Ofsted Primary Catchment", highlight: true },
    { metric: "14 Mins", label: "Manchester City Centre" },
  ],
  complianceNotice:
    "COMPLIANCE NOTICE (UK CPR 2008) | [CPR: 1] These particulars do not constitute any part of an offer or contract. All measurements, fixtures, and room layouts are approximate (circa 16). No person in the employment of Prestige Estates UK has any authority to make or give any representation or warranty in relation to this property. [CPR: 1]",
};

/**
 * Helper to fetch a property pack dynamically:
 * Checks localStorage first (e.g. if edited in Pack Editor or saved by AI generator),
 * then falls back to DEFAULT_PROPERTY_PACK.
 * When backend API is ready, an RTK Query endpoint hook (e.g. useGetPropertyPackQuery(id))
 * can seamlessly replace or hydrate this helper.
 */
export function getPropertyPackById(id: string): PropertyPackData {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`pp_pack_${id}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading pack from localStorage", e);
    }
  }
  return DEFAULT_PROPERTY_PACK;
}

export function savePropertyPack(data: PropertyPackData): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`pp_pack_${data.id}`, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving pack to localStorage", e);
    }
  }
}
