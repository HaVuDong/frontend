import axiosClient from "@/utils/axiosClient";

export const register = async (username, email, password) => {
  try {
    return await axiosClient.post("/users/register", {
      username,
      email,
      password,
    });
  } catch (error) {
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    return await axiosClient.post("/users/login", {
      username,
      password,
    });
  } catch (error) {
    throw error;
  }
};

export const me = async () => {
  try {
    return await axiosClient.get("/users/me");
  } catch (error) {
    console.error("❌ Lỗi khi lấy thông tin user:", error);
    throw error;
  }
};
