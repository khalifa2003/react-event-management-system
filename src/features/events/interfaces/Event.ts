import type { EventAgeRestriction } from "./EventAgeRestriction";
import type { EventCapacity } from "./EventCapacity";
import type { EventDateTime } from "./EventDateTime";
import type { EventPricing } from "./EventPricing";
import type { EventSocialLinks } from "./EventSocialLinks";
import type { EventVenue } from "./EventVenue";

export interface Event {
  _id?: string;
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  category: string;
  organizer?: string;
  images: string[];
  coverImage: string;
  venue: EventVenue;
  dateTime: EventDateTime;
  pricing: EventPricing;
  capacity: EventCapacity;
  status: "draft" | "published" | "cancelled" | "completed";
  tags: string[];
  features: string[];
  ageRestriction: EventAgeRestriction;
  socialLinks: EventSocialLinks;
  isPopular: boolean;
  isFeatured: boolean;
  views: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  avgRating?: number;
}
