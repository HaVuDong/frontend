import axiosClient from "@/utils/axiosClient";

export const getFields = () => axiosClient.get("/fields");

export const getFieldById = (id) => axiosClient.get(`/fields/${id}`);

export const createField = (data) => axiosClient.post("/fields", data);

export const updateField = (id, data) => axiosClient.put(`/fields/${id}`, data);

export const deleteField = (id) => axiosClient.delete(`/fields/${id}`);
