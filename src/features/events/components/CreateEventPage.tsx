import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Calendar, MapPin, Users, DollarSign, Tag, Image, Clock, Globe, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { eventService, categoryService } from '../services/eventService';
import type { EventFormData } from '../interfaces/EventFormData';
import type { CreateEventRequest } from '../interfaces/CreateEventRequest';

const CURRENCIES = ['EGP', 'USD', 'EUR'];

const InputField = ({
  label,
  field,
  type = 'text',
  icon: Icon,
  placeholder,
  required = false,
  as = 'input',
  value,
  onChange,
  errors,
  options,
}: {
  label: string;
  field: keyof EventFormData;
  type?: string;
  icon?: React.ComponentType<any>;
  placeholder?: string;
  required?: boolean;
  as?: 'input' | 'textarea' | 'select';
  value: string;
  onChange: (field: keyof EventFormData, value: string) => void;
  errors: Record<string, string>;
  options?: string[];
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      )}
      {as === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 ${Icon ? 'pl-10' : ''} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors[field] ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={4}
        />
      ) : as === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className={`w-full px-3 py-2 ${Icon ? 'pl-10' : ''} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors[field] ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select {label}</option>
          {options?.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 ${Icon ? 'pl-10' : ''} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors[field] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      )}
    </div>
    {errors[field] && (
      <p className="text-sm text-red-600">{errors[field]}</p>
    )}
  </div>
);

// Helper function to validate URLs
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to transform form data
const mapFormDataToCreateEventRequest = (formData: EventFormData, coverImage: File | null, images: File[], status: 'draft' | 'published'): CreateEventRequest => {
  const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
  const endDateTime = formData.endDate && formData.endTime
    ? new Date(`${formData.endDate}T${formData.endTime}`)
    : new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // Default to 2 hours after start

  return {
    title: formData.title,
    description: formData.description,
    shortDescription: formData.shortDescription || '',
    category: formData.category,
    venue: {
      name: formData.venueName,
      address: formData.venueAddress || '',
      city: formData.venueCity || '',
    },
    dateTime: {
      start: startDateTime,
      end: endDateTime,
    },
    pricing: {
      ticketPrice: parseFloat(formData.ticketPrice),
      currency: formData.currency,
      earlyBird: formData.earlyBirdPrice && formData.earlyBirdDeadline ? {
        price: parseFloat(''+formData.earlyBirdPrice),
        deadline: new Date(formData.earlyBirdDeadline),
      } : undefined,
    },
    capacity: {
      totalSeats: parseInt(formData.totalSeats),
    },
    tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    features: formData.features ? formData.features.split(',').map(feature => feature.trim()).filter(Boolean) : [],
    ageRestriction: {
      minAge: parseInt(formData.minAge) || 0,
      maxAge: formData.maxAge ? parseInt(""+formData.maxAge) : undefined,
    },
    socialLinks: {
      website: formData.website && isValidUrl(formData.website) ? formData.website : undefined,
      facebook: formData.facebook && isValidUrl(formData.facebook) ? formData.facebook : undefined,
      twitter: formData.twitter && isValidUrl(formData.twitter) ? formData.twitter : undefined,
      instagram: formData.instagram && isValidUrl(formData.instagram) ? formData.instagram : undefined,
    },
    images,
    coverImage: coverImage!,
    status,
  };
};

const CreateEventPage = () => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    venueName: '',
    venueAddress: '',
    venueCity: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    ticketPrice: '',
    currency: 'EGP',
    totalSeats: '',
    tags: '',
    features: '',
    minAge: '',
    maxAge: '',
    website: '',
    facebook: '',
    twitter: '',
    instagram: '',
    earlyBirdPrice: '',
    earlyBirdDeadline: '',
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories dynamically
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response.data.map(cat => cat.name));
      } catch (e) {
        toast.error('Failed to load categories'+ e);
      }
    };
    fetchCategories();
  }, []);

  // Enhanced validation
  const validationErrors = useMemo(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 100) newErrors.title = 'Title cannot exceed 100 characters';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length > 2000) newErrors.description = 'Description cannot exceed 2000 characters';
    if (formData.shortDescription && formData.shortDescription.length > 200) {
      newErrors.shortDescription = 'Short description cannot exceed 200 characters';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.venueName.trim()) newErrors.venueName = 'Venue name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (formData.endDate && formData.endTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      if (endDateTime <= startDateTime) {
        newErrors.endDate = 'End date/time must be after start date/time';
      }
    }
    if (!formData.ticketPrice) newErrors.ticketPrice = 'Ticket price is required';
    if (formData.ticketPrice && (isNaN(parseFloat(formData.ticketPrice)) || parseFloat(formData.ticketPrice) < 0)) {
      newErrors.ticketPrice = 'Ticket price must be a non-negative number';
    }
    if (formData.earlyBirdPrice && (isNaN(formData.earlyBirdPrice) || formData.earlyBirdPrice < 0)) {
      newErrors.earlyBirdPrice = 'Early bird price must be a non-negative number';
    }
    if (formData.earlyBirdPrice && !formData.earlyBirdDeadline) {
      newErrors.earlyBirdDeadline = 'Early bird deadline is required if price is provided';
    }
    if (formData.earlyBirdDeadline && formData.startDate) {
      const earlyBirdDeadline = new Date(formData.earlyBirdDeadline);
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      if (earlyBirdDeadline >= startDateTime) {
        newErrors.earlyBirdDeadline = 'Early bird deadline must be before event start';
      }
    }
    if (!formData.totalSeats) newErrors.totalSeats = 'Total seats is required';
    if (formData.totalSeats && (isNaN(parseInt(formData.totalSeats)) || parseInt(formData.totalSeats) < 1)) {
      newErrors.totalSeats = 'Total seats must be at least 1';
    }
    if (formData.minAge && (isNaN(parseInt(formData.minAge)) || parseInt(formData.minAge) < 0)) {
      newErrors.minAge = 'Minimum age must be a non-negative number';
    }
    if (formData.maxAge && (isNaN(formData.maxAge) || formData.maxAge < 0 || formData.maxAge > 120)) {
      newErrors.maxAge = 'Maximum age must be between 0 and 120';
    }
    if (formData.minAge && formData.maxAge && parseInt(formData.minAge) > formData.maxAge) {
      newErrors.maxAge = 'Maximum age must be greater than minimum age';
    }
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Invalid website URL';
    }
    if (formData.facebook && !isValidUrl(formData.facebook)) {
      newErrors.facebook = 'Invalid Facebook URL';
    }
    if (formData.twitter && !isValidUrl(formData.twitter)) {
      newErrors.twitter = 'Invalid Twitter URL';
    }
    if (formData.instagram && !isValidUrl(formData.instagram)) {
      newErrors.instagram = 'Invalid Instagram URL';
    }
    if (!coverImage) newErrors.coverImage = 'Cover image is required';
    if (images.length > 5) newErrors.images = 'Cannot upload more than 5 additional images';
    if (coverImage && coverImage.size > 5 * 1024 * 1024) {
      newErrors.coverImage = 'Cover image must be less than 5MB';
    }
    images.forEach((image, index) => {
      if (image.size > 5 * 1024 * 1024) {
        newErrors.images = `Image ${index + 1} must be less than 5MB`;
      }
    });

    return newErrors;
  }, [formData, coverImage, images]);

  const isFormValid = Object.keys(validationErrors).length === 0;

  const handleInputChange = useCallback((field: keyof EventFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);
  const handleFileChange = useCallback((type: 'cover' | 'images', files: FileList | null) => {
    if (!files) return;
    if (type === 'cover') {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, coverImage: 'Cover image must be less than 5MB' }));
        return;
      }
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
      if (errors.coverImage) {
        setErrors(prev => ({ ...prev, coverImage: '' }));
      }
    } else {
      const newImages = Array.from(files).slice(0, 5); // Limit to 5 images
      if (newImages.some(file => file.size > 5 * 1024 * 1024)) {
        setErrors(prev => ({ ...prev, images: 'Each image must be less than 5MB' }));
        return;
      }
      setImages(newImages);
      setImagePreviews(newImages.map(file => URL.createObjectURL(file)));
      if (errors.images) {
        setErrors(prev => ({ ...prev, images: '' }));
      }
    }
  }, [errors]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [coverImagePreview, imagePreviews]);

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published' = 'draft') => {
    e.preventDefault();
    setErrors(validationErrors);

    if (!isFormValid) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const eventData = mapFormDataToCreateEventRequest(formData, coverImage, images, status);
      await eventService.createEvent(eventData);
      toast.success(`Event ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
      setFormData({
        title: '',
        description: '',
        shortDescription: '',
        category: '',
        venueName: '',
        venueAddress: '',
        venueCity: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        ticketPrice: '',
        currency: 'EGP',
        totalSeats: '',
        tags: '',
        features: '',
        minAge: '',
        maxAge: '',
        website: '',
        facebook: '',
        twitter: '',
        instagram: '',
        earlyBirdPrice: '',
        earlyBirdDeadline: '',
      });
      setCoverImage(null);
      setCoverImagePreview(null);
      setImages([]);
      setImagePreviews([]);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create event. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-fluid mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
            <p className="text-gray-600 mt-1">Fill in the details to create your event</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
              <InputField
                label="Event Title"
                field="title"
                required
                placeholder="Enter event title"
                value={formData.title}
                onChange={handleInputChange}
                errors={errors}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Category"
                  field="category"
                  as="select"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  errors={errors}
                  options={categories}
                />
                <InputField
                  label="Short Description"
                  field="shortDescription"
                  placeholder="Brief event summary"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  errors={errors}
                />
              </div>
              <InputField
                label="Description"
                field="description"
                as="textarea"
                required
                placeholder="Detailed event description"
                value={formData.description}
                onChange={handleInputChange}
                errors={errors}
              />
            </section>

            {/* Venue Information */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Venue Information</h2>
              <InputField
                label="Venue Name"
                field="venueName"
                icon={MapPin}
                required
                placeholder="Enter venue name"
                value={formData.venueName}
                onChange={handleInputChange}
                errors={errors}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Address"
                  field="venueAddress"
                  placeholder="Street address"
                  value={formData.venueAddress}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <InputField
                  label="City"
                  field="venueCity"
                  placeholder="City"
                  value={formData.venueCity}
                  onChange={handleInputChange}
                  errors={errors}
                />
              </div>
            </section>

            {/* Date & Time */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Date & Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Start Date"
                  field="startDate"
                  type="date"
                  icon={Calendar}
                  required
                  value={formData.startDate}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <InputField
                  label="Start Time"
                  field="startTime"
                  type="time"
                  icon={Clock}
                  required
                  value={formData.startTime}
                  onChange={handleInputChange}
                  errors={errors}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="End Date"
                  field="endDate"
                  type="date"
                  icon={Calendar}
                  value={formData.endDate}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <InputField
                  label="End Time"
                  field="endTime"
                  type="time"
                  icon={Clock}
                  value={formData.endTime}
                  onChange={handleInputChange}
                  errors={errors}
                />
              </div>
            </section>

            {/* Pricing & Capacity */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing & Capacity</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Ticket Price"
                  field="ticketPrice"
                  type="number"
                  icon={DollarSign}
                  required
                  placeholder="0"
                  value={formData.ticketPrice}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <InputField
                  label="Currency"
                  field="currency"
                  as="select"
                  value={formData.currency}
                  onChange={handleInputChange}
                  errors={errors}
                  options={CURRENCIES}
                />
                <InputField
                  label="Total Seats"
                  field="totalSeats"
                  type="number"
                  icon={Users}
                  required
                  placeholder="100"
                  value={formData.totalSeats}
                  onChange={handleInputChange}
                  errors={errors}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Early Bird Price"
                  field="earlyBirdPrice"
                  type="number"
                  icon={DollarSign}
                  placeholder="0"
                  value={""+formData.earlyBirdPrice}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <InputField
                  label="Early Bird Deadline"
                  field="earlyBirdDeadline"
                  type="datetime-local"
                  icon={Calendar}
                  value={formData.earlyBirdDeadline}
                  onChange={handleInputChange}
                  errors={errors}
                />
              </div>
            </section>

            {/* Additional Details */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Tags"
                  field="tags"
                  icon={Tag}
                  placeholder="music, concert, live (comma separated)"
                  value={formData.tags}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <InputField
                  label="Features"
                  field="features"
                  icon={Star}
                  placeholder="VIP seating, food included (comma separated)"
                  value={formData.features}
                  onChange={handleInputChange}
                  errors={errors}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Minimum Age"
                  field="minAge"
                  type="number"
                  placeholder="18"
                  value={formData.minAge}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <InputField
                  label="Maximum Age"
                  field="maxAge"
                  type="number"
                  placeholder="120"
                  value={""+formData.maxAge}
                  onChange={handleInputChange}
                  errors={errors}
                />
              </div>
              <InputField
                label="Website"
                field="website"
                icon={Globe}
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleInputChange}
                errors={errors}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Facebook"
                  field="facebook"
                  icon={Globe}
                  placeholder="https://facebook.com/event"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <InputField
                  label="Twitter"
                  field="twitter"
                  icon={Globe}
                  placeholder="https://twitter.com/event"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  errors={errors}
                />
                <InputField
                  label="Instagram"
                  field="instagram"
                  icon={Globe}
                  placeholder="https://instagram.com/event"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  errors={errors}
                />
              </div>
            </section>

            {/* Images */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Images</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cover Image <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    {coverImagePreview ? (
                      <img src={coverImagePreview} alt="Cover Preview" className="mx-auto h-24 w-auto mb-2" />
                    ) : (
                      <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('cover', e.target.files)}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label htmlFor="cover-upload" className="cursor-pointer">
                      <span className="text-sm text-gray-600">
                        {coverImage ? coverImage.name : 'Click to upload cover image'}
                      </span>
                    </label>
                  </div>
                  {errors.coverImage && (
                    <p className="text-sm text-red-600">{errors.coverImage}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Additional Images (Max 5)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    {imagePreviews.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {imagePreviews.map((preview, index) => (
                          <img key={index} src={preview} alt={`Preview ${index + 1}`} className="h-16 w-16 object-cover" />
                        ))}
                      </div>
                    ) : (
                      <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange('images', e.target.files)}
                      className="hidden"
                      id="images-upload"
                    />
                    <label htmlFor="images-upload" className="cursor-pointer">
                      <span className="text-sm text-gray-600">
                        {images.length > 0 ? `${images.length} images selected` : 'Click to upload images'}
                      </span>
                    </label>
                  </div>
                  {errors.images && (
                    <p className="text-sm text-red-600">{errors.images}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={isSubmitting || !formData.title}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'published')}
                disabled={isSubmitting || !isFormValid}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Event'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;