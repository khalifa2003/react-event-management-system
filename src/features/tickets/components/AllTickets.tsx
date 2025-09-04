import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { eventService } from '../../events/services/eventService';
import type { Event, EventResponse } from '../../events/interfaces/events';
import type { EventTicketsResponse, Ticket } from '../interfaces/ticket';
import { checkInTicket, getEventTickets } from '../services/ticketService';

const AllTickets: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<EventTicketsResponse['stats'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch event details and tickets
  useEffect(() => {
    if (!eventId) {
      setError('Event ID is missing');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [eventResponse, ticketsResponse]: [EventResponse, EventTicketsResponse] = await Promise.all([
          eventService.getEvent(eventId),
          getEventTickets(eventId),
        ]);
        setEvent(eventResponse.data);
        setTickets(ticketsResponse.data);
        setStats(ticketsResponse.stats);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch event or tickets');
        setIsLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  // Handle ticket check-in
  const handleCheckIn = async (ticket: Ticket) => {
    setError('');
    setSuccess('');
    try {
      const response = await checkInTicket({ qrData: ticket.qrCode?.data || '' });
      setSuccess(`Ticket ${response.data.ticketNumber} checked in successfully`);
      setTickets(tickets.map(t => 
        t._id === ticket._id ? { ...t, checkIn: { isCheckedIn: true, checkedInAt: new Date() } } : t
      ));
      setStats(prev => prev ? { ...prev, checkedInTickets: prev.checkedInTickets + 1 } : null);
    } catch (err: any) {
      setError(err.message || 'Failed to check in ticket');
    }
  };

  if (isLoading) {
    return <div className="text-center p-6 text-gray-600">Loading tickets...</div>;
  }

  if (!event) {
    return <div className="text-center p-6 text-red-500 bg-red-100 rounded">{error}</div>;
  }

  return (
    <div className="container-fluid mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tickets for {event.title}</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-6">{error}</p>}
      {success && <p className="text-green-500 bg-green-100 p-3 rounded mb-6">{success}</p>}
      {stats && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Ticket Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Total Tickets:</strong> {stats.totalTickets}</p>
            <p><strong>Active Tickets:</strong> {stats.activeTickets}</p>
            <p><strong>Used Tickets:</strong> {stats.usedTickets}</p>
            <p><strong>Cancelled Tickets:</strong> {stats.cancelledTickets}</p>
            <p><strong>Checked-In Tickets:</strong> {stats.checkedInTickets}</p>
            <p><strong>Total Revenue:</strong> {stats.totalRevenue} {event.pricing.currency}</p>
          </div>
        </div>
      )}
      {tickets.length === 0 ? (
        <div className="text-center p-6 text-gray-600 bg-white shadow-lg rounded-lg">
          No tickets found for this event.
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.ticketNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.attendeeInfo.name} ({ticket.attendeeInfo.email})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.seatInfo.seatNumber} ({ticket.seatInfo.section}, Row {ticket.seatInfo.row})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.checkIn.isCheckedIn ? (
                      <span className="text-green-600">
                        Checked In {ticket.checkIn.checkedInAt && new Date(ticket.checkIn.checkedInAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-gray-600">Not Checked In</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {!ticket.checkIn.isCheckedIn && ticket.status === 'active' && (
                      <button
                        onClick={() => handleCheckIn(ticket)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Check In
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllTickets;