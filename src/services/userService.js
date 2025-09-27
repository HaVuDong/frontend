import axiosClient from "@/lib/axiosClient";

// Lấy danh sách tất cả người dùng (có thể truyền params để lọc, phân trang)
export const getUsers = async (params) => {
    try {
        return await axiosClient.get("/users", { params });
    } catch (error) {
        throw error;
    }
};

// Lấy thông tin chi tiết người dùng theo ID
export const getUserById = async (id, params) => {
    try {
        return await axiosClient.get(`/users/${id}`, { params });
    } catch (error) {
        throw error;
    }
};

// Cập nhật thông tin người dùng
export const updateUser = async (id, data, params) => {
    try {
        return await axiosClient.put(`/users/${id}`, {
            params,
            data,
        });
    } catch (error) {
        console.error("❌ API updateUser thất bại:", error.response?.data || error.message);
        throw error;
    }
};

// Xoá người dùng theo ID
export const deleteUser = async (id) => {
    try {
        return await axiosClient.delete(`/users/${id}`);
    } catch (error) {
        throw error;
    }
};

// Tạo mới người dùng
export const createUser = async (data) => {
    try {
        const payload = { data }; // Strapi format
        const response = await axiosClient.post("/users", payload);
        return response.data;
    } catch (error) {
        console.error("❌ API createUser lỗi:", error.response?.data || error.message);
        throw error;
    }
};
