import axiosClient from "@/utils/axiosClient";

export const getBookings = () => axiosClient.get("/bookings");

export const getBookingById = (id) => axiosClient.get(`/bookings/${id}`);

export const createBooking = (data) => axiosClient.post("/bookings", data);

export const updateBooking = (id, data) => axiosClient.put(`/bookings/${id}`, data);

export const deleteBooking = (id) => axiosClient.delete(`/bookings/${id}`);
