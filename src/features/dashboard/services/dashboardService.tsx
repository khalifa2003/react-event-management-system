
import type { AxiosResponse } from "axios";
import type { AudienceDemographicsResponse, DashboardStatsResponse, EventPerformanceResponse, ExportAnalyticsParams, SalesAnalyticsResponse } from "../interfaces/dashboardInterfaces";
import api from "../../../core/services/api";

const dashboardService = {
  getDashboardStats: async (): Promise<AxiosResponse<DashboardStatsResponse>> => {
    const response = await api.get('/analytics/dashboard');
    return response;
  },
  getSalesAnalytics: async ( period: string = '30', groupBy: 'hour' | 'day' | 'week' | 'month' = 'day' ): Promise<AxiosResponse<SalesAnalyticsResponse>> => {
    const response = await api.get('/analytics/sales', { params: { period, groupBy } });
    return response;
  },
  getAudienceDemographics: async ( eventId?: string ): Promise<AxiosResponse<AudienceDemographicsResponse>> => {
    const response = await api.get('/analytics/demographics', { params: { eventId } });
      return response;
  },
  getEventPerformance: async ( eventId?: string, organizerId?: string ): Promise<AxiosResponse<EventPerformanceResponse>> => {
    const response = await api.get('/analytics/events/performance', { params: { eventId, organizerId } });
    return response;
  },
  exportAnalytics: async ( params: ExportAnalyticsParams ): Promise<AxiosResponse<string>> => {
    const response = await api.get('/analytics/export', { params, responseType: 'text' });
    return response;
  },
};

export default dashboardService;