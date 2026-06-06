import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { Text } from "@react-three/drei";
import { useState } from "react";

function OrbitRing({
  radius,
}: {
  radius: number;
}) {
  const points: [number, number, number][] = [];

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

function EarthSystem({
  earthSpeed,
  moonSpeed,
  paused,
}: {
  earthSpeed: number;
  moonSpeed: number;
  paused: boolean;
}) {
  const earthOrbit =
    useRef<THREE.Group>(null);

  const moonOrbit =
    useRef<THREE.Group>(null);

  useFrame(() => {
    if (earthOrbit.current)
      if (!paused) {
  earthOrbit.current.rotation.y +=
    earthSpeed;
}

    if (moonOrbit.current)
      if (!paused) {
  moonOrbit.current.rotation.y +=
    moonSpeed;
}
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
const [earthSpeed, setEarthSpeed] =
  useState(0.01);

const [moonSpeed, setMoonSpeed] =
  useState(0.04);

const [paused, setPaused] =
  useState(false);

  return (
    <>
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

      <EarthSystem
  earthSpeed={earthSpeed}
  moonSpeed={moonSpeed}
  paused={paused}
/>
    </Canvas>

    <div
  style={{
    marginTop: "20px",
    color: "white",
  }}
>
  <h3>
    Physics Controls
  </h3>

  

  <div>
    Earth Speed:
    <input
      type="range"
      min="0"
      max="0.05"
      step="0.001"
      value={earthSpeed}
      onChange={(e) =>
        setEarthSpeed(
          Number(e.target.value)
        )
      }
    />
  </div>

  <div>
    Moon Speed:
    <input
      type="range"
      min="0"
      max="0.1"
      step="0.001"
      value={moonSpeed}
      onChange={(e) =>
        setMoonSpeed(
          Number(e.target.value)
        )
      }
    />
  </div>

  <button
    onClick={() =>
      setPaused(!paused)
    }
  >
    {paused
      ? "Resume"
      : "Pause"}
  </button>

  <div
  style={{
    marginTop: "30px",
    color: "#ccc",
  }}
>
  <h3>
    Orbital Mechanics
  </h3>

  <p>
    Earth revolves around the Sun
    while the Moon revolves around
    Earth.
  </p>

  <p>
    This demonstrates hierarchical
    orbital motion using nested
    coordinate systems.
  </p>
</div>
</div>
    </>
  );
}