import { type AxiosResponse } from 'axios';
import api from '../../../core/services/api'; // Import the unified axios instance
import type { Category } from '../../categories/interfaces/Category';
import type { CreateEventRequest } from '../interfaces/CreateEventRequest';
import type { EventResponse } from '../interfaces/EventResponse';
import type { EventsResponse } from '../interfaces/EventsResponse';
import type { UpdateEventRequest } from '../interfaces/UpdateEventRequest';

class EventService {
  // Use the unified axios instance with /events appended to the base URL
  private api = api;

  /**
   * Fetches a list of events with optional filtering and pagination.
   * @param params - Filtering and pagination options.
   * @returns A promise that resolves to an EventsResponse.
   */
  async getEvents(params?: {
    page?: number;
    limit?: number;
    category?: string;
    city?: string;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<EventsResponse> {
    const response: AxiosResponse<EventsResponse> = await this.api.get('/events', { params });
    return response.data;
  }

  /**
   * Fetches popular events.
   * @returns A promise that resolves to an EventsResponse.
   */
  async getPopularEvents(): Promise<EventsResponse> {
    const response: AxiosResponse<EventsResponse> = await this.api.get('/events/popular');
    return response.data;
  }

  /**
   * Fetches a single event by ID or slug.
   * @param id - The event ID or slug.
   * @returns A promise that resolves to an EventResponse.
   */
  async getEvent(id: string): Promise<EventResponse> {
    const response: AxiosResponse<EventResponse> = await this.api.get(`/events/${id}`);
    return response.data;
  }

  /**
   * Fetches events created by the authenticated organizer.
   * @returns A promise that resolves to an EventsResponse.
   */
  async getMyEvents(): Promise<EventsResponse> {
    const response: AxiosResponse<EventsResponse> = await this.api.get('/events/organizer/my-events');
    return response.data;
  }

  /**
   * Creates a new event.
   * @param eventData - The event data to create.
   * @returns A promise that resolves to an EventResponse.
   */
  async createEvent(eventData: CreateEventRequest): Promise<EventResponse> {
    const formData = new FormData();
    formData.append('title', eventData.title);
    formData.append('description', eventData.description);
    if (eventData.shortDescription) formData.append('shortDescription', eventData.shortDescription);
    formData.append('category', eventData.category);
    if (eventData.status) formData.append('status', eventData.status);
    formData.append('venue[name]', eventData.venue.name);
    if (eventData.venue.address) formData.append('venue[address]', eventData.venue.address);
    if (eventData.venue.city) formData.append('venue[city]', eventData.venue.city);
    if (eventData.venue.coordinates) {
      formData.append('venue[coordinates][lat]', String(eventData.venue.coordinates.lat));
      formData.append('venue[coordinates][lng]', String(eventData.venue.coordinates.lng));
    }
    formData.append('dateTime[start]', eventData.dateTime.start.toString());
    formData.append('dateTime[end]', eventData.dateTime.end.toString());
    formData.append('pricing[ticketPrice]', String(eventData.pricing.ticketPrice));
    formData.append('pricing[currency]', eventData.pricing.currency);
    if (eventData.pricing.earlyBird) {
      formData.append('pricing[earlyBird][price]', String(eventData.pricing.earlyBird.price));
      formData.append('pricing[earlyBird][deadline]', eventData.pricing.earlyBird.deadline.toString());
    }
    formData.append('capacity[totalSeats]', String(eventData.capacity.totalSeats));
    eventData.tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
    eventData.features.forEach((feature, index) => formData.append(`features[${index}]`, feature));
    formData.append('ageRestriction[minAge]', String(eventData.ageRestriction.minAge));
    if (eventData.ageRestriction.maxAge) {
      formData.append('ageRestriction[maxAge]', String(eventData.ageRestriction.maxAge));
    }
    if (eventData.socialLinks.website) formData.append('socialLinks[website]', eventData.socialLinks.website);
    if (eventData.socialLinks.facebook) formData.append('socialLinks[facebook]', eventData.socialLinks.facebook);
    if (eventData.socialLinks.twitter) formData.append('socialLinks[twitter]', eventData.socialLinks.twitter);
    if (eventData.socialLinks.instagram) formData.append('socialLinks[instagram]', eventData.socialLinks.instagram);
    if (eventData.coverImage instanceof File) {
      formData.append('coverImage', eventData.coverImage);
    }
    if (eventData.images && Array.isArray(eventData.images)) {
      eventData.images.forEach((file) => {
        if (file instanceof File) {
          formData.append('images', file);
        }
      });
    }

    const response: AxiosResponse<EventResponse> = await this.api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  /**
   * Updates an existing event.
   * @param eventData - The event data to update.
   * @returns A promise that resolves to an EventResponse.
   */
  async updateEvent(eventData: UpdateEventRequest): Promise<EventResponse> {
    const { _id, ...updateData } = eventData;
    const formData = new FormData();
    if (updateData.title) formData.append('title', updateData.title);
    if (updateData.description) formData.append('description', updateData.description);
    if (updateData.shortDescription) formData.append('shortDescription', updateData.shortDescription);
    if (updateData.category) formData.append('category', updateData.category);
    if (updateData.status) formData.append('status', updateData.status);
    if (updateData.venue) {
      if (updateData.venue.name) formData.append('venue[name]', updateData.venue.name);
      if (updateData.venue.address) formData.append('venue[address]', updateData.venue.address);
      if (updateData.venue.city) formData.append('venue[city]', updateData.venue.city);
      if (updateData.venue.coordinates) {
        formData.append('venue[coordinates][lat]', String(updateData.venue.coordinates.lat));
        formData.append('venue[coordinates][lng]', String(updateData.venue.coordinates.lng));
      }
    }
    if (updateData.dateTime) {
      if (updateData.dateTime.start) formData.append('dateTime[start]', updateData.dateTime.start.toString());
      if (updateData.dateTime.end) formData.append('dateTime[end]', updateData.dateTime.end.toString());
    }
    if (updateData.pricing) {
      if (updateData.pricing.ticketPrice) formData.append('pricing[ticketPrice]', String(updateData.pricing.ticketPrice));
      if (updateData.pricing.currency) formData.append('pricing[currency]', updateData.pricing.currency);
      if (updateData.pricing.earlyBird) {
        formData.append('pricing[earlyBird][price]', String(updateData.pricing.earlyBird.price));
        formData.append('pricing[earlyBird][deadline]', updateData.pricing.earlyBird.deadline.toString());
      }
    }
    if (updateData.capacity) {
      if (updateData.capacity.totalSeats) formData.append('capacity[totalSeats]', String(updateData.capacity.totalSeats));
    }
    if (updateData.tags) {
      updateData.tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
    }
    if (updateData.features) {
      updateData.features.forEach((feature, index) => formData.append(`features[${index}]`, feature));
    }
    if (updateData.ageRestriction) {
      if (updateData.ageRestriction.minAge) {
        formData.append('ageRestriction[minAge]', String(updateData.ageRestriction.minAge));
      }
      if (updateData.ageRestriction.maxAge) {
        formData.append('ageRestriction[maxAge]', String(updateData.ageRestriction.maxAge));
      }
    }
    if (updateData.socialLinks) {
      if (updateData.socialLinks.website) formData.append('socialLinks[website]', updateData.socialLinks.website);
      if (updateData.socialLinks.facebook) formData.append('socialLinks[facebook]', updateData.socialLinks.facebook);
      if (updateData.socialLinks.twitter) formData.append('socialLinks[twitter]', updateData.socialLinks.twitter);
      if (updateData.socialLinks.instagram) formData.append('socialLinks[instagram]', updateData.socialLinks.instagram);
    }
    if (updateData.coverImage instanceof File) {
      formData.append('coverImage', updateData.coverImage);
    }
    if (updateData.images && Array.isArray(updateData.images)) {
      updateData.images.forEach((file) => {
        if (file instanceof File) {
          formData.append('images', file);
        }
      });
    }

    const response: AxiosResponse<EventResponse> = await this.api.put(`/events/${_id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  /**
   * Deletes an event by ID.
   * @param id - The event ID.
   * @returns A promise that resolves to a success response.
   */
  async deleteEvent(id: string): Promise<{ success: boolean; message: string }> {
    const response = await this.api.delete(`/events/${id}`);
    return response.data;
  }
}

class CategoryService {
  private api = api; // Use the unified axios instance

  /**
   * Fetches all categories.
   * @returns A promise that resolves to an array of categories.
   */
  async getCategories(): Promise<{ data: Category[] }> {
    const response: AxiosResponse<{ data: Category[] }> = await this.api.get('/categories');
    return response.data;
  }
}

export const eventService = new EventService();
export const categoryService = new CategoryService();