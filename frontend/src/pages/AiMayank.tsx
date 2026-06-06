import { Link } from "react-router-dom";

export default function AiMayank() {
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

      <h1>AI Mayank</h1>

      <p>
        Future AI-powered digital twin.
      </p>
    </div>
  );
}