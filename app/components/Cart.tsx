import { useState } from "react";
import type { CartItem } from "../types/cart";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

export default function Cart({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}: CartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // 模拟结账过程
    setTimeout(() => {
      alert('订单提交成功！感谢您的购买！');
      onClearCart();
      setIsCheckingOut(false);
      onClose();
    }, 2000);
  };

  const formatItemDescription = (item: CartItem) => {
    // 移动端简化描述
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return `${item.selectedCup.name_short || item.selectedCup.name} / ${item.selectedSugar.name_short || item.selectedSugar.name} / ${item.selectedTemperature.name_short || item.selectedTemperature.name}`;
    }
    return `${item.selectedCup.name} | ${item.selectedSugar.name} | ${item.selectedTemperature.name}`;
  };

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className={`
          fixed inset-0 z-40 transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={onClose}
        style={{ 
          background: isOpen 
            ? 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)' 
            : 'transparent'
        }}
      />
      
      {/* 购物车侧边栏 */}
      <div 
        className={`
          fixed right-0 top-0 h-full w-full md:max-w-md z-50
          bg-gradient-to-br from-gray-50 via-white to-gray-100 
          shadow-2xl transform transition-all duration-300 ease-in-out
          flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* 头部 */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white p-4 md:p-6 flex items-center justify-between flex-shrink-0 shadow-md">
          {/* Back Button (Left) */}
          <button
            onClick={onClose}
            className="text-white hover:text-amber-200 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
            aria-label="返回"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 md:w-7 md:h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Centered Title and Icon */}
          <div className="flex items-center space-x-3 flex-grow justify-center">
            <div className="relative">
              <span className="text-2xl md:text-3xl">🛒</span>
              {totalItems > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">购物车</h2>
              {/* The subtitle <p> element previously here has been removed for a cleaner look. It can be added back if requested. */}
            </div>
          </div>

          {/* Spacer (Right) - to balance the back button for centering the title */}
          <div className="p-1">
            <div className="w-6 h-6 md:w-7 md:h-7 opacity-0 pointer-events-none"></div> 
          </div>
        </div>

        {/* 购物车内容 */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
              <div className="text-6xl md:text-7xl opacity-30 mb-4">🛍️</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-700">购物车还是空的</h3>
              <p className="text-sm md:text-base">快去挑选你喜欢的咖啡吧！</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {items.map((item, index) => (
                <div 
                  key={item.id}
                  className={`
                    bg-white rounded-lg p-3 md:p-4 border border-gray-200 shadow-sm
                    flex flex-col space-y-2
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-2">
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base leading-tight">
                        {item.coffee.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 break-all">
                        {formatItemDescription(item)}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors duration-200 flex-shrink-0 text-xs md:text-sm"
                      title="删除商品"
                    >
                      移除
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100 mt-2">
                    <div className="flex items-center space-x-1.5 md:space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-gray-100 hover:bg-amber-100 flex items-center justify-center font-bold text-gray-600 hover:text-amber-700 transition-colors duration-200 shadow-sm"
                      >
                        -
                      </button>
                      <span className="font-medium text-gray-700 text-sm md:text-base w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-gray-100 hover:bg-amber-100 flex items-center justify-center font-bold text-gray-600 hover:text-amber-700 transition-colors duration-200 shadow-sm"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-sm md:text-base text-amber-600">
                      ¥{item.totalPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部操作区 */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 bg-white p-3 md:p-4 space-y-3 shadow-top flex-shrink-0">
            <div className="flex justify-between items-center">
              <span className="text-sm md:text-base text-gray-600">商品总计 ({totalItems} 件)</span>
              <span className="text-lg md:text-xl font-bold text-amber-600">
                ¥{totalPrice}
              </span>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`
                w-full font-semibold py-3 px-4 rounded-lg text-white text-base md:text-lg
                transition-all duration-200 shadow-md
                ${isCheckingOut 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-lg active:scale-[0.98]'}
              `}
            >
              {isCheckingOut ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>正在处理...</span>
                </div>
              ) : `立即结账 ¥${totalPrice}`}
            </button>

            <button
              onClick={onClearCart}
              className="w-full text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 py-2 rounded-md transition-colors duration-200 mt-1"
            >
              清空购物车
            </button>
          </div>
        )}
      </div>
    </>
  );
} 
