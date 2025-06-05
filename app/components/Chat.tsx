import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ChatBase, MessageBase } from "~/types/ai";
import type { OrderItem } from "~/types/coffee";

interface ChatProps {
  onAddToCart?: (orderItems: any[]) => void;
  onOpenCart?: () => void;
  onShowToast?: (message: string) => void;
}

export function CartoonCharacter({ isInputting }: { isInputting: boolean }) {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // 呼吸
    if (headRef.current) headRef.current.position.y = Math.sin(t * 1.5) * 0.08;
    // 眨眼 - 偶尔眨眼
    const blink = t % 5 > 4.8 ? 0.1 : 1;
    if (leftEyeRef.current) leftEyeRef.current.scale.y = blink;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = blink;
    // 轻微摇摆
    if (headRef.current) headRef.current.rotation.z = Math.sin(t * 0.8) * 0.05;
    // 自然旋转，增加立体感
    if (headRef.current) headRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    // 嘴巴说话动画 - 更夸张
    if (mouthRef.current) {
      const scale = isInputting ? 0.8 + Math.sin(t * 8) * 0.3 : 1;
      mouthRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group ref={headRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {/* 主头部 - 更立体的球形 */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#F5C6A0" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* 棕色头发/帽子 - 更立体的半球 */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <sphereGeometry
          args={[0.88, 32, 32, 0, 2 * Math.PI, 0, Math.PI * 0.65]}
        />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* 头发边缘 - 增加厚度 */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <torusGeometry args={[0.85, 0.08, 16, 32]} />
        <meshStandardMaterial color="#7A3F0F" roughness={0.9} />
      </mesh>

      {/* 眼部凹陷效果 - 移到眼睛后面 */}
      <mesh position={[-0.25, 0.15, 0.75]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#E8B896" roughness={0.9} />
      </mesh>
      <mesh position={[0.25, 0.15, 0.75]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#E8B896" roughness={0.9} />
      </mesh>

      {/* 左眼 - 立体的黑色球体 */}
      <mesh ref={leftEyeRef} position={[-0.25, 0.15, 0.95]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000000" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 右眼 - 立体的黑色球体 */}
      <mesh ref={rightEyeRef} position={[0.25, 0.15, 0.95]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000000" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 左腮红 - 立体效果 */}
      <mesh position={[-0.55, -0.1, 0.75]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#FFB6C1"
          transparent
          opacity={0.6}
          roughness={0.8}
        />
      </mesh>

      {/* 右腮红 - 立体效果 */}
      <mesh position={[0.55, -0.1, 0.75]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#FFB6C1"
          transparent
          opacity={0.6}
          roughness={0.8}
        />
      </mesh>

      {/* 嘴巴外缘 - 立体的唇部 */}
      <mesh position={[0, -0.25, 0.85]} castShadow>
        <torusGeometry args={[0.15, 0.03, 8, 16]} />
        <meshStandardMaterial color="#D2691E" roughness={0.6} />
      </mesh>

      {/* 嘴巴 - 深度感的圆形开口 */}
      <mesh ref={mouthRef} position={[0, -0.25, 0.82]}>
        <cylinderGeometry args={[0.24, 0.25, 0.1, 16]} />
        <meshStandardMaterial color="#8B0000" roughness={0.9} />
      </mesh>

      {/* 舌头 - 更立体 */}
      <mesh position={[0, -0.32, 0.85]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#FF69B4" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* 鼻子 - 增加立体感的小突起 */}
      <mesh position={[0, 0.05, 0.95]}>
        <sphereGeometry args={[0.1, 8, 16]} />
        <meshStandardMaterial color="#E8B896" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function Cartoon({ isInputting }: { isInputting: boolean }) {
  return (
    <div className="relative">
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
        <CartoonCharacter isInputting={isInputting} />
      </Canvas>

      {/* 装饰元素 */}
      <div className="absolute top-4 right-4 text-amber-600">
        {isInputting && (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

const OrderPreview = ({ 
  orderItems, 
  onAddToCart 
}: { 
  orderItems: OrderItem[], 
  onAddToCart: () => void 
}) => {
  if (!orderItems || orderItems.length === 0) return null;
  
  return (
    <div className="bg-white rounded-lg p-4 space-y-3 shadow-lg border border-gray-200">
      <div className="text-lg font-medium text-gray-800 mb-3">订单确认</div>
      
      {/* 订单商品列表 */}
      {orderItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 21v-2h18v2H2zM3 9v8h16V9h2v8c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V9h2zm16-4V3h-2v2H5V3H3v2H1v2h20V5h-2zM6 7h12v2H6V7z"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-800">{item.coffee.name}</div>
            <div className="text-gray-500 text-sm">
              {item.selectedCup?.name} / {item.selectedTemperature?.name} / {item.selectedSugar?.name}
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div className="text-amber-600 font-medium">
                ¥{((item.coffee.basePrice || 0) + (item.selectedCup?.addPrice || 0) + (item.selectedSugar?.addPrice || 0) + (item.selectedTemperature?.addPrice || 0)) * item.quantity}
              </div>
              <div className="text-gray-500">x{item.quantity}</div>
            </div>
          </div>
        </div>
      ))}
      
      {/* 添加到购物车按钮 */}
      <button
        onClick={onAddToCart}
        className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg hover:bg-amber-600 transition-colors font-medium"
      >
        加入购物车
      </button>
    </div>
  );
};

function ChatContainer({
  chat,
  isThinking,
  orderInfo,
  onAddToCart,
  onOpenCart,
  onShowToast,
}: {
  chat: ChatBase;
  isThinking: boolean;
  orderInfo: OrderItem[];
  onAddToCart?: (orderItems: any[]) => void;
  onOpenCart?: () => void;
  onShowToast?: (message: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
      {chat.messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === "human" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`
                        max-w-[80%] rounded-lg px-4 py-2
                        ${
                          message.role === "human"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }
                    `}
          >
            <p className="text-sm">{message.content}</p>
          </div>
        </div>
      ))}
      {isThinking && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800 rounded-bl-none">
            <div className="flex items-center space-x-1">
              <p className="text-sm">正在思考</p>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                <div
                  className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {orderInfo.length > 0 && (
        <div className="flex justify-start">
          <div className="max-w-[80%]">
            <OrderPreview 
              orderItems={orderInfo} 
              onAddToCart={() => {
                if (onAddToCart) {
                  const cartItems = orderInfo.map(item => ({
                    coffee: {
                      name: item.coffee.name,
                      description: '',
                      basePrice: item.coffee.basePrice || 0,
                    },
                    selectedCup: item.selectedCup || { name: '中杯', addPrice: 0 },
                    selectedSugar: item.selectedSugar || { name: '标准甜度', addPrice: 0 },
                    selectedTemperature: item.selectedTemperature || { name: '热饮', addPrice: 0 },
                    quantity: item.quantity,
                    totalPrice: ((item.coffee.basePrice || 0) + 
                                (item.selectedCup?.addPrice || 0) + 
                                (item.selectedSugar?.addPrice || 0) + 
                                (item.selectedTemperature?.addPrice || 0)) * item.quantity,
                  }));
                  onAddToCart(cartItems);
                  
                  // 显示成功提示
                  if (onShowToast) {
                    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
                    onShowToast(`已添加${totalItems}件商品到购物车`);
                  }
                  
                  // 延迟打开购物车
                  setTimeout(() => {
                    if (onOpenCart) {
                      onOpenCart();
                    }
                  }, 1500);
                }
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ChatInput({
  isInputting,
  setIsInputting,
}: {
  isInputting: boolean;
  setIsInputting: (isInputting: boolean) => void;
}) {
  const [buttonPressed, setButtonPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButtonDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (buttonPressed) return;

    setButtonPressed(true);
    setIsInputting(true);

    buttonRef.current?.focus();
  };

  const handleButtonUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!buttonPressed) return;

    setButtonPressed(false);
    setIsInputting(false);
  };

  const handleButtonLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (buttonPressed) {
      setButtonPressed(false);
      setIsInputting(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleButtonDown(e);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleButtonUp(e);
  };

  const handleTouchCancel = (e: React.TouchEvent) => {
    e.preventDefault();
    if (buttonPressed) {
      setButtonPressed(false);
      setIsInputting(false);
    }
  };

  return (
    <div className="p-4 bg-white">
      <div className="flex justify-center">
        <button
          ref={buttonRef}
          onMouseDown={handleButtonDown}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          onContextMenu={(e) => e.preventDefault()}
          className={`
                        w-full max-w-md h-12 rounded-full
                        flex items-center justify-center
                        shadow-lg transform transition-all duration-300
                        select-none touch-none
                        ${
                          buttonPressed
                            ? "bg-red-500 scale-105"
                            : "bg-amber-500 hover:bg-amber-600 active:scale-95"
                        }
                        text-white font-medium
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
                    `}
        >
          <div className="flex items-center space-x-2 pointer-events-none">
            {buttonPressed ? <span>松开发送</span> : <span>按住说话</span>}
          </div>
        </button>
      </div>
    </div>
  );
}

export default function Chat({
  onAddToCart,
  onOpenCart,
  onShowToast,
}: ChatProps = {}) {
  const [isInputting, setIsInputting] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [orderInfo, setOrderInfo] = useState<OrderItem[]>([]);
  const [chat, setChat] = useState<ChatBase>({
    messages: [
      {
        role: "system",
        content: "你好，我是你的咖啡助手，有什么可以帮助你的？",
      },
      { role: "human", content: "我想要点一杯冰的卡布奇诺和冰的拿铁" },
    ],
  });

  const handleOrderInfo = (orderInfoRaw: any) => {

    return orderInfoRaw.map((item: any) =>  ({
      coffee: {
        name: item.name,
      },
      selectedCup: item.selectedCup,
      selectedSugar: item.selectedSugar,
      selectedTemperature: item.selectedTemperature,
      quantity: item.quantity,
    }));
  };

  const fetchChat = async (chat: ChatBase) => {
    setIsThinking(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(chat),
    });
    const data = await response.json();
    setChat({
      messages: [
        ...chat.messages,
        { role: data.message.role, content: data.message.content },
      ],
    });

    setOrderInfo(handleOrderInfo(data.orderInfo));
    setIsThinking(false);
  };

  useEffect(() => {
    fetchChat(chat);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white border-l-gray-500">
      <Cartoon isInputting={isInputting} />
      <ChatContainer 
        chat={chat} 
        isThinking={isThinking} 
        orderInfo={orderInfo} 
        onAddToCart={onAddToCart}
        onOpenCart={onOpenCart}
        onShowToast={onShowToast}
      />
      <ChatInput isInputting={isInputting} setIsInputting={setIsInputting} />
    </div>
  );
}
