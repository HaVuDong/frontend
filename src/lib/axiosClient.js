import API_CONFIG from "@/config/api";
import axios from "axios"
const axiosClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: 1000,
    headers: API_CONFIG.HEADERS
});

axiosClient.interceptors.response.use((response) => response.data,
    (error) => {
        console.error('Error: ', error)
        return Promise.reject(error);
    });



axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwt");
        if (token && !config.url.includes("/auth/local")) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
export default axiosClient;

