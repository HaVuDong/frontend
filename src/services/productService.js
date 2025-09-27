import axiosClient from "@/lib/axiosClient"
import axios from 'axios';


export const getProducts = async (params) => {


    try {
        return await axiosClient.get('/products', { 'params': params })
    }
    catch (error) {
        throw error;
    }

}
export const getProductsByid = async (id, params) => {
    try {
        return await axiosClient.get(`/products/${id}`, { 'params': params })
    }
    catch (error) {
        throw error;
    }
}
export const updateProduct = async (id, data, params) => {
    try {
        return await axiosClient.put(`/products/${id}`, {
            'params': params,
            data: data // ✅ Phải có key `data`
        });
    } catch (error) {
        console.error("❌ API updateProduct thất bại:", error.response?.data || error.message);
        throw error;
    }
};
export const deleteProduct = async (id) => {
    try {
        return await axiosClient.delete(`/products/${id}`)
    } catch (error) {
        throw error;

    }
};


export const createProduct = async (data) => {
    try {
        const payload = { data }; // Strapi format
        const response = await axiosClient.post("/products", payload);
        return response.data;
    } catch (error) {
        console.error("❌ API lỗi:", error.response?.data || error.message);
        throw error;
    }
};
