import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

type PlanetProps = {
  position: [number, number, number];
  color: string;
  name: string;
};

export default function Planet({
  position,
  color,
  name,
}: PlanetProps) {
  const ref = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!ref.current) return;

    ref.current.rotation.y += 0.01;

    const scale = hovered ? 1.2 : 1;

    ref.current.scale.set(scale, scale, scale);
  });

  return (
  <>
    <mesh
      ref={ref}
      position={position}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
        setHovered(false);
      }}
      onClick={() => console.log(`Entering ${name}`)}
    >
      <sphereGeometry args={[0.7, 64, 64]} />

      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.3}
      />
    </mesh>

    <Text
      position={[
        position[0],
        position[1] - 1.2,
        position[2]
      ]}
      fontSize={0.25}
      color="white"
    >
      {name}
    </Text>
  </>
);
}