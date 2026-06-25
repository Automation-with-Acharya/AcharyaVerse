import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

type PlanetProps = {
  position: [number, number, number];
  color: string;
  name: string;
  size?: number;
  emoji?: string;
  glowColor?: string;
  tagline?: string;
  selectedPlanet: string | null;
  setSelectedPlanet: (name: string | null) => void;
};

export default function Planet({
  position,
  color,
  name,
  size = 0.7,
  glowColor,
  tagline,
  selectedPlanet,
  setSelectedPlanet,
}: PlanetProps) {
  const meshRef   = useRef<THREE.Mesh>(null);
  const glowRef   = useRef<THREE.Mesh>(null);
  const groupRef  = useRef<THREE.Group>(null);
  const labelRef  = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);
  const isSelected = selectedPlanet === name;

  const effectiveGlow = glowColor ?? color;

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();

    if (!meshRef.current || !groupRef.current) return;

    // Gentle floating bob
    const floatY = Math.sin(t * 0.8 + position[0]) * 0.18;
    groupRef.current.position.y = position[1] + floatY;
    groupRef.current.position.x = position[0];
    groupRef.current.position.z = position[2];

    // Self-rotation
    meshRef.current.rotation.y += 0.006;
    meshRef.current.rotation.x += 0.001;

    // Scale on hover / select
    const targetScale = isSelected ? 1.35 : hovered ? 1.15 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    // Glow pulse
    if (glowRef.current) {
      const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
      glowMat.opacity = (isSelected ? 0.22 : hovered ? 0.14 : 0.08)
        + Math.sin(t * 1.5) * 0.03;
    }

    // Billboard labels toward camera
    if (labelRef.current) {
      labelRef.current.lookAt(camera.position);
      labelRef.current.position.y = floatY - size - 0.55;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Atmospheric glow aura */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 1.6, 32, 32]} />
        <meshBasicMaterial
          color={effectiveGlow}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Equatorial ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[size * 1.55, 0.012, 8, 64]} />
        <meshBasicMaterial
          color={effectiveGlow}
          transparent
          opacity={isSelected ? 0.6 : hovered ? 0.35 : 0.18}
        />
      </mesh>

      {/* Planet body */}
      <mesh
        ref={meshRef}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
          setHovered(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
          setHovered(false);
        }}
        onClick={() => setSelectedPlanet(isSelected ? null : name)}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          color={color}
          roughness={0.45}
          metalness={0.25}
          emissive={effectiveGlow}
          emissiveIntensity={isSelected ? 0.35 : hovered ? 0.2 : 0.05}
        />
      </mesh>

      {/* Floating label */}
      <group ref={labelRef} position={[0, -size - 0.55, 0]}>
        <Text
          fontSize={0.22}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          font={undefined}
        >
          {name}
        </Text>
        {tagline && (
          <Text
            fontSize={0.13}
            color={effectiveGlow}
            anchorX="center"
            anchorY="middle"
            position={[0, -0.3, 0]}
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {tagline}
          </Text>
        )}
      </group>
    </group>
  );
}
