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

function SolarPlanet({ body, speed }: { body: typeof SOLAR_BODIES[0]; speed: number }) {
  const orbitRef = useRef<THREE.Group>(null);
  const meshRef  = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (orbitRef.current) orbitRef.current.rotation.y += body.speed * speed;
    if (meshRef.current)  meshRef.current.rotation.y  += 0.008;
  });

  return (
    <>
      <OrbitRing radius={body.orbit} />
      <group ref={orbitRef}>
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

function SolarScene({ speedMultiplier }: { speedMultiplier: number }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <Stars radius={80} depth={40} count={5000} factor={3} saturation={0.2} fade />
      <Sun />
      {SOLAR_BODIES.map((b) => (
        <SolarPlanet key={b.name} body={b} speed={speedMultiplier} />
      ))}
    </>
  );
}

export function SolarSystemSim() {
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);

  return (
    <div>
      <div
        style={{
          background: "rgba(0,0,5,0.8)",
          border: "1px solid rgba(251,191,36,0.2)",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <Canvas camera={{ position: [0, 12, 22], fov: 55 }} style={{ height: "480px" }}>
          <SolarScene speedMultiplier={paused ? 0 : speed} />
          <OrbitControls enableDamping dampingFactor={0.05} minDistance={3} maxDistance={40} />
        </Canvas>
      </div>

      <PhysicsControls>
        <SliderControl
          label="Orbital Speed"
          value={speed}
          min={0.1} max={5} step={0.1}
          unit="x"
          color="#fbbf24"
          onChange={setSpeed}
        />
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <LabButton color="#fbbf24" onClick={() => setPaused(!paused)}>
            {paused ? "▶ Resume" : "⏸ Pause"}
          </LabButton>
          <LabButton color="#64748b" onClick={() => { setSpeed(1); setPaused(false); }}>
            ↺ Reset
          </LabButton>
        </div>
      </PhysicsControls>

      <PhysicsFact color="#fbbf24">
        🌍 Earth's orbital speed is ~29.8 km/s. Jupiter takes 11.86 Earth years to orbit the Sun.
        Saturn's rings are made of ice and rock, stretching 282,000 km but only 30 m thick.
      </PhysicsFact>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// BLACK HOLE VISUALIZATION — gravitational lensing + particle accretion
// ─────────────────────────────────────────────────────────

function BlackHoleScene() {
  const diskRef   = useRef<THREE.Mesh>(null);
  const ring1Ref  = useRef<THREE.Mesh>(null);
  const ring2Ref  = useRef<THREE.Mesh>(null);
  const jetRef    = useRef<THREE.Mesh>(null);
  const coreRef   = useRef<THREE.Mesh>(null);
  const glowRef   = useRef<THREE.Mesh>(null);

  // Accretion particles
  const particleCount = 800;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 1.8 + Math.random() * 3.5;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3]     = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = Math.sin(a) * r;
      // Hot inner → cooler outer gradient
      const heat = 1 - (r - 1.8) / 3.5;
      col[i * 3]     = 1;
      col[i * 3 + 1] = heat * 0.5;
      col[i * 3 + 2] = heat * 0.1;
    }
    return { positions: pos, colors: col };
  }, []);

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
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#1a004d" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.9, 64, 64]} />
        <meshStandardMaterial color="#000000" emissive="#0d0030" emissiveIntensity={0.5} />
      </mesh>

      {/* Photon sphere ring */}
      <mesh rotation={[Math.PI / 2.2, 0.2, 0]}>
        <torusGeometry args={[1.12, 0.025, 8, 120]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>

      {/* Accretion disk — hot inner */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.6, 0.4, 16, 120]} />
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
        <torusGeometry args={[2.2, 0.08, 8, 100]} />
        <meshStandardMaterial color="#9d174d" emissive="#be185d" emissiveIntensity={1.5} transparent opacity={0.7} />
      </mesh>

      {/* Outer glow ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2.1, 0.7, 0]}>
        <torusGeometry args={[2.9, 0.04, 8, 100]} />
        <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={1.0} transparent opacity={0.4} />
      </mesh>

      {/* Relativistic jet */}
      <mesh ref={jetRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.3, 8, 16, 1, true]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={jetRef} position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.3, 8, 16, 1, true]} />
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
  return (
    <div>
      <div
        style={{
          background: "rgba(0,0,5,0.9)",
          border: "1px solid rgba(244,63,94,0.2)",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <Canvas camera={{ position: [0, 4, 9], fov: 55 }} style={{ height: "480px" }}>
          <BlackHoleScene />
          <OrbitControls enableDamping dampingFactor={0.05} minDistance={3} maxDistance={20} />
        </Canvas>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        {[
          { label: "Event Horizon Radius",  value: "~3 km / M☉",  color: "#f43f5e" },
          { label: "Escape Velocity",       value: "Speed of Light", color: "#a78bfa" },
          { label: "Photon Sphere",         value: "1.5× Rs",      color: "#ffffff" },
          { label: "Hawking Temp.",         value: "~10⁻⁷ K (stellar)", color: "#60a5fa" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: `${stat.color}0c`,
              border: `1px solid ${stat.color}25`,
              borderRadius: "12px",
              padding: "14px",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.9rem", color: stat.color, marginBottom: "4px" }}>
              {stat.value}
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#64748b", fontSize: "0.75rem" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <PhysicsFact color="#f43f5e">
        ⚫ The innermost stable circular orbit (ISCO) sits at 3× the Schwarzschild radius.
        Inside the event horizon, spacetime curvature is so extreme that all future paths point toward the singularity.
        Relativistic jets (shown) can extend thousands of light-years at near-light speeds.
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
  const [freq1, setFreq1]     = useState(1.5);
  const [freq2, setFreq2]     = useState(1.5);
  const [amplitude, setAmp]   = useState(1.2);
  const [paused, setPaused]   = useState(false);

  return (
    <div>
      <div
        style={{
          background: "rgba(0,0,20,0.9)",
          border: "1px solid rgba(96,165,250,0.2)",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <Canvas camera={{ position: [0, 12, 8], fov: 55 }} style={{ height: "480px" }}>
          <WaveScene freq1={freq1} freq2={freq2} amplitude={amplitude} paused={paused} />
          <OrbitControls enableDamping />
        </Canvas>
      </div>

      <PhysicsControls>
        <SliderControl label="Source 1 Frequency" value={freq1} min={0.5} max={4} step={0.1} unit=" Hz" color="#a78bfa" onChange={setFreq1} />
        <SliderControl label="Source 2 Frequency" value={freq2} min={0.5} max={4} step={0.1} unit=" Hz" color="#34d399" onChange={setFreq2} />
        <SliderControl label="Amplitude" value={amplitude} min={0.2} max={2.5} step={0.1} unit="" color="#60a5fa" onChange={setAmp} />
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <LabButton color="#60a5fa" onClick={() => setPaused(!paused)}>{paused ? "▶ Resume" : "⏸ Pause"}</LabButton>
          <LabButton color="#64748b" onClick={() => { setFreq1(1.5); setFreq2(1.5); setAmp(1.2); setPaused(false); }}>↺ Reset</LabButton>
        </div>
      </PhysicsControls>

      <PhysicsFact color="#60a5fa">
        〰️ When two waves meet, constructive interference creates bright fringes (crests align),
        destructive interference creates dark fringes (crest meets trough). This is the principle
        behind double-slit experiments, radio antennas, and noise-cancelling headphones.
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
    <div>
      <div
        style={{
          background: "rgba(0,0,5,0.85)",
          border: "1px solid rgba(167,139,250,0.2)",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <Canvas camera={{ position: [0, 8, 18], fov: 55 }} style={{ height: "480px" }}>
          <NBodyScene bodyCount={bodyCount} speed={speed} paused={paused} simKey={simKey} />
          <OrbitControls enableDamping />
        </Canvas>
      </div>

      <PhysicsControls>
        <div style={{ marginBottom: "14px" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#94a3b8", fontSize: "0.82rem", marginBottom: "8px" }}>
            Bodies: <span style={{ color: "#a78bfa", fontWeight: 600 }}>{bodyCount}</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => { setBodyCount(n); setSimKey((k) => k + 1); }}
                style={{
                  padding: "7px 18px",
                  borderRadius: "8px",
                  border: `1px solid ${n === bodyCount ? "#a78bfa" : "rgba(255,255,255,0.1)"}`,
                  background: n === bodyCount ? "rgba(167,139,250,0.15)" : "transparent",
                  color: n === bodyCount ? "#a78bfa" : "#64748b",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                {n} Bodies
              </button>
            ))}
          </div>
        </div>
        <SliderControl label="Simulation Speed" value={speed} min={0.1} max={3} step={0.1} unit="x" color="#a78bfa" onChange={setSpeed} />
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <LabButton color="#a78bfa" onClick={() => setPaused(!paused)}>{paused ? "▶ Resume" : "⏸ Pause"}</LabButton>
          <LabButton color="#64748b" onClick={() => setSimKey((k) => k + 1)}>↺ Reset</LabButton>
        </div>
      </PhysicsControls>

      <PhysicsFact color="#a78bfa">
        🌌 The N-body problem has no closed-form solution for N ≥ 3 (Poincaré, 1890).
        The orbits are chaotic — tiny changes in initial conditions produce wildly different outcomes.
        This is why we simulate the solar system numerically rather than analytically.
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
    <div>
      <div
        style={{
          background: "rgba(0,0,10,0.9)",
          border: "1px solid rgba(34,211,153,0.2)",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <Canvas key={simKey} camera={{ position: [0, -3, 14], fov: 50 }} style={{ height: "480px" }}>
          <PendulumScene
            length={length} gravity={g} damping={damping}
            angle0={angle0Rad} paused={paused}
            isDouble={isDouble} length2={length * 0.8} angle2_0={angle0Rad * 0.9}
          />
          <OrbitControls enableDamping enableZoom minDistance={5} maxDistance={25} />
        </Canvas>
      </div>

      {/* Live stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "12px",
        marginBottom: "16px",
      }}>
        {[
          { label: "Period (T)",    value: `${period.toFixed(2)} s`,   color: "#34d399" },
          { label: "Gravity (g)",   value: `${g.toFixed(2)} m/s²`,     color: "#fbbf24" },
          { label: "Length (L)",    value: `${length.toFixed(2)} m`,   color: "#60a5fa" },
          { label: "Damping (b)",   value: `${damping.toFixed(3)}`,    color: "#a78bfa" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: `${stat.color}0c`,
              border: `1px solid ${stat.color}25`,
              borderRadius: "12px",
              padding: "14px",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "1rem", color: stat.color, marginBottom: "4px", fontWeight: 700 }}>
              {stat.value}
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#64748b", fontSize: "0.75rem" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <PhysicsControls>
        {/* Gravity preset */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#94a3b8", fontSize: "0.82rem", marginBottom: "8px" }}>Gravity World</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {Object.keys(GRAVITY_PRESETS).map((gp) => (
              <button
                key={gp}
                onClick={() => { setGravKey(gp); setSimKey(k => k + 1); }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: `1px solid ${gp === gravKey ? "#34d399" : "rgba(255,255,255,0.1)"}`,
                  background: gp === gravKey ? "rgba(52,211,153,0.15)" : "transparent",
                  color: gp === gravKey ? "#34d399" : "#64748b",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                }}
              >
                {gp}
              </button>
            ))}
          </div>
        </div>

        <SliderControl label="Pendulum Length" value={length} min={0.3} max={3.0} step={0.1} unit=" m" color="#60a5fa"
          onChange={(v) => { setLength(v); setSimKey(k => k + 1); }} />
        <SliderControl label="Release Angle" value={angle0} min={5} max={170} step={5} unit="°" color="#fbbf24"
          onChange={(v) => { setAngle0(v); setSimKey(k => k + 1); }} />
        <SliderControl label="Air Damping" value={damping} min={0} max={0.5} step={0.01} unit="" color="#a78bfa" onChange={setDamping} />

        <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
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
      </PhysicsControls>

      <PhysicsFact color="#34d399">
        🕰️ The period of a simple pendulum T = 2π√(L/g) depends only on length and gravity — not mass!
        Galileo discovered this in 1602. The double pendulum is completely deterministic yet exhibits
        true chaos — tiny changes in initial angle lead to wildly different long-term trajectories.
        Switch to Double mode and observe the sensitivity to initial conditions.
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
