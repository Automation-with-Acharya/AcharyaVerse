import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type Skill = {
  name: string;
  level: number; // 0-100
};

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
      { name: "C#", level: 90 },
      { name: "Python", level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "JavaScript", level: 80 },
      { name: "SQL", level: 75 },
      { name: "VB.NET", level: 70 },
    ],
  },
  {
    label: "Frontend",
    color: "#22d3ee",
    center: [4.5, 2, 0],
    skills: [
      { name: "React", level: 85 },
      { name: "Three.js", level: 75 },
      { name: "HTML / CSS", level: 85 },
      { name: "Framer Motion", level: 70 },
      { name: "Vite", level: 75 },
    ],
  },
  {
    label: "Automation",
    color: "#f97316",
    center: [0, 3, -4],
    skills: [
      { name: "UiPath", level: 90 },
      { name: "Power Automate", level: 70 },
      { name: "OCR", level: 80 },
      { name: "RPA Design", level: 85 },
    ],
  },
  {
    label: "Analytics",
    color: "#fbbf24",
    center: [-4.5, -2, 0],
    skills: [
      { name: "Power BI", level: 88 },
      { name: "DAX", level: 80 },
      { name: "Data Modeling", level: 78 },
      { name: "Excel", level: 85 },
    ],
  },
  {
    label: "DevOps",
    color: "#a78bfa",
    center: [4.5, -2, 0],
    skills: [
      { name: "Azure DevOps", level: 80 },
      { name: "Git", level: 85 },
      { name: "CI/CD", level: 78 },
      { name: "Release Mgmt", level: 82 },
    ],
  },
  {
    label: "AI & Future",
    color: "#34d399",
    center: [0, -3, -4],
    skills: [
      { name: "LLMs", level: 65 },
      { name: "Ollama", level: 60 },
      { name: "AI Agents", level: 62 },
      { name: "Prompt Eng.", level: 70 },
    ],
  },
];

function SkillNode({
  name,
  level,
  position,
  color,
  offset,
}: {
  name: string;
  level: number;
  position: [number, number, number];
  color: string;
  offset: number;
}) {
  const meshRef   = useRef<THREE.Mesh>(null);
  const groupRef  = useRef<THREE.Group>(null);
  const size = 0.08 + (level / 100) * 0.14;

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;

    // Gentle bobbing
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + offset) * 0.12;

    // Billboard text toward camera
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Group) child.lookAt(camera.position);
    });

    // Node pulse
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(t * 1.2 + offset) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Node sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Label */}
      <group position={[0, -size - 0.18, 0]}>
        <Text
          fontSize={0.13}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {name}
        </Text>
      </group>
    </group>
  );
}

function CategoryLabel({ label, center, color }: { label: string; center: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ camera }) => {
    if (ref.current) ref.current.lookAt(camera.position);
  });

  return (
    <group ref={ref} position={[center[0], center[1] + 1.5, center[2]]}>
      <Text
        fontSize={0.22}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        font={undefined}
      >
        {label}
      </Text>
    </group>
  );
}

function ConnectionLines({ category }: { category: SkillCategory }) {
  const positions = useMemo(() => {
    const pts: [number, number, number][] = [];
    category.skills.forEach((_, i) => {
      const angle = (i / category.skills.length) * Math.PI * 2;
      const r = 1.1;
      pts.push([
        category.center[0] + Math.cos(angle) * r,
        category.center[1] + Math.sin(angle) * r * 0.5,
        category.center[2] + Math.sin(angle) * 0.4,
      ]);
    });
    return pts;
  }, [category]);

  const linePositions = useMemo(() => {
    const arr: number[] = [];
    positions.forEach((p) => {
      arr.push(...category.center, ...p);
    });
    return new Float32Array(arr);
  }, [category.center, positions]);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={category.color} transparent opacity={0.2} />
    </lineSegments>
  );
}

function GalaxyScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={30} />

      {skillCategories.map((cat) => (
        <group key={cat.label}>
          <CategoryLabel label={cat.label} center={cat.center} color={cat.color} />
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

export default function SkillGalaxy() {
  return (
    <Canvas
      camera={{ position: [0, 2, 14], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ height: "520px", borderRadius: "16px" }}
    >
      <GalaxyScene />
      <OrbitControls
        enableZoom
        enablePan
        autoRotate
        autoRotateSpeed={0.5}
        minDistance={6}
        maxDistance={22}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
