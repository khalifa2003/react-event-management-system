import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { eventService } from '../../events/services/eventService';
import type { Event, EventResponse } from '../../events/interfaces/events';
import type { CreateTicketData, TicketResponse } from '../interfaces/ticket';
import { bookTicket } from '../services/ticketService';

const BookTicket: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>(); // Get eventId from URL
  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<CreateTicketData>({
    eventId: eventId || '',
    seatNumber: '',
    ticketNumber: '',
    paymentMethod: 'card',
    attendeeInfo: {
      name: '',
      email: '',
      phone: '',
      age: undefined,
      gender: undefined,
    },
    section: 'General',
    row: 'A',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch event details
  useEffect(() => {
    if (!eventId) {
      setError('Event ID is missing');
      setIsLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const response: EventResponse = await eventService.getEvent(eventId);
        setEvent(response.data);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch event details');
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  // Handle form input changes
const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  field: string,
  isAttendeeInfo: boolean = false
) => {
  if (isAttendeeInfo) {
    setFormData({
      ...formData,
      attendeeInfo: {
        ...formData.attendeeInfo,
        [field as keyof CreateTicketData['attendeeInfo']]: e.target.value || undefined,
      },
    });
  } else {
    setFormData({
      ...formData,
      [field as keyof CreateTicketData]: e.target.value || undefined,
    });
  }
};

  // Validate form before submission
  const validateForm = () => {
    if (!formData.seatNumber.trim()) return 'Seat number is required';
    if (!formData.attendeeInfo?.name?.trim().toString()) return 'Attendee name is required';
    if (!formData.attendeeInfo?.email?.trim().toString()) return 'Attendee email is required';
    if (!formData.attendeeInfo?.phone?.trim().toString()) return 'Attendee phone is required';
    if (formData.attendeeInfo?.age && (formData.attendeeInfo.age < 1 || formData.attendeeInfo.age > 120))
      return 'Age must be between 1 and 120';
    if (formData.attendeeInfo?.gender && !['male', 'female', 'other'].includes(formData.attendeeInfo.gender))
      return 'Invalid gender selection';
    if (!['cash', 'card', 'online', 'bank_transfer'].includes(formData.paymentMethod))
      return 'Invalid payment method';
    return '';
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response: TicketResponse = await bookTicket(formData);
      setSuccess(`Ticket booked successfully: ${response.data.ticketNumber}`);
      setFormData({
        eventId: eventId || '',
        ticketNumber: '',
        seatNumber: '',
        paymentMethod: 'card',
        attendeeInfo: {
          name: '',
          email: '',
          phone: '',
          age: undefined,
          gender: undefined,
        },
        section: 'General',
        row: 'A',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to book ticket');
    }
  };

  if (isLoading) {
    return <div className="text-center p-6 text-gray-600">Loading event details...</div>;
  }

  if (!event) {
    return <div className="text-center p-6 text-red-500 bg-red-100 rounded">{error}</div>;
  }

  return (
    <div className="container-fluid mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Book Ticket for {event.title}</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-6">{error}</p>}
      {success && <p className="text-green-500 bg-green-100 p-3 rounded mb-6">{success}</p>}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        {/* Event Information */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Event Details</h2>
          <p className="text-gray-600">
            <strong>Event:</strong> {event.title}<br />
            <strong>Date:</strong>{' '}
            {event.dateTime.start
              ? new Date(
                  typeof event.dateTime.start === 'string'
                    ? event.dateTime.start
                    : event.dateTime.start
                ).toLocaleString()
              : 'N/A'}
            <br />
            <strong>Venue:</strong> {event.venue.name}, {event.venue.city}<br />
            <strong>Price:</strong> {event.pricing.ticketPrice} {event.pricing.currency}
            {event.pricing.earlyBird?.price &&
              event.pricing.earlyBird.deadline &&
              new Date(
                typeof event.pricing.earlyBird.deadline === 'string'
                  ? event.pricing.earlyBird.deadline
                  : event.pricing.earlyBird.deadline
              ) > new Date() && (
                <span>
                  {' '}
                  (Early Bird: {event.pricing.earlyBird.price} {event.pricing.currency})
                </span>
              )}
          </p>
        </div>

        {/* Attendee Information */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Attendee Information</h2>
          <div>
            <label htmlFor="attendeeName" className="block mb-1 font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              id="attendeeName"
              value={formData.attendeeInfo?.name || ''}
              onChange={(e) => handleInputChange(e, 'name', true)}
              required
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="attendeeEmail" className="block mb-1 font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="attendeeEmail"
              value={formData.attendeeInfo?.email || ''}
              onChange={(e) => handleInputChange(e, 'email', true)}
              required
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="attendeePhone" className="block mb-1 font-medium text-gray-600">
              Phone
            </label>
            <input
              type="tel"
              id="attendeePhone"
              value={formData.attendeeInfo?.phone || ''}
              onChange={(e) => handleInputChange(e, 'phone', true)}
              required
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="attendeeAge" className="block mb-1 font-medium text-gray-600">
                Age
              </label>
              <input
                type="number"
                id="attendeeAge"
                value={formData.attendeeInfo?.age ?? ''}
                onChange={(e) => handleInputChange(e, 'age', true)}
                min="1"
                max="120"
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="attendeeGender" className="block mb-1 font-medium text-gray-600">
                Gender
              </label>
              <select
                id="attendeeGender"
                value={formData.attendeeInfo?.gender || ''}
                onChange={(e) => handleInputChange(e, 'gender', true)}
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seat Information */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Seat Information</h2>
          <div>
            <label htmlFor="seatNumber" className="block mb-1 font-medium text-gray-600">
              Seat Number
            </label>
            <input
              type="text"
              id="seatNumber"
              value={formData.seatNumber}
              onChange={(e) => handleInputChange(e, 'seatNumber')}
              required
              placeholder="e.g., A12"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="section" className="block mb-1 font-medium text-gray-600">
                Section
              </label>
              <input
                type="text"
                id="section"
                value={formData.section || 'General'}
                onChange={(e) => handleInputChange(e, 'section')}
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="row" className="block mb-1 font-medium text-gray-600">
                Row
              </label>
              <input
                type="text"
                id="row"
                value={formData.row || 'A'}
                onChange={(e) => handleInputChange(e, 'row')}
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <div>
            <label htmlFor="ticketNumber" className="block mb-1 font-medium text-gray-600">
              Ticket Number
            </label>
            <input
              type="text"
              id="ticketNumber"
              value={formData.ticketNumber}
              onChange={(e) => handleInputChange(e, 'ticketNumber')}
              required
              placeholder="e.g., A12"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700">Payment Information</h2>
          <div>
            <label htmlFor="paymentMethod" className="block mb-1 font-medium text-gray-600">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => handleInputChange(e, 'paymentMethod')}
              required
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="card">Card</option>
              <option value="online">Online</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Book Ticket
        </button>
      </form>
    </div>
  );
};

export default BookTicket;