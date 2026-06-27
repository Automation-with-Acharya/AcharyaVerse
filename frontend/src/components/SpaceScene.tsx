import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { useRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import BlackHole from "./BlackHole";
import Galaxy from "./Galaxy";
import CameraController from "./CameraController";
import { galaxies } from "../data/galaxies";
import type { SubPlanetData } from "../types/galaxy";

type SpaceSceneProps = {
  selectedGalaxyId: string | null;
  setSelectedGalaxyId: (id: string | null) => void;
  selectedPlanet: SubPlanetData | null;
  setSelectedPlanet: (planet: SubPlanetData | null) => void;
};

// ─── Nebula-style particle cloud orbiting central Black Hole ───
function NebulaParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 600;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const palette = [
    new THREE.Color("#3b82f6"),
    new THREE.Color("#6d28d9"),
    new THREE.Color("#ec4899"),
    new THREE.Color("#1d4ed8"),
    new THREE.Color("#7c3aed"),
  ];

  for (let i = 0; i < count; i++) {
    const r = 10 + Math.random() * 18;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 0.45;

    positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
    positions[i * 3 + 1] = r * Math.sin(phi) * 0.35;
    positions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.008;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Scene content (inside Canvas) ───
function SceneContent({
  selectedGalaxyId,
  setSelectedGalaxyId,
  selectedPlanet,
  setSelectedPlanet,
  controlsRef,
}: SpaceSceneProps & { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[10, 15, 8]} intensity={0.8} color="#e0e7ff" />

      {/* Dynamic tracking camera controller */}
      <CameraController
        selectedGalaxyId={selectedGalaxyId}
        selectedPlanetName={selectedPlanet?.name ?? null}
        controlsRef={controlsRef}
      />

      <NebulaParticles />

      {/* Dense starfield background */}
      <Stars
        radius={140}
        depth={70}
        count={12000}
        factor={5}
        saturation={0.3}
        fade
        speed={0.4}
      />

      {/* Origin Singularity */}
      <BlackHole />

      {/* Galaxies clusters */}
      {galaxies.map((galaxy) => (
        <Galaxy
          key={galaxy.id}
          data={galaxy}
          selectedGalaxyId={selectedGalaxyId}
          selectedPlanetName={selectedPlanet?.name ?? null}
          onSelectGalaxy={(id) => {
            setSelectedGalaxyId(id);
            setSelectedPlanet(null);
          }}
          onSelectPlanet={(planet) => {
            setSelectedPlanet(planet);
          }}
        />
      ))}
    </>
  );
}

// ─── HUD Breadcrumbs component ───
type BreadcrumbsProps = {
  selectedGalaxyId: string | null;
  onSelectGalaxy: (id: string | null) => void;
  selectedPlanet: SubPlanetData | null;
  onSelectPlanet: (planet: SubPlanetData | null) => void;
};

function Breadcrumbs({
  selectedGalaxyId,
  onSelectGalaxy,
  selectedPlanet,
  onSelectPlanet,
}: BreadcrumbsProps) {
  const activeGalaxy = galaxies.find((g) => g.id === selectedGalaxyId);

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(2, 4, 12, 0.72)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "30px",
        padding: "8px 18px",
        fontFamily: "'Orbitron', monospace",
        fontSize: "0.78rem",
        letterSpacing: "0.06em",
        boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
      }}
    >
      <span
        onClick={() => {
          onSelectGalaxy(null);
          onSelectPlanet(null);
        }}
        style={{
          color: selectedGalaxyId ? "#64748b" : "#ffffff",
          cursor: "pointer",
          transition: "color 0.2s ease",
        }}
      >
        UNIVERSE
      </span>

      {activeGalaxy && (
        <>
          <span style={{ color: "#475569" }}>&gt;</span>
          <span
            onClick={() => onSelectPlanet(null)}
            style={{
              color: selectedPlanet ? "#64748b" : activeGalaxy.color,
              cursor: "pointer",
              transition: "color 0.2s ease",
            }}
          >
            {activeGalaxy.name.toUpperCase()}
          </span>
        </>
      )}

      {selectedPlanet && (
        <>
          <span style={{ color: "#475569" }}>&gt;</span>
          <span style={{ color: selectedPlanet.color }}>
            {selectedPlanet.name.toUpperCase()}
          </span>
        </>
      )}
    </div>
  );
}

