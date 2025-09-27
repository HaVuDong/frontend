import axiosClient from "@/utils/axiosClient";

export const getUsers = () => axiosClient.get("/users");

export const getUserById = (id) => axiosClient.get(`/users/${id}`);

export const createUser = (data) => axiosClient.post("/users", data);

export const updateUser = (id, data) => axiosClient.put(`/users/${id}`, data);

export const deleteUser = (id) => axiosClient.delete(`/users/${id}`);

// Auth (ví dụ login/register)
export const login = (credentials) => axiosClient.post("/users/login", credentials);

export const register = (data) => axiosClient.post("/users/register", data);
