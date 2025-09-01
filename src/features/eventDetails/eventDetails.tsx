import { useState } from 'react';
import { ArrowLeft, Edit3, MapPin, Clock, Calendar, DollarSign, Users, TrendingUp, Star, User, X } from 'lucide-react';

const EventDetailsPage = () => {
  const generateSeats = () => {
  const rows = 8;
  const seatsPerRow = 12;
  const seats = [];
  for (let row = 0; row < rows; row++) {
    for (let seat = 0; seat < seatsPerRow; seat++) {
      const seatId = `${row}-${seat}`;
      let status = 'available';
      const random = Math.random();
      if (random < 0.3) status = 'paid';
      else if (random < 0.45) status = 'reserved';
      seats.push({ id: seatId, row, seat, status });
    }
  }
  return seats;
  };
  const [seats] = useState(generateSeats());
  const getSeatColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-purple-600';
      case 'reserved': return 'bg-purple-400';
      case 'available': return 'bg-gray-300 hover:bg-gray-400 cursor-pointer';
      default: return 'bg-gray-300';
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Event Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value="Colombo Music Festival 2025"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
                <Edit3 size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value="April 12, 2025"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
                <Calendar size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Event Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Venue
              </label>
              <div className="relative">
                <input
                  type="text"
                  value="Viharamahadevi Open Air Theater, Colombo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
                <MapPin size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Event Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  value="6:00PM - 10:30PM"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
                <Clock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Description
            </label>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                Get ready for Sri Lanka's biggest music festival – the Colombo Music Festival 2025! 🎵 This electrifying open-air concert will feature top international and local artists, bringing an unforgettable night of music, lights, and energy to the heart of Colombo! Join 10,000+ music lovers at the Viharamahadevi Open Air Theater for a night filled with live performances, immersive stage effects, and a festival atmosphere like no other! Whether you're into pop, rock, EDM, or reggae, this festival has something for every music enthusiast!
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Ticket Price */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign size={16} className="text-green-600" />
                </div>
                <span className="text-sm text-gray-600">Ticket Price</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">2500LKR</p>
            </div>

            {/* Seat Amount */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users size={16} className="text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">Seat Amount</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">1200</p>
            </div>

            {/* Available Seats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp size={16} className="text-orange-600" />
                </div>
                <span className="text-sm text-gray-600">Available Seats</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">523</p>
            </div>

            {/* Popularity */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star size={16} className="text-purple-600" />
                </div>
                <span className="text-sm text-gray-600">Popularity</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">High Popularity</p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Seat Allocation */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seat Allocation</h3>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-600 rounded"></div>
                  <span className="text-gray-600">Paid Seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-400 rounded"></div>
                  <span className="text-gray-600">Reserved Seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span className="text-gray-600">Available</span>
                </div>
              </div>

              {/* Seat Map */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-12 gap-1">
                  {seats.map((seat) => (
                    <div
                      key={seat.id}
                      className={`w-6 h-6 rounded ${getSeatColor(seat.status)} transition-colors`}
                      title={`Row ${seat.row + 1}, Seat ${seat.seat + 1} - ${seat.status}`}
                    ></div>
                  ))}
                </div>
                <div className="text-center mt-4 text-xs text-gray-500">
                  STAGE
                </div>
              </div>
            </div>

            {/* Right Side Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    #Music
                    <X size={12} className="cursor-pointer hover:bg-blue-200 rounded-full" />
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    #Festival
                    <X size={12} className="cursor-pointer hover:bg-blue-200 rounded-full" />
                  </span>
                </div>
              </div>

              {/* Expected Attendance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Expected Attendance
                </label>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">+1000</span>
                </div>
              </div>

              {/* QR Code */}
              <div>
                <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                  <div className="w-32 h-32 mx-auto mb-4 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                    {/* QR Code Pattern */}
                    <div className="w-24 h-24 relative">
                      <div className="absolute inset-0 grid grid-cols-8 gap-px">
                        {Array.from({ length: 64 }, (_, i) => (
                          <div
                            key={i}
                            className={`${
                              Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                            }`}
                          />
                        ))}
                      </div>
                      {/* Corner squares */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-2 border-black">
                        <div className="w-2 h-2 bg-black m-1"></div>
                      </div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-2 border-black">
                        <div className="w-2 h-2 bg-black m-1"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-2 border-black">
                        <div className="w-2 h-2 bg-black m-1"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Scan QR code for easy payments</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  EDIT
                </button>
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  Attendee Insights
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;