import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { eventService } from '../services/eventService';
import { categoryService } from '../../categories/services/categoryService';
import type { UpdateEventData, Event, Category } from '../interfaces/events';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { CategoriesResponse } from '../../categories/interfaces/Category';

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const UpdateEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UpdateEventData>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch event and categories
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('Event ID is required');
        setIsLoading(false);
        return;
      }
      try {
        // Fetch event
        const eventResponse = await eventService.getEvent(id);
        const event: Event = eventResponse.data;
        setFormData({
          title: event.title || '',
          description: event.description || '',
          shortDescription: event.shortDescription || '',
          category: typeof event.category === 'string' ? event.category : event.category._id.toString(),
          venue: event.venue,
          dateTime: {
            start: new Date(event.dateTime.start).toISOString().slice(0, 16),
            end: new Date(event.dateTime.end).toISOString().slice(0, 16),
          },
          pricing: {
            ticketPrice: event.pricing.ticketPrice,
            currency: event.pricing.currency,
            earlyBird: event.pricing.earlyBird
              ? {
                  price: event.pricing.earlyBird.price,
                  deadline: event.pricing.earlyBird.deadline
                    ? new Date(event.pricing.earlyBird.deadline).toISOString().slice(0, 16)
                    : undefined,
                }
              : undefined,
          },
          capacity: { totalSeats: event.capacity.totalSeats },
          status: event.status,
          tags: event.tags?.join(','),
          features: event.features?.join(','),
          ageRestriction: event.ageRestriction,
          socialLinks: event.socialLinks,
          isPopular: event.isPopular,
          isFeatured: event.isFeatured,
        });

        // Fetch categories
        const categoriesResponse: CategoriesResponse = await categoryService.getCategories();
        setCategories(categoriesResponse.data);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Component to handle map click events
  const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
    useMapEvents({
      click(e) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      venue: { ...formData.venue, coordinates: { lat, lng } },
    });
  };

  const validateForm = () => {
    if (formData.title && formData.title.length > 100) return 'Title cannot exceed 100 characters';
    if (formData.description && formData.description.length > 2000) return 'Description cannot exceed 2000 characters';
    if (formData.shortDescription && formData.shortDescription.length > 200)
      return 'Short description cannot exceed 200 characters';
    if (formData.category && !formData.category.match(/^[0-9a-fA-F]{24}$/)) return 'Valid category ID is required';
    if (formData.venue?.coordinates?.lat && (formData.venue.coordinates.lat < -90 || formData.venue.coordinates.lat > 90))
      return 'Latitude must be between -90 and 90';
    if (formData.venue?.coordinates?.lng && (formData.venue.coordinates.lng < -180 || formData.venue.coordinates.lng > 180))
      return 'Longitude must be between -180 and 180';
    if (formData.dateTime?.start && formData.dateTime?.end && new Date(formData.dateTime.end) <= new Date(formData.dateTime.start))
      return 'End date must be after start date';
    if (formData.pricing?.ticketPrice && formData.pricing.ticketPrice < 0) return 'Ticket price cannot be negative';
    if (formData.pricing?.earlyBird?.price && formData.pricing.earlyBird.price < 0)
      return 'Early bird price cannot be negative';
    if (formData.pricing?.earlyBird?.deadline && new Date(formData.pricing.earlyBird.deadline) <= new Date())
      return 'Early bird deadline must be in the future';
    if (formData.capacity?.totalSeats && formData.capacity.totalSeats < 1) return 'Must have at least 1 seat';
    if (formData.status && !['draft', 'published', 'cancelled', 'completed'].includes(formData.status))
      return 'Invalid status';
    if (formData.ageRestriction?.minAge && formData.ageRestriction.minAge < 0) return 'Minimum age cannot be negative';
    if (formData.ageRestriction?.maxAge && formData.ageRestriction.maxAge > 120)
      return 'Maximum age cannot exceed 120';
    if (formData.socialLinks?.website && !formData.socialLinks.website.match(/^https?:\/\/.+/))
      return 'Invalid website URL';
    if (formData.socialLinks?.facebook && !formData.socialLinks.facebook.match(/^https?:\/\/(www\.)?facebook\.com\/.+/))
      return 'Invalid Facebook URL';
    if (formData.socialLinks?.twitter && !formData.socialLinks.twitter.match(/^https?:\/\/(www\.)?twitter\.com\/.+/))
      return 'Invalid Twitter URL';
    if (formData.socialLinks?.instagram && !formData.socialLinks.instagram.match(/^https?:\/\/(www\.)?instagram\.com\/.+/))
      return 'Invalid Instagram URL';
      return 'Each additional image must be under 5MB';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const data = new FormData();
    if (formData.title) data.append('title', formData.title);
    if (formData.description) data.append('description', formData.description);
    if (formData.shortDescription) data.append('shortDescription', formData.shortDescription);
    if (formData.category) data.append('category', formData.category);
    if (formData.coverImage) data.append('coverImage', formData.coverImage);
    if (formData.images) {
      formData.images.forEach(img => data.append('images', img));
    }
    if (formData.venue?.name) data.append('venue[name]', formData.venue.name);
    if (formData.venue?.address) data.append('venue[address]', formData.venue.address);
    if (formData.venue?.city) data.append('venue[city]', formData.venue.city);
    if (formData.venue?.coordinates?.lat) data.append('venue[coordinates][lat]', formData.venue.coordinates.lat.toString());
    if (formData.venue?.coordinates?.lng) data.append('venue[coordinates][lng]', formData.venue.coordinates.lng.toString());
    if (formData.dateTime?.start) data.append('dateTime[start]', new Date(formData.dateTime.start).toISOString());
    if (formData.dateTime?.end) data.append('dateTime[end]', new Date(formData.dateTime.end).toISOString());
    if (formData.pricing?.ticketPrice) data.append('pricing[ticketPrice]', formData.pricing.ticketPrice.toString());
    if (formData.pricing?.currency) data.append('pricing[currency]', formData.pricing.currency);
    if (formData.pricing?.earlyBird?.price)
      data.append('pricing[earlyBird][price]', formData.pricing.earlyBird.price.toString());
    if (formData.pricing?.earlyBird?.deadline)
      data.append('pricing[earlyBird][deadline]', new Date(formData.pricing.earlyBird.deadline).toISOString());
    if (formData.capacity?.totalSeats) data.append('capacity[totalSeats]', formData.capacity.totalSeats.toString());
    if (formData.status) data.append('status', formData.status);
    if (formData.tags) data.append('tags', formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag).join(','));
    if (formData.features)
      data.append('features', formData.features.split(',').map(feat => feat.trim()).filter(feat => feat).join(','));
    if (formData.ageRestriction?.minAge)
      data.append('ageRestriction[minAge]', formData.ageRestriction.minAge.toString());
    if (formData.ageRestriction?.maxAge)
      data.append('ageRestriction[maxAge]', formData.ageRestriction.maxAge.toString());
    if (formData.socialLinks?.website) data.append('socialLinks[website]', formData.socialLinks.website);
    if (formData.socialLinks?.facebook) data.append('socialLinks[facebook]', formData.socialLinks.facebook);
    if (formData.socialLinks?.twitter) data.append('socialLinks[twitter]', formData.socialLinks.twitter);
    if (formData.socialLinks?.instagram) data.append('socialLinks[instagram]', formData.socialLinks.instagram);
    if (formData.isPopular !== undefined) data.append('isPopular', formData.isPopular.toString());
    if (formData.isFeatured !== undefined) data.append('isFeatured', formData.isFeatured.toString());

    try {
      console.log('Updating event with:', Object.fromEntries(data));
      setSuccess(`Event updated successfully`);
      setError('');
      navigate('/events');
    } catch (err) {
      setSuccess('');
      console.error('Update event error:', err);
    }
  };

  if (isLoading) {
    return <div className="text-center p-6 text-gray-600">Loading event...</div>;
  }

  if (error && !formData.title) {
    return <div className="text-center p-6 text-red-500 bg-red-100 rounded">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Update Event</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-6">{error}</p>}
      {success && <p className="text-green-500 bg-green-100 p-3 rounded mb-6">{success}</p>}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Basic Information</h2>
          <div>
            <label htmlFor="title" className="block mb-1 font-medium text-gray-600">Title</label>
            <input
              type="text"
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1 font-medium text-gray-600">Description</label>
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="shortDescription" className="block mb-1 font-medium text-gray-600">Short Description (max 200 chars)</label>
            <textarea
              id="shortDescription"
              value={formData.shortDescription || ''}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              rows={3}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="category" className="block mb-1 font-medium text-gray-600">Category</label>
            <select
              id="category"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id.toString()} value={cat._id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Images</h2>
          <div>
            <label htmlFor="coverImage" className="block mb-1 font-medium text-gray-600">Cover Image (Max 5MB)</label>
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.files ? e.target.files[0] : undefined })}
              className="border border-gray-300 p-2 w-full rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>
          <div>
            <label htmlFor="images" className="block mb-1 font-medium text-gray-600">Additional Images (Max 5, each 5MB)</label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFormData({ ...formData, images: e.target.files ? Array.from(e.target.files) : undefined })}
              className="border border-gray-300 p-2 w-full rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>
        </div>

        {/* Venue */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Venue</h2>
          <div>
            <label htmlFor="venueName" className="block mb-1 font-medium text-gray-600">Venue Name</label>
            <input
              type="text"
              id="venueName"
              value={formData.venue?.name || ''}
              onChange={(e) => setFormData({ ...formData, venue: { ...formData.venue, name: e.target.value } })}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="venueAddress" className="block mb-1 font-medium text-gray-600">Address</label>
            <input
              type="text"
              id="venueAddress"
              value={formData.venue?.address || ''}
              onChange={(e) => setFormData({ ...formData, venue: { ...formData.venue, address: e.target.value } })}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="venueCity" className="block mb-1 font-medium text-gray-600">City</label>
            <input
              type="text"
              id="venueCity"
              value={formData.venue?.city || ''}
              onChange={(e) => setFormData({ ...formData, venue: { ...formData.venue, city: e.target.value } })}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-600">Select Location on Map</label>
            <div className="h-64 w-full rounded border border-gray-300">
              <MapContainer
                center={formData.venue?.coordinates?.lat && formData.venue?.coordinates?.lng ? [formData.venue.coordinates.lat, formData.venue.coordinates.lng] : [30.0444, 31.2357]}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {formData.venue?.coordinates?.lat && formData.venue?.coordinates?.lng && (
                  <Marker position={[formData.venue.coordinates.lat, formData.venue.coordinates.lng]} />
                )}
                <MapClickHandler onLocationSelect={handleLocationSelect} />
              </MapContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label htmlFor="venueLat" className="block mb-1 font-medium text-gray-600">Latitude</label>
                <input
                  type="number"
                  id="venueLat"
                  value={formData.venue?.coordinates?.lat ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      venue: {
                        ...formData.venue,
                        coordinates: { ...formData.venue?.coordinates, lat: e.target.value ? parseFloat(e.target.value) : undefined },
                      },
                    })
                  }
                  className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="venueLng" className="block mb-1 font-medium text-gray-600">Longitude</label>
                <input
                  type="number"
                  id="venueLng"
                  value={formData.venue?.coordinates?.lng ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      venue: {
                        ...formData.venue,
                        coordinates: { ...formData.venue?.coordinates, lng: e.target.value ? parseFloat(e.target.value) : undefined },
                      },
                    })
                  }
                  className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Date and Time</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block mb-1 font-medium text-gray-600">Start Date & Time</label>
              <input
                type="datetime-local"
                id="startDate"
                value={formData.dateTime?.start?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, dateTime: { ...formData.dateTime, start: e.target.value } })}
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block mb-1 font-medium text-gray-600">End Date & Time</label>
              <input
                type="datetime-local"
                id="endDate"
                value={formData.dateTime?.end?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, dateTime: { ...formData.dateTime, end: e.target.value } })}
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Pricing</h2>
          <div>
            <label htmlFor="ticketPrice" className="block mb-1 font-medium text-gray-600">Ticket Price</label>
            <input
              type="number"
              id="ticketPrice"
              value={formData.pricing?.ticketPrice ?? ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, ticketPrice: e.target.value ? parseFloat(e.target.value) : undefined },
                })
              }
              min="0"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="currency" className="block mb-1 font-medium text-gray-600">Currency</label>
            <select
              id="currency"
              value={formData.pricing?.currency || 'EGP'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, currency: e.target.value as 'EGP' | 'USD' | 'EUR' },
                })
              }
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="EGP">EGP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="earlyBirdPrice" className="block mb-1 font-medium text-gray-600">Early Bird Price</label>
              <input
                type="number"
                id="earlyBirdPrice"
                value={formData.pricing?.earlyBird?.price ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricing: {
                      ...formData.pricing,
                      earlyBird: { ...formData.pricing?.earlyBird, price: e.target.value ? parseFloat(e.target.value) : undefined },
                    },
                  })
                }
                min="0"
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="earlyBirdDeadline" className="block mb-1 font-medium text-gray-600">Early Bird Deadline</label>
              <input
                type="datetime-local"
                id="earlyBirdDeadline"
                value={formData.pricing?.earlyBird?.deadline?.toString() || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricing: {
                      ...formData.pricing,
                      earlyBird: { ...formData.pricing?.earlyBird, deadline: e.target.value || undefined },
                    },
                  })
                }
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Capacity */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Capacity</h2>
          <div>
            <label htmlFor="totalSeats" className="block mb-1 font-medium text-gray-600">Total Seats</label>
            <input
              type="number"
              id="totalSeats"
              value={formData.capacity?.totalSeats ?? ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: { ...formData.capacity, totalSeats: e.target.value ? parseInt(e.target.value) : undefined },
                })
              }
              min="1"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Additional Details</h2>
          <div>
            <label htmlFor="status" className="block mb-1 font-medium text-gray-600">Status</label>
            <select
              id="status"
              value={formData.status || 'draft'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'cancelled' | 'completed' })}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label htmlFor="tags" className="block mb-1 font-medium text-gray-600">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              value={formData.tags || ''}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., music, festival, concert"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="features" className="block mb-1 font-medium text-gray-600">Features (comma-separated)</label>
            <input
              type="text"
              id="features"
              value={formData.features || ''}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="e.g., food, parking, VIP"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="minAge" className="block mb-1 font-medium text-gray-600">Minimum Age</label>
              <input
                type="number"
                id="minAge"
                value={formData.ageRestriction?.minAge ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ageRestriction: { ...formData.ageRestriction, minAge: e.target.value ? parseInt(e.target.value) : undefined },
                  })
                }
                min="0"
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="maxAge" className="block mb-1 font-medium text-gray-600">Maximum Age</label>
              <input
                type="number"
                id="maxAge"
                value={formData.ageRestriction?.maxAge ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ageRestriction: { ...formData.ageRestriction, maxAge: e.target.value ? parseInt(e.target.value) : undefined },
                  })
                }
                max="120"
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="isPopular" className="block mb-1 font-medium text-gray-600">Popular</label>
              <input
                type="checkbox"
                id="isPopular"
                checked={formData.isPopular || false}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="isFeatured" className="block mb-1 font-medium text-gray-600">Featured</label>
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured || false}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Social Links</h2>
          <div>
            <label htmlFor="website" className="block mb-1 font-medium text-gray-600">Website</label>
            <input
              type="url"
              id="website"
              value={formData.socialLinks?.website || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, website: e.target.value || undefined },
                })
              }
              placeholder="https://example.com"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="facebook" className="block mb-1 font-medium text-gray-600">Facebook</label>
            <input
              type="url"
              id="facebook"
              value={formData.socialLinks?.facebook || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, facebook: e.target.value || undefined },
                })
              }
              placeholder="https://facebook.com/yourpage"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="twitter" className="block mb-1 font-medium text-gray-600">Twitter</label>
            <input
              type="url"
              id="twitter"
              value={formData.socialLinks?.twitter || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, twitter: e.target.value || undefined },
                })
              }
              placeholder="https://twitter.com/yourhandle"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="instagram" className="block mb-1 font-medium text-gray-600">Instagram</label>
            <input
              type="url"
              id="instagram"
              value={formData.socialLinks?.instagram || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, instagram: e.target.value || undefined },
                })
              }
              placeholder="https://instagram.com/yourpage"
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Update Event
        </button>
      </form>
    </div>
  );
};

export default UpdateEvent;