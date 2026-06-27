import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlanetPageLayout from "../components/PlanetPageLayout";
import {
  SolarSystemSim,
  BlackHoleSim,
  WaveInterferenceSim,
  NBodySim,
  PendulumSim,
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
    tagline: "Orbital mechanics with live spacetime curvature grid",
    branch: "Classical Mechanics",
    component: <SolarSystemSim />,
  },
  {
    id: "blackhole",
    label: "Black Hole",
    emoji: "⚫",
    color: "#f43f5e",
    tagline: "Gravitational singularity, accretion disk & relativistic jets",
    branch: "General Relativity",
    component: <BlackHoleSim />,
  },
  {
    id: "pendulum",
    label: "Pendulum",
    emoji: "🕰️",
    color: "#34d399",
    tagline: "Simple & double pendulum — RK4 integration with chaos",
    branch: "Classical Mechanics",
    component: <PendulumSim />,
  },
  {
    id: "wave",
    label: "Wave Interference",
    emoji: "〰️",
    color: "#a78bfa",
    tagline: "Two-source superposition & constructive/destructive patterns",
    branch: "Wave Physics",
    component: <WaveInterferenceSim />,
  },
  {
    id: "nbody",
    label: "N-Body Chaos",
    emoji: "🌌",
    color: "#f97316",
    tagline: "Gravitational many-body problem — sensitivity to initial conditions",
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
      subtitle="Real simulations. Real physics. Interact, experiment, and discover."
      accentColor="#f43f5e"
    >
      {/* ── FULL-WIDTH SPLIT LAYOUT ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "0",
          minHeight: "85vh",
          marginLeft: "-48px",
          marginRight: "-48px",
        }}
      >
        {/* ── LEFT: Experiment selector sidebar ── */}
        <div
          style={{
            borderRight: "1px solid rgba(244,63,94,0.12)",
            background: "rgba(2,4,12,0.6)",
            backdropFilter: "blur(20px)",
            padding: "28px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "#475569",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "14px",
              paddingLeft: "12px",
            }}
          >
            Experiments
          </div>

          {experiments.map((exp) => {
            const isActive = active === exp.id;
            return (
              <motion.button
                key={exp.id}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActive(exp.id)}
                style={{
                  padding: "12px 14px",
                  background: isActive ? `${exp.color}10` : "transparent",
                  border: "none",
                  borderLeft: `3px solid ${isActive ? exp.color : "transparent"}`,
                  borderRadius: "0 10px 10px 0",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.1rem" }}>{exp.emoji}</span>
                  <span
                    style={{
                      fontFamily: "'Orbitron', monospace",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: isActive ? exp.color : "#94a3b8",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {exp.label}
                  </span>
                </div>
                {isActive && (
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "0.67rem",
                      color: "#475569",
                      lineHeight: 1.4,
                      paddingLeft: "26px",
                    }}
                  >
                    {exp.branch}
                  </div>
                )}
              </motion.button>
            );
          })}

          {/* Physics branches legend at bottom */}
          <div style={{ marginTop: "auto", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.62rem",
                fontWeight: 700,
                color: "#334155",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "10px",
                paddingLeft: "12px",
              }}
            >
              Branches
            </div>
            {[
              { label: "Classical", color: "#fbbf24" },
              { label: "Relativity", color: "#f43f5e" },
              { label: "Wave Physics", color: "#a78bfa" },
              { label: "Chaos Theory", color: "#f97316" },
            ].map((b) => (
              <div
                key={b.label}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "5px 12px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.68rem",
                  color: "#475569",
                }}
              >
                <div
                  style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: b.color, boxShadow: `0 0 6px ${b.color}`,
                  }}
                />
                {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Simulation fullscreen area ── */}
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>

          {/* Experiment header bar */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active + "_header"}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                padding: "18px 28px",
                borderBottom: `1px solid ${current.color}15`,
                background: `linear-gradient(90deg, ${current.color}08, transparent)`,
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <span style={{ fontSize: "1.6rem" }}>{current.emoji}</span>
              <div>
                <h2
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: current.color,
                    letterSpacing: "0.06em",
                    margin: 0,
                    marginBottom: "2px",
                  }}
                >
                  {current.label}
                </h2>
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: "#475569",
                    fontSize: "0.78rem",
                    margin: 0,
                  }}
                >
                  {current.tagline}
                </p>
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  padding: "4px 12px",
                  borderRadius: "50px",
                  background: `${current.color}10`,
                  border: `1px solid ${current.color}30`,
                  color: current.color,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {current.branch}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Simulation viewport — fills remaining height */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ flex: 1 }}
            >
              {current.component}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PlanetPageLayout>
  );
}
