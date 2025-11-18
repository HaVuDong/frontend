import axiosClient from "@/utils/axiosClient";

// Tạo order từ giỏ hàng
export const createOrder = async (orderData) => {
  return await axiosClient.post("/orders", orderData);
};

// Tạo order trực tiếp (không qua cart)
export const createDirectOrder = async (orderData) => {
  return await axiosClient.post("/orders/direct", orderData);
};

// Lấy danh sách orders của user
export const getUserOrders = async (userId, params = {}) => {
  const { page = 1, limit = 10, status, sortBy, sortOrder } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append('userId', userId);
  queryParams.append('page', page);
  queryParams.append('limit', limit);
  if (status) queryParams.append('status', status);
  if (sortBy) queryParams.append('sortBy', sortBy);
  if (sortOrder) queryParams.append('sortOrder', sortOrder);
  
  return await axiosClient.get(`/orders?${queryParams.toString()}`);
};

// Lấy chi tiết order
export const getOrderById = async (orderId, userId) => {
  return await axiosClient.get(`/orders/${orderId}?userId=${userId}`);
};

// Hủy order
export const cancelOrder = async (orderId, userId, reason = null) => {
  return await axiosClient.put(`/orders/${orderId}/cancel`, {
    userId,
    reason
  });
};

// ============================================
// ADMIN FUNCTIONS
// ============================================

// Lấy tất cả orders (Admin)
export const getAllOrders = async (params = {}) => {
  const { page = 1, limit = 10, status, sortBy, sortOrder } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append('page', page);
  queryParams.append('limit', limit);
  if (status) queryParams.append('status', status);
  if (sortBy) queryParams.append('sortBy', sortBy);
  if (sortOrder) queryParams.append('sortOrder', sortOrder);
  
  return await axiosClient.get(`/orders/admin/all?${queryParams.toString()}`);
};

// Cập nhật trạng thái order (Admin)
export const updateOrderStatus = async (orderId, status) => {
  return await axiosClient.put(`/orders/${orderId}/status`, { status });
};

// Thống kê orders (Admin)
export const getOrderStats = async () => {
  return await axiosClient.get("/orders/admin/stats");
};

// ✅ SỬA LẠI: Xác nhận thanh toán chuyển khoản
export const confirmManualPayment = async (orderId, userId) => {
  return await axiosClient.post(`/payments/bank/${orderId}/confirm`, {
    userId
  });
};