import React, { useState } from 'react';
import { Search, Filter, Users, TrendingUp, TrendingDown, MapPin, Music, Calendar } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const AttendeeInsights: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Data for charts
  const locationData = [
    { name: 'Location 1', value: 853, percentage: '11.7%', color: '#3B82F6' },
    { name: 'Location 2', value: 743, percentage: '10.2%', color: '#DC2626' },
    { name: 'Location 3', value: 763, percentage: '10.5%', color: '#059669' },
    { name: 'Location 4', value: 934, percentage: '12.9%', color: '#9333EA' },
    { name: 'Location 5', value: 783, percentage: '10.8%', color: '#1F2937' },
    { name: 'Location 6', value: 643, percentage: '8.9%', color: '#EA580C' },
    { name: 'Location 7', value: 687, percentage: '9.5%', color: '#0891B2' },
    { name: 'Location 8', value: 936, percentage: '12.9%', color: '#CA8A04' },
    { name: 'Location 9', value: 573, percentage: '7.9%', color: '#9CA3AF' },
    { name: 'Location 10', value: 345, percentage: '4.8%', color: '#EC4899' }
  ];

  const interestData = [
    { name: 'Interest A', value: 212, percentage: '5.0%', color: '#3B82F6' },
    { name: 'Interest B', value: 234, percentage: '29.4%', color: '#DC2626' },
    { name: 'Interest C', value: 124, percentage: '11.0%', color: '#F59E0B' },
    { name: 'Interest D', value: 123, percentage: '10.3%', color: '#10B981' },
    { name: 'Interest E', value: 218, percentage: '18.0%', color: '#8B5CF6' },
    { name: 'Interest F', value: 265, percentage: '24.2%', color: '#6366F1' }
  ];

  const ageData = [
    { name: '18-24 Years', value: 2345, percentage: '67.8%', color: '#8B5CF6' },
    { name: '25-34 Years', value: 1342, percentage: '38.1%', color: '#DC2626' },
    { name: '35-44 Years', value: 124, percentage: '3.1%', color: '#10B981' },
    { name: '44+ Years', value: 89, percentage: '2.0%', color: '#F59E0B' }
  ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change: number;
    changeType: 'increase' | 'decrease';
    subtitle: string;
    icon: React.ReactNode;
  }> = ({ title, value, change, changeType, subtitle, icon }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-600 text-sm font-medium">{title}</div>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 text-sm ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'increase' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {Math.abs(change)}% {changeType === 'increase' ? 'Increase' : 'decrease'}
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900">{subtitle}</div>
      </div>
    </div>
  );

  const CustomBarChart: React.FC = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">ALL ATTENDEE LOCATIONS</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={locationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="value" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              domain={[0, 1000]}
              ticks={[0, 200, 400, 600, 800, 1000]}
            />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
            >
              {locationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center mt-4 gap-6 text-xs text-gray-600">
        {locationData.map((item, index) => (
          <div key={index} className="text-center">
            <div className="font-medium">{item.value}</div>
            <div>{item.percentage}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const DonutChart: React.FC<{
    data: any[];
    title: string;
    centerValue?: string;
    centerLabel?: string;
  }> = ({ data, title, centerValue, centerLabel }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="relative" style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {centerValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{centerValue}</div>
              {centerLabel && <div className="text-sm text-gray-600">{centerLabel}</div>}
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
            <div className="text-sm font-medium text-gray-900">{item.percentage}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">All Attendee Insights</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-300">
              <span className="text-sm text-gray-600">Attendees: </span>
              <span className="font-semibold text-gray-900">7523</span>
              <span className="text-green-600 text-sm ml-1">2%</span>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="ATTENDEE AGE"
            value="18 -24 Years"
            change={30}
            changeType="increase"
            subtitle="2345"
            icon={<Calendar className="w-5 h-5" />}
          />
          
          <StatCard
            title="ATTENDEE GENDER"
            value="Male"
            change={18}
            changeType="increase"
            subtitle="3345"
            icon={<Users className="w-5 h-5" />}
          />
          
          <StatCard
            title="ATTENDEE LOCATION"
            value="Colombo"
            change={15}
            changeType="decrease"
            subtitle="845"
            icon={<MapPin className="w-5 h-5" />}
          />
          
          <StatCard
            title="ATTENDEE INTERESTS"
            value="EDM Music"
            change={63}
            changeType="increase"
            subtitle="123"
            icon={<Music className="w-5 h-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="lg:col-span-3">
            <CustomBarChart />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Interests Pie Chart */}
          <DonutChart 
            data={interestData}
            title="ATTENDEE INTERESTS"
          />
          
          {/* Age Pie Chart */}
          <DonutChart 
            data={ageData}
            title="ATTENDEE AGES"
          />
        </div>

        {/* Additional Stats Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm font-medium mb-2">TOTAL ENGAGEMENT</div>
              <div className="text-2xl font-bold text-gray-900">FaceBook ADS</div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-red-600 text-sm">21% decrease</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">21</div>
            </div>
            <div className="text-gray-400">
              <Calendar className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeInsights;