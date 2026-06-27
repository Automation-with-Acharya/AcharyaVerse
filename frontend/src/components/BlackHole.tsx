import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function BlackHole() {
  const coreRef    = useRef<THREE.Mesh>(null);
  const diskRef    = useRef<THREE.Mesh>(null);
  const ring1Ref   = useRef<THREE.Mesh>(null);
  const ring2Ref   = useRef<THREE.Mesh>(null);
  const glowRef    = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Core slow spin
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.008;
      coreRef.current.rotation.x += 0.002;
    }

    // Accretion disk fast spin
    if (diskRef.current) {
      diskRef.current.rotation.z += 0.015;
    }

    // Outer rings counter-spin at different speeds
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z -= 0.008;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z += 0.005;
    }

    // Pulsing glow
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.08 + Math.sin(t * 1.5) * 0.04;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Core — dark event horizon */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#1a0050"
          emissiveIntensity={0.6}
          roughness={0.0}
          metalness={1.0}
        />
      </mesh>

      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.4, 32, 32]} />
        <meshBasicMaterial
          color="#3b0099"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Accretion disk — hot inner ring */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.87, 0.48, 16, 100]} />
        <meshStandardMaterial
          color="#ff6200"
          emissive="#ff4500"
          emissiveIntensity={2.5}
          roughness={0.3}
          metalness={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Mid ring — cooler blue-purple */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2.2, 0.3, 0]}>
        <torusGeometry args={[2.53, 0.13, 8, 80]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#6d28d9"
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Outer halo ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 1.8, 0.5, 0]}>
        <torusGeometry args={[3.3, 0.06, 8, 80]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#3b82f6"
          emissiveIntensity={1.0}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Point light to illuminate nearby planets */}
      <pointLight color="#ff6200" intensity={4} distance={30} />
    </group>
  );
}
