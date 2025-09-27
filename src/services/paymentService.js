import axiosClient from "@/utils/axiosClient";

export const getPayments = () => axiosClient.get("/payments");

export const getPaymentById = (id) => axiosClient.get(`/payments/${id}`);

export const createPayment = (data) => axiosClient.post("/payments", data);

export const updatePayment = (id, data) => axiosClient.put(`/payments/${id}`, data);

export const deletePayment = (id) => axiosClient.delete(`/payments/${id}`);
