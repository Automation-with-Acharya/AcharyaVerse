import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { planetContent } from "../data/planetContent";

type Props = {
  selectedPlanet: string | null;
  setSelectedPlanet: (planet: string | null) => void;
};

const PLANET_EMOJIS: Record<string, string> = {
  Resume:      "📄",
  Experience:  "🏛️",
  Projects:    "🚀",
  Skills:      "⚡",
  "AI Mayank": "🤖",
  "Physics Lab": "⚛️",
  Contact:     "📡",
};

const PLANET_COLORS: Record<string, string> = {
  Resume:       "#fbbf24",
  Experience:   "#f97316",
  Projects:     "#60a5fa",
  Skills:       "#34d399",
  "AI Mayank":  "#a78bfa",
  "Physics Lab":"#f43f5e",
  Contact:      "#22d3ee",
};

const ROUTES: Record<string, string> = {
  Projects:     "/projects",
  Skills:       "/skills",
  Experience:   "/experience",
  "AI Mayank":  "/ai-mayank",
  "Physics Lab":"/physics-lab",
  Resume:       "/resume",
  Contact:      "/contact",
};

export default function PlanetInfo({ selectedPlanet, setSelectedPlanet }: Props) {
  const navigate = useNavigate();

  const accentColor = selectedPlanet ? (PLANET_COLORS[selectedPlanet] ?? "#60a5fa") : "#60a5fa";
  const emoji       = selectedPlanet ? (PLANET_EMOJIS[selectedPlanet] ?? "🌍") : "🌍";
  const description = selectedPlanet
    ? planetContent[selectedPlanet as keyof typeof planetContent]?.description ?? ""
    : "";

  const handleOpen = () => {
    if (!selectedPlanet) return;
    const route = ROUTES[selectedPlanet];
    if (route) navigate(route);
  };

  return (
    <AnimatePresence>
      {selectedPlanet && (
        <motion.div
          key={selectedPlanet}
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: "320px",
            background: "rgba(2, 8, 20, 0.82)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${accentColor}35`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${accentColor}15, 0 0 40px ${accentColor}10`,
            borderRadius: "16px",
            padding: "24px",
            zIndex: 5,
          }}
        >
          {/* Planet emoji & name */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: `${accentColor}18`,
                border: `1px solid ${accentColor}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
                flexShrink: 0,
              }}
            >
              {emoji}
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: accentColor,
                  letterSpacing: "0.08em",
                  margin: 0,
                }}
              >
                {selectedPlanet}
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.75rem", margin: 0, marginTop: "2px" }}>
                Click to explore
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
              marginBottom: "14px",
            }}
          />

          {/* Description */}
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              marginBottom: "20px",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {description}
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: `0 0 20px ${accentColor}50` }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpen}
              style={{
                flex: 1,
                padding: "11px 0",
                background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`,
                border: `1px solid ${accentColor}50`,
                borderRadius: "10px",
                color: accentColor,
                cursor: "pointer",
                fontFamily: "'Orbitron', monospace",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
              }}
            >
              Enter Planet →
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedPlanet(null)}
              style={{
                padding: "11px 16px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                color: "#64748b",
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.8rem",
                transition: "all 0.2s ease",
              }}
            >
              ✕
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
