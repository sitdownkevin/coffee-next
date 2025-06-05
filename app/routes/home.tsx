import { useState } from "react";
import type { Route } from "./+types/home";
import type { Coffee, CoffeeOption } from "../types/coffee";
import { coffees } from "../data/coffees";
import CoffeeList from "../components/CoffeeList";
import CoffeeDetail from "../components/CoffeeDetail";
import Cart from "../components/Cart";
import { useCart } from "../hooks/useCart";
import AIAssistant from "~/components/AIAssistant";
import Chat from "~/components/Chat";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Cartoon, CartoonCharacter } from "~/components/Chat";

// 定义订单详情类型
interface OrderDetails {
  coffee: Coffee;
  selectedCup: CoffeeOption;
  selectedSugar: CoffeeOption;
  selectedTemperature: CoffeeOption;
  quantity: number;
  totalPrice: number;
}

// 3D悬浮按钮卡通形象组件
function FloatingCartoonButton({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (groupRef.current) {
      // 悬浮效果 - 当打开时更快更明显
      const floatSpeed = isOpen ? 4 : 2;
      const floatAmplitude = isOpen ? 0.15 : 0.1;
      groupRef.current.position.y = Math.sin(t * floatSpeed) * floatAmplitude;
      
      // 旋转效果 - 当打开时更快
      const rotationSpeed = isOpen ? 1 : 0.5;
      const rotationAmplitude = isOpen ? 0.5 : 0.3;
      groupRef.current.rotation.y = Math.sin(t * rotationSpeed) * rotationAmplitude;
    }
    
    if (headRef.current) {
      // 呼吸效果 - 当打开时更明显
      const breatheSpeed = isOpen ? 4 : 3;
      const breatheAmplitude = isOpen ? 0.08 : 0.05;
      const scale = 1 + Math.sin(t * breatheSpeed) * breatheAmplitude;
      headRef.current.scale.set(scale, scale, scale);
    }
    
    // 眨眼效果 - 当打开时更频繁
    const blinkFrequency = isOpen ? 2 : 4;
    const blink = (t % blinkFrequency) > (blinkFrequency - 0.2) ? 0.1 : 1;
    if (leftEyeRef.current) leftEyeRef.current.scale.y = blink;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = blink;
    
    // 嘴巴表情 - 当打开时显示高兴
    if (mouthRef.current) {
      const mouthScale = isOpen ? 1.2 + Math.sin(t * 6) * 0.1 : 1;
      mouthRef.current.scale.set(mouthScale, mouthScale, 1);
    }
  });

  return (
    <group 
      ref={groupRef} 
      onClick={onClick}
      scale={isOpen ? 0.8 : 1}
      position={[0, 0, 0]}
    >
      <group ref={headRef}>
        {/* 主头部 */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.6, 24, 24]} />
          <meshStandardMaterial 
            color="#F5C6A0" 
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        
        {/* 头发 */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <sphereGeometry args={[0.55, 24, 24, 0, 2 * Math.PI, 0, Math.PI * 0.6]} />
          <meshStandardMaterial 
            color="#8B4513" 
            roughness={0.9}
          />
        </mesh>
        
        {/* 左眼 */}
        <mesh ref={leftEyeRef} position={[-0.15, 0.1, 0.5]} castShadow>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* 右眼 */}
        <mesh ref={rightEyeRef} position={[0.15, 0.1, 0.5]} castShadow>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* 左腮红 */}
        <mesh position={[-0.35, -0.05, 0.4]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color="#FFB6C1" 
            transparent 
            opacity={0.6}
          />
        </mesh>
        
        {/* 右腮红 */}
        <mesh position={[0.35, -0.05, 0.4]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color="#FFB6C1" 
            transparent 
            opacity={0.6}
          />
        </mesh>
        
        {/* 嘴巴 */}
        <mesh ref={mouthRef} position={[0, -0.15, 0.45]}>
          <torusGeometry args={[0.08, 0.02, 8, 16]} />
          <meshStandardMaterial color="#D2691E" />
        </mesh>
        
        {/* 鼻子 */}
        <mesh position={[0, 0.03, 0.55]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="#E8B896" />
        </mesh>
      </group>
    </group>
  );
}

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
  // 移动端详情页面显示状态
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  // 添加AI助手显示状态控制
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  // 添加客服聊天窗口状态控制
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // 使用购物车Hook
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleSelectCoffee = (coffee: Coffee) => {
    setSelectedCoffee(coffee);
    // 移动端点击商品后打开详情页面
    setIsMobileDetailOpen(true);
  };

  // 关闭移动端详情页面
  const handleCloseMobileDetail = () => {
    setIsMobileDetailOpen(false);
  };

  const handleAddToCart = (orderDetails: OrderDetails) => {
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
  const handleVoiceAddToCart = (cartItems: OrderDetails[]) => {
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

  // 切换AI助手显示状态
  const handleToggleAIAssistant = () => {
    setIsAIAssistantOpen(!isAIAssistantOpen);
  };

  // 切换客服聊天窗口
  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Toast 提示组件 - 统一的通知系统 */}
      {showToast && (
        <div className="fixed top-24 right-6 z-50 transform transition-all duration-500 ease-out animate-slide-in-right">
          <div className="bg-white border-l-4 border-green-500 rounded-lg shadow-xl p-4 flex items-center space-x-3 max-w-sm">
            <div className="flex-1">
              <p className="text-gray-800 font-medium text-sm">{toastMessage}</p>
              <p className="text-gray-500 text-xs">商品已成功添加</p>
            </div>

          </div>
        </div>
      )}

      {/* 顶部导航栏 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm shrink-0">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl md:text-3xl">☕</div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Coffee Next
                </h1>
                <p className="text-xs md:text-sm text-gray-500">Next Coffee Order System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                onClick={handleToggleCart}
                className={`
                  relative group flex items-center space-x-2 md:space-x-3 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl 
                  transition-all duration-300 font-medium transform text-sm md:text-base
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
                      text-lg md:text-2xl transition-all duration-300
                      ${cartButtonAnimation ? 'animate-bounce scale-110' : 'group-hover:scale-110'}
                    `}
                  >
                    🛒
                  </span>
                  
                  {/* 商品数量徽章 */}
                  {cart.totalItems > 0 && (
                    <div 
                      className={`
                        absolute -top-1 md:-top-2 -right-1 md:-right-2 
                        bg-gradient-to-r from-red-500 to-red-600 text-white 
                        text-xs rounded-full w-5 md:w-6 h-5 md:h-6 
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

                {/* 购物车文字 - 在小屏幕上隐藏部分文本 */}
                <div className="flex flex-col items-start">
                  <span className="font-bold">购物车</span>
                  {cart.totalItems > 0 && (
                    <span className="text-xs opacity-75 hidden sm:block">
                      {cart.totalItems} 件商品
                    </span>
                  )}
                </div>

                {/* 价格显示 */}
                {cart.totalPrice > 0 && (
                  <div className="flex items-center">
                    <div className="bg-white/80 rounded-lg px-2 md:px-3 py-1 shadow-inner border border-amber-300/50">
                      <span className="text-sm md:text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        ¥{cart.totalPrice}
                      </span>
                    </div>
                  </div>
                )}

                {/* 悬浮时的额外效果 */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* 右侧箭头指示器 - 在小屏幕上隐藏 */}
                <div className={`
                  text-lg md:text-xl transition-all duration-300 opacity-60 hidden sm:block
                  ${cart.totalItems > 0 ? 'group-hover:opacity-100 group-hover:translate-x-1' : ''}
                `}>
                  →
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 - 响应式布局 */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* 桌面端：两列布局 */}
        <div className="hidden md:flex w-full">
          {/* 左列：咖啡列表 */}
          <div className="w-1/2 min-w-[320px] max-w-[500px]">
            <CoffeeList 
              coffees={coffees}
              selectedCoffee={selectedCoffee}
              onSelectCoffee={handleSelectCoffee}
            />
          </div>

          {/* 右列：咖啡详情 */}
          <div className="flex-1 min-w-[400px]">
            <CoffeeDetail 
              coffee={selectedCoffee}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* 移动端：菜单为主的布局 */}
        <div className="md:hidden flex flex-col w-full h-full relative">
          {/* 主界面：咖啡菜单列表 */}
          <div className={`flex-1 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isMobileDetailOpen ? '-translate-x-full' : 'translate-x-0'
          }`}>
            <CoffeeList 
              coffees={coffees}
              selectedCoffee={selectedCoffee}
              onSelectCoffee={handleSelectCoffee}
            />
          </div>

          {/* 商品详情页面 - 从右侧滑入 */}
          <div className={`absolute top-0 left-0 w-full h-full bg-white z-30 transition-transform duration-300 ease-in-out flex flex-col ${
            isMobileDetailOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* 详情页面头部 */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center space-x-3 shadow-sm flex-shrink-0">
              <button
                onClick={handleCloseMobileDetail}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <span className="text-xl text-gray-600">←</span>
              </button>
              <h2 className="text-lg font-semibold text-gray-800">商品详情</h2>
            </div>
            
            {/* 详情内容 */}
            <div className="flex-1 overflow-y-auto">
              <CoffeeDetail 
                coffee={selectedCoffee}
                onAddToCart={(orderDetails) => {
                  handleAddToCart(orderDetails);
                  // 添加到购物车后自动关闭详情页面
                  handleCloseMobileDetail();
                }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* 悬浮客服聊天窗口 */}
      <div className="fixed bottom-6 right-6 z-40">
        {/* 聊天窗口 */}
        {isChatOpen && (
          <div className="mb-4 mr-0 bg-white rounded-2xl shadow-2xl border border-gray-200 
            w-80 h-126 max-w-[calc(100vw-3rem)] max-h-[calc(100vh-10rem)]
            overflow-hidden flex flex-col"
          >
            {/* 聊天内容区域 */}
            <div className="flex-1 overflow-hidden">
              <Chat />
            </div>
          </div>
        )}

        {/* 3D卡通形象聊天按钮 */}
        <div 
          className={`w-16 h-16 cursor-pointer transform transition-all duration-300
            ${isChatOpen ? 'scale-90' : 'hover:scale-110 active:scale-95 animate-float-bounce'}
            `}
          onClick={handleToggleChat}
        >
            <Canvas 
                camera={{ position: [2, 1, 4], fov: 60 }}
                dpr={[1, 2]}
                gl={{ antialias: true }}
            >
                {/* 环境光 */}
                <ambientLight intensity={0.4} />
                {/* 主方向光 */}
                <directionalLight position={[5, 5, 3]} intensity={1.2} castShadow />
                {/* 补光 */}
                <directionalLight position={[-3, 2, 5]} intensity={0.6} />
                {/* 点光源 */}
                <pointLight position={[2, 3, 2]} intensity={0.5} />
                
                {/* 卡通角色 */}
                <CartoonCharacter isInputting={false} />
            </Canvas>
          {/* 悬浮效果背景 */}
          <div className={`absolute inset-0 rounded-full transition-all duration-300
            ${isChatOpen 
              ? 'bg-blue-400/20 shadow-lg animate-glow-pulse' 
              : 'bg-gradient-to-br from-blue-400/10 to-purple-400/10 hover:from-blue-400/20 hover:to-purple-400/20 shadow-xl hover:shadow-2xl hover:animate-glow-pulse'
            }
            `}
          />

        </div>
      </div>

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