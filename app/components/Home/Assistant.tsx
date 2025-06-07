import { Canvas } from "@react-three/fiber";
import CartoonCharacter from "~/components/Three/CartoonCharacter";
import Chat from "~/components/Assistant/Chat";
import { ModeToggle } from "~/components/Assistant/ModeToggle";

import type { ItemInCart } from "~/types/item";

import type { ChatBase } from "~/types/chat";
import { ChatStatusEnum } from "~/types/chat";

import { useState } from "react";

function ToggleButton({
  isChatOpen,
  handleToggleChat,
}: {
  isChatOpen: boolean;
  handleToggleChat: () => void;
}) {
  return (
    <div
      className={`relative w-24 h-24 cursor-pointer transform transition-all duration-100 ease-in-out
      ${
        isChatOpen
          ? "scale-95 rotate-12 animate-pulse"
          : "hover:scale-110 active:scale-90 animate-float-bounce hover:rotate-6"
      }
      `}
      onClick={handleToggleChat}
    >
      {/* 外圈发光环 */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-500 ease-out
        ${
          isChatOpen
            ? "animate-spin-slow bg-gradient-to-r from-blue-500/30 to-purple-500/30 scale-125 shadow-2xl"
            : "bg-gradient-to-r from-blue-300/20 to-purple-300/20 hover:scale-110 hover:from-blue-400/40 hover:to-purple-400/40"
        }
        `}
      />

      {/* 中圈脉冲环 */}
      <div
        className={`absolute inset-1 rounded-full transition-all duration-300
        ${
          isChatOpen
            ? "bg-gradient-to-br from-blue-400/40 to-purple-400/40 animate-ping"
            : "bg-gradient-to-br from-blue-200/15 to-purple-200/15 hover:from-blue-300/30 hover:to-purple-300/30"
        }
        `}
      />

      {/* 3D Canvas 容器 */}
      <div
        className={`relative w-full h-full rounded-full overflow-hidden transition-all duration-300
        ${isChatOpen ? "shadow-inner" : "shadow-lg hover:shadow-xl"}
      `}
      >
        <Canvas
          camera={{ position: [2, 1, 4], fov: 60 }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
        >
          {/* 环境光 */}
          <ambientLight intensity={isChatOpen ? 0.6 : 0.4} />
          {/* 主方向光 */}
          <directionalLight
            position={[5, 5, 3]}
            intensity={isChatOpen ? 1.5 : 1.2}
            castShadow
            color={isChatOpen ? "#60A5FA" : "#FFFFFF"}
          />
          {/* 补光 */}
          <directionalLight position={[-3, 2, 5]} intensity={0.6} />
          {/* 点光源 */}
          <pointLight
            position={[2, 3, 2]}
            intensity={isChatOpen ? 0.8 : 0.5}
            color={isChatOpen ? "#A855F7" : "#FFFFFF"}
          />

          {/* 卡通角色 */}
          <CartoonCharacter chatStatus={ChatStatusEnum.Completed} />
        </Canvas>
      </div>

      {/* 点击状态指示器 */}
      {isChatOpen && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg animate-bounce">
          <div className="absolute inset-0.5 bg-green-300 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
}

export default function Assistant({
  isChatOpen,
  handleToggleChat,
  handleAddToCart,
}:
{
  isChatOpen: boolean;
  handleToggleChat: () => void;
  handleAddToCart: (itemInCart: ItemInCart) => void;
}) {
  const [interactionMode, setInteractionMode] = useState<"chat" | "text">("text");

  const [itemsInChat, setItemsInChat] = useState<ItemInCart[]>([]);

  const [chat, setChat] = useState<ChatBase>([
    {
      role: "system",
      content: "你好，我是你的咖啡助手，有什么可以帮助你的？",
    },
  ]);

  return (
    <>
      {/* 遮罩层 - 点击可关闭聊天窗口 */}
      {isChatOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-all duration-300"
          onClick={handleToggleChat}
        />
      )}

      {/* 聊天组件容器 */}
      <div className="fixed bottom-6 right-6 z-40">
        {/* 聊天窗口 */}
        {isChatOpen && (
          <div
            className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 
          w-120 h-160 max-w-[calc(100vw-3rem)] max-h-[calc(100vh-10rem)]
          overflow-hidden flex flex-col animate-chat-window-in"
            onClick={(e) => e.stopPropagation()} // 防止点击聊天窗口时关闭
          >
            {/* 模式切换按钮 */}
            <ModeToggle
              interactionMode={interactionMode}
              setInteractionMode={setInteractionMode}
            />

            {/* 聊天内容区域 */}
            <div className="flex-1 overflow-hidden">
              <Chat
                handleAddToCart={handleAddToCart}
                interactionMode={interactionMode}
                setInteractionMode={setInteractionMode}
                chat={chat}
                setChat={setChat}
                itemsInChat={itemsInChat}
                setItemsInChat={setItemsInChat}
              />
            </div>
          </div>
        )}

        {/* 3D卡通形象聊天按钮 */}
        <ToggleButton
          isChatOpen={isChatOpen}
          handleToggleChat={handleToggleChat}
        />
      </div>
    </>
  );
}
