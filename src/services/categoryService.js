import axiosClient from "@/utils/axiosClient";

// Lấy tất cả categories
export const getAllCategories = async (params = {}) => {
  const { page = 1, limit = 10, status } = params;
  const queryParams = new URLSearchParams();
  
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);
  if (status) queryParams.append('status', status);
  
  return await axiosClient.get(`/categories?${queryParams.toString()}`);
};

// Lấy category theo ID
export const getCategoryById = async (id) => {
  return await axiosClient.get(`/categories/${id}`);
};

// Lấy category theo slug
export const getCategoryBySlug = async (slug) => {
  return await axiosClient.get(`/categories/slug/${slug}`);
};

// Tạo category (Admin only)
export const createCategory = async (data) => {
  return await axiosClient.post("/categories", data);
};

// Cập nhật category (Admin only)
export const updateCategory = async (id, data) => {
  return await axiosClient.put(`/categories/${id}`, data);
};

// Xóa category (Admin only)
export const deleteCategory = async (id) => {
  return await axiosClient.delete(`/categories/${id}`);
};

// Lấy products của category
export const getCategoryProducts = async (categoryId, params = {}) => {
  const { page = 1, limit = 10 } = params;
  return await axiosClient.get(`/categories/${categoryId}/products?page=${page}&limit=${limit}`);
};