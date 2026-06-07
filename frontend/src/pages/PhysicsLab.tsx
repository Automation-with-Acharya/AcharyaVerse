import PlanetPageLayout from "../components/PlanetPageLayout";
import OrbitalSimulation from "../components/OrbitalSimulation";

export default function PhysicsLab() {
  return (
    <PlanetPageLayout title="Physics Lab">
      <h2>Orbital Mechanics Simulation</h2>

      <OrbitalSimulation />
    </PlanetPageLayout>
  );
}
