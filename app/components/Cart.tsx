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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* 购物车侧边栏 */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* 头部 */}
          <div className="bg-amber-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🛒</span>
              <div>
                <h2 className="text-xl font-bold">购物车</h2>
                <p className="text-amber-100 text-sm">{totalItems} 件商品</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-amber-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* 购物车内容 */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-lg font-semibold mb-2">购物车为空</h3>
                <p className="text-sm text-center px-8">
                  还没有添加任何商品<br />
                  去左侧选择您喜欢的咖啡吧！
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {item.coffee.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatItemDescription(item)}
                        </p>
                        <p className="text-amber-600 font-bold mt-1">
                          ¥{item.unitPrice} × {item.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 text-xl ml-2"
                        title="删除商品"
                      >
                        🗑️
                      </button>
                    </div>

                    {/* 数量调整 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-sm"
                        >
                          -
                        </button>
                        <span className="font-bold text-gray-700 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="font-bold text-lg text-gray-800">
                        ¥{item.totalPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 底部操作区 */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 bg-white p-4 space-y-4">
              {/* 清空购物车按钮 */}
              <button
                onClick={onClearCart}
                className="w-full text-red-600 hover:text-red-700 font-medium py-2 text-sm"
              >
                清空购物车
              </button>

              {/* 总价显示 */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">商品总计：</span>
                  <span className="font-semibold">{totalItems} 件</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">总金额：</span>
                  <span className="text-2xl font-bold text-amber-600">¥{totalPrice}</span>
                </div>
              </div>

              {/* 结账按钮 */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
              >
                {isCheckingOut ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>处理中...</span>
                  </div>
                ) : (
                  `立即结账 ¥${totalPrice}`
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 