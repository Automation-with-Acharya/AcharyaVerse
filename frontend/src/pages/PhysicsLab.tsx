import { Link } from "react-router-dom";

export default function PhysicsLab() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        padding: "40px",
      }}
    >
<Link
  to="/"
  style={{
    color: "cyan",
    textDecoration: "none",
  }}
>
  ← Return To Universe
</Link>

      <h1>Physics Lab</h1>

      <p>
        Gravity simulations, orbital mechanics,
        black holes and physics experiments.
      </p>
    </div>
  );
}