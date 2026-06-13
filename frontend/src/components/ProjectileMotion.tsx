import { useState } from "react";
import ProjectileCanvas from "./ProjectileCanvas";

export default function ProjectileMotion() {
  const [angle, setAngle] = useState(45);

  const [velocity, setVelocity] = useState(20);

  const [simulationSpeed, setSimulationSpeed] = useState(1);

  const [followProjectile, setFollowProjectile] = useState(true);

  const [resetCamera, setResetCamera] = useState(false);

  const [launchData, setLaunchData] = useState({
    angle: 45,
    velocity: 20,
    key: 0,
  });

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
        <div
          style={{
            marginTop: "20px",
          }}
        >
          Simulation Speed:
          {simulationSpeed.toFixed(1)}x
        </div>

        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={simulationSpeed}
          onChange={(e) => setSimulationSpeed(Number(e.target.value))}
          style={{
            width: "100%",
          }}
        />

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={followProjectile}
              onChange={(e) => setFollowProjectile(e.target.checked)}
            />{" "}
            Follow Projectile
          </label>
        </div>

        <button
          onClick={() =>
            setLaunchData({
              angle,
              velocity,
              key: Date.now(),
            })
          }
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

        <button
          onClick={() => setResetCamera(true)}
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
          Reset Camera
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
      <ProjectileCanvas
        angle={angle}
        velocity={velocity}
        launchKey={launchData.key}
        simulationSpeed={simulationSpeed}
        followProjectile={followProjectile}
        resetCamera={resetCamera}
        onCameraReset={() => setResetCamera(false)}
      />
    </div>
  );
}
