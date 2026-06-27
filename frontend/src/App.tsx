import SpaceScene from "./components/SpaceScene";
import { useState } from "react";
import PlanetInfo from "./components/PlanetInfo";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { SubPlanetData } from "./types/galaxy";

import Projects    from "./pages/Projects";
import Skills      from "./pages/Skills";
import Experience  from "./pages/Experience";
import AiMayank   from "./pages/AiMayank";
import PhysicsLab  from "./pages/PhysicsLab";
import Resume      from "./pages/Resume";
import Contact     from "./pages/Contact";

// ─── Page transition wrapper ──────────────────────────────────────────────────
// Each planet page warps in from a slight scale + opacity shift
const pageVariants = {
  initial: { opacity: 0, scale: 0.97, y: 12 },
  animate: { opacity: 1, scale: 1,    y: 0  },
  exit:    { opacity: 0, scale: 1.02, y: -8 },
};
const pageTransition = { duration: 0.45, ease: "easeOut" as const };

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
}

// ─── Universe home ────────────────────────────────────────────────────────────
function UniverseHome() {
  const [selectedGalaxyId, setSelectedGalaxyId] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<SubPlanetData | null>(null);

  // Persist across React Router navigations — session only (clears on tab close)
  const [enteredUniverse, setEnteredUniverse] = useState<boolean>(
    () => sessionStorage.getItem("acharyaverse_entered") === "true"
  );

  const handleEnter = () => {
    sessionStorage.setItem("acharyaverse_entered", "true");
    setEnteredUniverse(true);
  };


  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#000005" }}>
      <SpaceScene
        selectedGalaxyId={selectedGalaxyId}
        setSelectedGalaxyId={setSelectedGalaxyId}
        selectedPlanet={selectedPlanet}
        setSelectedPlanet={setSelectedPlanet}
      />

      <PlanetInfo
        selectedGalaxyId={selectedGalaxyId}
        setSelectedGalaxyId={setSelectedGalaxyId}
        setSelectedPlanet={setSelectedPlanet}
      />

      {/* Entry overlay */}
      <AnimatePresence>
        {!enteredUniverse && (
          <motion.div
            key="entry-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background:
                "radial-gradient(ellipse at center, rgba(10,5,40,0.95) 0%, rgba(0,0,5,0.98) 100%)",
              zIndex: 10,
              textAlign: "center",
              padding: "40px",
            }}
          >
            {/* Animated title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            >
              <div
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
                  fontWeight: 900,
                  letterSpacing: "0.15em",
                  background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: "12px",
                  lineHeight: 1.1,
                }}
              >
                ACHARYAVERSE
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
                  color: "#94a3b8",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Software Engineer · Automation Expert · AI Builder
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(0.75rem, 1.5vw, 0.95rem)",
                  color: "#60a5fa",
                  letterSpacing: "0.15em",
                  marginBottom: "50px",
                  opacity: 0.8,
                }}
              >
                Exploring the universe of technology, one planet at a time
              </motion.p>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6, type: "spring" }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(96,165,250,0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleEnter()}
                style={{
                  padding: "16px 48px",
                  background: "linear-gradient(135deg, #1d4ed8, #4f46e5)",
                  color: "white",
                  border: "1px solid rgba(96,165,250,0.3)",
                  borderRadius: "50px",
                  cursor: "pointer",
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  boxShadow: "0 0 20px rgba(79,70,229,0.4)",
                  transition: "all 0.3s ease",
                }}
              >
                ✦ ENTER UNIVERSE
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                style={{
                  marginTop: "24px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.8rem",
                  color: "#475569",
                  letterSpacing: "0.1em",
                }}
              >
                Click a planet to explore · Scroll to zoom · Drag to orbit
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Animated routes ──────────────────────────────────────────────────────────
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/"            element={<UniverseHome />} />
        <Route path="/projects"    element={<PageWrapper><Projects /></PageWrapper>} />
        <Route path="/skills"      element={<PageWrapper><Skills /></PageWrapper>} />
        <Route path="/experience"  element={<PageWrapper><Experience /></PageWrapper>} />
        <Route path="/ai-mayank"   element={<PageWrapper><AiMayank /></PageWrapper>} />
        <Route path="/physics-lab" element={<PageWrapper><PhysicsLab /></PageWrapper>} />
        <Route path="/resume"      element={<PageWrapper><Resume /></PageWrapper>} />
        <Route path="/contact"     element={<PageWrapper><Contact /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return <AnimatedRoutes />;
}

export default App;
