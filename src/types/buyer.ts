export interface ViewingInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  fullName: string;
  email: string;
  phone: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
  gdprConsent: boolean;
  createdAt: string;
}

export type BookingModalState = "form" | "submitting" | "success" | "error" | "rate_limited";
