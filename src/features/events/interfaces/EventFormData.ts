export interface EventFormData {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  ticketPrice: string;
  currency: "EGP" | "USD" | "EUR";
  totalSeats: string;
  tags: string;
  minAge: string;
  website: string;
  earlyBirdPrice: number | "";
  earlyBirdDeadline: string;
  features: string;
  maxAge: number | "";
  facebook: string;
  twitter: string;
  instagram: string;
}