// ─── HUD Circular Minimap component ───
type MinimapProps = {
  selectedGalaxyId: string | null;
  onSelectGalaxy: (id: string | null) => void;
};

function Minimap({ selectedGalaxyId, onSelectGalaxy }: MinimapProps) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animId: number;
    const update = () => {
      setTime(performance.now() * 0.001);
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  const size = 125;
  const center = size / 2;
  const maxRadius = 38;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        width: `${size}px`,
        height: `${size}px`,
        background: "rgba(2, 4, 12, 0.78)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "50%",
        padding: "8px",
        zIndex: 5,
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        {/* Origin Black Hole singularity */}
        <circle
          cx={center}
          cy={center}
          r={4}
          fill="#000000"
          stroke="#f43f5e"
          strokeWidth={1}
          style={{ filter: "drop-shadow(0 0 2px #f43f5e)" }}
        />

        {galaxies.map((g) => {
          const radiusScale = (g.orbitRadius / maxRadius) * (size / 2 - 10);
          const angle = time * g.orbitSpeed * 3.5;
          const x = center + Math.cos(angle) * radiusScale;
          const y = center + Math.sin(angle) * radiusScale;

          const isSelected = selectedGalaxyId === g.id;

          return (
            <g
              key={g.id}
              style={{ cursor: "pointer" }}
              onClick={() => onSelectGalaxy(isSelected ? null : g.id)}
            >
              {/* Concentric orbit tracks */}
              <circle
                cx={center}
                cy={center}
                r={radiusScale}
                fill="none"
                stroke={g.color}
                strokeWidth={isSelected ? 1.0 : 0.4}
                strokeDasharray="2 4"
                opacity={isSelected ? 0.35 : 0.12}
              />
              {/* Rotating orbital dot */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 4 : 2.5}
                fill={g.color}
                opacity={isSelected ? 1.0 : 0.65}
                style={{
                  transition: "r 0.2s ease, opacity 0.2s ease",
                  filter: isSelected ? `drop-shadow(0 0 4px ${g.color})` : "none",
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── main SpaceScene container ───
export default function SpaceScene({
  selectedGalaxyId,
  setSelectedGalaxyId,
  selectedPlanet,
  setSelectedPlanet,
}: SpaceSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 5, 24], fov: 60 }}
        gl={{ antialias: true, alpha: false, toneMappingExposure: 1.25 }}
        style={{ background: "#000004" }}
        onPointerMissed={() => {
          setSelectedGalaxyId(null);
          setSelectedPlanet(null);
        }}
      >
        <Suspense fallback={null}>
          <SceneContent
            selectedGalaxyId={selectedGalaxyId}
            setSelectedGalaxyId={setSelectedGalaxyId}
            selectedPlanet={selectedPlanet}
            setSelectedPlanet={setSelectedPlanet}
            controlsRef={controlsRef}
          />
          <OrbitControls
            ref={controlsRef}
            enableZoom
            enablePan={false}
            minDistance={3.5}
            maxDistance={48}
            autoRotate
            autoRotateSpeed={0.2}
            enableDamping
            dampingFactor={0.05}
          />
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.55}
              luminanceSmoothing={0.3}
              intensity={1.2}
              radius={0.8}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Render Universe Breadcrumbs Navigation HUD */}
      <Breadcrumbs
        selectedGalaxyId={selectedGalaxyId}
        onSelectGalaxy={setSelectedGalaxyId}
        selectedPlanet={selectedPlanet}
        onSelectPlanet={setSelectedPlanet}
      />

      {/* Render Universe Galactic Minimap Radar HUD */}
      <Minimap
        selectedGalaxyId={selectedGalaxyId}
        onSelectGalaxy={setSelectedGalaxyId}
      />
    </div>
  );
}
