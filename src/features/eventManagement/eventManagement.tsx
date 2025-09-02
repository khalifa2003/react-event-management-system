import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Plus, MoreVertical, Music, Car, Palette, BookOpen, Utensils, Laptop, Sparkles, Trophy } from 'lucide-react';

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

const EventManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Status');

  const events: Event[] = [
    {
      id: '1',
      title: 'Colombo Music Festival',
      icon: <Music className="w-5 h-5" />,
      status: 'upcoming',
      price: 5000,
      originalPrice: 2500,
      attendees: 1800,
      venue: 'Open Air Theater, Colombo',
      date: '12 April 2025',
      time: '09:00PM to 11:30PM'
    },
    {
      id: '2',
      title: 'Lanka Supercar Show',
      icon: <Car className="w-5 h-5" />,
      status: 'pending',
      price: 3000,
      originalPrice: 2500,
      attendees: 0,
      venue: 'Lanka Supercar Show',
      date: '15 April 2025',
      time: '09:00PM to 11:30PM'
    },
    {
      id: '3',
      title: 'Rock & Roll Night',
      icon: <Music className="w-5 h-5" />,
      status: 'closed',
      price: 3000,
      originalPrice: 1500,
      attendees: 1500,
      venue: 'Open Air Theater, Colombo',
      date: '03 March 2025',
      time: '09:00PM to 11:30PM'
    },
    {
      id: '4',
      title: 'Galle Literary Fair',
      icon: <BookOpen className="w-5 h-5" />,
      status: 'upcoming',
      price: 2000,
      originalPrice: 1500,
      attendees: 600,
      venue: 'Open Air Theater, Galle',
      date: '14 April 2025',
      time: '09:00AM to 12:00PM'
    },
    {
      id: '5',
      title: 'Kandy Art Exhibition',
      icon: <Palette className="w-5 h-5" />,
      status: 'pending',
      price: 4000,
      originalPrice: 750,
      attendees: 0,
      venue: 'Open Air Theater, Colombo',
      date: '19 April 2025',
      time: '09:00PM to 11:30PM'
    },
    {
      id: '6',
      title: 'Sri Lanka Food Fest',
      icon: <Utensils className="w-5 h-5" />,
      status: 'closed',
      price: 2000,
      originalPrice: 700,
      attendees: 600,
      venue: 'Open Air Theater, Colombo',
      date: '02 March 2025',
      time: '09:00PM to 11:30PM'
    },
    {
      id: '7',
      title: 'Tech Lanka Expo 2025',
      icon: <Laptop className="w-5 h-5" />,
      status: 'upcoming',
      price: 1000,
      originalPrice: 800,
      attendees: 400,
      venue: 'Open Air Theater, Colombo',
      date: '18 April 2025',
      time: '10:00AM to 01:30PM'
    },
    {
      id: '8',
      title: "New Year's Eve Fireworks",
      icon: <Sparkles className="w-5 h-5" />,
      status: 'pending',
      price: 1500,
      originalPrice: 1500,
      attendees: 0,
      venue: 'Open Air Theater, Colombo',
      date: '24 April 2025',
      time: '09:00PM to 11:30PM'
    },
    {
      id: '9',
      title: 'Colombo Music Festival',
      icon: <Music className="w-5 h-5" />,
      status: 'closed',
      price: 5000,
      originalPrice: 1500,
      attendees: 1100,
      venue: 'Open Air Theater, Colombo',
      date: '24 February 2025',
      time: '09:00PM to 11:30PM'
    },
    {
      id: '10',
      title: 'Jaffna Music Festival',
      icon: <Music className="w-5 h-5" />,
      status: 'upcoming',
      price: 0,
      originalPrice: 0,
      attendees: 0,
      venue: '',
      date: '',
      time: ''
    },
    {
      id: '11',
      title: 'Matara Car Show',
      icon: <Car className="w-5 h-5" />,
      status: 'upcoming',
      price: 0,
      originalPrice: 0,
      attendees: 0,
      venue: '',
      date: '',
      time: ''
    },
    {
      id: '12',
      title: 'Cricket Festival',
      icon: <Trophy className="w-5 h-5" />,
      status: 'upcoming',
      price: 0,
      originalPrice: 0,
      attendees: 0,
      venue: '',
      date: '',
      time: ''
    }
  ];

  const filteredEvents = useMemo(() => {
    return events.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, events]);

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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