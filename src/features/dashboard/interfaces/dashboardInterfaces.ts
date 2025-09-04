export interface OverviewStats {
  totalEvents: number;
  activeEvents: number;
  totalUsers: number;
  totalRevenue: number;
  totalTicketsSold: number;
}
export interface ThisMonthStats {
  events: number;
  tickets: number;
  revenue: number;
  growth: {
    events: number;
    tickets: number;
    revenue: number;
  };
}
export interface DashboardStatsResponse {
  status: "success";
  data: {
    overview: OverviewStats;
    thisMonth: ThisMonthStats;
  };
}
export interface SalesTrend {
  _id: string | number;
  ticketsSold: number;
  revenue: number;
  averagePrice: number;
}
export interface PaymentMethod {
  _id: string;
  count: number;
  revenue: number;
}
export interface TopEvent {
  _id: string;
  ticketsSold: number;
  revenue: number;
  eventTitle: string;
  eventDate: string;
}
export interface SalesSummary {
  totalTickets: number;
  totalRevenue: number;
  averageOrderValue: number;
}
export interface SalesAnalyticsResponse {
  status: "success";
  data: {
    salesTrend: SalesTrend[];
    paymentMethods: PaymentMethod[];
    topEvents: TopEvent[];
    summary: SalesSummary;
  };
}
export interface AgeDistribution {
  _id: string;
  count: number;
}
export interface GenderDistribution {
  _id: string;
  count: number;
}
export interface LocationDistribution {
  _id: string;
  count: number;
}
export interface PurchasePattern {
  _id: number;
  count: number;
}
export interface PurchasePatterns {
  byHour: PurchasePattern[];
  byDayOfWeek: PurchasePattern[];
}
export interface AudienceDemographicsResponse {
  status: "success";
  data: {
    ageDistribution: AgeDistribution[];
    genderDistribution: GenderDistribution[];
    locationDistribution: LocationDistribution[];
    purchasePatterns: PurchasePatterns;
  };
}
export interface EventPerformance {
  _id: string;
  title: string;
  status: string;
  dateTime: { start: string };
  venue: { name: string; city: string };
  capacity: { totalSeats: number };
  pricing: { ticketPrice: number };
  views: number;
  ticketsSold: number;
  revenue: number;
  checkedInCount: number;
  averageRating: number;
  reviewsCount: number;
  occupancyRate: number;
  attendanceRate: number;
}
export interface CategoryPerformance {
  _id: string;
  categoryName: string;
  eventsCount: number;
  totalTicketsSold: number;
  totalRevenue: number;
  averageOccupancy: number;
}
export interface EventPerformanceSummary {
  totalEvents: number;
  totalRevenue: number;
  totalTicketsSold: number;
  averageOccupancy: number;
  averageAttendance: number;
}
export interface EventPerformanceResponse {
  status: "success";
  data: {
    events: EventPerformance[];
    categories: CategoryPerformance[];
    summary: EventPerformanceSummary;
  };
}
export interface ExportAnalyticsParams {
  type: "tickets" | "events";
  startDate?: string;
  endDate?: string;
  eventId?: string;
}
