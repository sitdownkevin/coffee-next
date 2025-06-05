import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ChatBase, MessageBase } from "~/types/ai";

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
        const blink = (t % 5) > 4.8 ? 0.1 : 1;
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
                <meshStandardMaterial 
                    color="#F5C6A0" 
                    roughness={0.8}
                    metalness={0.1}
                />
            </mesh>
            
            {/* 棕色头发/帽子 - 更立体的半球 */}
            <mesh position={[0, 0.25, 0]} castShadow>
                <sphereGeometry args={[0.88, 32, 32, 0, 2 * Math.PI, 0, Math.PI * 0.65]} />
                <meshStandardMaterial 
                    color="#8B4513" 
                    roughness={0.9}
                    metalness={0.05}
                />
            </mesh>
            
            {/* 头发边缘 - 增加厚度 */}
            <mesh position={[0, 0.25, 0]} castShadow>
                <torusGeometry args={[0.85, 0.08, 16, 32]} />
                <meshStandardMaterial 
                    color="#7A3F0F" 
                    roughness={0.9}
                />
            </mesh>
            
            {/* 眼部凹陷效果 - 移到眼睛后面 */}
            <mesh position={[-0.25, 0.15, 0.75]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial 
                    color="#E8B896" 
                    roughness={0.9}
                />
            </mesh>
            <mesh position={[0.25, 0.15, 0.75]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial 
                    color="#E8B896" 
                    roughness={0.9}
                />
            </mesh>
            
            {/* 左眼 - 立体的黑色球体 */}
            <mesh ref={leftEyeRef} position={[-0.25, 0.15, 0.95]} castShadow>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial 
                    color="#000000" 
                    roughness={0.3}
                    metalness={0.8}
                />
            </mesh>
            
            {/* 右眼 - 立体的黑色球体 */}
            <mesh ref={rightEyeRef} position={[0.25, 0.15, 0.95]} castShadow>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial 
                    color="#000000" 
                    roughness={0.3}
                    metalness={0.8}
                />
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
                <meshStandardMaterial 
                    color="#D2691E" 
                    roughness={0.6}
                />
            </mesh>
            
            {/* 嘴巴 - 深度感的圆形开口 */}
            <mesh ref={mouthRef} position={[0, -0.25, 0.82]}>
                <cylinderGeometry args={[0.24, 0.25, 0.1, 16]} />
                <meshStandardMaterial 
                    color="#8B0000" 
                    roughness={0.9}
                />
            </mesh>
            
            {/* 舌头 - 更立体 */}
            <mesh position={[0, -0.32, 0.85]}>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshStandardMaterial 
                    color="#FF69B4" 
                    roughness={0.7}
                    metalness={0.2}
                />
            </mesh>
            
            {/* 鼻子 - 增加立体感的小突起 */}
            <mesh position={[0, 0.05, 0.95]}>
                <sphereGeometry args={[0.1, 8, 16]} />
                <meshStandardMaterial 
                    color="#E8B896" 
                    roughness={0.8}
                />
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
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ChatContainer({ chat }: { chat: ChatBase }) {
    return <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
        {chat.messages.map((message, index) => (
            <div 
                key={index} 
                className={`flex ${message.role === 'human' ? 'justify-end' : 'justify-start'}`}
            >
                <div 
                    className={`
                        max-w-[80%] rounded-lg px-4 py-2
                        ${message.role === 'human' 
                            ? 'bg-blue-500 text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }
                    `}
                >
                    <p className="text-sm">{message.content}</p>
                </div>
            </div>
        ))}
    </div>;
}


function ChatInput({ isInputting, setIsInputting }: { isInputting: boolean, setIsInputting: (isInputting: boolean) => void }) {
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
                        ${buttonPressed 
                            ? 'bg-red-500 scale-105' 
                            : 'bg-amber-500 hover:bg-amber-600 active:scale-95'
                        }
                        text-white font-medium
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
                    `}
                >
                    <div className="flex items-center space-x-2 pointer-events-none">
                        {buttonPressed ? (
                            <span>松开发送</span>
                        ) : (
                            <span>按住说话</span>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
}


export default function Chat() {
    const [isInputting, setIsInputting] = useState(false);
    const [chat, setChat] = useState<ChatBase>({
        messages: [],
    });


    useEffect(() => {
        const fetchChat = async () => {
            const response = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({
                    message: "你好，我是你的咖啡助手，有什么可以帮助你的？"
                }),
            });
            const data = await response.json();
            setChat(data);
        };
        fetchChat();
    }, []);



  return <div className="flex flex-col h-full bg-white border-l-gray-500">
    <Cartoon isInputting={isInputting} />
    <ChatContainer chat={chat} />
    <ChatInput isInputting={isInputting} setIsInputting={setIsInputting} />
  </div>;
}