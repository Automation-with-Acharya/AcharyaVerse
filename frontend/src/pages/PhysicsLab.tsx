import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlanetPageLayout from "../components/PlanetPageLayout";
import {
  SolarSystemSim,
  BlackHoleSim,
  WaveInterferenceSim,
  NBodySim,
} from "../components/PhysicsSimulations";

type Experiment = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  tagline: string;
  branch: string;
  component: React.ReactNode;
};

const experiments: Experiment[] = [
  {
    id: "solar",
    label: "Solar System",
    emoji: "☀️",
    color: "#fbbf24",
    tagline: "Newtonian Orbital Mechanics",
    branch: "Classical Mechanics",
    component: <SolarSystemSim />,
  },
  {
    id: "blackhole",
    label: "Black Hole",
    emoji: "⚫",
    color: "#f43f5e",
    tagline: "Gravitational Singularity & Accretion",
    branch: "General Relativity",
    component: <BlackHoleSim />,
  },
  {
    id: "wave",
    label: "Wave Interference",
    emoji: "〰️",
    color: "#60a5fa",
    tagline: "Two-Source Superposition",
    branch: "Wave Physics",
    component: <WaveInterferenceSim />,
  },
  {
    id: "nbody",
    label: "N-Body Chaos",
    emoji: "🌌",
    color: "#a78bfa",
    tagline: "Gravitational Many-Body Problem",
    branch: "Chaos Theory",
    component: <NBodySim />,
  },
];

export default function PhysicsLab() {
  const [active, setActive] = useState("solar");
  const current = experiments.find((e) => e.id === active)!;

  return (
    <PlanetPageLayout
      title="PHYSICS LAB"
      subtitle="Interactive simulations where code meets the laws of nature"
      accentColor="#f43f5e"
    >
      {/* ── EXPERIMENT SELECTOR ───────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        {experiments.map((exp) => {
          const isActive = active === exp.id;
          return (
            <motion.button
              key={exp.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActive(exp.id)}
              style={{
                padding: "16px 18px",
                background: isActive ? `${exp.color}14` : "rgba(2,8,20,0.6)",
                border: `1px solid ${isActive ? exp.color + "50" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "14px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                boxShadow: isActive ? `0 0 20px ${exp.color}18` : "none",
              }}
            >
              <div style={{ fontSize: "1.6rem", marginBottom: "6px" }}>{exp.emoji}</div>
              <div
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: isActive ? exp.color : "#94a3b8",
                  letterSpacing: "0.05em",
                  marginBottom: "3px",
                }}
              >
                {exp.label}
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.72rem",
                  color: "#475569",
                }}
              >
                {exp.branch}
              </div>
              {isActive && (
                <div
                  style={{
                    marginTop: "8px",
                    height: "2px",
                    background: `linear-gradient(90deg, ${exp.color}, transparent)`,
                    borderRadius: "1px",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ── ACTIVE EXPERIMENT HEADER ──────────────── */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: "20px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <span style={{ fontSize: "1.4rem" }}>{current.emoji}</span>
          <h2
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: current.color,
              letterSpacing: "0.06em",
              margin: 0,
            }}
          >
            {current.label}
          </h2>
          <span
            style={{
              padding: "3px 12px",
              borderRadius: "50px",
              background: `${current.color}12`,
              border: `1px solid ${current.color}30`,
              color: current.color,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 500,
            }}
          >
            {current.branch}
          </span>
        </div>
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "#64748b",
            fontSize: "0.85rem",
            margin: 0,
          }}
        >
          {current.tagline} · Drag to orbit · Scroll to zoom
        </p>
      </motion.div>

      {/* ── SIMULATION VIEWPORT ───────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          {current.component}
        </motion.div>
      </AnimatePresence>

      {/* ── PHYSICS BRANCHES REFERENCE ────────────── */}
      <div style={{ marginTop: "48px", marginBottom: "16px" }}>
        <h2
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#f43f5e",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          ✦ Physics Branches Explored
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "12px",
            paddingBottom: "60px",
          }}
        >
          {[
            {
              icon: "🌍", label: "Classical Mechanics",
              items: ["Newton's Laws", "Orbital Mechanics", "Gravitational Force", "Kepler's Laws"],
              color: "#fbbf24",
            },
            {
              icon: "🌀", label: "General Relativity",
              items: ["Spacetime Curvature", "Event Horizons", "Gravitational Lensing", "Schwarzschild Radius"],
              color: "#f43f5e",
            },
            {
              icon: "〰️", label: "Wave Physics",
              items: ["Superposition", "Constructive Interference", "Destructive Interference", "Double-Slit"],
              color: "#60a5fa",
            },
            {
              icon: "🌪️", label: "Chaos Theory",
              items: ["N-body Problem", "Sensitivity to IC", "Lyapunov Exponent", "Poincaré Section"],
              color: "#a78bfa",
            },
            {
              icon: "⚛️", label: "Quantum Mechanics",
              items: ["Wave-Particle Duality", "Heisenberg Uncertainty", "Schrödinger Eq.", "Quantum Tunneling"],
              color: "#34d399",
            },
            {
              icon: "💫", label: "Astrophysics",
              items: ["Stellar Evolution", "Neutron Stars", "Dark Matter", "Cosmic Inflation"],
              color: "#22d3ee",
            },
          ].map((branch) => (
            <div
              key={branch.label}
              style={{
                background: `${branch.color}07`,
                border: `1px solid ${branch.color}20`,
                borderRadius: "14px",
                padding: "18px 18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ fontSize: "1.2rem" }}>{branch.icon}</span>
                <span
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: branch.color,
                    letterSpacing: "0.04em",
                  }}
                >
                  {branch.label}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {branch.items.map((item) => (
                  <div
                    key={item}
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: "#64748b",
                      fontSize: "0.78rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span style={{ color: branch.color, fontSize: "0.6rem" }}>✦</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PlanetPageLayout>
  );
}
