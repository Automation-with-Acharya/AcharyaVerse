import { useState } from "react";
import GravityCanvas from "./GravityCanvas";

export default function GravitySimulator() {
  const [scenarioName, setScenarioName] = useState("Custom");

  const [mass1, setMass1] = useState(100);

  const [mass2, setMass2] = useState(100);

  const [distance, setDistance] = useState(10);

  const [simulationRunning, setSimulationRunning] = useState(false);

  const [simulationStatus, setSimulationStatus] = useState("Ready");

  const [orbitalMode, setOrbitalMode] = useState(false);

  const [showCurvature, setShowCurvature] = useState(false);

  const [curvatureScale, setCurvatureScale] = useState(3);

  const [simulationKey, setSimulationKey] = useState(0);

  const G = 6.674;

  const force = ((G * mass1 * mass2) / (distance * distance)).toFixed(2);

  const accelerationA = ((G * mass2) / (distance * distance)).toFixed(2);

  const accelerationB = ((G * mass1) / (distance * distance)).toFixed(2);

  const totalMass = mass1 + mass2;

  const massAOrbitRadius = ((distance * mass2) / totalMass).toFixed(2);

  const massBOrbitRadius = ((distance * mass1) / totalMass).toFixed(2);

  const barycenterPosition = (
    (mass1 * (-distance / 2) + mass2 * (distance / 2)) /
    totalMass
  ).toFixed(2);

  const applyScenario = ({
    name,
    nextMass1,
    nextMass2,
    nextDistance,
    nextOrbitalMode,
    nextShowCurvature,
    nextCurvatureScale,
  }: {
    name: string;
    nextMass1: number;
    nextMass2: number;
    nextDistance: number;
    nextOrbitalMode: boolean;
    nextShowCurvature: boolean;
    nextCurvatureScale: number;
  }) => {
    setScenarioName(name);

    setMass1(nextMass1);

    setMass2(nextMass2);

    setDistance(nextDistance);

    setOrbitalMode(nextOrbitalMode);

    setShowCurvature(nextShowCurvature);

    setCurvatureScale(nextCurvatureScale);

    setSimulationRunning(false);

    setSimulationStatus("Ready");

    setSimulationKey(Date.now());
  };

  return (
    <div>
      <h2>Gravity Simulator</h2>

      <div
        style={{
          maxWidth: "500px",
        }}
      >
        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <h3>Scenarios</h3>

          <button
            onClick={() =>
              applyScenario({
                name: "Binary Stars",
                nextMass1: 750,
                nextMass2: 600,
                nextDistance: 18,
                nextOrbitalMode: true,
                nextShowCurvature: true,
                nextCurvatureScale: 4,
              })
            }
            style={{
              padding: "8px 14px",
              marginRight: "8px",
              marginBottom: "8px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Binary Stars
          </button>

          <button
            onClick={() =>
              applyScenario({
                name: "Star and Planet",
                nextMass1: 1000,
                nextMass2: 80,
                nextDistance: 22,
                nextOrbitalMode: true,
                nextShowCurvature: true,
                nextCurvatureScale: 5,
              })
            }
            style={{
              padding: "8px 14px",
              marginRight: "8px",
              marginBottom: "8px",
              background: "#374151",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Star and Planet
          </button>

          <button
            onClick={() =>
              applyScenario({
                name: "Equal Mass Pair",
                nextMass1: 500,
                nextMass2: 500,
                nextDistance: 16,
                nextOrbitalMode: true,
                nextShowCurvature: false,
                nextCurvatureScale: 3,
              })
            }
            style={{
              padding: "8px 14px",
              marginRight: "8px",
              marginBottom: "8px",
              background: "#0f766e",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Equal Mass Pair
          </button>
        </div>

        <div>
          Mass A:
          {mass1}
        </div>

        <input
          type="range"
          min="1"
          max="1000"
          value={mass1}
          onChange={(e) => {
            setScenarioName("Custom");

            setMass1(Number(e.target.value));
          }}
          style={{
            width: "100%",
          }}
        />

        <br />
        <br />

        <div>
          Mass B:
          {mass2}
        </div>

        <input
          type="range"
          min="1"
          max="1000"
          value={mass2}
          onChange={(e) => {
            setScenarioName("Custom");

            setMass2(Number(e.target.value));
          }}
          style={{
            width: "100%",
          }}
        />

        <br />
        <br />

        <div>
          Distance:
          {distance}
        </div>

        <input
          type="range"
          min="1"
          max="50"
          value={distance}
          onChange={(e) => {
            setScenarioName("Custom");

            setDistance(Number(e.target.value));
          }}
          style={{
            width: "100%",
          }}
        />
        <button
          onClick={() => {
            setSimulationRunning(true);

            setSimulationStatus("Running");
          }}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Start Simulation
        </button>

        <button
          onClick={() => {
            setSimulationRunning(false);

            setSimulationStatus("Ready");

            setSimulationKey(Date.now());
          }}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            background: "#374151",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Reset Simulation
        </button>

        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "#111827",
            borderRadius: "8px",
            border: "1px solid #2563eb",
          }}
        >
          Simulation Status: <strong>{simulationStatus}</strong>
        </div>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={orbitalMode}
              onChange={(e) => {
                setScenarioName("Custom");

                setOrbitalMode(e.target.checked);
              }}
            />{" "}
            Orbital Mode
          </label>
        </div>

        <div
          style={{
            marginTop: "12px",
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={showCurvature}
              onChange={(e) => {
                setScenarioName("Custom");

                setShowCurvature(e.target.checked);
              }}
            />{" "}
            Spacetime Curvature
          </label>
        </div>

        {showCurvature && (
          <div
            style={{
              marginTop: "16px",
            }}
          >
            <div>Curvature Scale: {curvatureScale.toFixed(1)}x</div>

            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={curvatureScale}
              onChange={(e) => {
                setScenarioName("Custom");

                setCurvatureScale(Number(e.target.value));
              }}
              style={{
                width: "100%",
              }}
            />
          </div>
        )}

        <br />
        <br />

        <div
          style={{
            background: "#111827",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #2563eb",
          }}
        >
          <h3>Gravity Dashboard</h3>

          <p>Scenario: {scenarioName}</p>

          <p>
            Force:
            {force}
          </p>

          <p>Mass A acceleration: {accelerationA}</p>

          <p>Mass B acceleration: {accelerationB}</p>

          <p>Center of mass position: {barycenterPosition}</p>

          {orbitalMode && (
            <>
              <p>Barycenter: common center of mass</p>

              <p>Mass A orbit radius: {massAOrbitRadius}</p>

              <p>Mass B orbit radius: {massBOrbitRadius}</p>
            </>
          )}

          {showCurvature && (
            <p>
              Curvature: gravity wells deepen as mass increases, visually
              scaled {curvatureScale.toFixed(1)}x
            </p>
          )}
        </div>
      </div>

      <GravityCanvas
        mass1={mass1}
        mass2={mass2}
        distance={distance}
        simulationRunning={simulationRunning}
        simulationKey={simulationKey}
        orbitalMode={orbitalMode}
        showCurvature={showCurvature}
        curvatureScale={curvatureScale}
      />
    </div>
  );
}
