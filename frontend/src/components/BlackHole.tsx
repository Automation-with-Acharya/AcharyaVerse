import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function BlackHole() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;

    meshRef.current.rotation.y += 0.01;
    meshRef.current.rotation.x += 0.003;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <sphereGeometry args={[0.6, 64, 64]} />
      <meshStandardMaterial
  color="#111111"
  emissive="#2200ff"
  emissiveIntensity={0.4}
/>
    </mesh>
  );
}