import { useFBX } from '@react-three/drei';

export function Boy() {
  const fbx = useFBX('/models/Boy.fbx');
  return <primitive object={fbx} scale={0.025} position={[0, -1.5, 0]} />;
} 