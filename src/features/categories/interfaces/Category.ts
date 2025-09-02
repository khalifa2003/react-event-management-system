export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  color: string;
  isActive: boolean;
  eventsCount?: number;
  createdAt: string;
  updatedAt: string;
  
}
export interface CategoryStats {
  name: string;
  eventsCount: number;
  activeEventsCount: number;
  totalRevenue: number;
}
export interface CategoryResponse {
  status: 'success';
  data: Category;
}
export interface CategoriesResponse {
  status: 'success';
  data: Category[];
}
export interface CategoryStatsResponse {
  status: 'success';
  data: CategoryStats[];
}
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: File;
  color?: string;
  isActive?: boolean;
}
export interface UpdateCategoryRequest {
  _id: string;
  name?: string;
  description?: string;
  image?: string;
  color?: string;
  isActive?: boolean;
}
export interface DeleteCategoryResponse {
  status: 'success';
  message: string;
}
export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  image: string;
  isActive: boolean;
}