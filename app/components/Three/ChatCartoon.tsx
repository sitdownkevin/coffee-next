import { Canvas } from "@react-three/fiber";
import CartoonCharacter from "~/components/Three/CartoonCharacter";
import type { ChatStatus } from "~/types/chat";
import { ChatStatusEnum } from "~/types/chat";

export default function ChatCartoon({ chatStatus }: { chatStatus: ChatStatus }) {
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
        <CartoonCharacter chatStatus={chatStatus} />
      </Canvas>

      {/* 装饰元素 */}
      <div className="absolute top-4 right-4 text-amber-600">
        {chatStatus === ChatStatusEnum.Inputting && (
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
