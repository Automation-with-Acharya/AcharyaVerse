import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import BlackHole from "./BlackHole";
import Planet from "./Planet";
import { planets } from "../data/planets";

function MovingCamera() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y =
      Math.sin(clock.getElapsedTime() * 0.05) * 0.1;

    groupRef.current.rotation.x =
      Math.cos(clock.getElapsedTime() * 0.03) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Stars
        radius={100}
        depth={50}
        count={8000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </group>
  );
}

export default function SpaceScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <MovingCamera />
      <BlackHole />
      {
  planets.map((planet) => (
    <Planet
      key={planet.name}
      name={planet.name}
      color={planet.color}
      position={planet.position}
    />
  ))
}
    </Canvas>
  );
}