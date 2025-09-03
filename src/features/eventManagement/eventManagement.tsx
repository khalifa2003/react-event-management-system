import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, Plus, MoreVertical, Music, Car, Palette, BookOpen, Utensils, Laptop, Sparkles, Trophy } from 'lucide-react';
import { eventService } from '../events/services/eventService';
import type { EventListResponse } from '../events/interfaces/events';

interface Event {
  id: string;
  title: string;
  icon: React.ReactNode;
  status: 'upcoming' | 'pending' | 'closed';
  price: number;
  originalPrice?: number;
  attendees: number;
  venue: string;
  date: string;
  time: string;
}

// Map category names to icons
const categoryIconMap: { [key: string]: React.ReactNode } = {
  music: <Music className="w-5 h-5" />,
  car: <Car className="w-5 h-5" />,
  art: <Palette className="w-5 h-5" />,
  literary: <BookOpen className="w-5 h-5" />,
  food: <Utensils className="w-5 h-5" />,
  tech: <Laptop className="w-5 h-5" />,
  fireworks: <Sparkles className="w-5 h-5" />,
  sports: <Trophy className="w-5 h-5" />,
};

const EventManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Status');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response: EventListResponse = await eventService.getEvents();
        const mappedEvents: Event[] = response.data.map(event => {
          const dateTimeStart = new Date(event.dateTime.start);
          const dateTimeEnd = new Date(event.dateTime.end);
          const date = dateTimeStart.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
          const time = `${dateTimeStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} to ${dateTimeEnd.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
          
          // Determine status based on dates
          const now = new Date();
          let status: 'upcoming' | 'pending' | 'closed' = 'upcoming';
          if (now > dateTimeEnd) {
            status = 'closed';
          } else if (now < dateTimeStart) {
            status = 'pending';
          }

          // Map category name to icon (default to Music if unknown)
          const categoryName = event.category.toString() || 'music';
          const icon = categoryIconMap[categoryName] || <Music className="w-5 h-5" />;

          return {
            id: event._id.toString(),
            title: event.title,
            icon,
            status,
            price: event.pricing.ticketPrice,
            originalPrice: event.pricing.earlyBird?.price,
            attendees: event.capacity.totalSeats, // Adjust based on actual attendees field if available
            venue: `${event.venue.name}, ${event.venue.city}`,
            date,
            time,
          };
        });
        setEvents(mappedEvents);
        setIsLoading(false);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? 'Failed to fetch events'
            : 'An unknown error occurred';
        setError(errorMessage);
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const sortedEvents = [...events];
    if (sortBy === 'Date') {
      sortedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === 'Name') {
      sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'Price') {
      sortedEvents.sort((a, b) => a.price - b.price);
    } else {
      // Default: sort by status (upcoming, pending, closed)
      sortedEvents.sort((a, b) => {
        const statusOrder = { upcoming: 1, pending: 2, closed: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
    }
    return sortedEvents.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, events, sortBy]);

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-600';
      case 'pending': return 'bg-green-600';
      case 'closed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const EventCard: React.FC<{ event: Event }> = ({ event }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-gray-600">
            {event.icon}
          </div>
          <h3 className="font-medium text-gray-900">{event.title}</h3>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-green-600 font-medium">₹{event.price}LKR</span>
          {event.originalPrice && (
            <span className="text-red-500 line-through">₹{event.originalPrice}</span>
          )}
          {event.attendees > 0 && (
            <span className="text-blue-500">{event.attendees}</span>
          )}
        </div>
        
        {event.venue && (
          <p className="text-sm text-gray-600">
            <strong>Venue:</strong> {event.venue}
          </p>
        )}
        
        {event.date && (
          <p className="text-sm text-gray-600">
            <strong>Date:</strong> {event.date}
          </p>
        )}
        
        {event.time && (
          <p className="text-sm text-gray-600">
            <strong>Time:</strong> {event.time}
          </p>
        )}
      </div>

      {(event.venue || event.date || event.time) && (
        <div className="flex justify-end">
          <button className="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );

  const StatusFilter: React.FC<{ status: string; count: number }> = ({ status, count }) => (
    <div className="flex items-center gap-2 text-sm font-medium">
      <div className={`w-2 h-2 rounded-full ${getStatusDot(status)}`}></div>
      <span className="capitalize">{status.replace('-', ' ')} Events</span>
      {count > 0 && <span className="text-gray-500">({count})</span>}
    </div>
  );

  const upcomingEvents = filteredEvents.filter(e => e.status === 'upcoming');
  const pendingEvents = filteredEvents.filter(e => e.status === 'pending');
  const closedEvents = filteredEvents.filter(e => e.status === 'closed');

  if (isLoading) {
    return <div className="text-center p-6 text-gray-600">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500 bg-red-100 rounded">{error}</div>;
  }

  return (
    <div className="container-fluid min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Event Management Section</h1>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"><Filter className="w-4 h-4" />Filter</button>
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/create-event')} 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Event
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Attendee Insights</span>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort By:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option>Status</option>
                <option>Date</option>
                <option>Name</option>
                <option>Price</option>
              </select>
            </div>

            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4" />
              Pick Date
            </button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-8 mb-6">
          <StatusFilter status="upcoming" count={upcomingEvents.length} />
          <StatusFilter status="pending" count={pendingEvents.length} />
          <StatusFilter status="closed" count={closedEvents.length} />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventManagement;