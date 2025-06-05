import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { ChatStatus } from "~/types/chat";
import { ChatStatusEnum } from "~/types/chat";

export default function CartoonCharacter({ chatStatus }: { chatStatus: ChatStatus }) {
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
      const scale = chatStatus === ChatStatusEnum.Inputting ? 0.8 + Math.sin(t * 8) * 0.3 : 1;
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
