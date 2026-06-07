import SpaceScene from "./components/SpaceScene";
import { useState } from "react";
import PlanetInfo from "./components/PlanetInfo";
import { Routes, Route } from "react-router-dom";

import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Experience from "./pages/Experience";
import AiMayank from "./pages/AiMayank";
import PhysicsLab from "./pages/PhysicsLab";

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [enteredUniverse, setEnteredUniverse] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div
            style={{
              width: "100vw",
              height: "100vh",
              position: "relative",
              background: "black",
            }}
          >
            <SpaceScene
              selectedPlanet={selectedPlanet}
              setSelectedPlanet={setSelectedPlanet}
            />

            <PlanetInfo selectedPlanet={selectedPlanet} />

            {!enteredUniverse && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <h1
                  style={{
                    fontSize: "4rem",
                    marginBottom: "15px",
                  }}
                >
                  ACHARYAVERSE
                </h1>

                <p
                  style={{
                    fontSize: "1.2rem",
                  }}
                >
                  Exploring Software, AI and Physics
                </p>

                <button
                  style={{
                    marginTop: "25px",
                    padding: "12px 30px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                  onClick={() => setEnteredUniverse(true)}
                >
                  ENTER UNIVERSE
                </button>
              </div>
            )}
          </div>
        }
      />

      <Route path="/projects" element={<Projects />} />

      <Route path="/skills" element={<Skills />} />

      <Route path="/experience" element={<Experience />} />

      <Route path="/ai-mayank" element={<AiMayank />} />

      <Route path="/physics-lab" element={<PhysicsLab />} />
    </Routes>
  );
}

export default App;
