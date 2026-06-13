import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect, useMemo } from "react";
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

function createInitialPositions(distance: number) {
  return {
    bodyA: new THREE.Vector3(-distance / 2, 0, 0),
    bodyB: new THREE.Vector3(distance / 2, 0, 0),
  };
}

function OrbitRing({
  radius,
  color,
}: {
  radius: number;
  color: string;
}) {
  const points = useMemo<[number, number, number][]>(() => {
    const ringPoints: [number, number, number][] = [];

    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;

      ringPoints.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }

    return ringPoints;
  }, [radius]);

  if (radius < 0.05) return null;

  return <Line points={points} color={color} lineWidth={1} />;
}

function ForceBeam({
  leftRef,
  rightRef,
  lineWidth,
}: {
  leftRef: React.RefObject<THREE.Mesh | null>;
  rightRef: React.RefObject<THREE.Mesh | null>;
  lineWidth: number;
}) {
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  const positions = useMemo(() => new Float32Array(6), []);

  useFrame(() => {
    if (!leftRef.current || !rightRef.current || !geometryRef.current) return;

    const positionAttribute = geometryRef.current.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    positionAttribute.setXYZ(
      0,
      leftRef.current.position.x,
      leftRef.current.position.y,
      leftRef.current.position.z,
    );

    positionAttribute.setXYZ(
      1,
      rightRef.current.position.x,
      rightRef.current.position.y,
      rightRef.current.position.z,
    );

    positionAttribute.needsUpdate = true;
  });

  return (
    <line>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>

      <lineBasicMaterial color="yellow" linewidth={lineWidth} />
    </line>
  );
}

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

  const totalMass = mass1 + mass2;

  const radiusA = (distance * mass2) / totalMass;

  const radiusB = (distance * mass1) / totalMass;

  const barycentricOrbitSpeed = Math.sqrt((6.674 * totalMass) / distance ** 3);

  useEffect(() => {
    initialized.current = false;

    orbitAngle.current = 0;

    const initialPositions = createInitialPositions(distance);

    if (leftRef.current && rightRef.current) {
      leftRef.current.position.copy(initialPositions.bodyA);

      rightRef.current.position.copy(initialPositions.bodyB);
    }
  }, [simulationKey, distance, mass1, mass2, orbitalMode]);

  useFrame((_, delta) => {
    if (!leftRef.current || !rightRef.current) return;

    if (!simulationRunning) return;

    if (orbitalMode) {
      orbitAngle.current += delta * barycentricOrbitSpeed * 0.08;

      const angle = orbitAngle.current;

      const bodyA = new THREE.Vector3(
        Math.cos(angle + Math.PI) * radiusA,
        0,
        Math.sin(angle + Math.PI) * radiusA,
      );

      const bodyB = new THREE.Vector3(
        Math.cos(angle) * radiusB,
        0,
        Math.sin(angle) * radiusB,
      );

      leftRef.current.position.copy(bodyA);

      rightRef.current.position.copy(bodyB);

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
      {orbitalMode && (
        <>
          <OrbitRing radius={radiusA} color="#60a5fa" />

          <OrbitRing radius={radiusB} color="#f87171" />

          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />

            <meshStandardMaterial color="white" emissive="white" />
          </mesh>
        </>
      )}

      <mesh ref={leftRef} position={[-distance / 2, 0, 0]}>
        <sphereGeometry args={[Math.max(mass1 / 200, 0.5), 32, 32]} />

        <meshStandardMaterial color="blue" />
      </mesh>

      <mesh ref={rightRef} position={[distance / 2, 0, 0]}>
        <sphereGeometry args={[Math.max(mass2 / 200, 0.5), 32, 32]} />

        <meshStandardMaterial color="red" />
      </mesh>

      <ForceBeam
        leftRef={leftRef}
        rightRef={rightRef}
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
