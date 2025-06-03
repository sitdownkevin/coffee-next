import { useState, useEffect } from "react";
import type { Route } from "./+types/home";
import type { Coffee } from "../types/coffee";
import CoffeeList from "../components/CoffeeList";
import CoffeeDetail from "../components/CoffeeDetail";
import AIAssistant from "../components/AIAssistant";
import Cart from "../components/Cart";
import { useCart } from "../hooks/useCart";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "小咖点单 - 智能咖啡订购系统" },
    { name: "description", content: "智能AI助手陪伴的现代咖啡点单体验" },
  ];
}

export default function Home() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [selectedCoffee, setSelectedCoffee] = useState<Coffee | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [cartButtonAnimation, setCartButtonAnimation] = useState(false);
  
  // 使用购物车Hook
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();

  // 加载咖啡数据
  useEffect(() => {
    const loadCoffeeData = async () => {
      try {
        const response = await fetch('/coffeeSkus.json');
        const data = await response.json();
        setCoffees(data);
        setLoading(false);
      } catch (error) {
        console.error('加载咖啡数据失败:', error);
        setLoading(false);
      }
    };

    loadCoffeeData();
  }, []);

  const handleSelectCoffee = (coffee: Coffee) => {
    setSelectedCoffee(coffee);
  };

  const handleAddToCart = (orderDetails: any) => {
    addToCart(orderDetails);
    
    // 显示成功提示Toast
    setToastMessage(`${orderDetails.coffee.name} 已添加到购物车`);
    setShowToast(true);
    
    // 购物车按钮动画效果
    setCartButtonAnimation(true);
    
    // 3秒后隐藏Toast
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
    
    // 0.6秒后结束按钮动画
    setTimeout(() => {
      setCartButtonAnimation(false);
    }, 600);
  };

  const handleToggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center">
          <div className="text-6xl mb-4">☕</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">小咖点单系统</h2>
          <p className="text-gray-500">正在加载咖啡菜单...</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Toast 提示组件 */}
      <div className={`
        fixed top-20 right-6 z-50 transition-all duration-300 ease-in-out transform
        ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}
      `}>
        <div className="bg-white/95 backdrop-blur-sm border border-green-200 rounded-lg shadow-lg px-4 py-3 flex items-center space-x-3">
          <div className="text-green-500 text-lg">✅</div>
          <span className="text-gray-700 font-medium">{toastMessage}</span>
        </div>
      </div>

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
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium transform
                  ${cart.totalItems > 0 
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-800' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }
                  ${cartButtonAnimation ? 'scale-110 bg-green-100 border-2 border-green-300' : 'scale-100'}
                `}
              >
                <span className={cartButtonAnimation ? 'animate-bounce' : ''}>🛒</span>
                <span>购物车</span>
                <span className={`
                  rounded-full px-2 py-1 text-xs font-bold transition-all duration-200
                  ${cart.totalItems > 0 
                    ? 'bg-amber-200 text-amber-800' 
                    : 'bg-gray-200 text-gray-600'
                  }
                  ${cartButtonAnimation ? 'bg-green-200 text-green-800 scale-125' : ''}
                `}>
                  {cart.totalItems}
                </span>
                {cart.totalPrice > 0 && (
                  <span className="text-sm font-bold">
                    ¥{cart.totalPrice}
                  </span>
                )}
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
          <AIAssistant />
        </div>
      </main>

      {/* 底部状态栏 */}
      {/* <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-3">
        <div className="px-6 flex items-center justify-center text-sm text-gray-500">
          <span className="flex items-center space-x-2">
            <span>🌟</span>
            <span>欢迎使用小咖点单系统 - 让AI为您推荐最适合的咖啡</span>
            <span>🌟</span>
          </span>
        </div>
      </footer> */}

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