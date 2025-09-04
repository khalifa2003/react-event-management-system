import { type AxiosResponse } from 'axios';
import api from '../../../core/services/api';
import type {
  CategoryResponse,
  CategoriesResponse,
  CategoryStatsResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  DeleteCategoryResponse,
} from '../interfaces/Category';

class CategoryService {
  private api = api;

  async getCategories(): Promise<CategoriesResponse> {
    const response: AxiosResponse<CategoriesResponse> = await this.api.get('/categories');
    return response.data;
  }

  async getCategory(id: string): Promise<CategoryResponse> {
    const response: AxiosResponse<CategoryResponse> = await this.api.get(`/categories/${id}`);
    return response.data;
  }

  async getCategoryStats(): Promise<CategoryStatsResponse> {
    const response: AxiosResponse<CategoryStatsResponse> = await this.api.get('/categories/stats');
    return response.data;
  }
  async createCategory(categoryData: CreateCategoryRequest): Promise<CategoryResponse> {
    if (categoryData.image) {
      const formData = new FormData();
      formData.append('name', categoryData.name);
      if (categoryData.description) formData.append('description', categoryData.description);
      formData.append('image', categoryData.image);
      if (categoryData.color) formData.append('color', categoryData.color);
      if (categoryData.isActive !== undefined) formData.append('isActive', String(categoryData.isActive));
      const response: AxiosResponse<CategoryResponse> = await this.api.post('/categories', formData);
      return response.data;
    }
    const response: AxiosResponse<CategoryResponse> = await this.api.post('/categories', categoryData);
    return response.data;
  }
  async updateCategory(categoryData: UpdateCategoryRequest): Promise<CategoryResponse> {
    const { _id, ...updateData } = categoryData;
    const formData = new FormData();
    if (updateData.name) formData.append('name', updateData.name);
    if (updateData.description) formData.append('description', updateData.description);
    if (updateData.image) {
      formData.append('image', updateData.image);
    }
    if (updateData.color) formData.append('color', updateData.color);
    if (updateData.isActive !== undefined) formData.append('isActive', String(updateData.isActive));
    const response: AxiosResponse<CategoryResponse> = await this.api.put(`/categories/${_id}`, formData);
    return response.data;
  }

  async deleteCategory(id: string): Promise<DeleteCategoryResponse> {
    const response: AxiosResponse<DeleteCategoryResponse> = await this.api.delete(`/categories/${id}`);
    return response.data;
  }
}

export const categoryService = new CategoryService();