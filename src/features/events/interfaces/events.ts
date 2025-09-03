export interface Venue {
  name: string;
  address: string;
  city: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
}

export interface PartialVenue {
  name?: string;
  address?: string;
  city?: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
}

export interface DateTime {
  start: Date | string;
  end: Date | string;
}

export interface PartialDateTime {
  start?: Date | string;
  end?: Date | string;
}

export interface Pricing {
  ticketPrice: number;
  currency?: "EGP" | "USD" | "EUR";
  earlyBird?: {
    price?: number;
    deadline?: Date | string;
  };
}

export interface PartialPricing {
  ticketPrice?: number;
  currency?: "EGP" | "USD" | "EUR";
  earlyBird?: {
    price?: number;
    deadline?: Date | string;
  };
}

export interface Capacity {
  totalSeats: number;
  availableSeats: number;
  soldSeats?: number;
}

export interface AgeRestriction {
  minAge?: number;
  maxAge?: number;
}

export interface SocialLinks {
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  profileImg?: string;
  phone?: string;
}

export interface Review {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  user: User;
  createdAt: Date;
}

export interface Ticket {
  _id: string;
  event: string;
  payment: {
    paymentStatus: string;
  };
}

export interface Event {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string | Category;
  organizer: string | User;
  coverImage: string;
  venue: Venue;
  dateTime: DateTime;
  pricing: Pricing;
  capacity: Capacity;
  status: "draft" | "published" | "cancelled" | "completed";
  tags?: string[];
  features?: string[];
  ageRestriction?: AgeRestriction;
  socialLinks?: SocialLinks;
  isPopular?: boolean;
  isFeatured?: boolean;
  views?: number;
  createdAt: Date;
  updatedAt: Date;
  reviews?: Review[];
  tickets?: Ticket[];
  avgRating?: number;
}

export interface CreateEventData {
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  coverImage: string;
  venue: Venue;
  dateTime: DateTime;
  pricing: Pricing;
  capacity: {
    totalSeats: number;
    availableSeats: number;
    soldSeats: number;
  };
  status?: "draft" | "published";
  tags?: string;
  features?: string;
  ageRestriction?: AgeRestriction;
  socialLinks?: SocialLinks;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  coverImage?: string;
  venue?: PartialVenue;
  dateTime?: PartialDateTime;
  pricing?: PartialPricing;
  capacity?: {
    totalSeats: number;
    availableSeats: number;
    soldSeats?: number;
  };
  status?: "draft" | "published" | "cancelled" | "completed";
  tags?: string;
  features?: string;
  ageRestriction?: AgeRestriction;
  socialLinks?: SocialLinks;
  isPopular?: boolean;
  isFeatured?: boolean;
}

export interface EventFilter {
  category?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: "draft" | "published" | "cancelled" | "completed";
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface EventListResponse {
  status: "success";
  results: number;
  total: number;
  page: number;
  pages: number;
  data: Event[];
}

export interface EventResponse {
  status: "success";
  data: Event;
}

export interface CategoriesResponse {
  status: "success";
  results: number;
  data: Category[];
}
