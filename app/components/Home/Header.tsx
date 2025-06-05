import { useEffect, useState } from "react";
import type { CartProp } from "~/types/cart";
import type { ItemInCart } from "~/types/item";


export default function Header({
    itemsInCart,
    handleToggleCart,
    cartButtonAnimation,
  }: {
    itemsInCart: ItemInCart[];
    handleToggleCart: () => void;
    cartButtonAnimation: boolean;
  }) {
  
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
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl md:text-3xl">☕</div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Coffee Next
                </h1>
                <p className="text-xs md:text-sm text-gray-500">
                  Next Coffee Order System
                </p>
              </div>
            </div>
  
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={handleToggleCart}
                className={`
                    relative group flex items-center space-x-2 md:space-x-3 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl 
                    transition-all duration-300 font-medium transform text-sm md:text-base
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
                        text-lg md:text-2xl transition-all duration-300
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
                          absolute -top-1 md:-top-2 -right-1 md:-right-2 
                          bg-gradient-to-r from-red-500 to-red-600 text-white 
                          text-xs rounded-full w-5 md:w-6 h-5 md:h-6 
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
  
                {/* 购物车文字 - 在小屏幕上隐藏部分文本 */}
                <div className="flex flex-col items-start">
                  <span className="font-bold">购物车</span>
                  {cartProp.totalItems > 0 && (
                    <span className="text-xs opacity-75 hidden sm:block">
                      {cartProp.totalItems} 件商品
                    </span>
                  )}
                </div>
  
                {/* 价格显示 */}
                {itemsInCart.reduce(
                  (sum, itemInCart) =>
                    sum + itemInCart.basePrice * itemInCart.quantity,
                  0
                ) > 0 && (
                  <div className="flex items-center">
                    <div className="bg-white/80 rounded-lg px-2 md:px-3 py-1 shadow-inner border border-amber-300/50">
                      <span className="text-sm md:text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        ¥
                        {itemsInCart.reduce(
                          (sum, itemInCart) =>
                            sum + itemInCart.basePrice * itemInCart.quantity,
                          0
                        )}
                      </span>
                    </div>
                  </div>
                )}
  
                {/* 悬浮时的额外效果 */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  
                {/* 右侧箭头指示器 - 在小屏幕上隐藏 */}
                <div
                  className={`
                    text-lg md:text-xl transition-all duration-300 opacity-60 hidden sm:block
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