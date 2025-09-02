import type { CreateEventRequest } from "./CreateEventRequest";

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  _id: string;
}
