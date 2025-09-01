// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import { 
  Calendar, 
  Ticket, 
  DollarSign, 
  ChevronDown,
  Filter,
  CreditCard,
  User,
  Star
} from 'lucide-react';

interface Event {
  id: string;
  name: string;
  date: string;
  image: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'paycheck' | 'ticket' | 'user';
}

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color }) => (
  <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:shadow-xl transition-all">
    <div className="flex items-center gap-4">
      <div className={`${color} p-4 rounded-xl shadow-lg`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('Weekly');

  const upcomingEvents: Event[] = [
    { id: '1', name: 'Cynosure Festival', date: '24 March 2025', image: '🎪' },
    { id: '2', name: 'Mightor Festival', date: '30 March 2025', image: '🎭' },
    { id: '3', name: 'Cynders Festival', date: '03 April 2025', image: '🎨' },
    { id: '4', name: 'Hyper Festival', date: '10 April 2025', image: '⚡' },
    { id: '5', name: 'EDM Festival', date: '15 April 2025', image: '🎵' }
  ];

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Paycheck released for artists',
      description: '@Wayne Event',
      time: '2h',
      type: 'paycheck'
    },
    {
      id: '2',
      title: 'Total revenue has been transferred to bank',
      description: '',
      time: '3h',
      type: 'ticket'
    },
    {
      id: '3',
      title: '@Alan Walker Event in 3 days',
      description: '',
      time: '1d',
      type: 'user'
    },
    {
      id: '4',
      title: 'Paycheck released for artists',
      description: '@Cynders Event',
      time: '2d',
      type: 'paycheck'
    },
    {
      id: '5',
      title: 'Paycheck released for artists',
      description: '@Get Together Event',
      time: '3d',
      type: 'paycheck'
    }
  ];

  const chartData = [
    { month: 'JAN', value: 15000, percentage: '5.0%' },
    { month: 'FEB', value: 22000, percentage: '10.5%' },
    { month: 'MAR', value: 35000, percentage: '17.3%' },
    { month: 'APR', value: 46000, percentage: '22.7%' },
    { month: 'MAY', value: 34000, percentage: '16.8%' },
    { month: 'JUN', value: 28000, percentage: '13.8%' },
    { month: 'JUL', value: 25000, percentage: '11.1%' }
  ];

  const maxValue = Math.max(...chartData.map(item => item.value));

  return (
    <div className="p-6 bg-gray-900 min-h-full text-white">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Overview of your event management system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                icon={Calendar} 
                title="EVENTS" 
                value="28 Events" 
                color="bg-blue-500"
              />
              <StatCard 
                icon={Ticket} 
                title="BOOKINGS" 
                value="2,7598" 
                color="bg-orange-500"
              />
              <StatCard 
                icon={DollarSign} 
                title="REVENUE" 
                value="623,500LKR" 
                color="bg-green-500"
              />
            </div>

            {/* Net Sales Chart */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  NET SALES <ChevronDown size={18} />
                </h3>
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-400" />
                  <select 
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="bg-gray-700 border border-gray-600 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-white">155,500 LKR</p>
                  <p className="text-sm text-gray-400">Total Revenue</p>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-white">2438 Tickets</p>
                  <p className="text-sm text-gray-400">Total Tickets</p>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-white">37 Events</p>
                  <p className="text-sm text-gray-400">Total Events</p>
                </div>
              </div>

              {/* Chart */}
              <div className="h-72 flex items-end justify-between gap-3 border-l-2 border-b-2 border-gray-600 pl-6 pb-6">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    <div className="text-xs text-gray-400 font-medium">{item.percentage}</div>
                    <div 
                      className="bg-gradient-to-t from-red-600 to-red-400 w-full rounded-t-lg relative group cursor-pointer hover:from-red-500 hover:to-red-300 transition-all"
                      style={{ 
                        height: `${(item.value / maxValue) * 220}px`,
                        minHeight: '24px'
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.value.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 font-medium">{item.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">UPCOMING EVENTS</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                  See All
                </button>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-3 hover:bg-gray-700/50 rounded-lg transition-all cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-lg shadow-lg">
                      {event.image}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">Event : {event.name}</p>
                      <p className="text-sm text-gray-400">Date : {event.date}</p>
                    </div>
                    <Star size={16} className="text-gray-400 hover:text-yellow-400 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Notifications</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                  See All
                </button>
              </div>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-4 p-3 hover:bg-gray-700/50 rounded-lg transition-all cursor-pointer">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                      notification.type === 'paycheck' ? 'bg-green-500' :
                      notification.type === 'ticket' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      {notification.type === 'paycheck' ? <CreditCard size={18} /> :
                       notification.type === 'ticket' ? <Ticket size={18} /> : <User size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm leading-tight">{notification.title}</p>
                      {notification.description && (
                        <p className="text-xs text-gray-400 mt-1">{notification.description}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{notification.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;