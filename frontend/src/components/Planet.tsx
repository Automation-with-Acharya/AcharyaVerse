import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type PlanetProps = {
  position: [number, number, number];
  color: string;
};

export default function Planet({
  position,
  color,
}: PlanetProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;

    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}