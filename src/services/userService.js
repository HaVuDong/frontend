import axiosClient from "@/utils/axiosClient";

// ===== USER CRUD =====
export const getUsers = () => axiosClient.get("/users"); 
export const getUserById = (id) => axiosClient.get(`/users/${id}`);
export const createUser = (data) => axiosClient.post("/users", data);
export const updateUser = (id, data) => axiosClient.put(`/users/${id}`, data);
export const deleteUser = (id) => axiosClient.delete(`/users/${id}`);
