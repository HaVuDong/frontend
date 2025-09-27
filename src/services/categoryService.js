import axiosClient from "@/lib/axiosClient";

// ✅ Lấy danh sách danh mục (có hỗ trợ params lọc)
export const getCategories = async (params) => {
    try {
        return await axiosClient.get('/categories', { params });
    } catch (error) {
        throw error;
    }
};

// ✅ Lấy 1 danh mục theo ID
export const getCategoryById = async (id, params) => {
    try {
        return await axiosClient.get(`/categories/${id}`, { params });
    } catch (error) {
        throw error;
    }
};

// ✅ Tạo danh mục mới
export const createCategory = async (data) => {
    try {
        return await axiosClient.post('/categories', { data });
    } catch (error) {
        throw error;
    }
};

// ✅ Cập nhật danh mục
export const updateCategory = async (id, data) => {
    try {
        return await axiosClient.put(`/categories/${id}`, {
            data,
        });
    } catch (error) {
        console.error("❌ API updateCategory thất bại:", error.response?.data || error.message);
        throw error;
    }
};

// ✅ Xóa danh mục
export const deleteCategory = async (id) => {
    try {
        return await axiosClient.delete(`/categories/${id}`);
    } catch (error) {
        throw error;
    }
};
