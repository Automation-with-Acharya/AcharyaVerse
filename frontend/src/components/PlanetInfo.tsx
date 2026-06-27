import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { planetContent } from "../data/planetContent";
import type { SubPlanetData } from "../types/galaxy";
import { galaxies } from "../data/galaxies";

type Props = {
  selectedGalaxyId: string | null;
  selectedPlanet: SubPlanetData | null;
  setSelectedPlanet: (planet: SubPlanetData | null) => void;
};

export default function PlanetInfo({
  selectedGalaxyId,
  selectedPlanet,
  setSelectedPlanet,
}: Props) {
  const navigate = useNavigate();

  // Find active galaxy details
  const activeGalaxy = galaxies.find((g) => g.id === selectedGalaxyId);
  const accentColor = activeGalaxy?.color ?? "#60a5fa";

  // Use sub-planet attributes, or fallback to galaxy level
  const emoji = selectedPlanet?.emoji ?? activeGalaxy?.emoji ?? "🪐";
  const title = selectedPlanet ? `${planetLabel(selectedPlanet)}` : activeGalaxy?.name ?? "";
  const subtitle = selectedPlanet
    ? `${activeGalaxy?.name} Galaxy · Node Link`
    : `${activeGalaxy?.tagline}`;

  // Retrieve matching description from content data
  const galaxyKey = activeGalaxy?.name as keyof typeof planetContent;
  const description = planetContent[galaxyKey]?.description ?? "";

  const handleOpen = () => {
    if (selectedPlanet) {
      navigate(planetPath(selectedPlanet));
    }
  };

  const handleCancel = () => {
    setSelectedPlanet(null);
  };

  return (
    <AnimatePresence>
      {selectedPlanet && (
        <motion.div
          key={selectedPlanet.name}
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
          {/* Node Icon & Names */}
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

          {/* Description Context */}
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

          {/* Action CTAs */}
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
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                cursor: "pointer",
              }}
            >
              ✦ WARP TO NODE
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

// Subplanet helper label
function planetLabel(planet: SubPlanetData): string {
  if (planet.name === "LLM Chat") return "AI MAYANK";
  if (planet.name === "Orbits") return "PHYSICS LAB";
  return planet.name;
}

// Subplanet path resolver
function planetPath(planet: SubPlanetData): string {
  if (planet.name === "Biography") return "/resume";
  if (planet.name === "Achievements") return "/resume";
  if (planet.name === "Bank of America") return "/experience";
  if (planet.name === "Team Lead") return "/experience";
  if (planet.name === "AcharyaVerse") return "/projects";
  if (planet.name === "AI Mayank") return "/projects";
  if (planet.name === "RPA Automation") return "/projects";
  if (planet.name === "Development") return "/skills";
  if (planet.name === "Automation Skills") return "/skills";
  if (planet.name === "DevOps release") return "/skills";
  if (planet.name === "LLM Chat") return "/ai-mayank";
  if (planet.name === "Knowledge base") return "/ai-mayank";
  if (planet.name === "Orbits") return "/physics-lab";
  if (planet.name === "Singularity") return "/physics-lab";
  if (planet.name === "Relativity clock") return "/physics-lab";
  if (planet.name === "LinkedIn") return "/contact";
  if (planet.name === "GitHub") return "/contact";
  return planet.path;
}
