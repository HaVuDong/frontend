import axiosClient from "@/utils/axiosClient";

// 🟢 Lấy tất cả sản phẩm
export const getProducts = () => axiosClient.get("/products");

// 🟢 Lấy chi tiết sản phẩm theo ID
export const getProductById = (id) => axiosClient.get(`/products/${id}`);

// 🟡 Thêm sản phẩm mới
export const addProduct = (data) => axiosClient.post("/products", data);

// 🟠 Cập nhật sản phẩm
export const updateProduct = (id, data) => axiosClient.put(`/products/${id}`, data);

// 🔴 Xóa sản phẩm
export const deleteProduct = (id) => axiosClient.delete(`/products/${id}`);
