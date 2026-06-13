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
  showCurvature: boolean;
  curvatureScale: number;
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

function GravityGrid({
  mass1,
  mass2,
  leftRef,
  rightRef,
  showCurvature,
  curvatureScale,
}: {
  mass1: number;
  mass2: number;
  leftRef: React.RefObject<THREE.Mesh | null>;
  rightRef: React.RefObject<THREE.Mesh | null>;
  showCurvature: boolean;
  curvatureScale: number;
}) {
  const { geometry, basePoints } = useMemo(() => {
    const size = 52;

    const divisions = 50;

    const spacing = size / divisions;

    const generatedPositions: number[] = [];

    const generatedBasePoints: { x: number; z: number }[] = [];

    for (let index = 0; index <= divisions; index++) {
      const lineOffset = -size / 2 + index * spacing;

      const horizontalStart = { x: -size / 2, z: lineOffset };

      const horizontalEnd = { x: size / 2, z: lineOffset };

      const verticalStart = { x: lineOffset, z: -size / 2 };

      const verticalEnd = { x: lineOffset, z: size / 2 };

      for (let step = 0; step < divisions; step++) {
        const start = -size / 2 + step * spacing;

        const end = start + spacing;

        const horizontalA = { x: start, z: horizontalStart.z };

        const horizontalB = { x: end, z: horizontalEnd.z };

        const verticalA = { x: verticalStart.x, z: start };

        const verticalB = { x: verticalEnd.x, z: end };

        [horizontalA, horizontalB, verticalA, verticalB].forEach((point) => {
          generatedBasePoints.push(point);

          generatedPositions.push(point.x, 0, point.z);
        });
      }
    }

    const gridGeometry = new THREE.BufferGeometry();

    gridGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(generatedPositions), 3),
    );

    return {
      geometry: gridGeometry,
      basePoints: generatedBasePoints,
    };
  }, []);

  useFrame(() => {
    const positionAttribute = geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    if (!showCurvature || !leftRef.current || !rightRef.current) {
      basePoints.forEach((_, index) => {
        positionAttribute.setY(index, 0);
      });

      positionAttribute.needsUpdate = true;

      return;
    }

    const leftPosition = leftRef.current.position;

    const rightPosition = rightRef.current.position;

    basePoints.forEach((point, index) => {
      const distanceToA = Math.hypot(
        point.x - leftPosition.x,
        point.z - leftPosition.z,
      );

      const distanceToB = Math.hypot(
        point.x - rightPosition.x,
        point.z - rightPosition.z,
      );

      const wellA =
        curvatureScale * (mass1 / 1000) * (4 / Math.sqrt(distanceToA + 1.8));

      const wellB =
        curvatureScale * (mass2 / 1000) * (4 / Math.sqrt(distanceToB + 1.8));

      const depression = Math.min(wellA + wellB, 7);

      positionAttribute.setY(index, -depression);
    });

    positionAttribute.needsUpdate = true;
  });

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="white"
        transparent
        opacity={showCurvature ? 0.75 : 0.45}
      />
    </lineSegments>
  );
}

function Bodies({
  mass1,
  mass2,
  distance,
  simulationRunning,
  simulationKey,
  orbitalMode,
  showCurvature,
  curvatureScale,
}: Props) {
  const leftRef = useRef<THREE.Mesh>(null);

  const rightRef = useRef<THREE.Mesh>(null);

  const initialized = useRef(false);

  const orbitAngle = useRef(0);

  const leftVelocity = useRef(new THREE.Vector3());

  const rightVelocity = useRef(new THREE.Vector3());

  const totalMass = mass1 + mass2;

  const radiusA = (distance * mass2) / totalMass;

  const radiusB = (distance * mass1) / totalMass;

  const barycentricOrbitSpeed = Math.sqrt((6.674 * totalMass) / distance ** 3);

  useEffect(() => {
    initialized.current = false;

    orbitAngle.current = 0;

    leftVelocity.current.set(0, 0, 0);

    rightVelocity.current.set(0, 0, 0);

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

    const displacement = new THREE.Vector3().subVectors(
      rightRef.current.position,
      leftRef.current.position,
    );

    const currentDistance = displacement.length();

    const direction =
      currentDistance > 0
        ? displacement.clone().normalize()
        : new THREE.Vector3(1, 0, 0);

    const bodyRadiusA = Math.max(mass1 / 200, 0.5);

    const bodyRadiusB = Math.max(mass2 / 200, 0.5);

    const contactDistance = bodyRadiusA + bodyRadiusB;

    if (currentDistance <= contactDistance) {
      const barycenter = leftRef.current.position
        .clone()
        .multiplyScalar(mass1)
        .add(rightRef.current.position.clone().multiplyScalar(mass2))
        .divideScalar(totalMass);

      leftRef.current.position.copy(
        barycenter
          .clone()
          .addScaledVector(direction, -(mass2 / totalMass) * contactDistance),
      );

      rightRef.current.position.copy(
        barycenter
          .clone()
          .addScaledVector(direction, (mass1 / totalMass) * contactDistance),
      );

      leftVelocity.current.set(0, 0, 0);

      rightVelocity.current.set(0, 0, 0);

      return;
    }

    const softenedDistanceSquared = currentDistance * currentDistance + 0.8;

    const accelerationA = direction
      .clone()
      .multiplyScalar((6.674 * mass2) / softenedDistanceSquared);

    const accelerationB = direction
      .clone()
      .multiplyScalar((-6.674 * mass1) / softenedDistanceSquared);

    const visualTimeScale = 0.08;

    const maxRelativeSpeed = 0.18;

    leftVelocity.current.addScaledVector(
      accelerationA,
      delta * visualTimeScale,
    );

    rightVelocity.current.addScaledVector(
      accelerationB,
      delta * visualTimeScale,
    );

    const relativeSpeed = new THREE.Vector3()
      .subVectors(rightVelocity.current, leftVelocity.current)
      .length();

    if (relativeSpeed > maxRelativeSpeed) {
      const scale = maxRelativeSpeed / relativeSpeed;

      leftVelocity.current.multiplyScalar(scale);

      rightVelocity.current.multiplyScalar(scale);
    }

    leftRef.current.position.addScaledVector(leftVelocity.current, delta * 60);

    rightRef.current.position.addScaledVector(
      rightVelocity.current,
      delta * 60,
    );
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

      <GravityGrid
        mass1={mass1}
        mass2={mass2}
        leftRef={leftRef}
        rightRef={rightRef}
        showCurvature={showCurvature}
        curvatureScale={curvatureScale}
      />

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
  showCurvature,
  curvatureScale,
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
        showCurvature={showCurvature}
        curvatureScale={curvatureScale}
      />

    </Canvas>
  );
}
