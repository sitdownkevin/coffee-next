import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { CartProp } from "~/types/cart";
import type { ItemInCart } from "~/types/item";


export default function Header({
    itemsInCart,
    handleToggleCart,
    cartButtonAnimation,
    handleToggleCoupon,
  }: {
    itemsInCart: ItemInCart[];
    handleToggleCart: () => void;
    cartButtonAnimation: boolean;
    handleToggleCoupon: () => void;
  }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('coffee-next-user');
    navigate('/');
  };
  
    const [cartProp, setCartProp] = useState<CartProp>({
      totalPrice: 0,
      totalItems: 0,
    });
  
    useEffect(() => {
      setCartProp({
        totalPrice: itemsInCart.reduce(
          (sum, itemInCart) =>
            sum + itemInCart.basePrice * itemInCart.quantity,
          0
        ),
        totalItems: itemsInCart.reduce((sum, itemInCart) => sum + itemInCart.quantity, 0),
      });
    }, [itemsInCart]);
  
  
    return (
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm shrink-0">
        <div className="px-3 md:px-6 py-3 md:py-4">
          {/* 移动端布局 */}
          <div className="md:hidden">
            {/* 第一行：Logo和功能按钮 */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">☕</div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Coffee Next
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {/* 优惠券按钮 - 移动端简化 */}
                <button
                  onClick={handleToggleCoupon}
                  className="p-2 rounded-lg bg-gradient-to-r from-red-100 to-pink-100 text-red-600 transition-all duration-200 transform active:scale-95 shadow-sm"
                >
                  <span className="text-lg">🎁</span>
                </button>

                {/* 退出按钮 - 移动端简化 */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 transition-all duration-200 transform active:scale-95"
                >
                  <span className="text-lg">👤</span>
                </button>
              </div>
            </div>

            {/* 第二行：购物车按钮 */}
            <div className="flex justify-center">
              <button
                onClick={handleToggleCart}
                className={`
                  relative group flex items-center space-x-3 px-4 py-2 rounded-xl
                  transition-all duration-300 font-medium transform text-sm w-full max-w-xs
                  ${
                    cartProp.totalItems > 0
                      ? "bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 text-amber-800 shadow-lg border-2 border-amber-200"
                      : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 shadow-md border border-gray-300"
                  }
                  ${
                    cartButtonAnimation
                      ? "scale-105 shadow-xl animate-pulse"
                      : "active:scale-95"
                  }
                `}
              >
                {/* 购物车图标容器 */}
                <div className="relative">
                  <span
                    className={`
                      text-xl transition-all duration-300
                      ${
                        cartButtonAnimation
                          ? "animate-bounce scale-110"
                          : ""
                      }
                    `}
                  >
                    🛒
                  </span>

                  {/* 商品数量徽章 */}
                  {cartProp.totalItems > 0 && (
                    <div
                      className={`
                        absolute -top-1 -right-1
                        bg-gradient-to-r from-red-500 to-red-600 text-white
                        text-xs rounded-full w-5 h-5
                        flex items-center justify-center font-bold
                        shadow-lg border-2 border-white
                        transition-all duration-300
                        ${
                          cartButtonAnimation
                            ? "scale-110"
                            : ""
                        }
                      `}
                    >
                      {cartProp.totalItems > 99 ? "99+" : cartProp.totalItems}
                    </div>
                  )}

                  {/* 发光效果 */}
                  {cartButtonAnimation && (
                    <div className="absolute inset-0 rounded-full bg-amber-400 opacity-30 animate-ping"></div>
                  )}
                </div>

                {/* 购物车信息 */}
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <span className="font-bold">购物车</span>
                    {cartProp.totalItems > 0 && (
                      <span className="text-xs opacity-75">
                        {cartProp.totalItems} 件商品
                      </span>
                    )}
                  </div>

                  {/* 价格显示 */}
                  {cartProp.totalPrice > 0 && (
                    <div className="bg-white/80 rounded-lg px-3 py-1 shadow-inner border border-amber-300/50">
                      <span className="text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        ¥{cartProp.totalPrice}
                      </span>
                    </div>
                  )}
                </div>

                {/* 箭头指示器 */}
                <div className="text-lg opacity-60">
                  →
                </div>
              </button>
            </div>
          </div>

          {/* 桌面端布局 */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">☕</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Coffee Next
                </h1>
                <p className="text-sm text-gray-500">
                  Next Coffee Order System
                </p>
              </div>
            </div>
  
            <div className="flex items-center space-x-4">
              {/* 优惠券按钮 */}
              <button
                onClick={handleToggleCoupon}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 text-red-600 hover:text-red-700 transition-all duration-200 text-sm transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                <span className="text-lg animate-pulse">🎁</span>
                <span className="font-medium">优惠券</span>
              </button>

              {/* 用户信息和退出按钮 */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 text-sm"
              >
                <span className="text-lg">👤</span>
                <span>退出</span>
              </button>

              <button
                onClick={handleToggleCart}
                className={`
                    relative group flex items-center space-x-3 px-6 py-3 rounded-2xl
                    transition-all duration-300 font-medium transform text-base
                    ${
                      cartProp.totalItems > 0
                        ? "bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 hover:from-amber-200 hover:via-amber-100 hover:to-orange-200 text-amber-800 shadow-lg border-2 border-amber-200 hover:border-amber-300"
                        : "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-600 shadow-md border border-gray-300"
                    }
                    ${
                      cartButtonAnimation
                        ? "scale-110 shadow-xl animate-pulse"
                        : "scale-100 hover:scale-105"
                    }
                    hover:shadow-xl active:scale-95
                  `}
              >
                {/* 购物车图标容器 */}
                <div className="relative">
                  <span
                    className={`
                        text-2xl transition-all duration-300
                        ${
                          cartButtonAnimation
                            ? "animate-bounce scale-110"
                            : "group-hover:scale-110"
                        }
                      `}
                  >
                    🛒
                  </span>

                  {/* 商品数量徽章 */}
                  {cartProp.totalItems > 0 && (
                    <div
                      className={`
                          absolute -top-2 -right-2
                          bg-gradient-to-r from-red-500 to-red-600 text-white
                          text-xs rounded-full w-6 h-6
                          flex items-center justify-center font-bold
                          shadow-lg border-2 border-white
                          transition-all duration-300
                          ${
                            cartButtonAnimation
                              ? "scale-110"
                              : "group-hover:scale-105"
                          }
                        `}
                    >
                      {cartProp.totalItems > 99 ? "99+" : cartProp.totalItems}
                    </div>
                  )}

                  {/* 发光效果 - 只在动画时显示 */}
                  {cartButtonAnimation && (
                    <div className="absolute inset-0 rounded-full bg-amber-400 opacity-30 animate-ping"></div>
                  )}
                </div>
  
                {/* 购物车文字 */}
                <div className="flex flex-col items-start">
                  <span className="font-bold">购物车</span>
                  {cartProp.totalItems > 0 && (
                    <span className="text-xs opacity-75">
                      {cartProp.totalItems} 件商品
                    </span>
                  )}
                </div>

                {/* 价格显示 */}
                {cartProp.totalPrice > 0 && (
                  <div className="flex items-center">
                    <div className="bg-white/80 rounded-lg px-3 py-1 shadow-inner border border-amber-300/50">
                      <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        ¥{cartProp.totalPrice}
                      </span>
                    </div>
                  </div>
                )}

                {/* 悬浮时的额外效果 */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* 右侧箭头指示器 */}
                <div
                  className={`
                    text-xl transition-all duration-300 opacity-60
                    ${
                      cartProp.totalItems > 0
                        ? "group-hover:opacity-100 group-hover:translate-x-1"
                        : ""
                    }
                  `}
                >
                  →
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }