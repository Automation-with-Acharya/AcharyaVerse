import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Ball() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();

    const x = t * 2;

    const y = 3 + 2 * t - 0.5 * 2 * t * t;

    ref.current.position.set(x, Math.max(y, 0), 0);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function ProjectileCanvas() {
  return (
    <Canvas
      style={{
        height: "400px",
        marginTop: "30px",
      }}
      camera={{
        position: [5, 5, 10],
      }}
    >
      <ambientLight intensity={2} />

      <Ball />

      <gridHelper args={[20, 20]} />
    </Canvas>
  );
}
