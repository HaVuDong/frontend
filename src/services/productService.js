import axiosClient from "@/utils/axiosClient";

// ============================================
// PUBLIC FUNCTIONS
// ============================================

// Lấy tất cả products
export const getAllProducts = async (params = {}) => {
  const { page = 1, limit = 10, status, sortBy, sortOrder } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append('page', page);
  queryParams.append('limit', limit);
  if (status) queryParams.append('status', status);
  if (sortBy) queryParams.append('sortBy', sortBy);
  if (sortOrder) queryParams.append('sortOrder', sortOrder);
  
  return await axiosClient.get(`/products?${queryParams.toString()}`);
};

// Lấy product theo ID
export const getProductById = async (id) => {
  return await axiosClient.get(`/products/${id}`);
};

// Lấy product theo slug
export const getProductBySlug = async (slug) => {
  return await axiosClient.get(`/products/slug/${slug}`);
};

// Search products
export const searchProducts = async (search) => {
  return await axiosClient.get(`/products/search?search=${encodeURIComponent(search)}`);
};

// Lấy products theo category
export const getProductsByCategory = async (categoryId, params = {}) => {
  const { page = 1, limit = 10 } = params;
  return await axiosClient.get(`/products/category/${categoryId}?page=${page}&limit=${limit}`);
};

// Lấy top selling products
export const getTopSellingProducts = async (limit = 10) => {
  return await axiosClient.get(`/products/top-selling?limit=${limit}`);
};

// ============================================
// ADMIN FUNCTIONS
// ============================================

// Tạo product (Admin)
export const createProduct = async (productData) => {
  return await axiosClient.post("/products", productData);
};

// Cập nhật product (Admin)
export const updateProduct = async (id, productData) => {
  return await axiosClient.put(`/products/${id}`, productData);
};

// Xóa product (Admin)
export const deleteProduct = async (id) => {
  return await axiosClient.delete(`/products/${id}`);
};

// Lấy sản phẩm sắp hết hàng (Admin)
export const getLowStockProducts = async (threshold = 10) => {
  return await axiosClient.get(`/products/admin/low-stock?threshold=${threshold}`);
};