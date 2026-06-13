import { useState } from "react";

export default function GravitySimulator() {
  const [mass1, setMass1] = useState(100);

  const [mass2, setMass2] = useState(100);

  const [distance, setDistance] = useState(10);

  const G = 6.674;

  const force = ((G * mass1 * mass2) / (distance * distance)).toFixed(2);

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
        </div>
      </div>
    </div>
  );
}
