import { Link } from "react-router-dom";

export default function Skills() {
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

      <h1>Skills Planet</h1>

      <ul>
        <li>.NET / C#</li>
        <li>Python</li>
        <li>React</li>
        <li>Power BI</li>
        <li>UiPath</li>
      </ul>
    </div>
  );
}