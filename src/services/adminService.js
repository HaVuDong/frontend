import axiosClient from "@/utils/axiosClient";

// ============================================
// DASHBOARD STATS
// ============================================

// Lấy tổng quan dashboard
export const getDashboardSummary = async () => {
  return await axiosClient.get("/admin/dashboard/summary");
};

// Lấy overview stats
export const getOverviewStats = async () => {
  return await axiosClient.get("/admin/dashboard/overview");
};

// ============================================
// REVENUE STATS
// ============================================

// Doanh thu tùy chỉnh
export const getRevenueByPeriod = async (startDate, endDate, period = 'day') => {
  return await axiosClient.get(`/admin/revenue/custom?startDate=${startDate}&endDate=${endDate}&period=${period}`);
};

// Doanh thu hôm nay
export const getTodayRevenue = async () => {
  return await axiosClient.get("/admin/revenue/today");
};

// Doanh thu tuần này
export const getWeekRevenue = async () => {
  return await axiosClient.get("/admin/revenue/week");
};

// Doanh thu tháng này
export const getMonthRevenue = async () => {
  return await axiosClient.get("/admin/revenue/month");
};

// Doanh thu năm nay
export const getYearRevenue = async () => {
  return await axiosClient.get("/admin/revenue/year");
};

// Doanh thu theo loại (order vs booking)
export const getRevenueByType = async (startDate, endDate) => {
  return await axiosClient.get(`/admin/revenue/by-type?startDate=${startDate}&endDate=${endDate}`);
};

// ============================================
// PRODUCT STATS
// ============================================

// Top sản phẩm bán chạy
export const getTopSellingProducts = async (limit = 10, startDate = null, endDate = null) => {
  let url = `/admin/products/top-selling?limit=${limit}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  return await axiosClient.get(url);
};

// Top sản phẩm doanh thu cao
export const getTopRevenueProducts = async (limit = 10, startDate = null, endDate = null) => {
  let url = `/admin/products/top-revenue?limit=${limit}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  return await axiosClient.get(url);
};

// Sản phẩm sắp hết hàng
export const getLowStockProducts = async (threshold = 10) => {
  return await axiosClient.get(`/admin/products/low-stock?threshold=${threshold}`);
};

// Sản phẩm hết hàng
export const getOutOfStockProducts = async () => {
  return await axiosClient.get("/admin/products/out-of-stock");
};

// ============================================
// USER STATS
// ============================================

// Users mới theo thời gian
export const getNewUsersByPeriod = async (startDate, endDate, period = 'day') => {
  return await axiosClient.get(`/admin/users/new?startDate=${startDate}&endDate=${endDate}&period=${period}`);
};

// Top khách hàng VIP
export const getTopCustomers = async (limit = 10, startDate = null, endDate = null) => {
  let url = `/admin/users/top-customers?limit=${limit}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  return await axiosClient.get(url);
};

// ============================================
// ORDER & PAYMENT STATS
// ============================================

// Thống kê orders theo status
export const getOrdersByStatus = async (startDate = null, endDate = null) => {
  let url = "/admin/orders/by-status";
  const params = [];
  if (startDate) params.push(`startDate=${startDate}`);
  if (endDate) params.push(`endDate=${endDate}`);
  if (params.length > 0) url += `?${params.join('&')}`;
  return await axiosClient.get(url);
};

// Thống kê payments theo method
export const getPaymentsByMethod = async (startDate = null, endDate = null) => {
  let url = "/admin/payments/by-method";
  const params = [];
  if (startDate) params.push(`startDate=${startDate}`);
  if (endDate) params.push(`endDate=${endDate}`);
  if (params.length > 0) url += `?${params.join('&')}`;
  return await axiosClient.get(url);
};