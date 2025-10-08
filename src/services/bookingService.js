import axiosClient from "@/utils/axiosClient";

export const getBookings = () => axiosClient.get("/bookings");
export const getBookingById = (id) => axiosClient.get(`/bookings/${id}`);
export const createBooking = (data) => axiosClient.post("/bookings", data);
export const updateBooking = (id, data) => axiosClient.put(`/bookings/${id}`, data);

// ⚠️ Sử dụng cancelBooking riêng vì backend có logic hoàn tiền
export const cancelBooking = (id) => axiosClient.put(`/bookings/${id}/cancel`);

export const deleteBooking = (id) => axiosClient.delete(`/bookings/${id}`);
