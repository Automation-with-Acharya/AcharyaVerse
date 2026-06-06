import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

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

        {/* Moon Orbit */}
        <group
          ref={moonOrbit}
          position={[4, 0, 0]}
        >
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
        position: [0, 4, 10],
      }}
    >
      <ambientLight
        intensity={2}
      />

      <EarthSystem />
    </Canvas>
  );
}