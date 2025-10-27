"use client";

import React, { useEffect, useState } from "react";
import { getCart, updateCartItem, removeFromCart, clearCart, calculateCartTotal } from "@/services/cartService";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { 
  FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingBag,
  FaSpinner, FaCheckCircle, FaLock, FaSignInAlt, FaExclamationTriangle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndLoadCart();
  }, []);

  const checkAuthAndLoadCart = async () => {
    try {
      setLoading(true);
      
      // Check JWT cookie
      const jwtToken = Cookies.get('jwt');
      const userDataCookie = Cookies.get('user');
      
      let userData = null;
      if (userDataCookie) {
        try {
          userData = JSON.parse(decodeURIComponent(userDataCookie));
        } catch (error) {
          console.error("Error parsing user cookie:", error);
        }
      }

      // Fallback to localStorage
      if (!jwtToken || !userData) {
        const localUser = localStorage.getItem('user');
        if (localUser) userData = JSON.parse(localUser);
      }

      const userIdValue = userData?._id || userData?.id;
      
      if (!jwtToken || !userIdValue) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      setIsAuthenticated(true);
      setUser(userData);
      setUserId(userIdValue);
      await loadCart(userIdValue);
      
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const loadCart = async (uid) => {
    try {
      const data = await getCart(uid);
      const items = data.cart?.items || data.items || [];
      setCartItems(items);
    } catch (error) {
      console.error("Error loading cart:", error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        Cookies.remove('jwt', { path: '/' });
        Cookies.remove('user', { path: '/' });
        Cookies.remove('role', { path: '/' });
        localStorage.removeItem('user');
        
        setIsAuthenticated(false);
        toast.error("Phiên đăng nhập đã hết hạn!");
      } else {
        toast.error("Không thể tải giỏ hàng!");
      }
      
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }

    if (newQuantity > 99) {
      toast.warning("Số lượng tối đa là 99!");
      return;
    }

    try {
      setUpdatingItems(prev => ({ ...prev, [productId]: true }));
      
      setCartItems(prev =>
        prev.map(item =>
          (item.productId?._id || item.productId) === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      await updateCartItem(productId, userId, newQuantity);
      toast.success("Đã cập nhật số lượng!");
    } catch (error) {
      toast.error("Không thể cập nhật số lượng!");
      await loadCart(userId);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const itemToRemove = cartItems.find(item => 
        (item.productId?._id || item.productId) === productId
      );

      setCartItems(prev =>
        prev.filter(item => 
          (item.productId?._id || item.productId) !== productId
        )
      );

      await removeFromCart(productId, userId);
      toast.success(`Đã xóa "${itemToRemove?.name}"`);
    } catch (error) {
      toast.error("Không thể xóa sản phẩm!");
      await loadCart(userId);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart(userId);
      setCartItems([]);
      setShowClearConfirm(false);
      toast.success("Đã xóa toàn bộ giỏ hàng!");
    } catch (error) {
      toast.error("Không thể xóa giỏ hàng!");
    }
  };

  const handleLoginRedirect = () => {
    Cookies.set('redirectAfterLogin', '/site/cart', { expires: 1, path: '/' });
    router.push('/site/auth/login');
  };

  const cartTotal = calculateCartTotal(cartItems);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 25 } },
    exit: { opacity: 0, scale: 0.8 }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="text-center">
            <FaSpinner className="animate-spin text-6xl text-green-500 mx-auto mb-4" />
            <p className="text-xl text-gray-600 font-medium">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not Authenticated State
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-12 text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <FaShoppingCart className="text-8xl text-gray-300" />
                <FaLock className="absolute -bottom-2 -right-2 text-4xl text-red-500 bg-white rounded-full p-2" />
              </div>
            </div>
            
            <h1 className="text-4xl font-black bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Vui lòng đăng nhập
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Bạn cần đăng nhập để xem giỏ hàng và mua sản phẩm
            </p>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4 text-left">
                <FaExclamationTriangle className="text-blue-500 text-2xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2 text-lg">Tại sao cần đăng nhập?</h3>
                  <ul className="text-blue-800 space-y-2">
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-blue-500" />
                      Lưu giỏ hàng an toàn
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-blue-500" />
                      Theo dõi đơn hàng dễ dàng
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-blue-500" />
                      Nhận ưu đãi đặc biệt
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleLoginRedirect}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <FaSignInAlt />
                Đăng nhập ngay
              </button>
              
              <Link
                href="/site/auth/register"
                className="px-8 py-4 border-2 border-green-500 text-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition-all flex items-center justify-center gap-2"
              >
                Đăng ký tài khoản
              </Link>
            </div>

            <Link
              href="/site/products"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium hover:underline mt-8"
            >
              <FaArrowLeft />
              Quay lại trang sản phẩm
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Authenticated - Show Cart
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/site/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 mb-4"
          >
            <FaArrowLeft />
            <span className="font-medium">Tiếp tục mua sắm</span>
          </Link>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
                <FaShoppingCart className="text-green-600" />
                Giỏ Hàng
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Xin chào, <span className="font-semibold text-green-600">
                  {user?.username || user?.email || 'Khách hàng'}
                </span>
              </p>
            </div>
            
            {cartItems.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all hover:scale-105 flex items-center gap-2"
              >
                <FaTrash />
                Xóa tất cả
              </button>
            )}
          </div>
          
          <p className="text-gray-600 text-lg mt-2">
            {cartItems.length > 0 
              ? `Bạn có ${cartTotal.itemCount} sản phẩm trong giỏ hàng`
              : "Giỏ hàng của bạn đang trống"
            }
          </p>
        </div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-12 text-center"
          >
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!
            </p>
            <Link
              href="/site/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <FaShoppingBag />
              Khám phá sản phẩm
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => {
                  const itemId = item.productId?._id || item.productId;
                  const isUpdating = updatingItems[itemId];
                  
                  return (
                    <motion.div
                      key={itemId}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                        <div className="relative w-full sm:w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-5xl">📦</div>
                          )}
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                              {item.name}
                            </h3>
                            <button onClick={() => handleRemoveItem(itemId)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-110">
                              <FaTrash />
                            </button>
                          </div>

                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <span className="text-2xl font-black text-green-600">{item.price?.toLocaleString()} đ</span>

                            <div className="flex items-center gap-3">
                              <button onClick={() => handleUpdateQuantity(itemId, item.quantity, -1)} disabled={isUpdating} className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-all hover:scale-110 disabled:opacity-50">
                                <FaMinus />
                              </button>
                              <span className="w-12 text-center font-bold text-lg">
                                {isUpdating ? <FaSpinner className="animate-spin mx-auto" /> : item.quantity}
                              </span>
                              <button onClick={() => handleUpdateQuantity(itemId, item.quantity, 1)} disabled={isUpdating} className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all hover:scale-110 disabled:opacity-50">
                                <FaPlus />
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <span className="text-gray-600 font-medium">Tổng:</span>
                            <span className="text-xl font-black text-green-600">{(item.price * item.quantity).toLocaleString()} đ</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaShoppingBag className="text-green-600" />
                  Tổng đơn hàng
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính ({cartTotal.itemCount} SP):</span>
                    <span className="font-semibold">{cartTotal.subtotal.toLocaleString()} đ</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="font-semibold text-green-600">Miễn phí</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
                      <span className="text-3xl font-black text-green-600">{cartTotal.total.toLocaleString()} đ</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/site/checkout"
                  className="block w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all text-center"
                >
                  Thanh toán
                </Link>

                <div className="mt-6 p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <FaCheckCircle />
                    <span className="font-semibold">Mua sắm an toàn</span>
                  </div>
                  <p className="text-sm text-gray-600">Bảo mật 100%. Đổi trả trong 7 ngày.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Clear Cart Confirmation */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowClearConfirm(false)}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Xóa toàn bộ giỏ hàng?</h3>
                  <p className="text-gray-600 mb-8">
                    Xóa tất cả {cartTotal.itemCount} sản phẩm?
                  </p>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleClearCart}
                      className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}