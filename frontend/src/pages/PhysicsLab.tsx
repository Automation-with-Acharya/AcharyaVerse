import PlanetPageLayout from "../components/PlanetPageLayout";
import OrbitalSimulation from "../components/OrbitalSimulation";
import { useState } from "react";
import ProjectileMotion from "../components/ProjectileMotion";

export default function PhysicsLab() {
  const [selectedExperiment, setSelectedExperiment] = useState("orbital");

  return (
    <PlanetPageLayout title="Physics Lab">
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <button onClick={() => setSelectedExperiment("orbital")}>
          Orbital Mechanics
        </button>

        <button
          onClick={() => setSelectedExperiment("projectile")}
          style={{
            marginLeft: "10px",
          }}
        >
          Projectile Motion
        </button>
      </div>

      {selectedExperiment === "orbital" && <OrbitalSimulation />}

      {selectedExperiment === "projectile" && <ProjectileMotion />}
    </PlanetPageLayout>
  );
}
