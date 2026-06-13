import { useState } from "react";
import GravityCanvas from "./GravityCanvas";

export default function GravitySimulator() {
  const [mass1, setMass1] = useState(100);

  const [mass2, setMass2] = useState(100);

  const [distance, setDistance] = useState(10);

  const [simulationRunning, setSimulationRunning] = useState(false);

  const [simulationStatus, setSimulationStatus] = useState("Ready");

  const [orbitalMode, setOrbitalMode] = useState(false);

  const [simulationKey, setSimulationKey] = useState(0);

  const G = 6.674;

  const force = ((G * mass1 * mass2) / (distance * distance)).toFixed(2);

  const totalMass = mass1 + mass2;

  const massAOrbitRadius = ((distance * mass2) / totalMass).toFixed(2);

  const massBOrbitRadius = ((distance * mass1) / totalMass).toFixed(2);

  return (
    <div>
      <h2>Gravity Simulator</h2>

      <div
        style={{
          maxWidth: "500px",
        }}
      >
        <div>
          Mass A:
          {mass1}
        </div>

        <input
          type="range"
          min="1"
          max="1000"
          value={mass1}
          onChange={(e) => setMass1(Number(e.target.value))}
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
          onChange={(e) => setMass2(Number(e.target.value))}
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
          onChange={(e) => setDistance(Number(e.target.value))}
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
              onChange={(e) => setOrbitalMode(e.target.checked)}
            />{" "}
            Orbital Mode
          </label>
        </div>

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

          <p>
            Force:
            {force}
          </p>

          {orbitalMode && (
            <>
              <p>Barycenter: common center of mass</p>

              <p>Mass A orbit radius: {massAOrbitRadius}</p>

              <p>Mass B orbit radius: {massBOrbitRadius}</p>
            </>
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
      />
    </div>
  );
}
