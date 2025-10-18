import axiosClient from "@/utils/axiosClient";

export const dashboardService = {
  /**
   * Lấy thống kê tổng quan
   * @returns {Promise} - Stats data
   */
  getStats: async () => {
    try {
      const response = await axiosClient.get("/dashboard/stats");
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
      throw error;
    }
  },

  /**
   * Lấy doanh thu theo tháng
   * @param {number} year - Năm cần lấy dữ liệu
   * @returns {Promise} - Revenue data by month
   */
  getRevenue: async (year) => {
    try {
      const response = await axiosClient.get(`/dashboard/revenue?year=${year}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching revenue for year ${year}:`, error);
      throw error;
    }
  },

  /**
   * Lấy thống kê sử dụng sân
   * @returns {Promise} - Field usage data
   */
  getFieldUsage: async () => {
    try {
      const response = await axiosClient.get("/dashboard/field-usage");
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching field usage:", error);
      throw error;
    }
  },

  /**
   * Lấy hoạt động gần đây
   * @param {number} limit - Số lượng hoạt động cần lấy
   * @returns {Promise} - Activities data
   */
  getActivities: async (limit = 10) => {
    try {
      const response = await axiosClient.get(
        `/dashboard/activities?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching activities:", error);
      throw error;
    }
  },

  /**
   * Lấy thống kê trạng thái booking
   * @returns {Promise} - Booking status data
   */
  getBookingStatus: async () => {
    try {
      const response = await axiosClient.get("/dashboard/booking-status");
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching booking status:", error);
      throw error;
    }
  },

  /**
   * Lấy tất cả dữ liệu dashboard cùng lúc
   * @param {number} year - Năm cho doanh thu
   * @param {number} activityLimit - Số lượng hoạt động
   * @returns {Promise} - All dashboard data
   */
  getAllDashboardData: async (year, activityLimit = 10) => {
    try {
      const [stats, revenue, fieldUsage, activities, bookingStatus] =
        await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRevenue(year),
          dashboardService.getFieldUsage(),
          dashboardService.getActivities(activityLimit),
          dashboardService.getBookingStatus(),
        ]);

      return {
        stats,
        revenue,
        fieldUsage,
        activities,
        bookingStatus,
      };
    } catch (error) {
      console.error("❌ Error fetching all dashboard data:", error);
      throw error;
    }
  },
};