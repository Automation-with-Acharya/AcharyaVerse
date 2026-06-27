import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface AiAvatarProps {
  state: "idle" | "thinking" | "speaking";
  speechIntensity?: number; // 0 to 1
}

function HologramCore({ state: avatarState, speechIntensity = 0.5 }: { state: string; speechIntensity: number }) {
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const initialPositions = useRef<Float32Array | null>(null);

  // Store initial vertex positions for deformation
  useEffect(() => {
    if (geomRef.current) {
      const posAttr = geomRef.current.attributes.position;
      initialPositions.current = new Float32Array(posAttr.array);
    }
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Deform the outer neural wireframe sphere based on the state
    if (geomRef.current && initialPositions.current) {
      const posAttr = geomRef.current.attributes.position;
      const arr = posAttr.array as Float32Array;
      const init = initialPositions.current;

      let speed = 1.2;
      let amp = 0.08;
      let freq = 2.5;

      if (avatarState === "thinking") {
        speed = 3.5;
        amp = 0.18;
        freq = 4.5;
      } else if (avatarState === "speaking") {
        speed = 6.0;
        // Modulate amplitude by real-time speech intensity & high speed fluctuation
        amp = 0.18 + speechIntensity * 0.22 + Math.sin(time * 18) * 0.08;
        freq = 6.0;
      }

      for (let i = 0; i < arr.length; i += 3) {
        const x = init[i];
        const y = init[i + 1];
        const z = init[i + 2];

        const len = Math.sqrt(x * x + y * y + z * z);
        if (len === 0) continue;
        const nx = x / len;
        const ny = y / len;
        const nz = z / len;

        // Simple turbulence function
        const noise =
          Math.sin(nx * freq + time * speed) *
          Math.cos(ny * freq + time * speed) *
          Math.sin(nz * freq + time * speed);

        const displacement = noise * amp;
        const newLen = len + displacement;

        arr[i] = nx * newLen;
        arr[i + 1] = ny * newLen;
        arr[i + 2] = nz * newLen;
      }
      posAttr.needsUpdate = true;
    }

    // 2. Rotate core mesh, rings and particle shells
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.y = time * 0.2;
      coreMeshRef.current.rotation.z = time * 0.1;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.4;
      ring1Ref.current.rotation.y = time * 0.15;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.35;
      ring2Ref.current.rotation.z = time * 0.2;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.06;
      // Breathe scale
      const pulse = 1.0 + Math.sin(time * 1.5) * 0.04;
      particlesRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  // Color mapping based on status
  const getColor = () => {
    if (avatarState === "thinking") return "#f97316"; // Hot amber/orange
    if (avatarState === "speaking") return "#d946ef"; // Energetic pink/magenta/purple
    return "#38bdf8"; // Calm neon blue/cyan
  };

  // Generate localized star dust points
  const pointsCount = 60;
  const positions = new Float32Array(pointsCount * 3);
  for (let i = 0; i < pointsCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 1.8 + Math.random() * 0.6; // slightly outside the 1.2 radius core
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  const activeColor = getColor();

  return (
    <group>
      {/* 1. Deformable wireframe neural grid sphere */}
      <mesh ref={coreMeshRef}>
        <icosahedronGeometry ref={geomRef} args={[1.15, 3]} />
        <meshStandardMaterial
          color={activeColor}
          wireframe
          emissive={activeColor}
          emissiveIntensity={avatarState === "speaking" ? 2.5 : avatarState === "thinking" ? 1.8 : 0.8}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 2. Inner glowing nucleus */}
      <mesh>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshBasicMaterial
          color={activeColor}
          transparent
          opacity={avatarState === "speaking" ? 0.35 : avatarState === "thinking" ? 0.28 : 0.15}
        />
      </mesh>

      {/* 3. Ring system */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.55, 0.015, 8, 64]} />
        <meshBasicMaterial color={activeColor} transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[1.72, 0.01, 8, 64]} />
        <meshBasicMaterial color={activeColor} transparent opacity={0.2} />
      </mesh>

      {/* 4. Particle envelope shell */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.038}
          color={activeColor}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </points>

      {/* 5. Center light source */}
      <pointLight color={activeColor} intensity={avatarState === "speaking" ? 3.0 : 1.5} distance={10} />
    </group>
  );
}

