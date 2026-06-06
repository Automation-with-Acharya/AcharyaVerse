import { Link } from "react-router-dom";

export default function Experience() {
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

      <h1>Experience Planet</h1>

      <p>
        Bank of America Continuum India
      </p>

      <p>
        Software Engineer
      </p>
    </div>
  );
}