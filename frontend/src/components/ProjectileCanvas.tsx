import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

type ProjectileCanvasProps = {
  angle: number;
  velocity: number;
  launchKey: number;
};

function Ball({ angle, velocity, launchKey }: ProjectileCanvasProps) {
  const ref = useRef<THREE.Mesh>(null);

  const elapsedRef = useRef(0);

  const [trailPoints, setTrailPoints] = useState<[number, number, number][]>(
    [],
  );

  useEffect(() => {
    elapsedRef.current = 0;

    setTrailPoints([]);

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

    setTrailPoints((prev) => [...prev, [x, y, 0]]);
  });

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {trailPoints.length > 1 && (
        <Line points={trailPoints} color="yellow" lineWidth={2} />
      )}
    </>
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
        height: "500px",
        marginTop: "30px",
      }}
      camera={{
        position: [10, 8, 15],
        fov: 50,
      }}
    >
      <ambientLight intensity={2} />

      <OrbitControls enableDamping />

      <Ball angle={angle} velocity={velocity} launchKey={launchKey} />

      <gridHelper args={[50, 50]} />
    </Canvas>
  );
}
