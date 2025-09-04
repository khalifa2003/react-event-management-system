import type { Event } from "../../events/interfaces/events";
import type { User } from "../../users/interfaces/userTypes";

export interface AttendeeInfo {
  name: string;
  email: string;
  phone: string;
  age?: number;
  gender?: "male" | "female" | "other";
}

export interface SeatInfo {
  seatNumber: string;
  section?: string;
  row?: string;
}

export interface Pricing {
  originalPrice: number;
  finalPrice: number;
  discount?: number;
  currency?: "EGP" | "USD" | "EUR";
}

export interface Payment {
  paymentMethod: "cash" | "card" | "online" | "bank_transfer";
  transactionId?: string;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  paidAt?: string | Date;
  refundedAt?: string | Date;
}

export interface QrCode {
  data?: string;
  image?: string;
}

export interface CheckIn {
  isCheckedIn: boolean;
  checkedInAt?: string | Date;
  checkedInBy?: string | User;
  gate?: string;
}

export interface Metadata {
  source?: "web" | "mobile" | "admin";
  userAgent?: string;
  ipAddress?: string;
}

export interface Ticket {
  _id: string;
  ticketNumber: string;
  event: Event;
  user: string | User;
  attendeeInfo: AttendeeInfo;
  seatInfo: SeatInfo;
  pricing: Pricing;
  payment: Payment;
  qrCode?: QrCode;
  status: "active" | "used" | "cancelled" | "expired";
  checkIn: CheckIn;
  purchaseDate: string | Date;
  validUntil?: string | Date;
  notes?: string;
  metadata: Metadata;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateTicketData {
  eventId: string;
  ticketNumber: string;
  seatNumber: string;
  attendeeInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    age?: number;
    gender?: "male" | "female" | "other";
  };
  paymentMethod: "cash" | "card" | "online" | "bank_transfer";
  section?: string;
  row?: string;
}

export interface CheckInTicketData {
  qrData: string;
  gate?: string;
}

export interface TicketFilter {
  event?: string;
  status?: "active" | "used" | "cancelled" | "expired";
  paymentStatus?: "pending" | "completed" | "failed" | "refunded";
  checkedIn?: boolean;
}

export interface TicketListResponse {
  status: "success";
  results: number;
  data: Ticket[];
}

export interface TicketStats {
  totalTickets: number;
  activeTickets: number;
  usedTickets: number;
  cancelledTickets: number;
  checkedInTickets: number;
  totalRevenue: number;
}

export interface EventTicketsResponse {
  status: "success";
  results: number;
  stats: TicketStats;
  data: Ticket[];
}

export interface TicketResponse {
  status: "success";
  message?: string;
  data: Ticket;
}

// New interface for available seats
export interface AvailableSeat {
  seatNumber: string;
  section: string;
  row: string;
  isAvailable: boolean;
}

export interface AvailableSeatsResponse {
  status: "success";
  results: number;
  data: AvailableSeat[];
}
