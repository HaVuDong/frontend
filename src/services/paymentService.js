import axiosClient from "@/utils/axiosClient";

// Tạo payment cho order
export const createPayment = async (orderId, userId) => {
  return await axiosClient.post("/payments", { orderId, userId });
};

// Lấy payment theo orderId
export const getPaymentByOrderId = async (orderId, userId = null) => {
  let url = `/payments/order/${orderId}`;
  if (userId) url += `?userId=${userId}`;
  return await axiosClient.get(url);
};

// ============================================
// COD PAYMENT
// ============================================

// Xác nhận thanh toán COD (Admin)
export const confirmCODPayment = async (orderId, userId) => {
  return await axiosClient.post(`/payments/cod/${orderId}/confirm`, { userId });
};

// ============================================
// MOMO PAYMENT
// ============================================

// Tạo MoMo payment link
export const createMoMoPayment = async (orderId, userId) => {
  return await axiosClient.post("/payments/momo/create", { orderId, userId });
};

// ============================================
// VNPAY PAYMENT
// ============================================

// Tạo VNPay payment link
export const createVNPayPayment = async (orderId, userId) => {
  return await axiosClient.post("/payments/vnpay/create", { orderId, userId });
};

// ============================================
// CANCEL & REFUND
// ============================================

// Hủy payment
export const cancelPayment = async (orderId, userId, reason = null) => {
  return await axiosClient.put(`/payments/${orderId}/cancel`, {
    userId,
    reason
  });
};

// Hoàn tiền (Admin)
export const refundPayment = async (orderId, reason = null) => {
  return await axiosClient.put(`/payments/${orderId}/refund`, { reason });
};

// ============================================
// USER & ADMIN
// ============================================

// Lấy payments của user
export const getUserPayments = async (userId, params = {}) => {
  const { page = 1, limit = 10, status, referenceType } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append('userId', userId);
  queryParams.append('page', page);
  queryParams.append('limit', limit);
  if (status) queryParams.append('status', status);
  if (referenceType) queryParams.append('referenceType', referenceType);
  
  return await axiosClient.get(`/payments/user?${queryParams.toString()}`);
};

// Admin - Xác nhận thanh toán bank transfer
export const adminConfirmBankTransfer = async (orderId) => {
  return await axiosClient.post(`/payments/bank/${orderId}/admin-confirm`);
};

// Admin - Lấy tất cả payments
export const getAllPayments = async (params = {}) => {
  const { page = 1, limit = 10, status, referenceType, method } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append('page', page);
  queryParams.append('limit', limit);
  if (status) queryParams.append('status', status);
  if (referenceType) queryParams.append('referenceType', referenceType);
  if (method) queryParams.append('method', method);
  
  return await axiosClient.get(`/payments/admin/all?${queryParams.toString()}`);
};

// Admin - Thống kê payments
export const getPaymentStats = async () => {
  return await axiosClient.get("/payments/admin/stats");
};