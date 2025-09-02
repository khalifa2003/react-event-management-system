import type { EventAgeRestriction } from "./EventAgeRestriction";
import type { EventCapacity } from "./EventCapacity";
import type { EventDateTime } from "./EventDateTime";
import type { EventPricing } from "./EventPricing";
import type { EventSocialLinks } from "./EventSocialLinks";
import type { EventVenue } from "./EventVenue";

export interface CreateEventRequest {
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  images: File[];
  coverImage: File;
  venue: EventVenue;
  dateTime: EventDateTime;
  pricing: EventPricing;
  capacity: Omit<EventCapacity, "availableSeats" | "soldSeats">;
  status?: "draft" | "published";
  tags: string[];
  features: string[];
  ageRestriction: EventAgeRestriction;
  socialLinks: EventSocialLinks;
}
