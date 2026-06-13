import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

type ProjectileCanvasProps = {
  angle: number;
  velocity: number;
  launchKey: number;
};

function Ball({ angle, velocity, launchKey }: ProjectileCanvasProps) {
  const ref = useRef<THREE.Mesh>(null);

  const elapsedRef = useRef(0);

  useEffect(() => {
    elapsedRef.current = 0;

    if (ref.current) {
      ref.current.position.set(0, 0, 0);
    }
  }, [launchKey]);

  useFrame((_, delta) => {
    if (!ref.current) return;

    if (launchKey === 0) return;

    elapsedRef.current += delta;

    const t = elapsedRef.current;

    const radians = (angle * Math.PI) / 180;

    const vx = velocity * Math.cos(radians);

    const vy = velocity * Math.sin(radians);

    const g = 9.81;

    const scale = 0.1;

    const x = vx * t * scale;

    const y = vy * t * scale - 0.5 * g * t * t * scale;

    if (y < 0) return;

    ref.current.position.set(x, y, 0);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function ProjectileCanvas({
  angle,
  velocity,
  launchKey,
}: ProjectileCanvasProps) {
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

      <Ball angle={angle} velocity={velocity} launchKey={launchKey} />

      <gridHelper args={[20, 20]} />
    </Canvas>
  );
}
