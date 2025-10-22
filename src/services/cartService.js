import axiosClient from "@/utils/axiosClient";

// Lấy giỏ hàng của user
export const getCart = async (userId) => {
  return await axiosClient.get(`/cart?userId=${userId}`);
};

// Thêm sản phẩm vào giỏ
export const addToCart = async (cartData) => {
  const { userId, productId, name, price, quantity, image } = cartData;
  
  return await axiosClient.post("/cart/add", {
    userId,
    productId,
    name,
    price,
    quantity,
    image
  });
};

// Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItem = async (productId, userId, quantity) => {
  return await axiosClient.put(`/cart/update/${productId}`, {
    userId,
    quantity
  });
};

// Xóa sản phẩm khỏi giỏ
export const removeFromCart = async (productId, userId) => {
  return await axiosClient.delete(`/cart/remove/${productId}`, {
    data: { userId }
  });
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (userId) => {
  return await axiosClient.delete("/cart/clear", {
    data: { userId }
  });
};

// Tính tổng tiền giỏ hàng
export const calculateCartTotal = (cartItems) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return {
      subtotal: 0,
      total: 0,
      itemCount: 0
    };
  }

  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const itemCount = cartItems.reduce((count, item) => {
    return count + item.quantity;
  }, 0);

  return {
    subtotal,
    total: subtotal, // Có thể thêm shipping, tax sau
    itemCount
  };
};