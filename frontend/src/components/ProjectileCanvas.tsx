import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

type ProjectileCanvasProps = {
  angle: number;
  velocity: number;
  launchKey: number;
  simulationSpeed: number;
  followProjectile: boolean;
  resetCamera: boolean;

  onCameraReset: () => void;
};

function Ball({
  angle,
  velocity,
  launchKey,
  simulationSpeed,
  followProjectile,
  camera,
}: Pick<
  ProjectileCanvasProps,
  "angle" | "velocity" | "launchKey" | "simulationSpeed" | "followProjectile"
> & {
  camera: THREE.Camera;
}) {
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

    elapsedRef.current += delta * simulationSpeed;

    const t = elapsedRef.current;

    const radians = (angle * Math.PI) / 180;

    const vx = velocity * Math.cos(radians);

    const vy = velocity * Math.sin(radians);

    const g = 9.81;

    const scale = 0.03;

    const x = vx * t * scale;

    const y = vy * t * scale - 0.5 * g * t * t * scale;

    if (y < 0) return;

    ref.current.position.set(x, y, 0);

    const desiredPosition = new THREE.Vector3(x + 8, y + 5, 12);

    if (followProjectile) {
      camera.position.lerp(desiredPosition, 0.03);
    }

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

function AngleIndicator({ angle }: { angle: number }) {
  const radians = (angle * Math.PI) / 180;

  const length = 3;

  const points: [number, number, number][] = [
    [0, 0, 0],
    [Math.cos(radians) * length, Math.sin(radians) * length, 0],
  ];

  return <Line points={points} color="lime" lineWidth={3} />;
}

function VelocityVector({
  angle,
  velocity,
}: {
  angle: number;
  velocity: number;
}) {
  const radians = (angle * Math.PI) / 180;

  const length = Math.min(velocity / 10, 8);

  const points: [number, number, number][] = [
    [0, 0, 0],
    [Math.cos(radians) * length, Math.sin(radians) * length, 0],
  ];

  return <Line points={points} color="red" lineWidth={4} />;
}

function PredictedTrajectory({
  angle,
  velocity,
}: {
  angle: number;
  velocity: number;
}) {
  const points: [number, number, number][] = [];

  const radians = (angle * Math.PI) / 180;

  const vx = velocity * Math.cos(radians);

  const vy = velocity * Math.sin(radians);

  const g = 9.81;

  const scale = 0.03;

  for (let t = 0; t <= 20; t += 0.2) {
    const x = vx * t * scale;

    const y = vy * t * scale - 0.5 * g * t * t * scale;

    if (y < 0) break;

    points.push([x, y, 0]);
  }

  return <Line points={points} color="white" dashed />;
}

function ProjectileScene({
  angle,
  velocity,
  launchKey,
  simulationSpeed,
  followProjectile,
}: Pick<
  ProjectileCanvasProps,
  "angle" | "velocity" | "launchKey" | "simulationSpeed" | "followProjectile"
>) {
  const { camera } = useThree();

  return (
    <>
      <AngleIndicator angle={angle} />

      <VelocityVector angle={angle} velocity={velocity} />

      <PredictedTrajectory angle={angle} velocity={velocity} />

      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[2, 0.2, 1]} />

        <meshStandardMaterial color="#555555" />
      </mesh>

      <Ball
        angle={angle}
        velocity={velocity}
        launchKey={launchKey}
        simulationSpeed={simulationSpeed}
        camera={camera}
        followProjectile={followProjectile}
      />
    </>
  );
}

function CameraReset({
  resetCamera,
  onCameraReset,
}: {
  resetCamera: boolean;
  onCameraReset: () => void;
}) {
  const { camera } = useThree();

  useFrame(() => {
    if (!resetCamera) return;

    const target = new THREE.Vector3(25, 15, 30);

    camera.position.lerp(target, 0.05);

    if (camera.position.distanceTo(target) < 0.1) {
      onCameraReset();
    }
  });

  return null;
}

export default function ProjectileCanvas({
  angle,
  velocity,
  launchKey,
  simulationSpeed,
  followProjectile,
  resetCamera,
  onCameraReset,
}: ProjectileCanvasProps) {
  return (
    <Canvas
      style={{
        height: "700px",
        marginTop: "30px",
      }}
      camera={{
        position: [25, 15, 30],
        fov: 60,
      }}
    >
      <ambientLight intensity={2} />

      <CameraReset resetCamera={resetCamera} onCameraReset={onCameraReset} />

      <OrbitControls enableDamping />

      <ProjectileScene
        angle={angle}
        velocity={velocity}
        launchKey={launchKey}
        simulationSpeed={simulationSpeed}
        followProjectile={followProjectile}
      />

      <gridHelper args={[200, 100]} />
    </Canvas>
  );
}
