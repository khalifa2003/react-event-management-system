import React, { useState } from 'react';
import { Search, Filter, ArrowLeft, Instagram, Facebook, Twitter, QrCode } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const EventAttendeeInsights: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Attendee age data for timeline chart
  const ageTimelineData = [
    { day: '01', age18_24: 38, age25_34: null, age35_44: null, age45plus: null },
    { day: '02', age18_24: 35, age25_34: null, age35_44: null, age45plus: null },
    { day: '03', age18_24: 31, age25_34: 35, age35_44: null, age45plus: null },
    { day: '04', age18_24: 28, age25_34: null, age35_44: null, age45plus: null },
    { day: '05', age18_24: 26, age25_34: 30, age35_44: 29, age45plus: null },
    { day: '06', age18_24: 25, age25_34: null, age35_44: null, age45plus: null },
    { day: '07', age18_24: 27, age25_34: null, age35_44: 31, age45plus: null },
    { day: '08', age18_24: 29, age25_34: null, age35_44: null, age45plus: 31 },
    { day: '09', age18_24: 32, age25_34: 31, age35_44: null, age45plus: null },
    { day: '10', age18_24: 32, age25_34: null, age35_44: 32, age45plus: null },
    { day: '11', age18_24: 29, age25_34: null, age35_44: null, age45plus: null },
    { day: '12', age18_24: 24, age25_34: 30, age35_44: null, age45plus: null },
    { day: '13', age18_24: 24, age25_34: null, age35_44: 33, age45plus: null },
    { day: '14', age18_24: 33, age25_34: null, age35_44: null, age45plus: null },
    { day: '15', age18_24: 22, age25_34: null, age35_44: null, age45plus: null }
  ];

  // Interest distribution data
  const interestData = [
    { name: 'Live Music', value: 50, percentage: '34.5%', color: '#3B82F6' },
    { name: 'Innovation', value: 35, percentage: '24.1%', color: '#10B981' },
    { name: 'EDM Music', value: 35, percentage: '24.1%', color: '#F59E0B' },
    { name: 'Food Festivals', value: 25, percentage: '17.2%', color: '#EF4444' }
  ];

  // Location bar chart data
  const locationBarData = [
    { name: 'Colombo', value: 227, percentage: '36.9%', color: '#3B82F6' },
    { name: 'Kandy', value: 123, percentage: '20.0%', color: '#EF4444' },
    { name: 'Galle', value: 52, percentage: '8.5%', color: '#10B981' },
    { name: 'Jaffna', value: 70, percentage: '11.4%', color: '#F59E0B' },
    { name: 'International', value: 143, percentage: '23.3%', color: '#EC4899' }
  ];

  // Location table data
  const locationTableData = [
    { location: 'Colombo', count: 227, color: '#3B82F6' },
    { location: 'Kandy', count: 113, color: '#EC4899' },
    { location: 'Galle', count: 143, color: '#EC4899' },
    { location: 'Jaffna', count: 70, color: '#10B981' },
    { location: 'International', count: 52, color: '#10B981' }
  ];

  // Social media engagement data
  const socialMediaData = [
    { platform: 'Instagram Mentions', count: '5,200', icon: Instagram, color: 'text-pink-600' },
    { platform: 'Facebook Shares', count: '3,800', icon: Facebook, color: 'text-blue-600' },
    { platform: 'Twitter Tweets', count: '1,200', icon: Twitter, color: 'text-sky-500' },
    { platform: 'Event Check-ins (QR scans)', count: '9,500', icon: QrCode, color: 'text-gray-700' }
  ];

  const AgeTimelineChart: React.FC = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">ATTENDEE AGE</h3>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>18 - 24</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>25 - 34</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>35 - 44</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span>45+</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-64">
        {/* Custom timeline chart */}
        <div className="absolute inset-0 flex items-end justify-between px-4">
          {ageTimelineData.map((day, index) => (
            <div key={day.day} className="flex flex-col items-center gap-2 relative">
              {/* Data points */}
              <div className="relative h-32 flex flex-col justify-end">
                {day.age18_24 && (
                  <div className="relative mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {day.age18_24}
                    </div>
                    {index > 0 && (
                      <div className="absolute top-3 -left-6 w-6 h-0.5 bg-blue-500"></div>
                    )}
                  </div>
                )}
                {day.age25_34 && (
                  <div className="relative mb-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {day.age25_34}
                    </div>
                    {index > 0 && (
                      <div className="absolute top-3 -left-6 w-6 h-0.5 bg-orange-500"></div>
                    )}
                  </div>
                )}
                {day.age35_44 && (
                  <div className="relative mb-2">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {day.age35_44}
                    </div>
                    {index > 0 && (
                      <div className="absolute top-3 -left-6 w-6 h-0.5 bg-red-500"></div>
                    )}
                  </div>
                )}
                {day.age45plus && (
                  <div className="relative mb-2">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {day.age45plus}
                    </div>
                    {index > 0 && (
                      <div className="absolute top-3 -left-6 w-6 h-0.5 bg-green-600"></div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Day labels */}
              <div className="text-xs text-gray-500 font-medium">{day.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Attendee Insights - Colombo Music Festival 2025</h1>
              <div className="text-sm text-gray-600 mt-1">
                <div>• Event Venue : Viharamahadevi Open Air Theater, Colombo</div>
                <div>• Event Date : April 12, 2025</div>
                <div>• Event Time : 6:00PM - 10:30PM</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2">
              <span className="text-sm text-gray-600">Attendees:</span>
              <span className="font-semibold text-gray-900">523</span>
              <div className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs">2%</span>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Age Timeline Chart */}
          <div className="lg:col-span-2">
            <AgeTimelineChart />
          </div>

          {/* Engagement & Social Media */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement & Social Media Reach</h3>
            <p className="text-sm text-gray-600 mb-6">How attendees engaged with the event</p>
            
            <div className="space-y-4">
              {socialMediaData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-sm text-gray-700">{item.platform}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">TOTAL COUNT:</span>
                <span className="font-bold text-lg text-gray-900">19700</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendee Interests */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">ATTENDEE INTERESTS</h3>
            <div className="relative" style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={interestData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {interestData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-3">
              {interestData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.percentage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendee Locations Bar Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">ATTENDEE LOCATIONS</h3>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={locationBarData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" domain={[0, 250]} axisLine={false} tickLine={false} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    width={80}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {locationBarData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendee Locations Table */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">ATTENDEE LOCATIONS</h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Location</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {locationTableData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.location}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm font-medium text-gray-900">{item.count}</span>
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAttendeeInsights;