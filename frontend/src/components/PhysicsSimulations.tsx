import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────
// SOLAR SYSTEM — 8 planets with realistic relative sizes + orbital rings
// ─────────────────────────────────────────────────────────

const SOLAR_BODIES = [
  { name: "Mercury", color: "#b5b5b5", radius: 0.15, orbit: 2.2,  speed: 0.047, tilt: 0.03 },
  { name: "Venus",   color: "#e8cda0", radius: 0.22, orbit: 3.2,  speed: 0.035, tilt: 0.02 },
  { name: "Earth",   color: "#4fa3e0", radius: 0.24, orbit: 4.4,  speed: 0.029, tilt: 0.41 },
  { name: "Mars",    color: "#c1440e", radius: 0.18, orbit: 5.8,  speed: 0.024, tilt: 0.44 },
  { name: "Jupiter", color: "#c88b3a", radius: 0.55, orbit: 8.5,  speed: 0.013, tilt: 0.05 },
  { name: "Saturn",  color: "#e4d191", radius: 0.45, orbit: 11.0, speed: 0.009, tilt: 0.46 },
  { name: "Uranus",  color: "#7de8e8", radius: 0.32, orbit: 13.5, speed: 0.006, tilt: 1.71 },
  { name: "Neptune", color: "#3f54ba", radius: 0.30, orbit: 16.0, speed: 0.005, tilt: 0.49 },
];

function OrbitRing({ radius, opacity = 0.15 }: { radius: number; opacity?: number }) {
  const pts = useMemo<[number, number, number][]>(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      out.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
    }
    return out;
  }, [radius]);

  const geo = useMemo(() => {
    const positions = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      positions[i * 3]     = p[0];
      positions[i * 3 + 1] = p[1];
      positions[i * 3 + 2] = p[2];
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [pts]);

  return (
    <lineLoop geometry={geo}>
      <lineBasicMaterial color="#ffffff" transparent opacity={opacity} />
    </lineLoop>
  );
}

function SaturnRings({ radius }: { radius: number }) {
  return (
    <>
      {[1.3, 1.55, 1.75].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * r, radius * 0.04, 4, 80]} />
          <meshBasicMaterial
            color="#d4c08a"
            transparent
            opacity={0.4 - i * 0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}

function SolarPlanet({ body, angle }: { body: typeof SOLAR_BODIES[0]; angle: number }) {
  const meshRef  = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current)  meshRef.current.rotation.y  += 0.008;
  });

  return (
    <>
      <OrbitRing radius={body.orbit} />
      <group rotation={[0, angle, 0]}>
        <group position={[body.orbit, 0, 0]} rotation={[body.tilt, 0, 0]}>
          <mesh ref={meshRef}>
            <sphereGeometry args={[body.radius, 32, 32]} />
            <meshStandardMaterial
              color={body.color}
              roughness={0.7}
              metalness={0.1}
              emissive={body.color}
              emissiveIntensity={0.04}
            />
          </mesh>
          {body.name === "Saturn" && <SaturnRings radius={body.radius} />}
          <Text
            fontSize={0.18}
            color="white"
            position={[0, body.radius + 0.25, 0]}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000"
          >
            {body.name}
          </Text>
        </group>
      </group>
    </>
  );
}

function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(clock.getElapsedTime() * 1.2) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.9, 64, 64]} />
      <meshStandardMaterial
        color="#fff176"
        emissive="#ff9800"
        emissiveIntensity={0.9}
        roughness={0.3}
      />
      <pointLight color="#fff5c0" intensity={6} distance={60} />
      <Text fontSize={0.22} color="#fbbf24" position={[0, 1.2, 0]} anchorX="center">
        Sun
      </Text>
    </mesh>
  );
}

// Spacetime curvature grid driven dynamically by Sun + planet orbital locations
function SpacetimeSolarGrid({ sunMass, curvatureScale, angles, show }: {
  sunMass: number;
  curvatureScale: number;
  angles: number[];
  show: boolean;
}) {
  const SEGS = 60, SIZE = 36;
  const geometry = useMemo(() => new THREE.PlaneGeometry(SIZE, SIZE, SEGS, SEGS), []);

  const orbitGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!show) return;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Sun gravity well
      const rSun = Math.sqrt(x * x + z * z);
      let depth = (sunMass * 0.015 * curvatureScale) / Math.sqrt(rSun + 0.8);

      // Planet gravity wells tracking actual orbits in real-time
      SOLAR_BODIES.forEach((b, idx) => {
        const angle = angles[idx] || 0;
        // Map Y-axis group rotation back to plane coordinates
        const px = Math.cos(angle) * b.orbit;
        const pz = -Math.sin(angle) * b.orbit;

        const rPlanet = Math.sqrt((x - px) ** 2 + (z - pz) ** 2);
        // Deform grid locally around the planet using radius * scaling multiplier
        depth += (b.radius * 0.25 * curvatureScale) / Math.sqrt(rPlanet + 0.4);
      });

      pos.setY(i, Math.max(-6, -Math.min(depth, 6)));
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  if (!show) return null;
  return (
    <group ref={orbitGroupRef}>
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <meshBasicMaterial color="#1d4ed8" wireframe transparent opacity={0.18} />
      </mesh>
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.52, 0]}>
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#1d4ed8"
          emissiveIntensity={0.15}
          transparent
          opacity={0.25}
          roughness={0.2}
          metalness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function SolarScene({
  speedMultiplier,
  sunMass,
  curvatureScale,
  showGrid,
}: {
  speedMultiplier: number;
  sunMass: number;
  curvatureScale: number;
  showGrid: boolean;
}) {
  const [angles, setAngles] = useState<number[]>(() => SOLAR_BODIES.map(() => Math.random() * Math.PI * 2));

  useFrame((_, delta) => {
    if (speedMultiplier === 0) return;
    setAngles((prev) =>
      prev.map((ang, idx) => ang + SOLAR_BODIES[idx].speed * speedMultiplier * delta * 8)
    );
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <Stars radius={80} depth={40} count={5000} factor={3} saturation={0.2} fade />
      <SpacetimeSolarGrid sunMass={sunMass} curvatureScale={curvatureScale} angles={angles} show={showGrid} />
      <Sun />
      {SOLAR_BODIES.map((b, idx) => (
        <SolarPlanet key={b.name} body={b} angle={angles[idx] || 0} />
      ))}
    </>
  );
}

export function SolarSystemSim() {
  const [speed,          setSpeed]          = useState(1);
  const [paused,         setPaused]         = useState(false);
  const [sunMass,        setSunMass]        = useState(5);
  const [curvatureScale, setCurvatureScale] = useState(3.0);
  const [showGrid,       setShowGrid]       = useState(true);

  // Kepler's 3rd law: T² ∝ a³ (relative to Earth=1)
  const keplerData = SOLAR_BODIES.map(b => ({
    name: b.name,
    T: (b.orbit / 4.4) ** 1.5, // relative period
  }));

  return (
    <div style={{ position: "relative", background: "#000005" }}>
      {/* Full-bleed canvas */}
      <Canvas
        camera={{ position: [0, 12, 22], fov: 55 }}
        style={{ height: "75vh", width: "100%", display: "block" }}
      >
        <SolarScene speedMultiplier={paused ? 0 : speed} sunMass={sunMass} curvatureScale={curvatureScale} showGrid={showGrid} />
        <OrbitControls enableDamping dampingFactor={0.05} minDistance={3} maxDistance={60} />
      </Canvas>

      {/* Floating HUD controls — glassmorphism panel */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "24px",
          background: "rgba(2,4,12,0.82)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(251,191,36,0.2)",
          borderRadius: "16px",
          padding: "20px 22px",
          minWidth: "280px",
          zIndex: 10,
        }}
      >
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", color: "#fbbf24", letterSpacing: "0.15em", marginBottom: "14px" }}>
          SIMULATION CONTROLS
        </div>

        <SliderControl
          label="Orbital Speed"
          value={speed} min={0.1} max={8} step={0.1} unit="x"
          color="#fbbf24" onChange={setSpeed}
        />
        <SliderControl
          label="Sun Mass (affects well depth)"
          value={sunMass} min={1} max={20} step={0.5} unit=" M"
          color="#f97316" onChange={setSunMass}
        />
        <SliderControl
          label="Spacetime Curvature Scale"
          value={curvatureScale} min={1} max={10} step={0.5} unit="x"
          color="#60a5fa" onChange={setCurvatureScale}
        />

        <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
          <LabButton color="#fbbf24" onClick={() => setPaused(!paused)}>
            {paused ? "▶ Resume" : "⏸ Pause"}
          </LabButton>
          <LabButton color="#64748b" onClick={() => { setSpeed(1); setPaused(false); setSunMass(5); setCurvatureScale(3.0); }}>
            ↺ Reset
          </LabButton>
          <LabButton color={showGrid ? "#60a5fa" : "#334155"} onClick={() => setShowGrid(!showGrid)}>
            {showGrid ? "⊞ Grid ON" : "⊟ Grid OFF"}
          </LabButton>
        </div>
      </div>

      {/* Kepler data panel — top right */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "rgba(2,4,12,0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(251,191,36,0.12)",
          borderRadius: "12px",
          padding: "14px 16px",
          zIndex: 10,
          minWidth: "160px",
        }}
      >
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", color: "#fbbf24", letterSpacing: "0.12em", marginBottom: "10px" }}>
          KEPLER DATA · T² ∝ a³
        </div>
        {keplerData.map(p => (
          <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "4px" }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: "#64748b" }}>{p.name}</span>
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.68rem", color: "#fbbf24", fontWeight: 600 }}>
              {p.T.toFixed(2)}yr
            </span>
          </div>
        ))}
      </div>

      <PhysicsFact color="#fbbf24">
        ☀️ Kepler's 3rd Law: T² ∝ a³. The spacetime grid shows how the Sun's gravity curves space — increase Sun Mass to see deeper wells.
        Orbital speed follows Kepler's 2nd Law: planets move fastest at perihelion.
      </PhysicsFact>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// BLACK HOLE VISUALIZATION — gravitational lensing + particle accretion
// ─────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────
// BLACK HOLE VISUALIZATION — gravitational lensing + particle accretion
// ─────────────────────────────────────────────────────────

function BlackHoleScene({ mass }: { mass: number }) {
  const diskRef   = useRef<THREE.Mesh>(null);
  const ring1Ref  = useRef<THREE.Mesh>(null);
  const ring2Ref  = useRef<THREE.Mesh>(null);
  const jetRef    = useRef<THREE.Mesh>(null);
  const coreRef   = useRef<THREE.Mesh>(null);
  const glowRef   = useRef<THREE.Mesh>(null);

  // Schwarzschild physics scaling factors
  const Rs = 0.3 * mass; // Schwarzschild Radius inside simulation units
  const Rphoton = 1.5 * Rs; // Photon sphere radius
  const Risco = 3.0 * Rs; // Innermost stable circular orbit (ISCO)

  // Accretion particles
  const particleCount = 800;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Particles orbit outside the ISCO (3 * Rs)
      const r = Risco + 0.5 + Math.random() * 3.5;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3]     = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = Math.sin(a) * r;
      // Hot inner → cooler outer gradient
      const heat = 1 - (r - Risco) / 3.5;
      col[i * 3]     = 1;
      col[i * 3 + 1] = Math.max(0.1, heat * 0.6);
      col[i * 3 + 2] = Math.max(0.05, heat * 0.2);
    }
    return { positions: pos, colors: col };
  }, [Risco]);

  const particleRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (diskRef.current)  diskRef.current.rotation.z  += 0.012;
    if (ring1Ref.current) ring1Ref.current.rotation.z -= 0.007;
    if (ring2Ref.current) ring2Ref.current.rotation.z += 0.005;
    if (jetRef.current) {
      const mat = jetRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(t * 2) * 0.08;
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.06 + Math.sin(t * 0.8) * 0.03;
    }
    // Rotate accretion disk particles
    if (particleRef.current) {
      particleRef.current.rotation.y += 0.004;
    }
  });

  return (
    <>
      <ambientLight intensity={0.05} />
      <Stars radius={60} depth={30} count={4000} factor={3} saturation={0.1} fade />

      {/* Event horizon glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[Rs * 2.2, 32, 32]} />
        <meshBasicMaterial color="#1a004d" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      {/* Singularity Core (Event Horizon) */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[Rs, 64, 64]} />
        <meshStandardMaterial color="#000000" emissive="#0d0030" emissiveIntensity={0.5} />
      </mesh>

      {/* Photon sphere ring (1.5 * Rs) */}
      <mesh rotation={[Math.PI / 2.2, 0.2, 0]}>
        <torusGeometry args={[Rphoton, 0.025 * Rs, 8, 120]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>

      {/* Accretion disk — hot inner (starting at ISCO = 3 * Rs) */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[Risco + 0.4, 0.3 * Rs, 16, 120]} />
        <meshStandardMaterial
          color="#ff6200"
          emissive="#ff4500"
          emissiveIntensity={2.5}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Mid ring */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2.3, 0.4, 0]}>
        <torusGeometry args={[Risco + 1.0, 0.06 * Rs, 8, 100]} />
        <meshStandardMaterial color="#9d174d" emissive="#be185d" emissiveIntensity={1.5} transparent opacity={0.7} />
      </mesh>

      {/* Outer glow ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2.1, 0.7, 0]}>
        <torusGeometry args={[Risco + 1.8, 0.03 * Rs, 8, 100]} />
        <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={1.0} transparent opacity={0.4} />
      </mesh>

      {/* Relativistic jet */}
      <mesh ref={jetRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.04 * Rs, 0.3 * Rs, 10, 16, 1, true]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={jetRef} position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.04 * Rs, 0.3 * Rs, 10, 16, 1, true]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Accretion particles */}
      <points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <pointLight color="#ff6200" intensity={4} distance={20} />
    </>
  );
}

