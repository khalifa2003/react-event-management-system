import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tag, Palette, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoryService } from '../services/categoryService';
import type { CategoryFormData } from '../interfaces/Category';
import type { UpdateCategoryRequest } from '../interfaces/Category';

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
}: {
  label: string;
  field: keyof CategoryFormData;
  type?: string;
  icon?: React.ComponentType<any>;
  placeholder?: string;
  required?: boolean;
  as?: 'input' | 'textarea';
  value: string;
  onChange: (field: keyof CategoryFormData, value: string) => void;
  errors: Record<string, string>;
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

// Helper function to validate hex color
const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

// Helper function to transform form data
const mapFormDataToUpdateCategoryRequest = (
  formData: CategoryFormData,
  id: string
): UpdateCategoryRequest => {
  return {
    _id: id,
    name: formData.name,
    description: formData.description || undefined,
    image: formData.image || '',
    color: formData.color || undefined,
    isActive: formData.isActive,
  };
};

const UpdateCategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: '#3B82F6',
    isActive: true,
    image: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch category data on mount
  useEffect(() => {
    if (!id) {
      toast.error('Invalid category ID');
      navigate('/categories');
      return;
    }

    const fetchCategory = async () => {
      try {
        const response = await categoryService.getCategory(id);
        const category = response.data;
        setFormData({
          name: category.name,
          description: category.description || '',
          color: category.color,
          isActive: category.isActive,
          image: category.image || '',
        });
      } catch (error: any) {
        console.error('Error fetching category:', error);
        toast.error('Failed to load category data');
        navigate('/categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id, navigate]);

  // Validation
  const validationErrors = useMemo(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (formData.name.length > 50) newErrors.name = 'Category name cannot exceed 50 characters';
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }
    if (!isValidHexColor(formData.color)) {
      newErrors.color = 'Color must be a valid hex code (e.g., #3B82F6)';
    }

    return newErrors;
  }, [formData]);

  const isFormValid = Object.keys(validationErrors).length === 0;

  const handleInputChange = useCallback((field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleToggleChange = useCallback((field: keyof CategoryFormData, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(validationErrors);

    if (!isFormValid) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (!id) {
      toast.error('Invalid category ID');
      return;
    }

    setIsSubmitting(true);

    try {
      const categoryData = mapFormDataToUpdateCategoryRequest(formData, id);
      console.log('Submitting update category data:', categoryData);
      await categoryService.updateCategory(categoryData);
      toast.success('Category updated successfully!');
      navigate('/categories');
    } catch (error: any) {
      console.error('Error updating category:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to update category. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-fluid mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Update Category</h1>
            <p className="text-gray-600 mt-1">Modify the details of the category</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Category Information */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Category Information</h2>
              <InputField
                label="Category Name"
                field="name"
                icon={Tag}
                required
                placeholder="Enter category name"
                value={formData.name}
                onChange={handleInputChange}
                errors={errors}
              />
              <InputField
                label="Description"
                field="description"
                as="textarea"
                placeholder="Enter category description"
                value={formData.description}
                onChange={handleInputChange}
                errors={errors}
              />
              <InputField
                label="Image URL"
                field="image"
                type="url"
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                value={formData.image}
                onChange={handleInputChange}
                errors={errors}
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Category Image Preview"
                    className="h-24 w-auto rounded-lg"
                    onError={() => toast.error('Invalid image URL')}
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <div className="relative flex items-center">
                  <Palette className="absolute left-3 h-4 w-4 text-gray-400" />
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-12 h-12 border-none rounded-lg mr-2"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    placeholder="#3B82F6"
                    className={`flex-1 px-3 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.color ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.color && (
                  <p className="text-sm text-red-600">{errors.color}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Active</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleToggleChange('isActive', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Category'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/categories')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategoryPage;