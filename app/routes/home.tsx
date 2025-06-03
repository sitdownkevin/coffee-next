import { useState } from "react";
import type { Route } from "./+types/home";
import type { Coffee } from "../types/coffee";
import { coffees } from "../data/coffees";
import CoffeeList from "../components/CoffeeList";
import CoffeeDetail from "../components/CoffeeDetail";
import AIAssistant from "../components/AIAssistant";
import Cart from "../components/Cart";
import { useCart } from "../hooks/useCart";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Coffee Next - Next Coffee Order System" },
    { name: "description", content: "Next Coffee Order System" },
  ];
}

export default function Home() {
  const [selectedCoffee, setSelectedCoffee] = useState<Coffee | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [cartButtonAnimation, setCartButtonAnimation] = useState(false);
  
  // 使用购物车Hook
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleSelectCoffee = (coffee: Coffee) => {
    setSelectedCoffee(coffee);
  };

  const handleAddToCart = (orderDetails: any) => {
    addToCart(orderDetails);
    
    // 显示成功提示Toast
    setToastMessage(`${orderDetails.coffee.name} 已添加到购物车`);
    setShowToast(true);
    
    // 购物车按钮动画效果 - 优化时间
    setCartButtonAnimation(true);
    
    // 2.5秒后隐藏Toast
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
    
    // 0.8秒后结束按钮动画
    setTimeout(() => {
      setCartButtonAnimation(false);
    }, 800);
  };

  // 处理语音点单添加到购物车
  const handleVoiceAddToCart = (cartItems: any[]) => {
    console.log('收到语音点单商品：', cartItems);
    cartItems.forEach(item => {
      console.log('正在添加商品到购物车：', item);
      addToCart(item);
    });
    
    // 购物车按钮动画效果
    setCartButtonAnimation(true);
    setTimeout(() => {
      setCartButtonAnimation(false);
    }, 800);
  };

  // 显示Toast消息
  const handleShowToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const handleToggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Toast 提示组件 - 统一的通知系统 */}
      {showToast && (
        <div className="fixed top-24 right-6 z-50 transform transition-all duration-500 ease-out animate-slide-in-right">
          <div className="bg-white border-l-4 border-green-500 rounded-lg shadow-xl p-4 flex items-center space-x-3 max-w-sm">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">✅</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium text-sm">{toastMessage}</p>
              <p className="text-gray-500 text-xs">商品已成功添加</p>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <span className="text-lg">×</span>
            </button>
          </div>
        </div>
      )}

      {/* 顶部导航栏 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">☕</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Next Coffee
                </h1>
                <p className="text-sm text-gray-500">Next Coffee Order System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleToggleCart}
                className={`
                  relative group flex items-center space-x-3 px-6 py-3 rounded-2xl 
                  transition-all duration-300 font-medium transform
                  ${cart.totalItems > 0 
                    ? 'bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 hover:from-amber-200 hover:via-amber-100 hover:to-orange-200 text-amber-800 shadow-lg border-2 border-amber-200 hover:border-amber-300' 
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-600 shadow-md border border-gray-300'
                  }
                  ${cartButtonAnimation ? 'scale-110 shadow-xl animate-pulse' : 'scale-100 hover:scale-105'}
                  hover:shadow-xl active:scale-95
                `}
              >
                {/* 购物车图标容器 */}
                <div className="relative">
                  <span 
                    className={`
                      text-2xl transition-all duration-300
                      ${cartButtonAnimation ? 'animate-bounce scale-110' : 'group-hover:scale-110'}
                    `}
                  >
                    🛒
                  </span>
                  
                  {/* 商品数量徽章 */}
                  {cart.totalItems > 0 && (
                    <div 
                      className={`
                        absolute -top-2 -right-2 
                        bg-gradient-to-r from-red-500 to-red-600 text-white 
                        text-xs rounded-full w-6 h-6 
                        flex items-center justify-center font-bold
                        shadow-lg border-2 border-white
                        transition-all duration-300
                        ${cartButtonAnimation ? 'scale-110' : 'group-hover:scale-105'}
                      `}
                    >
                      {cart.totalItems > 99 ? '99+' : cart.totalItems}
                    </div>
                  )}
                  
                  {/* 发光效果 - 只在动画时显示 */}
                  {cartButtonAnimation && (
                    <div className="absolute inset-0 rounded-full bg-amber-400 opacity-30 animate-ping"></div>
                  )}
                </div>

                {/* 购物车文字 */}
                <div className="flex flex-col items-start">
                  <span className="text-lg font-bold">购物车</span>
                  {cart.totalItems > 0 && (
                    <span className="text-xs opacity-75">
                      {cart.totalItems} 件商品
                    </span>
                  )}
                </div>

                {/* 价格显示 */}
                {cart.totalPrice > 0 && (
                  <div className="flex items-center">
                    <div className="bg-white/80 rounded-lg px-3 py-1 shadow-inner border border-amber-300/50">
                      <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        ¥{cart.totalPrice}
                      </span>
                    </div>
                  </div>
                )}

                {/* 悬浮时的额外效果 */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* 右侧箭头指示器 */}
                <div className={`
                  text-xl transition-all duration-300 opacity-60
                  ${cart.totalItems > 0 ? 'group-hover:opacity-100 group-hover:translate-x-1' : ''}
                `}>
                  →
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 - 三列布局 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 左列：咖啡列表 */}
        <div className="w-1/3 min-w-[320px] max-w-[400px]">
          <CoffeeList 
            coffees={coffees}
            selectedCoffee={selectedCoffee}
            onSelectCoffee={handleSelectCoffee}
          />
        </div>

        {/* 中列：咖啡详情 */}
        <div className="flex-1 min-w-[400px]">
          <CoffeeDetail 
            coffee={selectedCoffee}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* 右列：AI助手 */}
        <div className="w-1/3 min-w-[300px] max-w-[380px]">
          <AIAssistant 
            onAddToCart={handleVoiceAddToCart}
            onOpenCart={handleToggleCart}
            onShowToast={handleShowToast}
          />
        </div>
      </main>

      {/* 购物车组件 */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart.items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />
    </div>
  );
}