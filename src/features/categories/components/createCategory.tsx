import React, { useState, useCallback, useMemo } from 'react';
import { Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoryService } from '../services/categoryService';
import type { CategoryFormData } from '../interfaces/Category';
import type { CreateCategoryRequest } from '../interfaces/Category';
import { useNavigate } from 'react-router-dom';
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

const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};
const mapFormDataToCreateCategoryRequest = (
  formData: CategoryFormData
): CreateCategoryRequest => {
  return {
    name: formData.name,
    description: formData.description || undefined,
    image: formData.image, 
    color: formData.color || undefined,
    isActive: formData.isActive,
  };
};

const CreateCategoryPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    image: '',
    color: '#3B82F6',
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Enhanced validation
  const validationErrors = useMemo(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim())
      newErrors.name = 'Category name is required';
    if (formData.name.length > 50)
      newErrors.name = 'Category name cannot exceed 50 characters';
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }
    if (!isValidHexColor(formData.color)) {
      newErrors.color = 'Color must be a valid hex code (e.g., #3B82F6)';
    }

    return newErrors;
  }, [formData]);

  const isFormValid = Object.keys(validationErrors).length === 0;

  const handleInputChange = useCallback(
    (field: keyof CategoryFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    },
    [errors]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(validationErrors);

    if (!isFormValid) {
      toast.error('Please fix the errors in the form', { position: "bottom-right" });
      return;
    }

    setIsSubmitting(true);

    try {
      const categoryData = mapFormDataToCreateCategoryRequest(formData);
      await categoryService.createCategory(categoryData);

      toast.success('Category created successfully!', {
        position: "top-right",
        duration: 2000,
      });
      navigate('/categories')

    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to create category. Please try again.';

      toast.error(message, { position: "bottom-right" });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-fluid mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create New Category</h1>
            <p className="text-gray-600 mt-1">Fill in the details to create a new category</p>
          </div>

          <div className="p-6 space-y-6">
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
            placeholder="https://example.com/image.png"
            value={formData.image}
            onChange={handleInputChange}
            errors={errors}
          />
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {isSubmitting ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryPage;