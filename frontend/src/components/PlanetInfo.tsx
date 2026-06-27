import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { planetContent } from "../data/planetContent";
import type { SubPlanetData } from "../types/galaxy";
import { galaxies } from "../data/galaxies";

type Props = {
  selectedGalaxyId: string | null;
  setSelectedGalaxyId: (id: string | null) => void;
  setSelectedPlanet: (planet: SubPlanetData | null) => void;
};

// Route mapping for each galaxy main landing page
const GALAXY_ROUTES: Record<string, string> = {
  resume: "/resume",
  experience: "/experience",
  projects: "/projects",
  skills: "/skills",
  "ai-mayank": "/ai-mayank",
  "physics-lab": "/physics-lab",
  contact: "/contact",
};

export default function PlanetInfo({
  selectedGalaxyId,
  setSelectedGalaxyId,
  setSelectedPlanet,
}: Props) {
  const navigate = useNavigate();

  // Find active galaxy details
  const activeGalaxy = galaxies.find((g) => g.id === selectedGalaxyId);
  const accentColor = activeGalaxy?.color ?? "#60a5fa";

  // Panel layout values are locked to the parent Galaxy level regardless of selected inner sub-planets
  const emoji = activeGalaxy?.emoji ?? "🪐";
  const title = activeGalaxy ? `${activeGalaxy.name.toUpperCase()} GALAXY` : "";
  const subtitle = activeGalaxy?.tagline ?? "";

  // Retrieve description from content details matching the parent Galaxy key name
  const galaxyKey = activeGalaxy?.name as keyof typeof planetContent;
  const description = planetContent[galaxyKey]?.description ?? "";

  const handleOpen = () => {
    if (selectedGalaxyId) {
      const route = GALAXY_ROUTES[selectedGalaxyId];
      if (route) navigate(route);
    }
  };

  const handleCancel = () => {
    setSelectedGalaxyId(null);
    setSelectedPlanet(null);
  };

  return (
    <AnimatePresence>
      {selectedGalaxyId && activeGalaxy && (
        <motion.div
          key={activeGalaxy.id}
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
          {/* Icon & Galaxy Title */}
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
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: accentColor,
                  letterSpacing: "0.08em",
                  margin: 0,
                }}
              >
                {title}
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.72rem", margin: 0, marginTop: "2px", fontFamily: "'Space Grotesk', sans-serif" }}>
                {subtitle}
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

          {/* Galaxy Description */}
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              marginBottom: "20px",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {description}
          </p>

          {/* Unified Galaxy Warp CTAs */}
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
                fontFamily: "'Orbitron', monospace",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                cursor: "pointer",
              }}
            >
              ✦ ENTER {activeGalaxy.name.toUpperCase()} GALAXY
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCancel}
              style={{
                padding: "11px 16px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                color: "#94a3b8",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.78rem",
                cursor: "pointer",
              }}
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
