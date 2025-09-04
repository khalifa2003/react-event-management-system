import { useState, useEffect, useMemo } from 'react';
import { Search, Bell, User, Calendar, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import dashboardService from '../services/dashboardService';
import type {
  DashboardStatsResponse,
  SalesAnalyticsResponse,
  EventPerformanceResponse,
} from '../interfaces/dashboardInterfaces';
import { getUser } from '../../auth/services/auth.service';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const user = getUser();
  const [filter, setFilter] = useState<'hour' | 'day' | 'week' | 'month'>('day');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<DashboardStatsResponse['data'] | null>(null);
  const [salesData, setSalesData] = useState<SalesAnalyticsResponse['data'] | null>(null);
  const [eventPerformance, setEventPerformance] = useState<EventPerformanceResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount and when filter changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, salesRes, performanceRes] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getSalesAnalytics('30', filter),
          dashboardService.getEventPerformance(),
        ]);
        setStats(statsRes.data.data);
        setSalesData(salesRes.data.data);
        setEventPerformance(performanceRes.data.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  // Handle CSV export
  const handleExport = async () => {
    try {
      const response = await dashboardService.exportAnalytics({ type: 'events' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `events-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      setError(err.message || 'Failed to export data');
    }
  };

  // Generate seat map (using static logic as a placeholder; can be made dynamic later)
  const seatMap = useMemo(() => {
    const seats = [];
    for (let i = 0; i < 70; i++) {
      const status = Math.random() < 0.6 ? 'sold' : Math.random() < 0.8 ? 'reserved' : 'available';
      seats.push(status);
    }
    return seats;
  }, []);

  const getSeatColor = (status: string) => {
    switch (status) {
      case 'sold':
        return 'bg-purple-600';
      case 'reserved':
        return 'bg-purple-400';
      default:
        return 'bg-gray-300';
    }
  };

  // Line chart data for net sales
  const lineChartData = useMemo(() => ({
    labels: salesData?.salesTrend.map((item) => item._id) || [],
    datasets: [
      {
        label: 'Revenue (EGP)',
        data: salesData?.salesTrend.map((item) => item.revenue) || [],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  }), [salesData]);

  // Doughnut chart data for category performance
  const doughnutChartData = useMemo(() => ({
    labels: eventPerformance?.categories.map((cat) => cat.categoryName) || [],
    datasets: [
      {
        data: eventPerformance?.categories.map((cat) => cat.totalTicketsSold) || [],
        backgroundColor: ['#8b5cf6', '#3b82f6', '#fbbf24', '#10b981', '#ef4444'],
        hoverOffset: 20,
      },
    ],
  }), [eventPerformance]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="bg-black text-white px-6 py-4 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">
                Welcome {user?.name ?? "Guest"}
              </h1>
              <p className="text-gray-400 text-sm">
                {user?.role ?? "User"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white text-gray-900 pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">EVENTS</p>
                  <p className="text-2xl font-bold">{stats?.overview.totalEvents || 0} Events</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">BOOKINGS</p>
                  <p className="text-2xl font-bold">{stats?.overview.totalTicketsSold.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">REVENUE</p>
                  <p className="text-2xl font-bold">{stats?.overview.totalRevenue.toLocaleString()} EGP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Net Sales Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Net Sales</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as 'hour' | 'day' | 'week' | 'month')}
                    className="bg-gray-900 text-white px-3 py-1 rounded text-sm"
                  >
                    <option value="hour">Hourly</option>
                    <option value="day">Daily</option>
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                  </select>
                  <button
                    onClick={handleExport}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  Total Revenue: <span className="font-semibold">{salesData?.summary.totalRevenue.toLocaleString()} EGP</span>
                </p>
                <p className="text-gray-600">
                  Total Tickets: <span className="font-semibold">{salesData?.summary.totalTickets.toLocaleString()} Tickets</span>
                </p>
                <p className="text-gray-600">
                  Average Order Value: <span className="font-semibold">{salesData?.summary.averageOrderValue.toFixed(2)} EGP</span>
                </p>
              </div>
              <div className="h-64">
                <Line
                  data={lineChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { beginAtZero: true, title: { display: true, text: 'Revenue (EGP)' } },
                      x: { title: { display: true, text: filter.charAt(0).toUpperCase() + filter.slice(1) } },
                    },
                    plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } },
                  }}
                />
              </div>
            </div>

            {/* Customer Engagement Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Category Engagement</h3>
              <div className="flex items-center justify-center mb-4">
                <div className="w-48 h-48">
                  <Doughnut
                    data={doughnutChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'right' },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const label = context.label || '';
                              const value = context.raw as number;
                              const total = context.dataset.data.reduce((sum, val) => sum + (val as number), 0);
                              const percentage = ((value / total) * 100).toFixed(1);
                              return `${label}: ${value} tickets (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {eventPerformance?.categories.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${['bg-purple-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-500'][index % 5]}`}
                      ></div>
                      <span className="text-sm text-gray-600">{item.categoryName}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{item.totalTicketsSold}</p>
                      <p className="text-xs text-gray-500">{((item.totalTicketsSold / (eventPerformance.summary.totalTicketsSold || 1)) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Latest Event */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Latest Event</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Event Name:</p>
                  <p className="font-semibold">{eventPerformance?.events[0]?.title || 'N/A'}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Event Date:</p>
                  <p className="font-semibold">
                    {eventPerformance?.events[0]?.dateTime.start
                      ? new Date(eventPerformance.events[0].dateTime.start).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Paid Seats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Reserved Seats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-sm">To be sold</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-10 gap-1 max-w-xs">
                  {seatMap.map((status, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded ${getSeatColor(status)} hover:opacity-80 transition-opacity cursor-pointer`}
                      title={`Seat ${index + 1}: ${status}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <button className="text-blue-600 text-sm hover:underline">See All</button>
            </div>
            <div className="space-y-4">
              {eventPerformance?.events.slice(0, 5).map((event, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 ${['bg-yellow-500', 'bg-purple-500', 'bg-green-500', 'bg-blue-500', 'bg-pink-500'][index % 5]} rounded-full flex items-center justify-center`}
                  >
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Event: {event.title}</p>
                    <p className="text-gray-500 text-xs">
                      Date: {new Date(event.dateTime.start).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications (Static for now, can be made dynamic) */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <button className="text-blue-600 text-sm hover:underline">See All</button>
            </div>
            <div className="space-y-4">
              {[
                { id: '1', message: 'Paycheck released for artists', event: '@Wayo Event' },
                { id: '2', message: 'Total revenue has been transferred to bank' },
                { id: '3', message: '@Alan Walker Event in 3 days' },
                { id: '4', message: 'Paycheck released for artists', event: '@Cyndrex Event' },
                { id: '5', message: 'Paycheck released for artists', event: '@Get Together Event' },
              ].map((notification, index) => {
                const icons = [Users, DollarSign, Calendar, Users, Users];
                const IconComponent = icons[index % icons.length];
                return (
                  <div key={notification.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      {notification.event && (
                        <p className="text-xs text-gray-500 mt-1">{notification.event}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;