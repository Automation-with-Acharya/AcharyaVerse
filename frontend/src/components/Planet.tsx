import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

type PlanetProps = {
  position: [number, number, number];
  color: string;
  name: string;

  selectedPlanet: string | null;

  setSelectedPlanet: (name: string | null) => void;
};

export default function Planet({
  position,
  color,
  name,
  selectedPlanet,
  setSelectedPlanet,
}: PlanetProps) {
  const textRef = useRef<THREE.Group>(null);

  const ref = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    ref.current.rotation.y += 0.01;

    ref.current.position.y =
      position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.2;

    let scale = 1;

    if (hovered) scale = 1.2;

    if (selectedPlanet === name) scale = 2;

    ref.current.scale.set(scale, scale, scale);

    if (textRef.current) {
      textRef.current.position.y =
        position[1] +
        Math.sin(clock.getElapsedTime() + position[0]) * 0.2 -
        1.2;
    }
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
        onClick={() => {
          setSelectedPlanet(name);
        }}
      >
        <sphereGeometry args={[0.7, 64, 64]} />

        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>

      <group
        ref={textRef}
        position={[position[0], position[1] - 1.2, position[2]]}
      >
        <Text fontSize={0.25} color="white">
          {name}
        </Text>
      </group>
    </>
  );
}
