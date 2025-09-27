import axiosClient from "@/lib/axiosClient";

export const register = async (username, email, password) => {
    try {

        return await axiosClient.post('/auth/local/register', {
            username,
            email, password
        })
    }
    catch (error) {
        throw error;
    }
}

export const login = async (identifier, password) => {
    try {
        return await axiosClient.post('/auth/local', {
            identifier,
            password
        });
    }
    catch (error) {
        throw error;
    }
}

export const me = async () => {

    try {
        const response = await axiosClient.get('/users/me?populate=role');
        return response;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin user:', error);
        throw error;
    }
};