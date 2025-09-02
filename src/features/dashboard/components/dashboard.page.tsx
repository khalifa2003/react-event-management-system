import { useState } from 'react';
import { Search, Bell, User, Calendar, TrendingUp, DollarSign, Users } from 'lucide-react';


const Dashboard = () => {
  const [filter, setFilter] = useState('Weekly');
  const [searchTerm, setSearchTerm] = useState('');
  const stats = {
    events: 28,
    bookings: 2759,
    revenue: 623500
  };
  const salesData = [
    { period: 'Week 1', revenue: 35000, percentage: 17.3 },
    { period: 'Week 2', revenue: 46000, percentage: 22.7 },
    { period: 'Week 3', revenue: 22000, percentage: 10.9 },
    { period: 'Week 4', revenue: 18000, percentage: 7.4 },
    { period: 'Week 5', revenue: 28000, percentage: 13.8 },
    { period: 'Week 6', revenue: 34000, percentage: 16.8 },
    { period: 'Week 7', revenue: 22500, percentage: 11.1 }
  ];
  const engagementData = [
    { event: 'Event A', value: 450, percentage: 29.4, color: 'bg-purple-500' },
    { event: 'Event B', value: 250, percentage: 16.3, color: 'bg-blue-500' },
    { event: 'Event C', value: 170, percentage: 11.1, color: 'bg-yellow-500' },
    { event: 'Event D', value: 370, percentage: 24.2, color: 'bg-green-500' },
    { event: 'Event E', value: 290, percentage: 19.0, color: 'bg-red-500' }
  ];
  const upcomingEvents = [
    { name: 'Cynosure Festival', date: '24 March 2025' },
    { name: 'Nightor Festival', date: '30 March 2025' },
    { name: 'Cyndrex Festival', date: '03 April 2025' },
    { name: 'Hyper Festival', date: '10 April 2025' },
    { name: 'EDM Festival', date: '15 April 2025' }
  ];
  const notifications = [
    { id: '1', message: 'Paycheck released for artists', event: '@Wayo Event' },
    { id: '2', message: 'Total revenue has been transferred to bank' },
    { id: '3', message: '@Alan Walker Event in 3 days' },
    { id: '4', message: 'Paycheck released for artists', event: '@Cyndrex Event' },
    { id: '5', message: 'Paycheck released for artists', event: '@Get Together Event' }
  ];
  const generateSeatMap = () => {
    const seats = [];
    for (let i = 0; i < 70; i++) {
      const status = Math.random() < 0.6 ? 'sold' : Math.random() < 0.8 ? 'reserved' : 'available';
      seats.push(status);
    }
    return seats;
  };
  const seatMap = generateSeatMap();
  const getSeatColor = (status: string) => {
    switch (status) {
      case 'sold': return 'bg-purple-600';
      case 'reserved': return 'bg-purple-400';
      default: return 'bg-gray-300';
    }
  };
  const totalEngagement = engagementData.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="min-h-screen bg-gray-50 rounded-lg pt-3">
      <header className="bg-black text-white px-6 py-4 mx-2 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Welcome Rusiru De Silva</h1>
              <p className="text-gray-400 text-sm">System Administrator</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white text-gray-900 pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600"><Bell className="w-5 h-5" /></button>
            <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600"><User className="w-5 h-5" /></button>
          </div>
        </div>
      </header>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-blue-600" /></div>
                  <div>
                    <p className="text-gray-500 text-sm">EVENTS</p>
                    <p className="text-2xl font-bold">{stats.events} Events</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-6 h-6 text-orange-600" /></div>
                  <div>
                    <p className="text-gray-500 text-sm">BOOKINGS</p>
                    <p className="text-2xl font-bold">{stats.bookings.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><DollarSign className="w-6 h-6 text-green-600" /></div>
                  <div>
                    <p className="text-gray-500 text-sm">REVENUE</p>
                    <p className="text-2xl font-bold">{stats.revenue.toLocaleString()} EGP</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">NET SALES</h3>
                  <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-gray-900 text-white px-3 py-1 rounded text-sm">
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                  </select>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600">Total Revenue: <span className="font-semibold">156,500 EGP</span></p>
                  <p className="text-gray-600">Total Tickets: <span className="font-semibold">2438 Tickets</span></p>
                  <p className="text-gray-600">Total Events: <span className="font-semibold">32 Events</span></p>
                </div>
                <div className="relative h-48">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <polyline fill="none" stroke="#ef4444" strokeWidth="2" points="20,150 80,100 140,180 200,120 260,140 320,100 380,120"/>
                    {salesData.map((point, index) => (
                      <g key={index}>
                        <circle cx={20 + index * 60} cy={200 - (point.revenue / 1000)} r="4" fill="#ef4444" />
                        <text x={20 + index * 60} y={200 - (point.revenue / 1000) - 10} textAnchor="middle" className="text-xs fill-gray-600" >{point.revenue.toLocaleString()}</text>
                        <text x={20 + index * 60} y={200 - (point.revenue / 1000) + 15} textAnchor="middle" className="text-xs fill-gray-500"> {point.percentage}% </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Customer Engagement</h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                      {engagementData.map((item, index) => {
                        const total = totalEngagement;
                        const percentage = (item.value / total) * 100;
                        const angle = (percentage / 100) * 360;
                        const prevAngles = engagementData.slice(0, index).reduce((sum, prev) => sum + (prev.value / total) * 360, 0);
                        const startAngle = prevAngles;
                        const endAngle = prevAngles + angle;
                        const startX = 100 + 70 * Math.cos((startAngle - 90) * Math.PI / 180);
                        const startY = 100 + 70 * Math.sin((startAngle - 90) * Math.PI / 180);
                        const endX = 100 + 70 * Math.cos((endAngle - 90) * Math.PI / 180);
                        const endY = 100 + 70 * Math.sin((endAngle - 90) * Math.PI / 180);
                        const largeArcFlag = angle > 180 ? 1 : 0;
                        const pathData = [ `M 100 100`, `L ${startX} ${startY}`, `A 70 70 0 ${largeArcFlag} 1 ${endX} ${endY}`, 'Z' ].join(' ');
                        const colors = ['#8b5cf6', '#3b82f6', '#fbbf24', '#10b981', '#ef4444'];
                        return (<path key={index} d={pathData} fill={colors[index]} className="hover:opacity-80 transition-opacity"/>);
                      })}
                      <circle cx="100" cy="100" r="30" fill="white" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-2">
                  {engagementData.map((item, index) => {
                    const colors = ['bg-purple-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-500'];
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
                          <span className="text-sm text-gray-600">{item.event}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{item.value}</p>
                          <p className="text-xs text-gray-500">{item.percentage}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Latest Event</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">Event Name:</p>
                    <p className="font-semibold">Alan Walker EDM Festival</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">Event Date:</p>
                    <p className="font-semibold">28 March 2025</p>
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
                      <div key={index} className={`w-6 h-6 rounded ${getSeatColor(status)} hover:opacity-80 transition-opacity cursor-pointer`} title={`Seat ${index + 1}: ${status}`}/>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">UPCOMING EVENTS</h3>
                <button className="text-blue-600 text-sm hover:underline">See All</button>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => {
                  const colors = ['bg-yellow-500', 'bg-purple-500', 'bg-green-500', 'bg-blue-500', 'bg-pink-500'];
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${colors[index]} rounded-full flex items-center justify-center`}>
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Event: {event.name}</p>
                        <p className="text-gray-500 text-xs">Date: {event.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <button className="text-blue-600 text-sm hover:underline">See All</button>
              </div>
              <div className="space-y-4">
                {notifications.map((notification, index) => {
                  const icons = [Users, DollarSign, Calendar, Users, Users];
                  const IconComponent = icons[index % icons.length];
                  return (
                    <div key={notification.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <IconComponent className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        {notification.event && (<p className="text-xs text-gray-500 mt-1">{notification.event}</p>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;