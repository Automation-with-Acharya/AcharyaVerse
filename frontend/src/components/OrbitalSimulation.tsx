import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { Text } from "@react-three/drei";

function OrbitRing({
  radius,
}: {
  radius: number;
}) {
  const points = [];

  for (
    let i = 0;
    i <= 64;
    i++
  ) {
    const angle =
      (i / 64) *
      Math.PI *
      2;

    points.push([
      Math.cos(angle) *
        radius,
      0,
      Math.sin(angle) *
        radius,
    ]);
  }

  return (
    <Line
      points={points}
      color="white"
      lineWidth={1}
    />
  );
}

function EarthSystem() {
  const earthOrbit =
    useRef<THREE.Group>(null);

  const moonOrbit =
    useRef<THREE.Group>(null);

  useFrame(() => {
    if (earthOrbit.current)
      earthOrbit.current.rotation.y +=
        0.01;

    if (moonOrbit.current)
      moonOrbit.current.rotation.y +=
        0.04;
  });

  return (
    <>
      {/* Sun */}
      <mesh>
        <sphereGeometry
          args={[1, 32, 32]}
        />
        <meshStandardMaterial
          color="yellow"
        />
      </mesh>
      <Text
  position={[0, 1.5, 0]}
  fontSize={0.3}
  color="white"
>
  Sun
</Text>

<OrbitRing radius={4} />

      {/* Earth Orbit */}
      <group ref={earthOrbit}>
        <mesh position={[4, 0, 0]}>
          <sphereGeometry
            args={[0.5, 32, 32]}
          />
          <meshStandardMaterial
            color="blue"
          />
        </mesh>
        <Text
  position={[4, 1, 0]}
  fontSize={0.2}
  color="white"
>
  Earth
</Text>

        {/* Moon Orbit */}
        <group
          ref={moonOrbit}
          position={[4, 0, 0]}
          
        >
        <OrbitRing radius={1} />
          <mesh
            position={[1, 0, 0]}
          >
            <sphereGeometry
              args={[0.2, 32, 32]}
            />
            <meshStandardMaterial
              color="white"
            />
          </mesh>
          <Text
  position={[1, 0.5, 0]}
  fontSize={0.15}
  color="white"
>
  Moon
</Text>
        </group>
      </group>
    </>
  );
}

export default function OrbitalSimulation() {
  return (
    <Canvas
      style={{
        height: "600px",
      }}
      camera={{
  position: [0, 6, 12],
  fov: 50,
}}
    >
      <ambientLight
        intensity={2}
      />

      <EarthSystem />
    </Canvas>
  );
}