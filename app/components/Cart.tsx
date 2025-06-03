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
    return `${item.selectedCup.name} | ${item.selectedSugar.name} | ${item.selectedTemperature.name}`;
  };

  return (
    <>
      {/* 背景遮罩 - 增强动画效果 */}
      <div 
        className={`
          fixed inset-0 z-40 transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={onClose}
        style={{ 
          background: isOpen 
            ? 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)' 
            : 'transparent'
        }}
      />
      
      {/* 购物车侧边栏 - 改进滑入动画 */}
      <div 
        className={`
          fixed right-0 top-0 h-full w-full max-w-md z-50
          bg-gradient-to-br from-white via-gray-50 to-gray-100
          shadow-2xl transform transition-all duration-500 ease-in-out
          ${isOpen ? 'translate-x-0 scale-100' : 'translate-x-full scale-95'}
        `}
        style={{
          boxShadow: isOpen 
            ? '-20px 0 50px rgba(0,0,0,0.3), -10px 0 30px rgba(0,0,0,0.2)' 
            : 'none'
        }}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* 装饰性背景元素 */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <div className="text-9xl transform rotate-12">☕</div>
          </div>
          
          {/* 头部 - 增强渐变效果 */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white p-6 relative overflow-hidden">
            {/* 装饰性背景图案 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 left-4 text-3xl animate-pulse">☕</div>
              <div className="absolute top-8 right-8 text-2xl animate-pulse animate-delay-300">🛒</div>
              <div className="absolute bottom-4 left-12 text-xl animate-pulse animate-delay-700">✨</div>
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <span className="text-3xl animate-bounce">🛒</span>
                  {totalItems > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                      {totalItems}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-wide">购物车</h2>
                  <p className="text-amber-100 text-sm font-medium">
                    {totalItems === 0 ? '暂无商品' : `${totalItems} 件精选咖啡`}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-white hover:text-amber-200 text-3xl transform transition-all duration-200 hover:scale-110 hover:rotate-90 p-2 rounded-full hover:bg-white/20"
              >
                ×
              </button>
            </div>
          </div>

          {/* 购物车内容 */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                <div className="relative mb-6">
                  <div className="text-8xl opacity-20 animate-pulse">🛒</div>
                  <div className="absolute -top-2 -right-2 text-4xl animate-bounce animate-delay-500">✨</div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-700">购物车空空如也</h3>
                <div className="text-center space-y-2">
                  <p className="text-sm">还没有添加任何商品</p>
                  <p className="text-sm bg-amber-50 text-amber-700 px-4 py-2 rounded-lg">
                    🌟 去左侧选择您喜欢的咖啡吧！
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item, index) => (
                  <div 
                    key={item.id}
                    className={`
                      bg-white rounded-xl p-5 border border-gray-200 shadow-sm
                      transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                      animate-fade-in-up opacity-0
                    `}
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">☕</span>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {item.coffee.name}
                          </h3>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {formatItemDescription(item)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-amber-600 font-bold text-lg">
                            ¥{item.unitPrice}
                          </span>
                          <span className="text-gray-400">×</span>
                          <span className="text-gray-700 font-medium">
                            {item.quantity}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-400 hover:text-red-600 text-xl ml-4 p-2 rounded-full hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                        title="删除商品"
                      >
                        🗑️
                      </button>
                    </div>

                    {/* 数量调整 - 美化设计 */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 hover:from-amber-200 hover:to-amber-300 flex items-center justify-center font-bold text-gray-700 hover:text-amber-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                        >
                          -
                        </button>
                        <div className="bg-white rounded-lg px-4 py-2 shadow-inner">
                          <span className="font-bold text-gray-700 text-lg">
                            {item.quantity}
                          </span>
                        </div>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 hover:from-amber-200 hover:to-amber-300 flex items-center justify-center font-bold text-gray-700 hover:text-amber-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="bg-amber-50 rounded-lg px-4 py-2 border border-amber-200">
                        <span className="font-bold text-xl text-amber-700">
                          ¥{item.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 底部操作区 - 增强视觉效果 */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 bg-gradient-to-t from-white to-gray-50 p-6 space-y-4 relative">
              {/* 装饰性分隔线 */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-amber-300 to-orange-300 rounded-full"></div>
              
              {/* 清空购物车按钮 */}
              <button
                onClick={onClearCart}
                className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 font-medium py-3 text-sm rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                🗑️ 清空购物车
              </button>

              {/* 总价显示 - 重新设计 */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200 shadow-inner">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600 font-medium">商品总计：</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">☕</span>
                    <span className="font-bold text-lg text-gray-800">{totalItems} 件</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">总金额：</span>
                  <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-amber-300">
                    <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      ¥{totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* 结账按钮 - 增强设计 */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`
                  w-full font-bold py-4 px-6 rounded-xl text-white text-lg
                  transform transition-all duration-300 shadow-lg
                  ${isCheckingOut 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:via-amber-700 hover:to-orange-600 hover:scale-105 hover:shadow-xl active:scale-95'
                  }
                `}
              >
                {isCheckingOut ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>正在处理订单...</span>
                    <div className="text-xl animate-pulse">⏳</div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">💳</span>
                    <span>立即结账 ¥{totalPrice}</span>
                    <span className="text-xl animate-bounce">🚀</span>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 添加自定义样式到头部 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
          }
          
          .animate-delay-300 {
            animation-delay: 300ms;
          }
          
          .animate-delay-500 {
            animation-delay: 500ms;
          }
          
          .animate-delay-700 {
            animation-delay: 700ms;
          }
        `
      }} />
    </>
  );
} 