import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, MoreVertical, Music, Car, Palette, BookOpen, Utensils, Laptop, Sparkles, Trophy } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { eventService } from '../services/eventService';
import type { Category, EventListResponse } from '../interfaces/events';
import { categoryService } from '../../categories/services/categoryService';
import type { CategoriesResponse } from '../../categories/interfaces/Category';
import { getUser } from '../../auth/services/auth.service';

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
  const [sortBy, setSortBy] = useState('createdAt'); // Maps to backend sort field
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<{
    category: string;
    city: string;
    startDate: Date | null;
    endDate: Date | null;
    minPrice: string;
    maxPrice: string;
    status: string;
  }>({
    category: '',
    city: '',
    startDate: null,
    endDate: null,
    minPrice: '',
    maxPrice: '',
    status: '',
  });
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    pages: number;
  }>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const navigate = useNavigate();
  const user = getUser();
  const userRole = user?.role || "user"; 

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesResponse: CategoriesResponse = await categoryService.getCategories();
      setCategories(categoriesResponse.data);
    };
    fetchCategories();
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params: any = {
          search: searchQuery || undefined,
          category: filters.category || undefined,
          city: filters.city || undefined,
          startDate: filters.startDate ? filters.startDate.toISOString() : undefined,
          endDate: filters.endDate ? filters.endDate.toISOString() : undefined,
          minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
          status: userRole === 'admin' || userRole === 'manager' ? filters.status || undefined : 'published',
          sort: sortBy === 'Status' ? 'status' : sortBy.toLowerCase(),
          page: pagination.page,
          limit: pagination.limit,
        };
        const response: EventListResponse = await eventService.getEvents(params);
        const mappedEvents: Event[] = response.data.map(event => {
          const dateTimeStart = new Date(event.dateTime.start);
          const dateTimeEnd = new Date(event.dateTime.end);
          const date = dateTimeStart.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
          const time = `${dateTimeStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} to ${dateTimeEnd.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
          
          const now = new Date();
          let status: 'upcoming' | 'pending' | 'closed' = 'upcoming';
          if (now > dateTimeEnd) status = 'closed';
          else if (now < dateTimeStart) status = 'pending';

          const categoryName = event.category?.toString() || 'music';
          const icon = categoryIconMap[categoryName] || <Music className="w-5 h-5" />;

          return {
            id: event._id.toString(),
            title: event.title,
            icon,
            status,
            price: event.pricing.ticketPrice,
            originalPrice: event.pricing.earlyBird?.price,
            attendees: event.capacity.totalSeats,
            venue: `${event.venue.name}, ${event.venue.city}`,
            date,
            time,
          };
        });
        setEvents(mappedEvents);
        setPagination({
          ...pagination,
          total: response.total,
          pages: response.pages,
        });
        setIsLoading(false);
      } catch (err: unknown) {
        setError('Failed to fetch events ' + err);
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [searchQuery, filters, sortBy, pagination.page, pagination.limit, userRole]);

  const filteredEvents = useMemo(() => {
    const sortedEvents = [...events];
    if (sortBy === 'Date') {
      sortedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === 'Name') {
      sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'Price') {
      sortedEvents.sort((a, b) => a.price - b.price);
    }
    return sortedEvents;
  }, [events, sortBy]);

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-600';
      case 'pending': return 'bg-green-600';
      case 'closed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = async () => {
      if (selectedEvent) {
        try {
          await eventService.deleteEvent(selectedEvent.id);
          setEvents(events.filter(e => e.id !== selectedEvent.id));
          setSelectedEvent(null);
          setIsOpen(false);
        } catch (err) {
          setError('Failed to delete event '+ err);
        }
      }
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-gray-600">{event.icon}</div>
            <h3 className="font-medium text-gray-900">{event.title}</h3>
          </div>
          <button onClick={() => setIsOpen(true)} className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-600 font-medium">₹{event.price}LKR</span>
            {event.originalPrice && <span className="text-red-500 line-through">₹{event.originalPrice}</span>}
            {event.attendees > 0 && <span className="text-blue-500">{event.attendees}</span>}
          </div>
          {event.venue && <p className="text-sm text-gray-600"><strong>Venue:</strong> {event.venue}</p>}
          {event.date && <p className="text-sm text-gray-600"><strong>Date:</strong> {event.date}</p>}
          {event.time && <p className="text-sm text-gray-600"><strong>Time:</strong> {event.time}</p>}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => navigate(`/events/${event.id}`)}
            className="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Event Actions</h3>
                {userRole === "user" && (
                  <button
                    onClick={() => { navigate("/tickets/book/"+event.id); setIsOpen(false); }}
                    className="w-full mb-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Book Ticket
                  </button>
                )}
                {(userRole === "admin" || userRole === "manager") && (
                  <>
                    <button
                      onClick={() => { navigate(`/events/${event.id}/edit`); setIsOpen(false); }}
                      className="w-full mb-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => { setSelectedEvent(event); setIsOpen(false); }}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full mt-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {selectedEvent === event && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
                <p>Are you sure you want to delete "{event.title}"?</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

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

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (isLoading) return <div className="text-center p-6 text-gray-600">Loading events...</div>;
  if (error) return <div className="text-center p-6 text-red-500 bg-red-100 rounded">{error}</div>;

  return (
    <div className="container-fluid min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Event Management Section</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
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

        {/* Filter Controls */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-600">Category</label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id.toString()} value={cat._id.toString()}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-600">City</label>
              <input
                type="text"
                id="city"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="Enter city"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">Date Range</label>
              <DatePicker
                selectsRange
                startDate={filters.startDate}
                endDate={filters.endDate}
                onChange={(dates: [Date | null, Date | null]) => {
                  const [start, end] = dates;
                  handleFilterChange('startDate', start);
                  handleFilterChange('endDate', end);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholderText="Select date range"
              />
            </div>
            <div>
              <label htmlFor="minPrice" className="block mb-1 text-sm font-medium text-gray-600">Min Price</label>
              <input
                type="number"
                id="minPrice"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="Min price"
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block mb-1 text-sm font-medium text-gray-600">Max Price</label>
              <input
                type="number"
                id="maxPrice"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="Max price"
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {(userRole === 'admin' || userRole === 'manager') && (
              <div>
                <label htmlFor="status" className="block mb-1 text-sm font-medium text-gray-600">Status</label>
                <select
                  id="status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          {userRole === 'admin' && 
          <button
            onClick={() => navigate('/events/create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Event
          </button>
          }
          <div className="flex items-center gap-4">
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

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {pagination.page} of {pagination.pages}</span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManagement;