import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Sparkles } from "@react-three/drei";
import type { GalaxyData, SubPlanetData } from "../types/galaxy";

interface GalaxyProps {
  data: GalaxyData;
  selectedGalaxyId: string | null;
  selectedPlanetName: string | null;
  onSelectGalaxy: (id: string | null) => void;
  onSelectPlanet: (planet: SubPlanetData | null) => void;
  timeScale?: number;
}

export default function Galaxy({
  data,
  selectedGalaxyId,
  selectedPlanetName,
  onSelectGalaxy,
  onSelectPlanet,
  timeScale = 1.0,
}: GalaxyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Points>(null);
  const sunLabelRef = useRef<THREE.Group>(null);

  const [hoveredSun, setHoveredSun] = useState(false);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  const isGalaxySelected = selectedGalaxyId === data.id;

  // ── STAR DUST GENERATION ──
  // Generate spiral galaxy star dust points
  const { positions, colors } = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const baseColor = new THREE.Color(data.color);

    for (let i = 0; i < count; i++) {
      // Golden spiral distribution
      const theta = i * 0.18;
      const r = 0.8 + Math.pow(i / count, 0.7) * 4.2;
      const spread = (Math.random() - 0.5) * 0.45;

      const x = Math.cos(theta) * r + spread;
      const z = Math.sin(theta) * r + spread;
      const y = (Math.random() - 0.5) * 0.15; // flat disk

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color variation close to core vs arm ends
      const coreMix = Math.max(0.1, 1 - r / 5);
      const tempColor = baseColor.clone().multiplyScalar(1.2).lerp(new THREE.Color("#ffffff"), coreMix);
      cols[i * 3] = tempColor.r;
      cols[i * 3 + 1] = tempColor.g;
      cols[i * 3 + 2] = tempColor.b;
    }
    return { positions: pos, colors: cols };
  }, [data.color]);

  // ── ANIMATION LOOP ──
  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime() * timeScale;

    // 1. Orbit the entire Galaxy around the central black hole
    if (groupRef.current) {
      const angle = t * data.orbitSpeed * 3.5 + data.startAngle;
      const x = Math.cos(angle) * data.orbitRadius;
      const z = Math.sin(angle) * data.orbitRadius;
      // Tilt orbit slightly based on inclination
      const y = Math.sin(angle) * data.orbitRadius * Math.sin(data.inclination);
      groupRef.current.position.set(x, y, z);
    }

    // 2. Rotate Galaxy Core (Sun)
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.005;
    }

    // 3. Rotate Star Dust Cloud
    if (dustRef.current) {
      dustRef.current.rotation.y += 0.0018;
    }

    // 4. Billboard the Main Galaxy Label toward the Camera
    if (sunLabelRef.current) {
      sunLabelRef.current.lookAt(camera.position);
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── GALAXY CORE (SUN) ── */}
      <mesh
        ref={sunRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          setHoveredSun(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "default";
          setHoveredSun(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelectGalaxy(isGalaxySelected ? null : data.id);
        }}
      >
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={isGalaxySelected ? 2.5 : hoveredSun ? 1.8 : 0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Pulsing Core Ring aura */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.015, 8, 64]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={isGalaxySelected ? 0.8 : hoveredSun ? 0.5 : 0.25}
        />
      </mesh>

      {/* Core Sun Label */}
      <group ref={sunLabelRef} position={[0, 1.15, 0]}>
        <Text
          fontSize={0.24}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
          font={undefined}
        >
          {data.name}
        </Text>
        <Text
          fontSize={0.11}
          color={data.color}
          position={[0, -0.22, 0]}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {data.tagline}
        </Text>
      </group>

      {/* Sparkles on active selection */}
      {isGalaxySelected && (
        <Sparkles
          count={40}
          scale={2.2}
          size={1.5}
          speed={0.6}
          color={data.color}
          opacity={0.8}
        />
      )}

      {/* ── SPIRAL STAR DUST CLOUD ── */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={isGalaxySelected ? 0.85 : 0.45}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ── SUB-PLANETS (Moons) ── */}
      {isGalaxySelected &&
        data.planets.map((planet) => {
          const isPlanetSelected = selectedPlanetName === planet.name;
          const isHovered = hoveredPlanet === planet.name;

          return (
            <SubPlanet
              key={planet.name}
              planet={planet}
              isPlanetSelected={isPlanetSelected}
              isHovered={isHovered}
              onHoverChange={(h) => setHoveredPlanet(h ? planet.name : null)}
              onClick={() => onSelectPlanet(isPlanetSelected ? null : planet)}
            />
          );
        })}
    </group>
  );
}

// ── INNER SUB-PLANET SUB-COMPONENT ──
interface SubPlanetProps {
  planet: SubPlanetData;
  isPlanetSelected: boolean;
  isHovered: boolean;
  onHoverChange: (h: boolean) => void;
  onClick: () => void;
}

function SubPlanet({
  planet,
  isPlanetSelected,
  isHovered,
  onHoverChange,
  onClick,
}: SubPlanetProps) {
  const planetRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<THREE.Group>(null);

  // Animate the sub-planet orbit relative to its galaxy center
  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    if (planetRef.current) {
      const angle = t * planet.orbitSpeed * 12;
      const x = Math.cos(angle) * planet.orbitRadius;
      const z = Math.sin(angle) * planet.orbitRadius;
      planetRef.current.position.set(x, 0, z);
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.01;
    }
    if (labelRef.current) {
      labelRef.current.lookAt(camera.position);
    }
  });

  return (
    <group>
      {/* Local Orbit Ring Line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[planet.orbitRadius, 0.005, 4, 64]} />
        <meshBasicMaterial color={planet.color} transparent opacity={0.12} />
      </mesh>

      {/* Orbiting Group */}
      <group ref={planetRef}>
        {/* Planet Sphere Body */}
        <mesh
          ref={sphereRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            onHoverChange(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "default";
            onHoverChange(false);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <sphereGeometry args={[planet.size, 32, 32]} />
          <meshStandardMaterial
            color={planet.color}
            emissive={planet.color}
            emissiveIntensity={isPlanetSelected ? 2.0 : isHovered ? 1.4 : 0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Orbit ring around planet */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[planet.size * 1.4, 0.008, 4, 32]} />
          <meshBasicMaterial color={planet.color} transparent opacity={isHovered ? 0.6 : 0.2} />
        </mesh>

        {/* Glowing halo */}
        <mesh>
          <sphereGeometry args={[planet.size * 1.35, 16, 16]} />
          <meshBasicMaterial color={planet.color} transparent opacity={isPlanetSelected ? 0.25 : isHovered ? 0.12 : 0.04} side={THREE.BackSide} />
        </mesh>

        {/* Dynamic Label billboard */}
        <group ref={labelRef} position={[0, -planet.size - 0.4, 0]}>
          <Text
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {planet.name}
          </Text>
          {isHovered && (
            <Text
              fontSize={0.09}
              color={planet.color}
              position={[0, -0.15, 0]}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.01}
              outlineColor="#000000"
            >
              {planet.label}
            </Text>
          )}
        </group>

        {/* Small sparkle ring when locked in zoom */}
        {isPlanetSelected && (
          <Sparkles
            count={12}
            scale={planet.size * 2.5}
            size={1.0}
            speed={0.5}
            color={planet.color}
            opacity={0.8}
          />
        )}
      </group>
    </group>
  );
}
