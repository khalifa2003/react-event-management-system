import api from "../../../core/services/api";
import type { EventFilter, EventListResponse, EventResponse } from "../interfaces/events";

export const eventService = {
  async getEvents(filters?: EventFilter): Promise<EventListResponse> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/events${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  },

  async getPopularEvents(): Promise<EventListResponse> {
    const response = await api.get('/events/popular');
    return response.data;
  },

  async getMyEvents(status?: string): Promise<EventListResponse> {
    const params = status ? new URLSearchParams({ status }) : undefined;
    const response = await api.get(`/events/organizer/my-events${params ? `?${params.toString()}` : ''}`);
    return response.data;
  },

  async getEvent(id: string): Promise<EventResponse> {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  async createEvent(data: FormData): Promise<Event> {
    const response = await api.post('/events', data);
    return response.data.data;
  },

  async updateEvent(id: string, data: FormData): Promise<Event> {
    const response = await api.put(`/events/${id}`, data);
    return response.data.data;
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },
};