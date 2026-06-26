import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import BlackHole from "./BlackHole";
import Planet from "./Planet";
import CameraController from "./CameraController";
import { planets } from "../data/planets";

type SpaceSceneProps = {
  selectedPlanet: string | null;
  setSelectedPlanet: (planet: string | null) => void;
};

// ─── Nebula-style particle cloud ─────────────────────────────────────────────
function NebulaParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 600;

  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);

  const palette = [
    new THREE.Color("#3b82f6"),
    new THREE.Color("#6d28d9"),
    new THREE.Color("#ec4899"),
    new THREE.Color("#1d4ed8"),
    new THREE.Color("#7c3aed"),
  ];

  for (let i = 0; i < count; i++) {
    const r     = 8 + Math.random() * 14;
    const theta = Math.random() * Math.PI * 2;
    const phi   = (Math.random() - 0.5) * Math.PI * 0.6;

    positions[i * 3]     = r * Math.cos(theta) * Math.cos(phi);
    positions[i * 3 + 1] = r * Math.sin(phi) * 0.5;
    positions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi) - 5;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Scene content (inside Canvas) ──────────────────────────────────────────
function SceneContent({
  selectedPlanet,
  setSelectedPlanet,
  controlsRef,
}: SpaceSceneProps & { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} color="#ffffff" />

      {/* Milestone 4: smooth camera controller */}
      <CameraController
        selectedPlanet={selectedPlanet}
        controlsRef={controlsRef}
      />

      <NebulaParticles />

      {/* Dense starfield */}
      <Stars
        radius={120}
        depth={60}
        count={15000}
        factor={4}
        saturation={0.3}
        fade
        speed={0.5}
      />

      <BlackHole />

      {planets.map((planet) => (
        <Planet
          key={planet.name}
          name={planet.name}
          color={planet.color}
          position={planet.position}
          size={planet.size}
          emoji={planet.emoji}
          glowColor={planet.glowColor}
          tagline={planet.tagline}
          selectedPlanet={selectedPlanet}
          setSelectedPlanet={setSelectedPlanet}
        />
      ))}
    </>
  );
}

// ─── SpaceScene ───────────────────────────────────────────────────────────────
export default function SpaceScene({
  selectedPlanet,
  setSelectedPlanet,
}: SpaceSceneProps) {
  // Shared ref so CameraController can pause / resume OrbitControls
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <Canvas
      camera={{ position: [0, 0, 22], fov: 60 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: "#000005" }}
    >
      <SceneContent
        selectedPlanet={selectedPlanet}
        setSelectedPlanet={setSelectedPlanet}
        controlsRef={controlsRef}
      />
      <OrbitControls
        ref={controlsRef}
        enableZoom
        enablePan={false}
        minDistance={2.5}
        maxDistance={25}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
