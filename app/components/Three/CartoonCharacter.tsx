import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { ChatStatus } from "~/types/chat";
import { ChatStatusEnum } from "~/types/chat";

export default function CartoonCharacter({ chatStatus }: { chatStatus: ChatStatus }) {
  const characterRef = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Group>(null!);
  const leftEyeRef = useRef<THREE.Group>(null!);
  const rightEyeRef = useRef<THREE.Group>(null!);
  const mouthRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const baseRotation = { x: 0.2, y: 0.3, z: 0 };

    // --- 通用动画 (头部) ---
    headRef.current.position.y = Math.sin(t * 1.5) * 0.05;
    const blink = t % 5 > 4.8 ? 0.1 : 1;
    if (leftEyeRef.current) leftEyeRef.current.scale.y = blink;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = blink;

    // --- 重置动画属性 (平滑过渡) ---
    // 重置头部独立动画
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, 0.1);
    leftEyeRef.current.position.y = THREE.MathUtils.lerp(leftEyeRef.current.position.y, 0, 0.1);
    rightEyeRef.current.position.y = THREE.MathUtils.lerp(rightEyeRef.current.position.y, 0, 0.1);
    mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 1, 0.1);
    mouthRef.current.scale.x = THREE.MathUtils.lerp(mouthRef.current.scale.x, 1, 0.1);
    // 重置整体模型动画
    characterRef.current.rotation.x = THREE.MathUtils.lerp(characterRef.current.rotation.x, baseRotation.x, 0.1);
    characterRef.current.rotation.y = THREE.MathUtils.lerp(characterRef.current.rotation.y, baseRotation.y, 0.1);
    
    // --- 根据状态应用不同动画 ---
    switch (chatStatus) {
      case ChatStatusEnum.Inputting: // 说话中
        // 嘴部动画
        const mouthScale = 0.5 + Math.abs(Math.sin(t * 15)) * 0.7;
        mouthRef.current.scale.y = mouthScale;
        // 头部晃动
        headRef.current.rotation.x = Math.sin(t * 10) * 0.1;
        headRef.current.rotation.z = Math.sin(t * 2) * 0.15;
        // 整体点头
        characterRef.current.rotation.x = baseRotation.x + Math.sin(t * 6) * 0.15;
        break;

      case ChatStatusEnum.AsrProcessing: // 思考中 (摇头)
      case ChatStatusEnum.NlpProcessing:
        // 头部歪头思考
        headRef.current.rotation.z = Math.sin(t * 0.8) * 0.1 + 0.2;
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.3;
        // 眼睛上移
        leftEyeRef.current.position.y = 0.1;
        rightEyeRef.current.position.y = 0.1;
        // 嘴巴抿成线
        mouthRef.current.scale.y = 0.15;
        mouthRef.current.scale.x = 0.8;
        // 整体摇头
        characterRef.current.rotation.y = baseRotation.y + Math.sin(t * 5) * 0.2;
        break;

      case ChatStatusEnum.Pending: // 等待中 (左顾右盼)
        // 头部独立动画
        headRef.current.rotation.y = Math.sin(t * 0.7) * 0.4;
        headRef.current.rotation.z = Math.sin(t) * 0.1;
        // 整体轻微晃动
        characterRef.current.rotation.y = baseRotation.y + Math.sin(t * 2) * 0.1;
        break;

      case ChatStatusEnum.Completed: // 已完成 (点头)
        // 头部独立动画
        headRef.current.rotation.z = Math.sin(t * 0.8) * 0.05;
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
        // 整体点头
        characterRef.current.rotation.x = baseRotation.x + Math.sin(t * 3) * 0.1;
        break;
      default:
        // 闲置
        headRef.current.rotation.z = Math.sin(t * 0.8) * 0.05;
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
        break;
    }
  });

  return (
    <group ref={characterRef} rotation={[0.2, 0.3, 0]}>
      <group ref={headRef} position={[0, -0.1, 0]} rotation={[0, 0, 0]}>
        {/* 头部 */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial color="#F5C6A0" roughness={0.6} />
        </mesh>

        {/* 头发 */}
        <group>
          <mesh position={[0, 0.5, 0]} castShadow>
            <sphereGeometry args={[0.9, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial color="#8B4513" roughness={0.8} />
          </mesh>
          {/* 两侧发髻 */}
          <mesh position={[-0.7, 0.4, -0.2]} castShadow>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color="#8B4513" roughness={0.8} />
          </mesh>
          <mesh position={[0.7, 0.4, -0.2]} castShadow>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color="#8B4513" roughness={0.8} />
          </mesh>
        </group>
        
        {/* 眼睛 */}
        <group ref={leftEyeRef} position={[-0.45, 0.2, 0.8]}>
          <mesh>
            <sphereGeometry args={[0.24, 32, 32]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0, 0, 0.18]}>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>
           <mesh position={[0.05, 0.05, 0.21]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial emissive="white" color="white" />
          </mesh>
        </group>
        <group ref={rightEyeRef} position={[0.45, 0.2, 0.8]}>
          <mesh>
            <sphereGeometry args={[0.24, 32, 32]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0, 0, 0.18]}>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>
           <mesh position={[0.05, 0.05, 0.21]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial emissive="white" color="white" />
          </mesh>
        </group>

        {/* 嘴巴 */}
        <mesh ref={mouthRef} position={[0, -0.2, 0.88]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.1, 32]} />
          <meshStandardMaterial color="#800000" side={THREE.DoubleSide} />
        </mesh>
        
        {/* 鼻子 */}
        <mesh position={[0, 0, 0.96]}>
          <sphereGeometry args={[0.12, 16, 8]} />
          <meshStandardMaterial color="#E8B896" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}
