import api from "../../../core/services/api";
import type { CreateTicketData, CheckInTicketData, TicketFilter, TicketListResponse, EventTicketsResponse, TicketResponse } from "../interfaces/ticket";
export const getAllTickets = async ( filter: TicketFilter = {} ): Promise<TicketListResponse> => {
  const response = await api.get<TicketListResponse>('/tickets', { params: filter });
  return response.data;
};
export const getMyTickets = async ( filter: TicketFilter = {} ): Promise<TicketListResponse> => {
  const response = await api.get<TicketListResponse>(`/tickets/my-tickets`, { params: filter });
  return response.data;
};
export const getTicket = async (id: string): Promise<TicketResponse> => {
  const response = await api.get<TicketResponse>(`/tickets/${id}`);
  return response.data;
};
export const bookTicket = async ( ticketData: CreateTicketData ): Promise<TicketResponse> => {
  const response = await api.post<TicketResponse>(`/tickets/book`, ticketData );
  return response.data;
};
export const cancelTicket = async (id: string): Promise<TicketResponse> => {
  const response = await api.patch<TicketResponse>(`/tickets/${id}/cancel`);
  return response.data;
};
export const checkInTicket = async ( checkInData: CheckInTicketData ): Promise<TicketResponse> => {
  const response = await api.post<TicketResponse>( `/tickets/checkin`, checkInData );
  return response.data;
};
export const getEventTickets = async ( eventId: string, filter: TicketFilter = {} ): Promise<EventTicketsResponse> => {
  const response = await api.get<EventTicketsResponse>(`/tickets/event/${eventId}`, { params: filter });
  return response.data;
};
