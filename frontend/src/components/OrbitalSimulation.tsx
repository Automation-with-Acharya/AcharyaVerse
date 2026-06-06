import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { Text } from "@react-three/drei";


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
    maxWidth: "600px",
  }}
>
  <h3>
    Physics Controls
  </h3>

  <div
    style={{
      marginBottom: "15px",
    }}
  >
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
      style={{
        width: "100%",
      }}
    />
  </div>

  <div
    style={{
      marginBottom: "15px",
    }}
  >
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
      style={{
        width: "100%",
      }}
    />
  </div>

  <button
    onClick={() =>
      setPaused(!paused)
    }
    style={{
  padding: "10px 20px",
  cursor: "pointer",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
}}
  >
    {paused
      ? "Resume Simulation"
      : "Pause Simulation"}
  </button>
  
  <div
  style={{
    marginTop: "30px",
    color: "#cccccc",
    maxWidth: "700px",
  }}
>
  <h3>
    Orbital Mechanics
  </h3>

  <p>
    Earth revolves around the Sun,
    while the Moon revolves around
    Earth.
  </p>

  <p>
    This simulation demonstrates
    hierarchical orbital motion
    using nested coordinate
    systems.
  </p>
</div>
</div>



    </>
  );
}