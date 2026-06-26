/**
 * SkillGalaxy.tsx — Milestone 5 Upgrade
 *
 * Improvements:
 * - Animated, glowing connection lines (opacity pulses)
 * - Central hub node per category that breathes
 * - Starfield background inside the canvas
 * - Skill node color highlight on hover (via raycasting through pointer events)
 * - Auto-rotation resumes after idle
 */
import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

type Skill = { name: string; level: number };
type SkillCategory = {
  label: string;
  color: string;
  center: [number, number, number];
  skills: Skill[];
};

const skillCategories: SkillCategory[] = [
  {
    label: "Programming",
    color: "#60a5fa",
    center: [-4.5, 2, 0],
    skills: [
      { name: "C#",         level: 90 },
      { name: "Python",     level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "JavaScript", level: 80 },
      { name: "SQL",        level: 75 },
      { name: "VB.NET",     level: 70 },
    ],
  },
  {
    label: "Frontend",
    color: "#22d3ee",
    center: [4.5, 2, 0],
    skills: [
      { name: "React",         level: 85 },
      { name: "Three.js",      level: 75 },
      { name: "HTML / CSS",    level: 85 },
      { name: "Framer Motion", level: 70 },
      { name: "Vite",          level: 75 },
    ],
  },
  {
    label: "Automation",
    color: "#f97316",
    center: [0, 3, -4],
    skills: [
      { name: "UiPath",         level: 90 },
      { name: "Power Automate", level: 70 },
      { name: "OCR",            level: 80 },
      { name: "RPA Design",     level: 85 },
    ],
  },
  {
    label: "Analytics",
    color: "#fbbf24",
    center: [-4.5, -2, 0],
    skills: [
      { name: "Power BI",     level: 88 },
      { name: "DAX",          level: 80 },
      { name: "Data Modeling",level: 78 },
      { name: "Excel",        level: 85 },
    ],
  },
  {
    label: "DevOps",
    color: "#a78bfa",
    center: [4.5, -2, 0],
    skills: [
      { name: "Azure DevOps", level: 80 },
      { name: "Git",          level: 85 },
      { name: "CI/CD",        level: 78 },
      { name: "Release Mgmt", level: 82 },
    ],
  },
  {
    label: "AI & Future",
    color: "#34d399",
    center: [0, -3, -4],
    skills: [
      { name: "LLMs",        level: 65 },
      { name: "Ollama",      level: 60 },
      { name: "AI Agents",   level: 62 },
      { name: "Prompt Eng.", level: 70 },
    ],
  },
];

// ─── Skill node ───────────────────────────────────────────────────────────────
function SkillNode({
  name, level, position, color, offset,
}: {
  name: string; level: number; position: [number, number, number];
  color: string; offset: number;
}) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const size = 0.08 + (level / 100) * 0.14;

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;

    groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + offset) * 0.12;
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Group) child.lookAt(camera.position);
    });

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = hovered
        ? 1.2
        : 0.5 + Math.sin(t * 1.2 + offset) * 0.3;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => { document.body.style.cursor = "pointer"; setHovered(true); }}
      onPointerOut={() => { document.body.style.cursor = "default"; setHovered(false); }}
    >
      {/* Outer glow ring when hovered */}
      {hovered && (
        <mesh>
          <sphereGeometry args={[size * 1.8, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      <group position={[0, -size - 0.18, 0]}>
        <Text
          fontSize={0.13}
          color={hovered ? color : "white"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {name}
        </Text>
        {/* Level bar */}
        <Text
          fontSize={0.09}
          color={color}
          anchorX="center"
          anchorY="middle"
          position={[0, -0.2, 0]}
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {"▓".repeat(Math.round(level / 20))}
        </Text>
      </group>
    </group>
  );
}

// ─── Hub node (category center) ───────────────────────────────────────────────
function HubNode({ center, color, label }: { center: [number, number, number]; color: string; label: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(t * 0.8) * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.4;
      ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.3;
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.35 + Math.sin(t * 1.2) * 0.15;
    }
    if (groupRef.current) {
      groupRef.current.children
        .filter((c) => c instanceof THREE.Group)
        .forEach((c) => (c as THREE.Group).lookAt(camera.position));
    }
  });

  return (
    <group ref={groupRef} position={center}>
      {/* Hub sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.6}
        />
      </mesh>

      {/* Orbiting ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.38, 0.025, 8, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {/* Label */}
      <group position={[0, 1.6, 0]}>
        <Text
          fontSize={0.22}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.025}
          outlineColor="#000000"
        >
          {label}
        </Text>
      </group>
    </group>
  );
}

// ─── Animated connection lines ────────────────────────────────────────────────
function ConnectionLines({ category }: { category: SkillCategory }) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const positions = useMemo(() => {
    const pts: [number, number, number][] = category.skills.map((_, i) => {
      const angle = (i / category.skills.length) * Math.PI * 2;
      const r = 1.1;
      return [
        category.center[0] + Math.cos(angle) * r,
        category.center[1] + Math.sin(angle) * r * 0.5,
        category.center[2] + Math.sin(angle) * 0.4,
      ];
    });
    return pts;
  }, [category]);

  const linePositions = useMemo(() => {
    const arr: number[] = [];
    positions.forEach((p) => arr.push(...category.center, ...p));
    return new Float32Array(arr);
  }, [category.center, positions]);

  useFrame(({ clock }) => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.12 + Math.sin(clock.getElapsedTime() * 0.8) * 0.08;
    }
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={category.color} transparent opacity={0.2} />
    </lineSegments>
  );
}

// ─── Scene ─────────────────────────────────────────────────────────────────────
function GalaxyScene() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#ffffff" distance={35} />

      {/* Background stars */}
      <Stars
        radius={60}
        depth={40}
        count={3000}
        factor={3}
        saturation={0.3}
        fade
        speed={0.3}
      />

      {skillCategories.map((cat) => (
        <group key={cat.label}>
          <HubNode center={cat.center} color={cat.color} label={cat.label} />
          <ConnectionLines category={cat} />

          {cat.skills.map((skill, i) => {
            const angle = (i / cat.skills.length) * Math.PI * 2;
            const r = 1.1;
            const pos: [number, number, number] = [
              cat.center[0] + Math.cos(angle) * r,
              cat.center[1] + Math.sin(angle) * r * 0.5,
              cat.center[2] + Math.sin(angle) * 0.4,
            ];
            return (
              <SkillNode
                key={skill.name}
                name={skill.name}
                level={skill.level}
                position={pos}
                color={cat.color}
                offset={i * 0.8 + cat.center[0]}
              />
            );
          })}
        </group>
      ))}
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function SkillGalaxy() {
  return (
    <Canvas
      camera={{ position: [0, 2, 14], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ height: "560px", borderRadius: "16px" }}
    >
      <GalaxyScene />
      <OrbitControls
        enableZoom
        enablePan
        autoRotate
        autoRotateSpeed={0.6}
        minDistance={5}
        maxDistance={24}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