export default function AiAvatar({ state, speechIntensity = 0.5 }: AiAvatarProps) {
  const [logs, setLogs] = useState<string[]>([
    "INITIALIZING COGNITIVE INTERFACE...",
    "KNOWLEDGE DECK SECURE.",
    "STATUS: STANDBY",
  ]);

  // Push periodic log messages for cybernetic console feeling
  useEffect(() => {
    const statuses = [
      "DECRYPTING SYNAPTIC PATHS...",
      "TELEMETRY STREAM: COMPILING",
      "NEURAL TEMPERATURE: 37.8°C",
      "QUANTUM ENVELOPE: SHIELDED",
      "BUFFER MEMORY: CLEAR",
      "INDEX RAG: ALIVE",
      "REFRESHING VECTOR WEIGHTS...",
      "SYNAPSE LINK: OPTIMAL",
    ];

    const interval = setInterval(() => {
      const randomMsg = statuses[Math.floor(Math.random() * statuses.length)];
      const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
      setLogs((prev) => {
        const next = [...prev, `[${timestamp}] ${randomMsg}`];
        if (next.length > 5) next.shift();
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Update status log on state change
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    let logMsg = "STATUS: STANDBY";
    if (state === "thinking") {
      logMsg = "STATUS: PROCESSING QUANTUM RESPONSE...";
    } else if (state === "speaking") {
      logMsg = "STATUS: STREAMING AUDIO OUTPUT...";
    }

    setLogs((prev) => {
      const next = [...prev, `[${timestamp}] ${logMsg}`];
      if (next.length > 5) next.shift();
      return next;
    });
  }, [state]);

  const stateLabel = () => {
    if (state === "thinking") return "PROCESSING";
    if (state === "speaking") return "TRANSMITTING";
    return "STABLE";
  };

  const getBorderColor = () => {
    if (state === "thinking") return "rgba(249,115,22,0.25)";
    if (state === "speaking") return "rgba(217,70,239,0.3)";
    return "rgba(56,189,248,0.15)";
  };

  const getShadowColor = () => {
    if (state === "thinking") return "rgba(249,115,22,0.1)";
    if (state === "speaking") return "rgba(217,70,239,0.15)";
    return "rgba(56,189,248,0.06)";
  };

  return (
    <div
      style={{
        flex: 1,
        maxWidth: "340px",
        minWidth: "260px",
        background: "rgba(2, 6, 20, 0.7)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${getBorderColor()}`,
        borderRadius: "20px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: `0 8px 32px ${getShadowColor()}`,
        transition: "all 0.5s ease",
      }}
    >
      {/* ── Hologram Visor Display Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "0.85rem",
              color: "#a78bfa",
              letterSpacing: "0.1em",
            }}
          >
            CORE.SYS
          </span>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.7rem",
              color: "#64748b",
            }}
          >
            VER: 10.4.2_DLN
          </span>
        </div>
        <div
          style={{
            padding: "4px 10px",
            background:
              state === "speaking"
                ? "rgba(217,70,239,0.12)"
                : state === "thinking"
                ? "rgba(249,115,22,0.12)"
                : "rgba(56,189,248,0.08)",
            border: `1px solid ${
              state === "speaking"
                ? "rgba(217,70,239,0.3)"
                : state === "thinking"
                ? "rgba(249,115,22,0.3)"
                : "rgba(56,189,248,0.2)"
            }`,
            borderRadius: "6px",
            fontFamily: "'Orbitron', monospace",
            fontSize: "0.68rem",
            color: state === "speaking" ? "#d946ef" : state === "thinking" ? "#f97316" : "#38bdf8",
            fontWeight: "bold",
            letterSpacing: "0.05em",
          }}
        >
          {stateLabel()}
        </div>
      </div>

      {/* ── R3F Canvas Visualizer ── */}
      <div
        style={{
          width: "100%",
          height: "230px",
          position: "relative",
          background: "radial-gradient(circle, rgba(16,24,48,0.2) 0%, rgba(2,6,20,0.6) 100%)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.03)",
          overflow: "hidden",
        }}
      >
        {/* CRT Scanline effect overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.12) 50%)",
            backgroundSize: "100% 4px",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <Canvas camera={{ position: [0, 0, 3.2], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <HologramCore state={state} speechIntensity={speechIntensity} />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
        </Canvas>
      </div>

      {/* ── Telemetry Monitor Log ── */}
      <div
        style={{
          flex: 1,
          background: "#030712",
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: "10px",
          padding: "12px",
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "0.72rem",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          color: "#4ade80", // Green matrix text
          overflow: "hidden",
        }}
      >
        {logs.map((log, index) => (
          <div
            key={index}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              opacity: 0.3 + (index / (logs.length - 1)) * 0.7, // newer logs are brighter
            }}
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
