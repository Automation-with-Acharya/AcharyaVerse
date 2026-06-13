import { useState } from "react";
import ProjectileCanvas from "./ProjectileCanvas";

export default function ProjectileMotion() {
  const [angle, setAngle] = useState(45);

  const [velocity, setVelocity] = useState(20);

  const g = 9.81;

  const range = (
    (velocity * velocity * Math.sin((2 * angle * Math.PI) / 180)) /
    g
  ).toFixed(2);

  const maxHeight = (
    (velocity * velocity * Math.pow(Math.sin((angle * Math.PI) / 180), 2)) /
    (2 * g)
  ).toFixed(2);

  return (
    <div>
      <h2>Projectile Motion</h2>

      <div
        style={{
          marginTop: "20px",
          maxWidth: "500px",
        }}
      >
        <div>Launch Angle: {angle}°</div>

        <input
          type="range"
          min="0"
          max="90"
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          style={{
            width: "100%",
          }}
        />

        <br />
        <br />

        <div>
          Launch Speed:
          {velocity} m/s
        </div>

        <input
          type="range"
          min="1"
          max="100"
          value={velocity}
          onChange={(e) => setVelocity(Number(e.target.value))}
          style={{
            width: "100%",
          }}
        />

        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Launch Projectile
        </button>

        <br />
        <br />

        <h3>Calculated Results</h3>

        <p>Range: {range} m</p>

        <p>
          Maximum Height:
          {maxHeight} m
        </p>
      </div>
      <ProjectileCanvas />
    </div>
  );
}
