import React, { useState, useEffect } from 'react';
import { cancelTicket, getMyTickets } from '../services/ticketService';
import type { Ticket, TicketListResponse } from '../interfaces/ticket';

const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user's tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response: TicketListResponse = await getMyTickets({ status: 'active' });
        setTickets(response.data);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch your tickets');
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Handle ticket cancellation
  const handleCancel = async (ticketId: string) => {
    setError('');
    setSuccess('');
    try {
      const response = await cancelTicket(ticketId);
      setSuccess(`Ticket ${response.data.ticketNumber} cancelled successfully`);
      setTickets(tickets.map(ticket => 
        ticket._id === ticketId ? { ...ticket, status: 'cancelled' } : ticket
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to cancel ticket');
    }
  };

  if (isLoading) {
    return <div className="text-center p-6 text-gray-600">Loading your tickets...</div>;
  }

  return (
    <div className="container-fluid mx-auto p-6 bg-gray-100 min-h-screen rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Tickets</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-6">{error}</p>}
      {success && <p className="text-green-500 bg-green-100 p-3 rounded mb-6">{success}</p>}
      {tickets.length === 0 ? (
        <div className="text-center p-6 text-gray-600 bg-white shadow-lg rounded-lg">
          You have no active tickets.
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
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Date
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
                    {typeof ticket.event === 'string' ? ticket.event : ticket.event.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.seatInfo.seatNumber} ({ticket.seatInfo.section}, Row {ticket.seatInfo.row})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(ticket.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {ticket.status === 'active' && (
                      <button
                        onClick={() => handleCancel(ticket._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Cancel
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

export default MyTickets;