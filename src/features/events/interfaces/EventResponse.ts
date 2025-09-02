import type { Event } from "./Event";

export interface EventResponse {
  data: Event;
  success: boolean;
  message?: string;
}