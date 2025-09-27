import axiosClient from "@/utils/axiosClient";

export const getCustomers = () => axiosClient.get("/customers");

export const getCustomerById = (id) => axiosClient.get(`/customers/${id}`);

export const createCustomer = (data) => axiosClient.post("/customers", data);

export const updateCustomer = (id, data) => axiosClient.put(`/customers/${id}`, data);

export const deleteCustomer = (id) => axiosClient.delete(`/customers/${id}`);
