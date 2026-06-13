import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";

type Props = {
  mass1: number;
  mass2: number;
  distance: number;

  simulationRunning: boolean;
  simulationKey: number;
  orbitalMode: boolean;
};

function Bodies({
  mass1,
  mass2,
  distance,
  simulationRunning,
  simulationKey,
  orbitalMode,
}: Props) {
  const leftRef = useRef<THREE.Mesh>(null);

  const rightRef = useRef<THREE.Mesh>(null);

  const initialized = useRef(false);

  const orbitAngle = useRef(0);

  useEffect(() => {
    initialized.current = false;

    if (leftRef.current && rightRef.current) {
      leftRef.current.position.x = -distance / 2;

      rightRef.current.position.x = distance / 2;
    }
  }, [simulationKey, distance]);

  useFrame(() => {
    if (!leftRef.current || !rightRef.current) return;

    if (!simulationRunning) return;

    if (orbitalMode) {
      orbitAngle.current += 0.01;

      const radius = distance / 2;

      leftRef.current.position.set(0, 0, 0);

      rightRef.current.position.x = Math.cos(orbitAngle.current) * radius;

      rightRef.current.position.z = Math.sin(orbitAngle.current) * radius;

      return;
    }

    if (!initialized.current) {
      leftRef.current.position.x = -distance / 2;

      rightRef.current.position.x = distance / 2;

      initialized.current = true;
    }

    const currentDistance = Math.abs(
      rightRef.current.position.x - leftRef.current.position.x,
    );

    if (currentDistance < 1) return;

    const force = (6.674 * mass1 * mass2) / (currentDistance * currentDistance);

    const attractionSpeed = Math.min(force * 0.00001, 0.03);

    leftRef.current.position.x += attractionSpeed;

    rightRef.current.position.x -= attractionSpeed;
  });

  return (
    <>
      <mesh ref={leftRef}>
        <sphereGeometry args={[Math.max(mass1 / 200, 0.5), 32, 32]} />

        <meshStandardMaterial color="blue" />
      </mesh>

      <mesh ref={rightRef}>
        <sphereGeometry args={[Math.max(mass2 / 200, 0.5), 32, 32]} />

        <meshStandardMaterial color="red" />
      </mesh>

      <Line
        points={[
          [leftRef.current?.position.x ?? 0, 0, 0],
          [rightRef.current?.position.x ?? 0, 0, 0],
        ]}
        color="yellow"
        lineWidth={Math.min((mass1 * mass2) / (distance * distance * 500), 10)}
      />
    </>
  );
}

export default function GravityCanvas({
  mass1,
  mass2,
  distance,
  simulationRunning,
  simulationKey,
  orbitalMode,
}: Props) {
  return (
    <Canvas
      style={{
        height: "500px",
        marginTop: "30px",
      }}
      camera={{
        position: [0, 5, 15],
      }}
    >
      <ambientLight intensity={2} />

      <Bodies
        mass1={mass1}
        mass2={mass2}
        distance={distance}
        simulationRunning={simulationRunning}
        simulationKey={simulationKey}
        orbitalMode={orbitalMode}
      />

      <gridHelper args={[50, 50]} />
    </Canvas>
  );
}