export function BlackHoleSim() {
  const [mass, setMass] = useState(3.0); // Mass in Solar Masses (M☉)

  // Derive physics metrics
  const rsKm = mass * 2.953; // Schwarzschild radius in km
  const photonSphereRadius = 1.5 * rsKm; // Photon sphere radius in km
  const hawkingTemp = 1.227e23 / mass; // Hawking Temperature in Kelvin (using M_sol equivalent)
  const iscoRadius = 3.0 * rsKm; // Innermost Stable Circular Orbit in km

  const bhStats = [
    { label: "Schwarzschild Rs", value: `${rsKm.toFixed(2)} km`, color: "#f43f5e" },
    { label: "Photon Sphere Radius", value: `${photonSphereRadius.toFixed(2)} km`, color: "#ffffff" },
    { label: "ISCO Boundary", value: `${iscoRadius.toFixed(2)} km`, color: "#fbbf24" },
    { label: "Hawking Temperature", value: hawkingTemp < 1e-6 ? `${hawkingTemp.toExponential(2)} K` : `${hawkingTemp.toFixed(6)} K`, color: "#60a5fa" },
  ];

  return (
    <div style={{ position: "relative", background: "#000000" }}>
      <Canvas camera={{ position: [0, 4, 9], fov: 55 }} style={{ height: "75vh", width: "100%", display: "block" }}>
        <BlackHoleScene mass={mass} />
        <OrbitControls enableDamping dampingFactor={0.05} minDistance={2} maxDistance={22} />
      </Canvas>

      {/* Controls HUD — bottom left */}
      <div
        style={{
          position: "absolute", bottom: "16px", left: "16px",
          background: "rgba(2,0,8,0.85)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(244,63,94,0.2)", borderRadius: "16px",
          padding: "20px 22px", zIndex: 10, minWidth: "280px",
        }}
      >
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", color: "#f43f5e", letterSpacing: "0.15em", marginBottom: "14px" }}>
          BLACK HOLE CONTROLS
        </div>
        <SliderControl
          label="Singularity Mass"
          value={mass} min={1.0} max={12.0} step={0.2} unit=" M☉"
          color="#f43f5e" onChange={setMass}
        />
        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
          <LabButton color="#f43f5e" onClick={() => setMass(3.0)}>
            ↺ Reset Mass
          </LabButton>
        </div>
      </div>

      {/* Physics stats HUD — top right */}
      <div
        style={{
          position: "absolute", top: "16px", right: "16px",
          background: "rgba(2,0,8,0.82)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(244,63,94,0.2)", borderRadius: "14px",
          padding: "16px 18px", zIndex: 10, minWidth: "200px",
        }}
      >
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", color: "#f43f5e", letterSpacing: "0.15em", marginBottom: "12px" }}>
          SINGULARITY DATA
        </div>
        {bhStats.map(s => (
          <div key={s.label} style={{ marginBottom: "10px" }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.85rem", color: s.color, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.68rem", color: "#64748b" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Hint overlay — bottom left floating above stats */}
      <div
        style={{
          position: "absolute", bottom: "140px", left: "16px",
          background: "rgba(2,0,8,0.75)", backdropFilter: "blur(14px)",
          border: "1px solid rgba(244,63,94,0.12)", borderRadius: "10px",
          padding: "10px 14px", zIndex: 10,
        }}
      >
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#94a3b8", fontSize: "0.72rem", margin: 0, lineHeight: 1.6 }}>
          Drag · Orbit &nbsp;|&nbsp; Scroll · Zoom &nbsp;|&nbsp; ISCO = 3× Schwarzschild radius
        </p>
      </div>

      <PhysicsFact color="#f43f5e">
        ⚫ Inside the event horizon, all future paths point to the singularity. Relativistic jets extend thousands of light-years.
        The photon sphere (white ring) marks where light orbits at exactly 1.5× the Schwarzschild radius.
      </PhysicsFact>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// WAVE INTERFERENCE — two-source interference pattern
// ─────────────────────────────────────────────────────────

function WaveScene({ freq1, freq2, amplitude, paused }: {
  freq1: number; freq2: number; amplitude: number; paused: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const GRID = 80;

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, GRID, GRID);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || paused) return;
    timeRef.current += delta;
    const t = timeRef.current;

    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const count = pos.count;

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Two sources at (-3, 0) and (3, 0)
      const d1 = Math.sqrt((x + 3) ** 2 + z ** 2);
      const d2 = Math.sqrt((x - 3) ** 2 + z ** 2);

      const w1 = amplitude * Math.sin(freq1 * d1 - t * 4) / (d1 + 1);
      const w2 = amplitude * Math.sin(freq2 * d2 - t * 4) / (d2 + 1);

      pos.setY(i, w1 + w2);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#60a5fa" />
      <pointLight position={[-3, 3, 0]} color="#a78bfa" intensity={2} />
      <pointLight position={[3, 3, 0]} color="#34d399" intensity={2} />

      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#1d4ed8"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.6}
          wireframe={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Source indicators */}
      {[[-3, 0, 0], [3, 0, 0]].map(([x, , z], i) => (
        <mesh key={i} position={[x, 0.5, z as number]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={i === 0 ? "#a78bfa" : "#34d399"}
            emissive={i === 0 ? "#7c3aed" : "#059669"}
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}
    </>
  );
}

export function WaveInterferenceSim() {
  const [freq1, setFreq1]   = useState(1.5);
  const [freq2, setFreq2]   = useState(1.5);
  const [amplitude, setAmp] = useState(1.2);
  const [paused, setPaused] = useState(false);

  // Derived physics
  const sameFreq = Math.abs(freq1 - freq2) < 0.05;
  const beatFreq = Math.abs(freq1 - freq2).toFixed(2);

  return (
    <div style={{ position: "relative", background: "#000010" }}>
      <Canvas camera={{ position: [0, 12, 8], fov: 55 }} style={{ height: "75vh", width: "100%", display: "block" }}>
        <WaveScene freq1={freq1} freq2={freq2} amplitude={amplitude} paused={paused} />
        <OrbitControls enableDamping />
      </Canvas>

      {/* Controls HUD */}
      <div
        style={{
          position: "absolute", bottom: "16px", left: "16px",
          background: "rgba(2,4,20,0.85)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(167,139,250,0.2)", borderRadius: "16px",
          padding: "20px 22px", zIndex: 10, minWidth: "280px",
        }}
      >
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", color: "#a78bfa", letterSpacing: "0.15em", marginBottom: "14px" }}>
          WAVE CONTROLS
        </div>
        <SliderControl label="Source 1 Frequency" value={freq1} min={0.5} max={4} step={0.1} unit=" Hz" color="#a78bfa" onChange={setFreq1} />
        <SliderControl label="Source 2 Frequency" value={freq2} min={0.5} max={4} step={0.1} unit=" Hz" color="#34d399" onChange={setFreq2} />
        <SliderControl label="Amplitude" value={amplitude} min={0.2} max={2.5} step={0.1} unit="" color="#60a5fa" onChange={setAmp} />
        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
          <LabButton color="#a78bfa" onClick={() => setPaused(!paused)}>{paused ? "▶ Resume" : "⏸ Pause"}</LabButton>
          <LabButton color="#64748b" onClick={() => { setFreq1(1.5); setFreq2(1.5); setAmp(1.2); setPaused(false); }}>↺ Reset</LabButton>
        </div>
      </div>

      {/* Physics readout — top right */}
      <div
        style={{
          position: "absolute", top: "16px", right: "16px",
          background: "rgba(2,4,20,0.82)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(167,139,250,0.15)", borderRadius: "12px",
          padding: "14px 18px", zIndex: 10,
        }}
      >
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", color: "#a78bfa", letterSpacing: "0.12em", marginBottom: "10px" }}>INTERFERENCE</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.78rem", color: sameFreq ? "#34d399" : "#fbbf24", marginBottom: "4px" }}>
          {sameFreq ? "✓ Standing wave pattern" : `Beat frequency: ${beatFreq} Hz`}
        </div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: "#475569" }}>
          {sameFreq ? "Constructive/destructive maxima fixed" : "Nodes oscillate at beat frequency"}
        </div>
      </div>

      <PhysicsFact color="#a78bfa">
        〰️ Set both frequencies equal for a stable interference pattern with fixed nodes.
        Make them different to observe beating — the apparent pulsation of amplitude at the difference frequency.
        This is the principle behind noise-cancelling headphones and acoustic engineers.
      </PhysicsFact>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// N-BODY GRAVITY — 3 to 5 bodies interacting
// ─────────────────────────────────────────────────────────

type Body = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  mass: number;
  color: string;
  radius: number;
};

function createBodies(count: number): Body[] {
  const configs: Body[] = [
    { pos: new THREE.Vector3(-4, 0, 0),  vel: new THREE.Vector3(0,  0,  0.8), mass: 300, color: "#60a5fa", radius: 0.4 },
    { pos: new THREE.Vector3(4, 0, 0),   vel: new THREE.Vector3(0,  0, -0.8), mass: 300, color: "#f97316", radius: 0.4 },
    { pos: new THREE.Vector3(0, 3, 0),   vel: new THREE.Vector3(0.8,0, 0),    mass: 250, color: "#34d399", radius: 0.35 },
    { pos: new THREE.Vector3(-2, -3, 0), vel: new THREE.Vector3(0.5,0, 0.5),  mass: 200, color: "#a78bfa", radius: 0.3 },
    { pos: new THREE.Vector3(2, -3, 0),  vel: new THREE.Vector3(-0.5,0, 0.4), mass: 200, color: "#fbbf24", radius: 0.3 },
  ];
  return configs.slice(0, count).map(c => ({
    ...c,
    pos: c.pos.clone(),
    vel: c.vel.clone(),
  }));
}

function NBodyScene({ bodyCount, speed, paused, simKey }: {
  bodyCount: number; speed: number; paused: boolean; simKey: number;
}) {
  const bodies    = useRef<Body[]>(createBodies(bodyCount));
  const meshRefs  = useRef<(THREE.Mesh | null)[]>([]);
  const G = 6.674;
  const SOFTENING = 0.5;

  // Reset when simKey changes
  useRef(() => { bodies.current = createBodies(bodyCount); });

  useFrame((_, delta) => {
    if (paused) return;
    const dt = delta * speed * 0.5;
    const bs = bodies.current;

    // Compute forces
    for (let i = 0; i < bs.length; i++) {
      const force = new THREE.Vector3();
      for (let j = 0; j < bs.length; j++) {
        if (i === j) continue;
        const diff = new THREE.Vector3().subVectors(bs[j].pos, bs[i].pos);
        const dist = diff.length();
        const softDist = Math.sqrt(dist * dist + SOFTENING);
        const mag = (G * bs[i].mass * bs[j].mass) / (softDist * softDist);
        force.addScaledVector(diff.normalize(), mag / bs[i].mass);
      }
      bs[i].vel.addScaledVector(force, dt);
      // Clamp velocity
      if (bs[i].vel.length() > 5) bs[i].vel.normalize().multiplyScalar(5);
    }

    // Update positions + meshes
    for (let i = 0; i < bs.length; i++) {
      bs[i].pos.addScaledVector(bs[i].vel, dt);
      // Boundary bounce
      ["x", "y", "z"].forEach((ax) => {
        const a = ax as "x" | "y" | "z";
        if (Math.abs(bs[i].pos[a]) > 12) {
          bs[i].vel[a] *= -0.7;
          bs[i].pos[a] = Math.sign(bs[i].pos[a]) * 12;
        }
      });
      if (meshRefs.current[i]) {
        meshRefs.current[i]!.position.copy(bs[i].pos);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <Stars radius={60} depth={30} count={2000} factor={3} fade />
      {createBodies(bodyCount).map((b, i) => (
        <mesh
          key={`${simKey}-${i}`}
          ref={(r) => { meshRefs.current[i] = r; }}
          position={b.pos.clone()}
        >
          <sphereGeometry args={[b.radius, 32, 32]} />
          <meshStandardMaterial
            color={b.color}
            emissive={b.color}
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.3}
          />
          <pointLight color={b.color} intensity={1.5} distance={8} />
        </mesh>
      ))}
    </>
  );
}

export function NBodySim() {
  const [bodyCount, setBodyCount] = useState(3);
  const [speed, setSpeed]         = useState(1);
  const [paused, setPaused]       = useState(false);
  const [simKey, setSimKey]       = useState(0);

  return (
    <div style={{ position: "relative", background: "#000005" }}>
      <Canvas key={simKey} camera={{ position: [0, 8, 18], fov: 55 }} style={{ height: "75vh", width: "100%", display: "block" }}>
        <NBodyScene bodyCount={bodyCount} speed={speed} paused={paused} simKey={simKey} />
        <OrbitControls enableDamping />
      </Canvas>

      {/* Controls HUD */}
      <div
        style={{
          position: "absolute", bottom: "16px", left: "16px",
          background: "rgba(2,4,12,0.85)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(249,115,22,0.2)", borderRadius: "16px",
          padding: "20px 22px", zIndex: 10, minWidth: "280px",
        }}
      >
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", color: "#f97316", letterSpacing: "0.15em", marginBottom: "14px" }}>N-BODY CONTROLS</div>
        <div style={{ marginBottom: "14px" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#94a3b8", fontSize: "0.82rem", marginBottom: "8px" }}>
            Bodies: <span style={{ color: "#f97316", fontWeight: 600 }}>{bodyCount}</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => { setBodyCount(n); setSimKey((k) => k + 1); }}
                style={{
                  padding: "7px 18px", borderRadius: "8px",
                  border: `1px solid ${n === bodyCount ? "#f97316" : "rgba(255,255,255,0.1)"}`,
                  background: n === bodyCount ? "rgba(249,115,22,0.15)" : "transparent",
                  color: n === bodyCount ? "#f97316" : "#64748b",
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", cursor: "pointer",
                }}
              >
                {n} Bodies
              </button>
            ))}
          </div>
        </div>
        <SliderControl label="Simulation Speed" value={speed} min={0.1} max={3} step={0.1} unit="x" color="#f97316" onChange={setSpeed} />
        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
          <LabButton color="#f97316" onClick={() => setPaused(!paused)}>{paused ? "▶ Resume" : "⏸ Pause"}</LabButton>
          <LabButton color="#64748b" onClick={() => setSimKey((k) => k + 1)}>↺ Reset</LabButton>
        </div>
      </div>

      {/* Chaos readout */}
      <div
        style={{
          position: "absolute", top: "16px", right: "16px",
          background: "rgba(2,4,12,0.8)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(249,115,22,0.15)", borderRadius: "12px",
          padding: "14px 18px", zIndex: 10,
        }}
      >
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", color: "#f97316", letterSpacing: "0.12em", marginBottom: "8px" }}>CHAOS METRICS</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: "#64748b", lineHeight: 1.6 }}>
          <div>Bodies: <span style={{ color: "#f97316" }}>{bodyCount}</span></div>
          <div>Interactions: <span style={{ color: "#f97316" }}>{bodyCount * (bodyCount - 1) / 2}</span> pairs</div>
          <div>Lyapunov: <span style={{ color: "#fbbf24" }}>diverges exponentially</span></div>
        </div>
      </div>

      <PhysicsFact color="#f97316">
        🌌 No closed-form solution exists for N≥3 (Poincaré, 1890). Reset to see completely different outcomes from
        seemingly identical initial conditions — this is deterministic chaos. Real solar system stability is only known for ~5M years.
      </PhysicsFact>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SPACETIME CURVATURE — gravity well deformable mesh
// Physics: Y displacement ∝ -mass / sqrt(r² + ε)
// NOT ripples (those = gravitational waves); this = geodesic curvature
// ─────────────────────────────────────────────────────────

const GRID_SIZE = 24;   // world-space size
const GRID_SEGS = 70;   // vertex resolution

function colorFromDepth(depth: number, maxDepth: number): THREE.Color {
  // 0 = flat (cyan-blue) → 1 = deep well (red-violet)
  const t = Math.min(depth / maxDepth, 1);
  const c = new THREE.Color();
  // Hue: 200° (blue) → 0° (red), through violet at midpoint
  c.setHSL(0.58 - t * 0.58, 1, 0.5 - t * 0.15);
  return c;
}

interface WellMass { x: number; z: number; mass: number; color: string; drift: number; }

function SpacetimeScene({
  wells, maxDepth, showWireframe,
}: { wells: WellMass[]; maxDepth: number; showWireframe: boolean }) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const wireRef  = useRef<THREE.Mesh>(null);
  const timeRef  = useRef(0);

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE, GRID_SEGS, GRID_SEGS);
  }, []);

  // Pre-alloc color buffer
  const colorBuffer = useMemo(() => {
    const n = (GRID_SEGS + 1) * (GRID_SEGS + 1);
    return new Float32Array(n * 3);
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta * 0.25;
    const t = timeRef.current;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const count = pos.count;

    let globalMax = 0;

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i); // PlaneGeometry is XY, rotated

      let totalDepth = 0;
      for (const w of wells) {
        // Gentle sinusoidal drift of mass position
        const wx = w.x + Math.sin(t * w.drift) * 1.5;
        const wz = w.z + Math.cos(t * w.drift * 0.7) * 1.5;
        const r2 = (x - wx) ** 2 + (z - wz) ** 2;
        totalDepth += (w.mass / 100) * 4 / Math.sqrt(r2 + 0.5);
      }
      totalDepth = Math.min(totalDepth, maxDepth);
      if (totalDepth > globalMax) globalMax = totalDepth;
      pos.setY(i, -totalDepth);

      const c = colorFromDepth(totalDepth, maxDepth);
      colorBuffer[i * 3]     = c.r;
      colorBuffer[i * 3 + 1] = c.g;
      colorBuffer[i * 3 + 2] = c.b;
    }

    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    // Apply colors
    if (!geometry.attributes.color) {
      geometry.setAttribute('color', new THREE.BufferAttribute(colorBuffer.slice(), 3));
    } else {
      (geometry.attributes.color as THREE.BufferAttribute).set(colorBuffer);
      (geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }

    // Mirror geometry to wireframe
    if (wireRef.current) {
      wireRef.current.geometry = geometry;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 14, 6]} intensity={0.8} color="#a0c8ff" />
      <pointLight position={[0, 8, 0]} intensity={2} color="#ffffff" distance={40} />
      <Stars radius={60} depth={30} count={2000} factor={3} saturation={0.2} fade />

      {/* Solid color-mapped mesh */}
      <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          roughness={0.3}
          metalness={0.5}
          transparent
          opacity={showWireframe ? 0.55 : 0.85}
        />
      </mesh>

      {/* Wireframe overlay */}
      {showWireframe && (
        <mesh ref={wireRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial
            color="#60a5fa"
            wireframe
            transparent
            opacity={0.25}
          />
        </mesh>
      )}

      {/* Mass spheres floating above their wells */}
      {wells.map((w, i) => (
        <mesh key={i} position={[w.x, 0.4 + (w.mass / 100) * 0.3, w.z]}>
          <sphereGeometry args={[0.12 + (w.mass / 100) * 0.18, 24, 24]} />
          <meshStandardMaterial
            color={w.color}
            emissive={w.color}
            emissiveIntensity={1.2}
            roughness={0.1}
            metalness={0.6}
          />
          <pointLight color={w.color} intensity={3} distance={8} />
        </mesh>
      ))}
    </>
  );
}

export function SpacetimeCurvatureSim() {
  const presets = [
    {
      id: "single",   label: "Single Mass",
      wells: [{ x: 0, z: 0, mass: 80, color: "#60a5fa", drift: 0 }],
    },
    {
      id: "binary",   label: "Binary Stars",
      wells: [
        { x: -4, z: 0, mass: 70, color: "#fbbf24", drift: 0.3 },
        { x:  4, z: 0, mass: 60, color: "#f97316", drift: -0.3 },
      ],
    },
    {
      id: "triple",   label: "Triple System",
      wells: [
        { x: -4, z: -3, mass: 60, color: "#a78bfa", drift: 0.2 },
        { x:  4, z: -3, mass: 55, color: "#34d399", drift: -0.25 },
        { x:  0, z:  4, mass: 80, color: "#f43f5e", drift: 0.15 },
      ],
    },
    {
      id: "blackhole", label: "Black Hole",
      wells: [{ x: 0, z: 0, mass: 200, color: "#6d28d9", drift: 0 }],
    },
  ];

  const [preset, setPreset]   = useState(presets[0]);
  const [mass, setMass]       = useState(80);
  const [maxD, setMaxD]       = useState(8);
  const [wire, setWire]       = useState(true);

  // Scale single-mass preset by slider
  const activeWells = preset.id === "single"
    ? [{ ...preset.wells[0], mass }]
    : preset.wells;

  return (
    <div>
      <div
        style={{
          background: "rgba(0,0,10,0.95)",
          border: "1px solid rgba(96,165,250,0.2)",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <Canvas camera={{ position: [0, 18, 14], fov: 50 }} style={{ height: "500px" }}>
          <SpacetimeScene wells={activeWells} maxDepth={maxD} showWireframe={wire} />
          <OrbitControls enableDamping dampingFactor={0.05} minDistance={4} maxDistance={40} />
        </Canvas>
      </div>

      <PhysicsControls>
        {/* Preset selector */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#94a3b8", fontSize: "0.82rem", marginBottom: "8px" }}>
            Mass Configuration
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => setPreset(p)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "8px",
                  border: `1px solid ${p.id === preset.id ? "#60a5fa" : "rgba(255,255,255,0.1)"}`,
                  background: p.id === preset.id ? "rgba(96,165,250,0.15)" : "transparent",
                  color: p.id === preset.id ? "#60a5fa" : "#64748b",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {preset.id === "single" && (
          <SliderControl label="Mass" value={mass} min={10} max={200} step={5} unit=" M" color="#60a5fa" onChange={setMass} />
        )}
        <SliderControl label="Max Well Depth" value={maxD} min={2} max={18} step={0.5} unit=" units" color="#a78bfa" onChange={setMaxD} />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <LabButton color="#60a5fa" onClick={() => setWire(!wire)}>
            {wire ? "⬡ Hide Grid" : "⬡ Show Grid"}
          </LabButton>
        </div>
      </PhysicsControls>

      {/* Color legend */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "16px",
        padding: "12px 18px",
        background: "rgba(2,8,20,0.7)",
        border: "1px solid rgba(96,165,250,0.12)",
        borderRadius: "12px",
      }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#64748b", fontSize: "0.78rem" }}>Curvature:</span>
        <div style={{
          flex: 1,
          height: "8px",
          borderRadius: "4px",
          background: "linear-gradient(90deg, #06b6d4, #6d28d9, #dc2626)",
        }}/>
        <span style={{ fontFamily: "'Orbitron', monospace", color: "#06b6d4", fontSize: "0.72rem" }}>Flat</span>
        <span style={{ fontFamily: "'Orbitron', monospace", color: "#dc2626", fontSize: "0.72rem" }}>Deep</span>
      </div>

      <PhysicsFact color="#60a5fa">
        🌌 Einstein's General Relativity describes gravity not as a force, but as the curvature
        of 4-dimensional spacetime caused by mass. Massive objects create deeper wells —
        geodesics ("straight lines" in curved spacetime) follow these wells, which we perceive as gravitational attraction.
        Black holes create infinite-depth funnels where even light cannot escape.
      </PhysicsFact>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PENDULUM — RK4 integrated, single + double chaos
// ─────────────────────────────────────────────────────────

const GRAVITY_PRESETS: Record<string, number> = {
  Earth:   9.81,
  Moon:    1.62,
  Mars:    3.72,
  Jupiter: 24.79,
  Space:   0.1,
};

function PendulumScene({
  length, gravity, damping, angle0, paused, isDouble, length2, angle2_0,
}: {
  length: number; gravity: number; damping: number; angle0: number;
  paused: boolean; isDouble: boolean; length2: number; angle2_0: number;
}) {
  // State: [theta1, omega1, theta2, omega2]
  const stateRef   = useRef([angle0, 0, angle2_0, 0]);
  const trailRef   = useRef<THREE.Vector3[]>([]);
  const bob1Ref    = useRef<THREE.Mesh>(null);
  const bob2Ref    = useRef<THREE.Mesh>(null);
  const rod1Ref    = useRef<THREE.Mesh>(null);
  const rod2Ref    = useRef<THREE.Mesh>(null);

  const m1 = 1, m2 = 1;
  const L1 = length, L2 = length2;

  // Reset on simKey
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetRef = useRef(false);
  if (!resetRef.current) {
    stateRef.current = [angle0, 0, angle2_0, 0];
    trailRef.current = [];
    resetRef.current = true;
  }

  // RK4 derivatives for simple pendulum
  const derivSimple = (th: number, om: number): [number, number] => [
    om,
    -(gravity / L1) * Math.sin(th) - damping * om,
  ];

  // RK4 derivatives for double pendulum
  const derivDouble = (th1: number, om1: number, th2: number, om2: number) => {
    const dth = th1 - th2;
    const denom1 = (m1 + m2) * L1 - m2 * L1 * Math.cos(dth) * Math.cos(dth);
    const denom2 = (L2 / L1) * denom1;

    const dom1 = (
      m2 * L1 * om1 * om1 * Math.sin(dth) * Math.cos(dth)
      + m2 * gravity * Math.sin(th2) * Math.cos(dth)
      + m2 * L2 * om2 * om2 * Math.sin(dth)
      - (m1 + m2) * gravity * Math.sin(th1)
    ) / denom1 - damping * om1;

    const dom2 = (
      -m2 * L2 * om2 * om2 * Math.sin(dth) * Math.cos(dth)
      + (m1 + m2) * gravity * Math.sin(th1) * Math.cos(dth)
      - (m1 + m2) * L1 * om1 * om1 * Math.sin(dth)
      - (m1 + m2) * gravity * Math.sin(th2)
    ) / denom2 - damping * om2;

    return [om1, dom1, om2, dom2];
  };

  useFrame((_, delta) => {
    if (paused) return;
    const dt = Math.min(delta, 0.02); // cap timestep
    const STEPS = 8;
    const h = dt / STEPS;

    for (let s = 0; s < STEPS; s++) {
      const [th1, om1, th2, om2] = stateRef.current;

      if (isDouble) {
        // RK4 for double pendulum
        const k1 = derivDouble(th1, om1, th2, om2);
        const k2 = derivDouble(th1+h/2*k1[0], om1+h/2*k1[1], th2+h/2*k1[2], om2+h/2*k1[3]);
        const k3 = derivDouble(th1+h/2*k2[0], om1+h/2*k2[1], th2+h/2*k2[2], om2+h/2*k2[3]);
        const k4 = derivDouble(th1+h*k3[0],   om1+h*k3[1],   th2+h*k3[2],   om2+h*k3[3]);
        stateRef.current = [
          th1 + (h/6)*(k1[0]+2*k2[0]+2*k3[0]+k4[0]),
          om1 + (h/6)*(k1[1]+2*k2[1]+2*k3[1]+k4[1]),
          th2 + (h/6)*(k1[2]+2*k2[2]+2*k3[2]+k4[2]),
          om2 + (h/6)*(k1[3]+2*k2[3]+2*k3[3]+k4[3]),
        ];
      } else {
        // RK4 for simple pendulum
        const [d1a, d1b] = derivSimple(th1, om1);
        const [d2a, d2b] = derivSimple(th1+h/2*d1a, om1+h/2*d1b);
        const [d3a, d3b] = derivSimple(th1+h/2*d2a, om1+h/2*d2b);
        const [d4a, d4b] = derivSimple(th1+h*d3a,   om1+h*d3b);
        stateRef.current[0] = th1 + (h/6)*(d1a+2*d2a+2*d3a+d4a);
        stateRef.current[1] = om1 + (h/6)*(d1b+2*d2b+2*d3b+d4b);
      }
    }

    const [th1, , th2] = stateRef.current;

    // Pivot at origin, Y pointing down
    const x1 =  L1 * Math.sin(th1) * 3;
    const y1 = -L1 * Math.cos(th1) * 3;
    const x2 = x1 + L2 * Math.sin(th2) * 3;
    const y2 = y1 - L2 * Math.cos(th2) * 3;

    // Update bob1
    if (bob1Ref.current) bob1Ref.current.position.set(x1, y1, 0);
    // Update rod1 (scale+rotate a cylinder)
    if (rod1Ref.current) {
      rod1Ref.current.position.set(x1/2, y1/2, 0);
      rod1Ref.current.scale.y = Math.sqrt(x1*x1 + y1*y1) / 3;
      rod1Ref.current.rotation.z = -Math.atan2(x1, -y1);
    }

    if (isDouble) {
      if (bob2Ref.current) bob2Ref.current.position.set(x2, y2, 0);
      if (rod2Ref.current) {
        const dx = x2-x1, dy = y2-y1;
        rod2Ref.current.position.set((x1+x2)/2, (y1+y2)/2, 0);
        rod2Ref.current.scale.y = Math.sqrt(dx*dx+dy*dy)/3;
        rod2Ref.current.rotation.z = -Math.atan2(dx, -dy);
      }

      // Trail for bob2
      trailRef.current.push(new THREE.Vector3(x2, y2, 0));
      if (trailRef.current.length > 200) trailRef.current.shift();
    } else {
      // Trail for simple bob
      trailRef.current.push(new THREE.Vector3(x1, y1, 0));
      if (trailRef.current.length > 150) trailRef.current.shift();
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1} color="#a0c8ff" />
      <Stars radius={40} depth={20} count={1500} factor={3} fade />

      {/* Pivot point */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.5} />
      </mesh>

      {/* Rod 1 */}
      <mesh ref={rod1Ref} position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 3, 8]} />
        <meshStandardMaterial color="#60a5fa" emissive="#1d4ed8" emissiveIntensity={0.3} />
      </mesh>

      {/* Bob 1 */}
      <mesh ref={bob1Ref} position={[0, -3, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.8} roughness={0.2} metalness={0.6} />
        <pointLight color="#60a5fa" intensity={2} distance={5} />
      </mesh>

      {isDouble && (
        <>
          {/* Rod 2 */}
          <mesh ref={rod2Ref}>
            <cylinderGeometry args={[0.03, 0.03, 3, 8]} />
            <meshStandardMaterial color="#f43f5e" emissive="#be123c" emissiveIntensity={0.3} />
          </mesh>
          {/* Bob 2 */}
          <mesh ref={bob2Ref}>
            <sphereGeometry args={[0.22, 32, 32]} />
            <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.8} roughness={0.2} metalness={0.6} />
            <pointLight color="#f43f5e" intensity={2} distance={5} />
          </mesh>
        </>
      )}
    </>
  );
}

export function PendulumSim() {
  const [length,  setLength]  = useState(1.0);
  const [gravKey, setGravKey] = useState("Earth");
  const [damping, setDamping] = useState(0.05);
  const [angle0,  setAngle0]  = useState(45);
  const [isDouble, setDouble] = useState(false);
  const [paused,  setPaused]  = useState(false);
  const [simKey,  setSimKey]  = useState(0);

  const g = GRAVITY_PRESETS[gravKey];
  const period = 2 * Math.PI * Math.sqrt(length / g);
  const angle0Rad = (angle0 * Math.PI) / 180;

  return (
    <div style={{ position: "relative", background: "#000008", width: "100%", height: "100vh" }}>
      <Canvas key={simKey} camera={{ position: [0, -3, 14], fov: 50 }} style={{ height: "100%", width: "100%", display: "block" }}>
          <PendulumScene
            length={length} gravity={g} damping={damping}
            angle0={angle0Rad} paused={paused}
            isDouble={isDouble} length2={length * 0.8} angle2_0={angle0Rad * 0.9}
          />
        <OrbitControls enableDamping enableZoom minDistance={5} maxDistance={25} />
      </Canvas>

      {/* Live stats HUD - top right */}
      <div
        style={{
          position: "absolute", top: "16px", right: "16px",
          background: "rgba(2,4,16,0.85)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(52,211,153,0.2)", borderRadius: "14px",
          padding: "16px 18px", zIndex: 10, minWidth: "170px",
        }}
      >
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", color: "#34d399", letterSpacing: "0.15em", marginBottom: "12px" }}>LIVE PHYSICS</div>
        {[
          { label: "Period (T)",    value: `${period.toFixed(2)} s`,   color: "#34d399" },
          { label: "Gravity (g)",   value: `${g.toFixed(2)} m/s²`,     color: "#fbbf24" },
          { label: "Length (L)",    value: `${length.toFixed(2)} m`,   color: "#60a5fa" },
          { label: "Damping (b)",   value: `${damping.toFixed(3)}`,    color: "#a78bfa" },
        ].map(s => (
          <div key={s.label} style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "8px" }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", color: "#475569" }}>{s.label}</span>
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.75rem", color: s.color, fontWeight: 700 }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Controls HUD - bottom left */}
      <div
        style={{
          position: "absolute", bottom: "16px", left: "16px",
          background: "rgba(2,4,16,0.85)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(52,211,153,0.2)", borderRadius: "16px",
          padding: "20px 22px", zIndex: 10, minWidth: "300px",
        }}
      >
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", color: "#34d399", letterSpacing: "0.15em", marginBottom: "14px" }}>PENDULUM CONTROLS</div>

        <div style={{ marginBottom: "14px" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#94a3b8", fontSize: "0.75rem", marginBottom: "6px" }}>Gravity World</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {Object.keys(GRAVITY_PRESETS).map((gp) => (
              <button
                key={gp}
                onClick={() => { setGravKey(gp); setSimKey(k => k + 1); }}
                style={{
                  padding: "5px 12px", borderRadius: "8px",
                  border: `1px solid ${gp === gravKey ? "#34d399" : "rgba(255,255,255,0.08)"}`,
                  background: gp === gravKey ? "rgba(52,211,153,0.15)" : "transparent",
                  color: gp === gravKey ? "#34d399" : "#64748b",
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.73rem", cursor: "pointer",
                }}
              >
                {gp}
              </button>
            ))}
          </div>
        </div>

        <SliderControl label="Pendulum Length" value={length} min={0.3} max={3.0} step={0.1} unit=" m" color="#60a5fa"
          onChange={(v) => { setLength(v); setSimKey(k => k + 1); }} />
        <SliderControl label="Release Angle" value={angle0} min={5} max={170} step={5} unit="\u00b0" color="#fbbf24"
          onChange={(v) => { setAngle0(v); setSimKey(k => k + 1); }} />
        <SliderControl label="Air Damping" value={damping} min={0} max={0.5} step={0.01} unit="" color="#a78bfa" onChange={setDamping} />

        <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
          <LabButton color="#34d399" onClick={() => setPaused(!paused)}>
            {paused ? "▶ Resume" : "⏸ Pause"}
          </LabButton>
          <LabButton color="#64748b" onClick={() => setSimKey(k => k + 1)}>↺ Reset</LabButton>
          <LabButton
            color={isDouble ? "#f43f5e" : "#a78bfa"}
            onClick={() => { setDouble(!isDouble); setSimKey(k => k + 1); }}
          >
            {isDouble ? "🔴 Double (Chaotic)" : "🔵 Single"}
          </LabButton>
        </div>
      </div>

      <PhysicsFact color="#34d399">
        🕰️ T = 2π√(L/g) — period only depends on length and gravity, not mass (Galileo, 1602).
        Change gravity to Moon (1.62 m/s²) to see the period increase. Switch to Chaotic for true mathematical chaos.
      </PhysicsFact>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SHARED UI PRIMITIVES
// ─────────────────────────────────────────────────────────

export function PhysicsControls({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "rgba(2,8,20,0.7)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "14px",
        padding: "20px 22px",
        marginBottom: "16px",
      }}
    >
      {children}
    </div>
  );
}

export function SliderControl({
  label, value, min, max, step, unit, color, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  unit: string; color: string; onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#94a3b8", fontSize: "0.82rem" }}>
          {label}
        </span>
        <span style={{ fontFamily: "'Orbitron', monospace", color, fontSize: "0.82rem", fontWeight: 600 }}>
          {value.toFixed(1)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          accentColor: color,
          height: "4px",
          cursor: "pointer",
        }}
      />
    </div>
  );
}

export function LabButton({
  children, color, onClick,
}: {
  children: React.ReactNode; color: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "9px 20px",
        background: `${color}15`,
        border: `1px solid ${color}40`,
        borderRadius: "8px",
        color,
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "0.82rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// SPECIAL RELATIVITY VISUALIZER — time dilation & length contraction
// ─────────────────────────────────────────────────────────

function RelativityScene({ velocity, timeDilation, paused }: {
  velocity: number;
  timeDilation: number;
  paused: boolean;
}) {
  const clock1Ref = useRef<THREE.Group>(null);
  const clock2Ref = useRef<THREE.Group>(null);
  const photon1Ref = useRef<THREE.Mesh>(null);
  const photon2Ref = useRef<THREE.Mesh>(null);

  // Constants
  const height = 4.0; // Distance between mirrors
  const width1 = 2.0; // Stationary mirror width
  const c = 3.0;      // Speed of light unit in simulation

  // We track local times for both clocks
  const timeStationary = useRef(0);
  const timeMoving = useRef(0);

  // Track coordinates for moving clock trajectory
  const posX = useRef(0);

  useFrame((_, delta) => {
    if (paused) return;

    // Stationary clock ticks at normal speed
    timeStationary.current += delta * 1.5;
    // Moving clock ticks slower by 1 / timeDilation (Lorentz factor gamma)
    timeMoving.current += (delta * 1.5) / timeDilation;

    // Move the moving clock horizontally
    posX.current += velocity * delta * 2.2;
    if (posX.current > 7) {
      posX.current = -7; // wrap around
    }

    // --- Stationary Photon bounce ---
    // The photon travels vertically up and down between y = -height/2 and y = height/2
    const totalDist1 = timeStationary.current * c;
    const cyclePos1 = totalDist1 % (height * 2);
    const py1 = cyclePos1 <= height ? -height/2 + cyclePos1 : height/2 - (cyclePos1 - height);

    if (photon1Ref.current) {
      photon1Ref.current.position.set(-3.5, py1, 0);
    }

    // --- Moving Photon bounce (in stationary frame) ---
    // In its own frame, moving photon travels vertically, but ticks slower.
    const totalDist2 = timeMoving.current * c;
    const cyclePos2 = totalDist2 % (height * 2);
    const py2 = cyclePos2 <= height ? -height/2 + cyclePos2 : height/2 - (cyclePos2 - height);

    if (photon2Ref.current) {
      photon2Ref.current.position.set(posX.current, py2, 0);
    }

    if (clock2Ref.current) {
      clock2Ref.current.position.x = posX.current;
    }
  });

  // Length contraction along direction of motion (X-axis)
  const contractedWidth = width1 / timeDilation;

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 2]} intensity={1.5} color="#e0e7ff" />
      <Stars radius={50} depth={20} count={2000} factor={2} fade />

      {/* Grid Floor */}
      <gridHelper args={[30, 30, "#312e81", "#1e1b4b"]} position={[0, -2.8, 0]} />

      {/* ── STATIONARY CLOCK (Left) ── */}
      <group ref={clock1Ref} position={[-3.5, 0, 0]}>
        {/* Top Mirror */}
        <mesh position={[0, height / 2 + 0.1, 0]}>
          <boxGeometry args={[width1, 0.15, 1]} />
          <meshStandardMaterial color="#60a5fa" emissive="#2563eb" emissiveIntensity={0.6} roughness={0.1} />
        </mesh>
        {/* Bottom Mirror */}
        <mesh position={[0, -height / 2 - 0.1, 0]}>
          <boxGeometry args={[width1, 0.15, 1]} />
          <meshStandardMaterial color="#60a5fa" emissive="#2563eb" emissiveIntensity={0.6} roughness={0.1} />
        </mesh>
        {/* Connection Pillar (transparent coordinate guide) */}
        <mesh position={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.03, 0.03, height]} />
          <meshBasicMaterial color="#334155" transparent opacity={0.25} />
        </mesh>
      </group>

      {/* Stationary Photon (Blue glow) */}
      <mesh ref={photon1Ref}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#60a5fa" />
        <pointLight color="#60a5fa" intensity={4} distance={6} />
      </mesh>


      {/* ── MOVING CLOCK (Right) ── */}
      <group ref={clock2Ref}>
        {/* Top contracted Mirror */}
        <mesh position={[0, height / 2 + 0.1, 0]}>
          <boxGeometry args={[contractedWidth, 0.15, 1]} />
          <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={0.8} roughness={0.1} />
        </mesh>
        {/* Bottom contracted Mirror */}
        <mesh position={[0, -height / 2 - 0.1, 0]}>
          <boxGeometry args={[contractedWidth, 0.15, 1]} />
          <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={0.8} roughness={0.1} />
        </mesh>
        {/* Connection Pillar */}
        <mesh position={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.03, 0.03, height]} />
          <meshBasicMaterial color="#475569" transparent opacity={0.2} />
        </mesh>
      </group>

      {/* Moving Photon (Red glow) */}
      <mesh ref={photon2Ref}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#f43f5e" />
        <pointLight color="#f43f5e" intensity={4} distance={6} />
      </mesh>
    </>
  );
}

export function RelativitySim() {
  const [vFactor, setVFactor] = useState(0.8); // Velocity as fraction of c (v/c)
  const [paused, setPaused]   = useState(false);

  // Derived Relativity metrics
  // gamma = 1 / sqrt(1 - beta^2)
  const beta = Math.min(0.999, Math.max(0, vFactor));
  const gamma = 1 / Math.sqrt(1 - beta * beta);
  const lengthContractionPercent = ((1 - 1 / gamma) * 100).toFixed(1);

  return (
    <div style={{ position: "relative", background: "#020210" }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} style={{ height: "75vh", width: "100%", display: "block" }}>
        <RelativityScene velocity={beta} timeDilation={gamma} paused={paused} />
      </Canvas>

      {/* Floating HUD controls — bottom left */}
      <div
        style={{
          position: "absolute", bottom: "16px", left: "16px",
          background: "rgba(2,2,15,0.85)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(167,139,250,0.25)", borderRadius: "16px",
          padding: "20px 22px", zIndex: 10, minWidth: "280px",
        }}
      >
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", color: "#a78bfa", letterSpacing: "0.15em", marginBottom: "14px" }}>
          RELATIVITY CONTROLS
        </div>
        <SliderControl
          label="Relative Velocity (v/c)"
          value={vFactor} min={0.0} max={0.99} step={0.01} unit=" c"
          color="#a78bfa" onChange={setVFactor}
        />
        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
          <LabButton color="#a78bfa" onClick={() => setPaused(!paused)}>
            {paused ? "▶ Resume" : "⏸ Pause"}
          </LabButton>
          <LabButton color="#64748b" onClick={() => { setVFactor(0.8); setPaused(false); }}>
            ↺ Reset
          </LabButton>
        </div>
      </div>

      {/* Relativity Metrics HUD — top right */}
      <div
        style={{
          position: "absolute", top: "16px", right: "16px",
          background: "rgba(2,2,15,0.82)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(167,139,250,0.2)", borderRadius: "14px",
          padding: "16px 18px", zIndex: 10, minWidth: "220px",
        }}
      >
        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", color: "#a78bfa", letterSpacing: "0.15em", marginBottom: "12px" }}>
          RELATIVISTIC EFFECTS
        </div>
        {[
          { label: "Lorentz Factor (\u03b3)", value: gamma.toFixed(4), color: "#a78bfa" },
          { label: "Time Dilation", value: `1s clock = ${gamma.toFixed(2)}s outside`, color: "#60a5fa" },
          { label: "Length Contraction", value: `-${lengthContractionPercent}% size`, color: "#f43f5e" },
          { label: "Lorentz contraction", value: `${(100 / gamma).toFixed(1)}% original width`, color: "#34d399" },
        ].map(s => (
          <div key={s.label} style={{ marginBottom: "10px" }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.85rem", color: s.color, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.68rem", color: "#64748b" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <PhysicsFact color="#a78bfa">
        🚀 Special Relativity: The speed of light is constant for all observers. To keep light speed constant,
        time must slow down (Time Dilation) and lengths must contract (Length Contraction) inside moving frames.
        Observe the moving clock (red) contract horizontally and its photon (red) bounce slower as velocity approaches 1.0c.
      </PhysicsFact>
    </div>
  );
}

export function PhysicsFact({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div
      style={{
        background: `${color}08`,
        border: `1px solid ${color}20`,
        borderRadius: "12px",
        padding: "16px 18px",
        fontFamily: "'Space Grotesk', sans-serif",
        color: "#94a3b8",
        fontSize: "0.84rem",
        lineHeight: 1.65,
      }}
    >
      {children}
    </div>
  );
}
