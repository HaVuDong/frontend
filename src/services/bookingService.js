import axiosClient from "@/utils/axiosClient";

// 🧾 Lấy toàn bộ bookings (admin)
export const getBookings = () => axiosClient.get("/bookings");

// 🔍 Lấy booking theo ID
export const getBookingById = (id) => axiosClient.get(`/bookings/${id}`);

// ➕ Tạo booking mới
export const createBooking = (data) => axiosClient.post("/bookings", data);

// ✏️ Cập nhật booking
export const updateBooking = (id, data) => axiosClient.put(`/bookings/${id}`, data);

// 🧍‍♂️ Lấy danh sách booking theo userId (cho trang “Lịch đã đặt”)
export const getBookingsByUserId = (userId) =>
  axiosClient.get(`/bookings/user/${userId}`);

// ❌ Hủy booking (user tự hủy)
export const cancelBooking = (id) => axiosClient.delete(`/bookings/${id}`);

// 🗑️ Xóa booking (admin)
export const deleteBooking = (id) => axiosClient.delete(`/bookings/${id}`);
